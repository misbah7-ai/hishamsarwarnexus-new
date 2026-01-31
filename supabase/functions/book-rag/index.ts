import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.77.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, bookId } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!LOVABLE_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing required environment variables");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Search for relevant book chunks using text search
    const { data: chunks, error: searchError } = await supabase.rpc("search_book_chunks_text", {
      query_text: query,
      match_count: 15,
      filter_book_id: bookId || null,
    });

    console.log("Search results:", { 
      query, 
      bookId, 
      chunksFound: chunks?.length || 0,
      chunks: chunks?.slice(0, 3),
      searchError: searchError?.message 
    });

    if (searchError) {
      console.error("Search error:", searchError);
      throw new Error("Failed to search book chunks");
    }

    // If no results from text search, try a simple LIKE search as fallback
    if (!chunks || chunks.length === 0) {
      console.log("No results from full-text search, trying LIKE search...");
      
      const { data: likeChunks, error: likeError } = await supabase
        .from("book_chunks")
        .select(`
          id,
          book_id,
          content,
          chunk_index,
          chapter_name,
          page_number,
          books!inner(title)
        `)
        .ilike("content", `%${query}%`)
        .limit(10);

      if (likeError) {
        console.error("LIKE search error:", likeError);
      } else if (likeChunks && likeChunks.length > 0) {
        console.log("Found chunks with LIKE search:", likeChunks.length);
        // Transform to expected format
        const transformedChunks = likeChunks.map((chunk: any) => ({
          id: chunk.id,
          book_id: chunk.book_id,
          content: chunk.content,
          chunk_index: chunk.chunk_index,
          book_title: chunk.books.title,
          chapter_name: chunk.chapter_name,
          page_number: chunk.page_number,
          similarity: 0.5
        }));
        
        return await generateAnswer(transformedChunks, query, LOVABLE_API_KEY);
      }
      
      console.log("No chunks found for query:", query);
      return new Response(
        JSON.stringify({ 
          answer: "I couldn't find specific information about that in the available books. Try asking about: business development strategies, communication skills, AI marketing techniques, or learning methodologies.",
          sources: []
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return await generateAnswer(chunks, query, LOVABLE_API_KEY);
  } catch (error) {
    console.error("Error in book-rag:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

async function generateAnswer(chunks: any[], query: string, apiKey: string) {
  // Build context from chunks
  const context = chunks.map((chunk: any, idx: number) => 
    `[Source ${idx + 1}: ${chunk.book_title}${chunk.chapter_name ? `, ${chunk.chapter_name}` : ''}${chunk.page_number ? `, Page ${chunk.page_number}` : ''}]\n${chunk.content}`
  ).join("\n\n");

  const systemPrompt = `You are an AI assistant helping users learn from Hisham Sarwar's books and educational content.

CRITICAL INSTRUCTIONS:
1. Answer ONLY based on the provided book excerpts from Hisham Sarwar's works
2. Keep your response to EXACTLY 7-10 lines maximum - be extremely concise
3. Extract the most important practical insights from the excerpts
4. ALWAYS end with: **Source:** [Book Title]

Format:
- 1-2 sentences introducing the concept
- 2-4 sentences with the main practical advice
- 1-2 sentences with actionable steps or tips
- Source citation

Style: Direct, practical, and conversational. Focus only on what matters most.`;

  // Generate answer using Lovable AI
  const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: systemPrompt },
        { 
          role: "user", 
          content: `Based on the following excerpts from Hisham Sarwar's books, answer this question: "${query}"\n\nContext:\n${context}` 
        },
      ],
    }),
  });

  if (!aiResponse.ok) {
    if (aiResponse.status === 429) {
      return new Response(
        JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (aiResponse.status === 402) {
      return new Response(
        JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
        { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    console.error("AI response error:", await aiResponse.text());
    throw new Error("Failed to generate answer");
  }

  const aiData = await aiResponse.json();
  const answer = aiData.choices[0].message.content;

  // Format sources with unique book titles
  const uniqueBooks = [...new Set(chunks.map((chunk: any) => chunk.book_title))];
  const sources = chunks.map((chunk: any) => ({
    bookTitle: chunk.book_title,
    chapterName: chunk.chapter_name,
    pageNumber: chunk.page_number,
    similarity: chunk.similarity,
  }));

  console.log("Generated answer with sources:", { 
    answerLength: answer.length,
    sourcesCount: sources.length,
    uniqueBooks 
  });

  return new Response(
    JSON.stringify({ answer, sources }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}
