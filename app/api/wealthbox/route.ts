import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

export async function POST(request: Request) {
  try {
    const { messages, systemPrompt } = await request.json();

    if (!messages || !systemPrompt) {
      return Response.json(
        { error: { message: "Missing messages or systemPrompt" } },
        { status: 400 }
      );
    }

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role,
        content: m.content,
      })),
    });

    return Response.json(response);
  } catch (error) {
    console.error("Wealthbox API error:", error);
    return Response.json({ error: { message: "Internal server error" } }, { status: 500 });
  }
}
