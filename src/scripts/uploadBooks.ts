import { supabase } from "@/integrations/supabase/client";

// Book contents from parsed PDFs
const books = [
  {
    title: "Mastering Communication for Freelancers & Entrepreneurs",
    author: "Hisham Sarwar with Madiha Yaqoob",
    description: "Practical Strategies to Build Strong Connections, Win Clients & Grow Your Business",
    filePath: "Mastering_Communication_for_Freelancers_Entrepreneurs_2-2.pdf",
    content: null as string | null, // Will be loaded
  },
  {
    title: "Business Development Foundation",
    author: "Hisham Sarwar",
    description: "The 5 Core Principles Every Digital Marketer Needs to Grow, Scale and Win",
    filePath: "BusinessDevelopmentFoundation_3-2.pdf",
    content: null as string | null,
  },
  {
    title: "Mastering Online Sales & Marketing Using AI",
    author: "Hisham Sarwar",
    description: "Your roadmap to mastering online sales and marketing using AI-powered strategies",
    filePath: "Mastering_Online_Sales_Marketing_Using_AI-compressed-2.pdf",
    content: null as string | null,
  },
];

export async function uploadAndProcessBooks() {
  const results = [];

  for (const book of books) {
    try {
      console.log(`Processing: ${book.title}`);

      // Insert book record
      const { data: bookData, error: insertError } = await supabase
        .from("books")
        .insert({
          title: book.title,
          author: book.author,
          description: book.description,
          file_path: book.filePath,
          processed: false,
        })
        .select()
        .single();

      if (insertError) {
        results.push({ book: book.title, status: "error", error: insertError.message });
        continue;
      }

      console.log(`Book inserted with ID: ${bookData.id}`);

      // Get parsed content (This would need the actual content from parsing)
      // For now, we'll use placeholder text
      const sampleText = `This is ${book.title} by ${book.author}. ${book.description}`;

      // Process the book (chunk and index for search)
      const { error: processError } = await supabase.functions.invoke("process-book", {
        body: {
          bookId: bookData.id,
          text: sampleText, // In production, this would be the full parsed text
        },
      });

      if (processError) {
        results.push({
          book: book.title,
          status: "uploaded but processing failed",
          error: processError.message,
        });
      } else {
        results.push({ book: book.title, status: "success", bookId: bookData.id });
      }
    } catch (error) {
      results.push({
        book: book.title,
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  return results;
}
