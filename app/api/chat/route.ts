import Anthropic from "@anthropic-ai/sdk";
import { profiles } from "@/lib/profiles";
import { buildSystemPrompt } from "@/lib/systemPrompt";

const anthropic = new Anthropic();

export async function POST(request: Request) {
  try {
    const { messages, profileId } = await request.json();

    const profile = profiles.find((p) => p.id === profileId);
    if (!profile) {
      return new Response("Profile not found", { status: 400 });
    }

    const systemPrompt = buildSystemPrompt(profile);

    const stream = anthropic.messages.stream({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role,
        content: m.content,
      })),
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        stream.on("text", (text) => {
          controller.enqueue(encoder.encode(text));
        });

        stream.on("end", () => {
          controller.close();
        });

        stream.on("error", (error) => {
          console.error("Stream error:", error);
          controller.error(error);
        });
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("API error:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
