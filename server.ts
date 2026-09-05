import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initialize Gemini client if API key is present
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Health check and AI status
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    model: 'gemini-3.8-flash',
    timestamp: new Date().toISOString(),
  });
});

// AI Career Mentor endpoint
app.post('/api/gemini/mentor', async (req, res) => {
  try {
    const { message, profile, career, skillGaps, chatHistory } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        available: false,
        source: 'local_engine',
        message: 'No external Gemini API key detected. Using built-in deterministic career intelligence engine.',
      });
    }

    const systemPrompt = `You are "SkillForge Mentor", an elite AI tech career advisor and engineering mentor.
Context about the student:
- Name: ${profile?.name || 'Student'}
- Education: ${profile?.degree || 'Degree'} at ${profile?.college || 'University'} (Year ${profile?.year || 'Current'})
- Target Career: ${career || 'Software Engineer'}
- Current Skills: ${(profile?.skills || []).map((s: any) => `${s.name} (${s.level})`).join(', ')}
- Known Skill Gaps: ${(skillGaps || []).map((g: any) => `${g.skill}: gap of ${g.gap}% (Current ${g.current}%, Required ${g.required}%)`).join(', ')}
- Projects: ${(profile?.projects || []).map((p: any) => p.name).join(', ')}

Guidelines:
1. Provide actionable, concise, motivating advice tailored to their exact skill gaps and career goal.
2. Formulate practical step-by-step advice with realistic time estimates.
3. Keep responses structured using markdown, bullet points, and clear headers where helpful.
4. Tone: Encouraging, razor-sharp, realistic, and mentor-like. Avoid fluffy marketing jargon.`;

    const contents = [
      { text: systemPrompt },
      ...(chatHistory || []).map((m: any) => ({
        text: `${m.sender === 'user' ? 'Student' : 'Mentor'}: ${m.text}`,
      })),
      { text: `Student: ${message}` },
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts: contents },
    });

    return res.json({
      available: true,
      source: 'gemini-3.8-flash',
      response: response.text,
    });
  } catch (error: any) {
    console.error('Gemini Mentor Error:', error);
    return res.status(500).json({
      available: false,
      error: error?.message || 'Failed to generate mentor response',
      source: 'fallback',
    });
  }
});

// AI Resume Deep Analyzer endpoint
app.post('/api/gemini/resume', async (req, res) => {
  try {
    const { resumeText, targetCareer, knownRequirements } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        available: false,
        source: 'local_engine',
      });
    }

    const prompt = `Analyze this student resume text specifically against the requirements of becoming a "${targetCareer}":
Target Career Requirements: ${JSON.stringify(knownRequirements || [])}

Resume Text:
"""
${(resumeText || '').slice(0, 8000)}
"""

Provide a structured JSON response with:
- score: number (0-100)
- detectedSkills: string[]
- missingTargetSkills: string[]
- strengths: string[] (3-4 points)
- weaknesses: string[] (3-4 points)
- atsKeywordsToAdd: string[] (5-8 high impact keywords)
- actionableImprovements: string[] (3-4 clear bullet points)
- summary: string (2-3 sentences overview)
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      available: true,
      source: 'gemini-3.8-flash',
      analysis: parsed,
    });
  } catch (error: any) {
    console.error('Gemini Resume Error:', error);
    return res.status(500).json({
      available: false,
      error: error?.message || 'Resume analysis failed',
    });
  }
});

// Vite middleware in dev or static serving in production
async function setupVite() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SkillForge AI Server running on port ${PORT}`);
  });
}

setupVite().catch((err) => {
  console.error('Failed to start server:', err);
});
