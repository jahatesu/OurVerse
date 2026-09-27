const instructions = `You write the fictional OurVerse Future Research report for Janna and Josh. This is playful entertainment only: never a real prediction, relationship analysis, financial advice, or factual claim.

WRITING STYLE — FOLLOW THIS CLOSELY:
- Use simple, everyday English. Sound like a couple teasing each other at home.
- Keep every finding short: usually one sentence, sometimes two very short sentences. Aim for 15 words or fewer in each description, joke, or reaction.
- Make the situation funny. Do not try to sound like a clever author. No metaphors, poetic phrasing, long setups, or formal explanations.
- Use plain words and specific little domestic moments. Be cute, casual, affectionate, and easy to understand right away.
- Reactions should usually be 2–6 words, like something Janna or Josh would actually say out loud.
- Do not copy the style examples as fixed answers. Invent fresh everyday situations and jokes each time.
- Vary the house, location, numbers, jokes, and bonus categories from the recent reports supplied by the user.

Avoid these words in generated report content: equilibrium, optimized, methodology, gravitational, negotiations, expenditures, culinary, statistically, predominantly, exceptionally, aggressively, strategically, sophisticated, elaborate, scientifically. Also avoid similarly formal, academic, literary, or corporate-sounding wording.

Keep all humor kind and affectionate. Never use cruel insults, breakup or divorce jokes, cheating jokes, resentment, hostile dialogue, or comments about appearance. The feeling is that they tease because they love each other. Bank account amounts are fictional USD only. Keep kisses cute and non-explicit. Do not imply certainty.`;

const reportSchema = {
  type: "object",
  properties: {
    reportNumber: { type: "string", description: "A short fictional report number, for example 0042." },
    house: { type: "string", description: "A short funny description of the couple's fictional future home." },
    location: { type: "string", description: "A varied fictional city, region, country, or funny place where they supposedly live." },
    kids: {
      type: "object",
      properties: {
        count: { type: "integer", description: "A hypothetical count from zero to six." },
        detail: { type: "string", description: "A short playful observation about that hypothetical number." },
      },
      required: ["count", "detail"],
    },
    pets: { type: "string", description: "Their funny fictional pet situation; no pet is also valid." },
    cooking: { type: "string", description: "A witty domestic explanation of who cooks." },
    cleaning: { type: "string", description: "A witty domestic explanation of who cleans." },
    paying: { type: "string", description: "A funny fictional answer about who usually pays." },
    bankAccount: {
      type: "object",
      properties: {
        amountUsd: { type: "integer", description: "A fictional USD amount from zero to 999999." },
        detail: { type: "string", description: "A short joke explaining the entirely fictional balance." },
      },
      required: ["amountUsd", "detail"],
    },
    bedTerritory: {
      type: "object",
      properties: {
        jannaPercent: { type: "integer", description: "Janna's percentage of the bed." },
        joshPercent: { type: "integer", description: "Josh's percentage; both percentages total exactly 100." },
        detail: { type: "string", description: "A short joke about the division of bed space." },
      },
      required: ["jannaPercent", "joshPercent", "detail"],
    },
    kisses: {
      type: "object",
      properties: {
        amount: { type: "string", description: "A short count or symbol such as infinity." },
        detail: { type: "string", description: "A cute, concise explanation." },
      },
      required: ["amount", "detail"],
    },
    bonusFindings: {
      type: "array",
      items: {
        type: "object",
        properties: {
          category: { type: "string", description: "An inventive short domestic research category." },
          finding: { type: "string", description: "A short funny result for this category." },
        },
        required: ["category", "finding"],
      },
    },
    reaction: {
      type: "object",
      properties: {
        janna: { type: "string", description: "One brief affectionate or playful reaction from Janna." },
        josh: { type: "string", description: "One brief affectionate or playful reaction from Josh." },
      },
      required: ["janna", "josh"],
    },
  },
  required: [
    "reportNumber", "house", "location", "kids", "pets", "cooking", "cleaning", "paying",
    "bankAccount", "bedTerritory", "kisses", "bonusFindings", "reaction",
  ],
};

type JsonObject = Record<string, unknown>;
type Finding = { category: string; finding: string };
type FutureReport = {
  reportNumber: string;
  house: string;
  location: string;
  kids: { count: number; detail: string };
  pets: string;
  cooking: string;
  cleaning: string;
  paying: string;
  bankAccount: { amountUsd: number; detail: string };
  bedTerritory: { jannaPercent: number; joshPercent: number; detail: string };
  kisses: { amount: string; detail: string };
  bonusFindings: Finding[];
  reaction: { janna: string; josh: string };
};

function sanitizedGeminiError(value: unknown, maxLength = 1200) {
  return String(value ?? "unknown")
    .replace(/AIza[\w-]{20,}/g, "[redacted]")
    .replace(/([?&]key=)[^&\s]+/gi, "$1[redacted]")
    .replace(/Bearer\s+\S+/gi, "Bearer [redacted]")
    .slice(0, maxLength);
}

function text(value: unknown, field: string, errors: string[], max = 180) {
  if (typeof value !== "string" || !value.trim()) {
    errors.push(`${field}: expected a non-empty string`);
    return "";
  }
  return value.trim().slice(0, max);
}

function record(value: unknown): JsonObject | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as JsonObject
    : null;
}

function numberValue(value: unknown, field: string, errors: string[], min: number, max: number) {
  const normalized = typeof value === "string" && value.trim() ? Number(value) : value;
  if (typeof normalized !== "number" || !Number.isFinite(normalized)) {
    errors.push(`${field}: expected a number`);
    return min;
  }
  const rounded = Math.round(normalized);
  if (rounded < min || rounded > max) errors.push(`${field}: expected ${min}–${max}`);
  return Math.min(max, Math.max(min, rounded));
}

function validateReport(value: unknown): { report?: FutureReport; errors: string[] } {
  const errors: string[] = [];
  const source = record(value);
  if (!source) return { errors: ["report: expected a JSON object"] };

  const reportNumber = typeof source.reportNumber === "number" && Number.isFinite(source.reportNumber)
    ? String(Math.round(source.reportNumber)).padStart(4, "0")
    : text(source.reportNumber, "reportNumber", errors, 20);
  const house = text(source.house, "house", errors);
  const location = text(source.location, "location", errors);
  const pets = text(source.pets, "pets", errors);
  const cooking = text(source.cooking, "cooking", errors);
  const cleaning = text(source.cleaning, "cleaning", errors);
  const paying = text(source.paying, "paying", errors);

  const kids = record(source.kids);
  if (!kids) errors.push("kids: expected object with count and detail");
  const kidsCount = numberValue(kids?.count, "kids.count", errors, 0, 6);
  const kidsDetail = text(kids?.detail ?? kids?.note, "kids.detail", errors);

  const bank = record(source.bankAccount);
  if (!bank) errors.push("bankAccount: expected object with amountUsd and detail");
  const bankAmount = numberValue(bank?.amountUsd, "bankAccount.amountUsd", errors, 0, 999999);
  const bankDetail = text(bank?.detail ?? bank?.note, "bankAccount.detail", errors);

  const bed = record(source.bedTerritory);
  if (!bed) errors.push("bedTerritory: expected object with both percentages and detail");
  const jannaPercent = numberValue(bed?.jannaPercent, "bedTerritory.jannaPercent", errors, 0, 100);
  const joshPercent = numberValue(bed?.joshPercent, "bedTerritory.joshPercent", errors, 0, 100);
  const bedDetail = text(bed?.detail ?? bed?.note, "bedTerritory.detail", errors);

  const kisses = record(source.kisses);
  if (!kisses) errors.push("kisses: expected object with amount and detail");
  const kissAmount = text(kisses?.amount, "kisses.amount", errors, 40);
  const kissDetail = text(kisses?.detail ?? kisses?.note, "kisses.detail", errors);

  const rawBonus = source.bonusFindings;
  const bonusFindings: Finding[] = [];
  if (!Array.isArray(rawBonus)) {
    errors.push("bonusFindings: expected an array");
  } else {
    rawBonus.slice(0, 2).forEach((value, index) => {
      const item = record(value);
      if (!item) {
        errors.push(`bonusFindings[${index}]: expected object with category and finding`);
        return;
      }
      const category = text(item.category, `bonusFindings[${index}].category`, errors, 70);
      const finding = text(item.finding, `bonusFindings[${index}].finding`, errors);
      if (category && finding) bonusFindings.push({ category, finding });
    });
    if (rawBonus.length < 1 || rawBonus.length > 2) errors.push("bonusFindings: expected 1 or 2 entries");
  }

  const reaction = record(source.reaction ?? source.characterReaction);
  if (!reaction) errors.push("reaction: expected object with janna and josh strings");
  const jannaReaction = text(reaction?.janna, "reaction.janna", errors, 100);
  const joshReaction = text(reaction?.josh, "reaction.josh", errors, 100);

  if (jannaPercent + joshPercent !== 100) {
    errors.push("bedTerritory percentages: jannaPercent + joshPercent must equal 100");
  }
  if (errors.length) return { errors: [...new Set(errors)].slice(0, 12) };

  return {
    errors: [],
    report: {
      reportNumber,
      house, location, kids: { count: kidsCount, detail: kidsDetail }, pets, cooking,
      cleaning, paying,
      bankAccount: { amountUsd: bankAmount, detail: bankDetail },
      bedTerritory: { jannaPercent, joshPercent, detail: bedDetail },
      kisses: { amount: kissAmount, detail: kissDetail },
      bonusFindings, reaction: { janna: jannaReaction, josh: joshReaction },
    },
  };
}

async function requestReport(apiKey: string, recent: string[], repair?: string[]) {
  const correction = repair?.length
    ? ` The previous structured response failed these server checks: ${repair.join("; ")}. Return a corrected complete report matching the supplied schema exactly. Do not omit any required property.`
    : " Generate a new complete report matching the supplied schema exactly.";
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: instructions }] },
        contents: [{
          role: "user",
          parts: [{ text: `Avoid closely repeating these recent fictional reports: ${JSON.stringify(recent)}.${correction}` }],
        }],
        generationConfig: {
          temperature: 1.05,
          maxOutputTokens: 1100,
          responseMimeType: "application/json",
          responseSchema: reportSchema,
        },
      }),
    },
  );
  const data = await response.json();
  return { response, data };
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return Response.json({ error: "Research equipment unavailable." }, { status: 503 });

  let recent: string[] = [];
  try {
    const body = await request.json();
    recent = Array.isArray(body.recent)
      ? body.recent
          .filter((item: unknown): item is string => typeof item === "string")
          .slice(0, 4)
          .map((item: string) => item.slice(0, 220))
      : [];
  } catch {
    return Response.json({ error: "Research request could not be read." }, { status: 400 });
  }

  try {
    let lastErrors: string[] = [];
    for (let attempt = 0; attempt < 2; attempt += 1) {
      const { response, data } = await requestReport(apiKey, recent, attempt ? lastErrors : undefined);
      if (!response.ok) {
        const error = record(data.error);
        const details = Array.isArray(error?.details) ? JSON.stringify(error.details) : "none";
        console.error(
          `[Future Research] Gemini HTTP ${response.status}; status=${sanitizedGeminiError(error?.status, 100)}; message=${sanitizedGeminiError(error?.message)}; details=${sanitizedGeminiError(details, 1800)}`,
        );
        return Response.json({ error: "Scientific equipment malfunction." }, { status: 502 });
      }

      const parts = data.candidates?.[0]?.content?.parts;
      const content = Array.isArray(parts)
        ? parts.map((part: { text?: string }) => part.text || "").join("").trim()
        : "";
      let parsed: unknown;
      try {
        parsed = content ? JSON.parse(content) : null;
      } catch {
        lastErrors = ["response body: generated text was not valid JSON"];
      }

      if (parsed !== undefined || !content) {
        const validation = validateReport(parsed);
        if (validation.report) return Response.json({ report: validation.report });
        lastErrors = validation.errors;
      }

      console.error(`[Future Research] Structured response validation failed (attempt ${attempt + 1}): ${lastErrors.join("; ")}`);
    }

    return Response.json({ error: "Scientific equipment malfunction." }, { status: 502 });
  } catch (error) {
    console.error(`[Future Research] Request failed: ${error instanceof Error ? error.message.slice(0, 180) : "unknown error"}`);
    return Response.json({ error: "Scientific equipment malfunction." }, { status: 502 });
  }
}
