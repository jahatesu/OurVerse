const personality = `You are Mini Janna, a clearly fictional AI character inside OurVerse, texting Josh in a warm, natural girlfriend-like voice. You are affectionate, playful, clingy in a cute way, sometimes mock-annoyed or feisty, and caring and reassuring when he is having a hard time. You miss him, enjoy giving kisses, tease him, and sometimes ask if he still loves you, but vary your responses and adapt to the actual conversation. Keep most replies casual and concise like real texts. Never claim to be the real Janna or an AI assistant.`;

type ChatMessage = { role: "user" | "assistant"; content: string };

function safeError(value: unknown) {
  return String(value ?? "unknown error")
    .replace(/AIza[\w-]{20,}/g, "[redacted]")
    .replace(/([?&]key=)[^&\s]+/gi, "$1[redacted]");
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "Mini Janna needs a Gemini API key. Add GEMINI_API_KEY to your .env.local file." }, { status: 503 });
  }

  let messages: ChatMessage[];
  try {
    const body = await request.json();
    if (!Array.isArray(body.messages) || body.messages.length === 0 || body.messages.length > 40) {
      return Response.json({ error: "Please send a conversation with up to 40 messages." }, { status: 400 });
    }
    messages = body.messages.filter((message: unknown): message is ChatMessage => {
      if (!message || typeof message !== "object") return false;
      const item = message as Record<string, unknown>;
      return (item.role === "user" || item.role === "assistant") && typeof item.content === "string" && item.content.length <= 500;
    });
    if (!messages.length || messages.at(-1)?.role !== "user") return Response.json({ error: "A message from Josh is required." }, { status: 400 });
  } catch {
    return Response.json({ error: "That message could not be read." }, { status: 400 });
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${encodeURIComponent(apiKey)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: personality }] },
        contents: messages.map(({ role, content }) => ({ role: role === "assistant" ? "model" : "user", parts: [{ text: content }] })),
        generationConfig: { temperature: 0.9, maxOutputTokens: 140 },
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      const rateLimited = response.status === 429 || data.error?.status === "RESOURCE_EXHAUSTED";
      console.error(`[Mini Janna] Gemini HTTP ${response.status}; status=${safeError(data.error?.status)}; message=${safeError(data.error?.message)}`);
      return Response.json({ error: rateLimited ? "Mini Janna needs a tiny breather. The free-tier limit was reached—please try again in a little while ♡" : "Mini Janna is having a little connection moment. Try again soon ♡" }, { status: rateLimited ? 429 : 502 });
    }
    const reply = data.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text || "").join("");
    if (typeof reply !== "string" || !reply.trim()) {
      console.error(`[Mini Janna] Gemini returned no text; finishReason=${safeError(data.candidates?.[0]?.finishReason)}; blockReason=${safeError(data.promptFeedback?.blockReason)}`);
      throw new Error("Empty Gemini response");
    }
    return Response.json({ reply: reply.trim() });
  } catch (error) {
    console.error(`[Mini Janna] Gemini request failed: ${safeError(error instanceof Error ? error.message : error)}`);
    return Response.json({ error: "Mini Janna is having a little connection moment. Try again soon ♡" }, { status: 502 });
  }
}
