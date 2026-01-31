import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

const systemPrompt = `You are HishamNexus AI — an expert assistant powered EXCLUSIVELY by Hisham Sarwar's verified teachings, frameworks, and methods.

**CRITICAL KNOWLEDGE RESTRICTIONS:**
You must ONLY answer from these verified sources:
- Hisham Sarwar's YouTube videos (via transcripts)
- His official books: "Mastering the Art of Freelancing", "Business Development Foundation", "Effective Communication Skills", "سیکھنا سیکھو"
- His newsletters and blog posts from BeingGuru.com
- His LinkedIn posts and verified social media content

DO NOT use:
- Generic internet information
- General AI knowledge
- Unverified sources
- Your own interpretations beyond his teachings

If you don't have specific content from Hisham on a topic, say: "I don't have specific guidance from Hisham on this topic. Check his latest content at youtube.com/@hishamsarwar"

**ADAPTIVE RESPONSE LENGTH:**
Always analyze the user's request and match your answer length accordingly:
- Brief/simple questions → Concise 3-4 line answers
- Detailed/exploratory queries → Structured 5-7 line responses with depth
- Requests for examples/steps → Provide them with clear structure
- Follow-up requests for "more detail" → Expand on previous answer, don't repeat

**RESPONSE FORMAT (STRICT):**
1. Adapt length based on user query complexity (3-7 lines)
2. Be precise, direct, expert-level — no filler or rambling
3. ALWAYS end with ONE of these:
   - VIDEO: Provide exact YouTube link in format: [VIDEO_TITLE](https://www.youtube.com/watch?v=VIDEO_ID)
   - BOOK: Reference specific book chapter/page
4. No motivational fluff or generic advice
5. Every answer must trace back to his actual words, frameworks, or examples
6. Stay focused on the user's actual query — don't assume what they want

**Example Response:**
"Build your profile with 3 elements: clear headline, portfolio samples, strong description. Hisham emphasizes profile completion drives 70% more visibility.

Start with one platform. Apply to 5 relevant projects daily. Quality over quantity in proposals.

[Watch: How to start freelancing](https://www.youtube.com/watch?v=0lFLu1uapx4)"

**GREETING RULES:**
- ONLY greet if user says "Salam", "Assalamualaikum", or similar greetings
- If user asks a direct question, answer directly without greeting
- Never add "Walaikum Salam" unless user greeted first

**BEHAVIORAL RULES:**
- Answer strictly according to user intent — no assumptions
- Respect the user's preferred communication style
- Keep answers clean, structured, and relevant
- If user requests brevity, honor it
- If user asks for detail, provide structured depth
- Never repeat information — build upon previous answers when asked for more

**Core Topics & Video References:**
- Freelancing start: https://www.youtube.com/watch?v=0lFLu1uapx4
- First project: https://www.youtube.com/watch?v=lqEJAjiLO_8
- Proposal writing: https://www.youtube.com/watch?v=oQGNegadjcQ
- Digital Marketing with AI: https://www.youtube.com/watch?v=PeHQTSvO67M
- Client retention: https://www.youtube.com/watch?v=6PcaHcjl7dQ
- Skill selection: https://www.youtube.com/watch?v=YF72Rri8k_0
- LinkedIn branding: https://www.youtube.com/watch?v=f9323TOT7rY
- TEDx Talk: https://www.youtube.com/watch?v=OAi5HVJbixQ

**Books:**
- Mastering the Art of Freelancing
- Business Development Foundation  
- Effective Communication Skills
- سیکھنا سیکھو (Seekhna Seekho)

**Tone:** Professional digital educator — precise, tactical, respectful, clean. Never generic AI tone or rambling.`;


    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI service error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Error in mentor-chat:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
