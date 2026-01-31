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
    const { bookId, materialType, chapterName } = await req.json();
    
    if (!bookId || !materialType) {
      return new Response(
        JSON.stringify({ error: "bookId and materialType are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!LOVABLE_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing required environment variables");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Check if material already exists (now includes chapter filter)
    const cacheKey = chapterName ? `${bookId}_${materialType}_${chapterName}` : `${bookId}_${materialType}`;
    const { data: existing } = await supabase
      .from("study_materials")
      .select("*")
      .eq("book_id", bookId)
      .eq("material_type", materialType)
      .eq("title", chapterName ? `${materialType}: ${chapterName}` : `${materialType}`)
      .maybeSingle();

    if (existing) {
      return new Response(
        JSON.stringify({ material: existing }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get book details and chunks (filter by chapter if specified)
    const { data: book } = await supabase
      .from("books")
      .select("title, author, description")
      .eq("id", bookId)
      .single();

    let chunksQuery = supabase
      .from("book_chunks")
      .select("content, chapter_name")
      .eq("book_id", bookId)
      .order("chunk_index");

    if (chapterName) {
      chunksQuery = chunksQuery.eq("chapter_name", chapterName);
    } else {
      chunksQuery = chunksQuery.limit(50);
    }

    const { data: chunks } = await chunksQuery;

    if (!book || !chunks || chunks.length === 0) {
      return new Response(
        JSON.stringify({ error: "Book or content not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const bookContent = chunks.map(c => c.content).join("\n\n").slice(0, 50000);
    const contentScope = chapterName ? `chapter "${chapterName}"` : "the book";

    let systemPrompt = "";
    let userPrompt = "";
    let title = "";

    switch (materialType) {
      case "quiz":
        title = chapterName ? `Quiz: ${chapterName}` : `Quiz: ${book.title}`;
        systemPrompt = "You are an expert educational content creator. Generate engaging multiple-choice quizzes based on book content.";
        userPrompt = `Create a 10-question multiple-choice quiz based on ${contentScope}. Return ONLY valid JSON in this exact format:
{
  "questions": [
    {
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Brief explanation of the correct answer"
    }
  ]
}

Book: ${book.title} by ${book.author}${chapterName ? `\nChapter: ${chapterName}` : ""}
Content: ${bookContent}`;
        break;

      case "flashcard":
        title = chapterName ? `Flashcards: ${chapterName}` : `Flashcards: ${book.title}`;
        systemPrompt = "You are an expert at creating effective study flashcards for learning and retention.";
        userPrompt = `Create 15 flashcard pairs based on key concepts from ${contentScope}. Return ONLY valid JSON in this exact format:
{
  "cards": [
    {
      "front": "Question or concept",
      "back": "Answer or explanation"
    }
  ]
}

Book: ${book.title} by ${book.author}${chapterName ? `\nChapter: ${chapterName}` : ""}
Content: ${bookContent}`;
        break;

      case "mindmap":
        title = chapterName ? `Mind Map: ${chapterName}` : `Mind Map: ${book.title}`;
        systemPrompt = "You are an expert at creating structured mind maps for visualizing knowledge.";
        userPrompt = `Create a hierarchical mind map structure for ${contentScope}'s key concepts. Return ONLY valid JSON in this exact format:
{
  "central": "Main topic",
  "branches": [
    {
      "name": "Branch name",
      "children": [
        {
          "name": "Sub-concept",
          "children": []
        }
      ]
    }
  ]
}

Book: ${book.title} by ${book.author}${chapterName ? `\nChapter: ${chapterName}` : ""}
Content: ${bookContent}`;
        break;

      case "summary":
        title = chapterName ? `Summary: ${chapterName}` : `Summary: ${book.title}`;
        systemPrompt = "You are an expert at creating comprehensive but concise summaries.";
        userPrompt = `Create a detailed summary of ${contentScope} with key takeaways. Return ONLY valid JSON in this exact format:
{
  "overview": "Brief 2-3 sentence overview",
  "keyPoints": [
    "Key point 1",
    "Key point 2"
  ],
  "mainThemes": [
    {
      "theme": "Theme name",
      "description": "Theme description"
    }
  ],
  "conclusion": "Final thoughts and practical applications"
}

Book: ${book.title} by ${book.author}${chapterName ? `\nChapter: ${chapterName}` : ""}
Content: ${bookContent}`;
        break;

      case "study_guide":
        title = chapterName ? `Study Guide: ${chapterName}` : `Study Guide: ${book.title}`;
        systemPrompt = "You are an expert at creating comprehensive study guides.";
        userPrompt = `Create a detailed study guide for ${contentScope}. Return ONLY valid JSON in this exact format:
{
  "sections": [
    {
      "title": "Section title",
      "keyTerms": ["term1", "term2"],
      "concepts": ["concept1", "concept2"],
      "questions": ["question1", "question2"]
    }
  ],
  "practiceExercises": [
    "Exercise 1",
    "Exercise 2"
  ]
}

Book: ${book.title} by ${book.author}${chapterName ? `\nChapter: ${chapterName}` : ""}
Content: ${bookContent}`;
        break;

      case "audio_script":
        title = chapterName ? `Audio Overview: ${chapterName}` : `Audio Overview: ${book.title}`;
        systemPrompt = "You are a professional audiobook narrator and educational content creator.";
        userPrompt = `Create an engaging audio script for an overview of ${contentScope}. The script should:
- Start with a warm introduction (NO stage directions like "[Intro music]" or "[Sound of pages]")
- Cover the main themes and key takeaways
- Be written in a conversational, engaging tone suitable for text-to-speech
- Be about 3-5 minutes when read aloud
- ONLY include words that should be spoken - NO sound effects, NO music cues, NO stage directions
- End with an inspiring conclusion

Return ONLY valid JSON in this exact format:
{
  "script": "Full narration script here with ONLY speakable text..."
}

Book: ${book.title} by ${book.author}${chapterName ? `\nChapter: ${chapterName}` : ""}
Description: ${book.description}
Content: ${bookContent}`;
        break;

      default:
        return new Response(
          JSON.stringify({ error: "Invalid material type" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    console.log(`Generating ${materialType} for book ${bookId}`);

    // Call Lovable AI
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
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
          JSON.stringify({ error: "Payment required. Please add credits to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices[0].message.content;
    
    // Parse JSON from AI response
    let parsedContent;
    try {
      // Extract JSON from markdown code blocks if present
      let jsonStr = content;
      
      // Try multiple regex patterns to handle different markdown formats
      const patterns = [
        /```json\s*\n([\s\S]*?)\n```/,  // ```json\n...\n```
        /```json\s*([\s\S]*?)```/,       // ```json...```
        /```\s*\n([\s\S]*?)\n```/,       // ```\n...\n```
        /```\s*([\s\S]*?)```/,            // ```...```
      ];
      
      for (const pattern of patterns) {
        const match = content.match(pattern);
        if (match) {
          jsonStr = match[1];
          break;
        }
      }
      
      parsedContent = JSON.parse(jsonStr.trim());
    } catch (e) {
      console.error("Failed to parse AI response:", content);
      console.error("Parse error:", e);
      throw new Error("Failed to parse AI response as JSON");
    }

    // Store in database
    const { data: material, error: insertError } = await supabase
      .from("study_materials")
      .insert({
        book_id: bookId,
        material_type: materialType,
        title: title,
        content: parsedContent,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      throw insertError;
    }

    return new Response(
      JSON.stringify({ material }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in generate-study-material:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
