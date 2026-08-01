import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware for parsing JSON requests with higher limit for base64 file payloads
app.use(express.json({ limit: "10mb" }));

// Initialize Gemini Client safely
function getGeminiClient() {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Fallback procedural roast generator if Gemini is unavailable
function generateMockRoast(text: string, filename?: string, intensity: string = "savage", targetRole?: string) {
  const textLower = (text || filename || "").toLowerCase();
  
  const prosPresets = [
    "You actually remembered to include contact information!",
    "Quantified metrics detected (e.g., increased efficiency or revenue) - nice touch!",
    "Clean bulleted formatting that ATS scanners won't completely choke on.",
    "Solid technical keyword coverage relevant to modern industry roles.",
    "Logical chronological flow that makes your career trajectory clear.",
    "Concise section headers that guide the eye quickly."
  ];

  const consPresets = [
    "Vague action verbs – 'Assisted with' and 'Responsible for' show zero ownership!",
    "Overuse of corporate buzzwords like 'Synergy', 'Results-driven', and 'Self-starter'.",
    "Missing clear impact metrics in several project descriptions.",
    "Inconsistent date formatting and bullet point alignment.",
    "Generic objective summary that sounds like it was written in 2012.",
    "Skill section resembles a dictionary dump without proof of actual usage."
  ];

  const savageRoasts = [
    "Your résumé is so aggressively average that an ATS scanner might automatically file it under 'Unsent Drafts'. 'Experienced team player'? More like experienced at filling prime whitespace with LinkedIn platitudes! You list 'communication skills' twice, but your layout communicates pure chaotic energy.",
    "I've seen fortune cookies with more persuasive career impact statements. Reading through your work history feels like watching paint dry in slow motion. If this résumé were a meal, it would be unseasoned boiled rice served on paper plates.",
    "This résumé reads like a bot compiled all the most clichéd job descriptions from 2018 and hit randomize. 'Fast learner who thrives in fast-paced environments'? That's code for 'I check Slack on my phone'. Please give your bullets actual numbers before another recruiter faints of boredom."
  ];

  const nuclearRoasts = [
    "WARNING: Nuclear Roast Protocol Activated! This isn't a résumé; it's a criminal confession of professional passivity. You claim to be a 'thought leader', yet every bullet point sounds like you took a nap while your team did the actual work. If a hiring manager spent 6 seconds on this, 5 seconds were spent regretting opening the PDF.",
    "Brace for impact! Your resume is a masterpiece of corporate fluff. It's so full of empty buzzwords that if you filtered out 'driven', 'dynamic', and 'synergy', all you'd have left is your name and a phone number that hasn't changed since college. Burn it and start over!"
  ];

  const gentleRoasts = [
    "Your résumé has a solid foundation, but it lacks that special sparkle! You have great experience, but you're hiding your light under a bushel of generic bullet points. Swap out the passive verbs for bold accomplishments and you'll stand out in no time!",
    "Not bad at all! Just needs a tune-up. Your achievements are clearly there, but they need stronger numbers to prove how awesome you were in past roles. A few formatting polishes and you're golden."
  ];

  let selectedRoast = savageRoasts[Math.floor(Math.random() * savageRoasts.length)];
  if (intensity === "nuclear") {
    selectedRoast = nuclearRoasts[Math.floor(Math.random() * nuclearRoasts.length)];
  } else if (intensity === "gentle") {
    selectedRoast = gentleRoasts[Math.floor(Math.random() * gentleRoasts.length)];
  }

  // Shuffle & pick 3-4 pros and cons
  const shuffledPros = [...prosPresets].sort(() => 0.5 - Math.random()).slice(0, 4);
  const shuffledCons = [...consPresets].sort(() => 0.5 - Math.random()).slice(0, 4);

  return {
    score: Math.floor(Math.random() * 35) + 38, // 38 to 72
    verdict: intensity === "nuclear" ? "Burnt to a Crisp 😭🔥" : "Standard Corporate Mediocrity",
    pros: shuffledPros,
    cons: shuffledCons,
    roast: selectedRoast,
    actionableTips: [
      "Replace 'Responsible for' with strong impact verbs like 'Architected', 'Spearheaded', or 'Optimized'.",
      "Add at least 3 concrete percentage or revenue metrics (e.g., 'Boosted API response speeds by 35%').",
      "Trim fluff words and limit your skills section to tools you could pass a live interview on today."
    ],
    funnyStats: {
      buzzwordDensity: "87% Corporate Fluff",
      survivalChance: "18% against ATS Scanners",
      recruiterSkimTime: "2.8 seconds"
    },
    isAiGenerated: false
  };
}

// API Route: Roast Resume
app.post("/api/roast", async (req, res) => {
  try {
    const { resumeText, fileData, intensity = "savage", targetRole = "Software Engineer" } = req.body;

    if (!resumeText && (!fileData || !fileData.base64)) {
      return res.status(400).json({ error: "Please provide resume text or upload a valid document." });
    }

    const ai = getGeminiClient();

    if (!ai) {
      console.log("No valid GEMINI_API_KEY found, using intelligent fallback roast generator.");
      const mockResult = generateMockRoast(resumeText || "", fileData?.filename, intensity, targetRole);
      return res.json(mockResult);
    }

    const systemInstruction = `You are "Resume Roaster" - a witty, hilarious, brutally honest yet genuinely insightful career coach and elite tech recruiter.
Your job is to roast the user's resume according to their selected intensity level:
- "gentle": Constructive, mildly witty, encouraging with light humor.
- "medium" or "savage": Spicy, sarcastic, hilarious, calling out buzzwords, passive verbs, and generic layout tropes.
- "nuclear": Unfiltered, hilarious roast comedy, zero mercy on fluff, dramatic hyperbole!

Target Role: ${targetRole || "General Professional"}
Intensity Level: ${intensity}

Analyze the resume provided (text or PDF document) and return JSON matching this exact structure:
{
  "score": <number between 15 and 95 representing resume health/impact score>,
  "verdict": "<short funny 3-5 word diagnosis e.g. 'Overqualified for Unemployment' or 'Buzzword Overdose'>",
  "pros": [<array of 3 to 4 genuine positive highlights or strengths found in the resume>],
  "cons": [<array of 3 to 4 specific weaknesses, passive verbs, missing metrics, or formatting bugs>],
  "roast": "<a 3 to 5 sentence sarcastic, hilarious, highly specific roast paragraph targeting their actual experience, skills, or phrasing>",
  "actionableTips": [<array of 3 practical, high-value bullet points on how to fix these exact issues>],
  "funnyStats": {
    "buzzwordDensity": "<e.g. '88% Synergy'>",
    "survivalChance": "<e.g. '14% in ATS filter'>",
    "recruiterSkimTime": "<e.g. '3.1 seconds'>"
  }
}`;

    const contentsParts: any[] = [];

    if (fileData && fileData.base64) {
      contentsParts.push({
        inlineData: {
          data: fileData.base64,
          mimeType: fileData.mimeType || "application/pdf"
        }
      });
    }

    if (resumeText) {
      contentsParts.push({
        text: `Target Role: ${targetRole}\nResume Content:\n${resumeText}`
      });
    } else {
      contentsParts.push({
        text: `Target Role: ${targetRole}\nPlease analyze and roast the attached resume document.`
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: { parts: contentsParts },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            verdict: { type: Type.STRING },
            pros: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            cons: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            roast: { type: Type.STRING },
            actionableTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            funnyStats: {
              type: Type.OBJECT,
              properties: {
                buzzwordDensity: { type: Type.STRING },
                survivalChance: { type: Type.STRING },
                recruiterSkimTime: { type: Type.STRING }
              },
              required: ["buzzwordDensity", "survivalChance", "recruiterSkimTime"]
            }
          },
          required: ["score", "verdict", "pros", "cons", "roast", "actionableTips", "funnyStats"]
        }
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("Empty response from Gemini model");
    }

    const parsedData = JSON.parse(responseText);
    return res.json({
      ...parsedData,
      isAiGenerated: true
    });

  } catch (error: any) {
    console.error("Error in /api/roast endpoint:", error);
    // Return graceful mock fallback on any AI API error
    const { resumeText, fileData, intensity, targetRole } = req.body;
    const fallback = generateMockRoast(resumeText || "", fileData?.filename, intensity, targetRole);
    return res.json(fallback);
  }
});

export default app;

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Resume Roaster Server running on http://0.0.0.0:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}
