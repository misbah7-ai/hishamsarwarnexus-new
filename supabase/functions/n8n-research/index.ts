import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  console.log("n8n-research function called - method:", req.method);
  
  if (req.method === "OPTIONS") {
    console.log("Handling OPTIONS request");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Processing POST request");
    const body = await req.json();
    console.log("Request body:", JSON.stringify(body, null, 2));
    
    const { query, format } = body;
    
    if (!query || !query.trim()) {
      throw new Error("Query is required");
    }

    console.log("Calling n8n webhook:", { query, format });

    // Call n8n webhook directly for research
    const webhookPayload = {
      query: query.trim(),
      format: format || "summary",
    };
    console.log("Calling n8n webhook with payload:", JSON.stringify(webhookPayload, null, 2));

    const response = await fetch("https://automation-ai.app.n8n.cloud/webhook/hisham-research", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(webhookPayload),
    });

    console.log("n8n webhook response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("n8n webhook error:", response.status, errorText);
      throw new Error(`n8n webhook failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("n8n webhook success, data:", JSON.stringify(data, null, 2));

    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in n8n-research:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
