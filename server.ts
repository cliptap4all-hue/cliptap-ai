import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '25mb' }));

// Shared server-side Gemini client as per AI Studio guidelines
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

interface PromptSuggestion {
  id: string;
  styleKey: 'realistic' | 'dramatic' | 'vintage';
  titleHe: string;
  styleName: string;
  prompt: string;
  reasoningHe: string;
  tags: string[];
}

// Fallback generator if both Gemini & Pollinations have network issues
function getStaticFallbackPrompts(idea: string, mediaType: string): PromptSuggestion[] {
  const cleanIdea = idea.trim() || 'Creative vision';
  
  if (mediaType === 'video') {
    return [
      {
        id: 'style_1',
        styleKey: 'realistic',
        titleHe: 'ריאליסטי וקולנועי',
        styleName: 'Realistic & Cinematic',
        prompt: `Cinematic 4K ultra-realistic footage of ${cleanIdea}, shot on 35mm Arri Alexa camera, natural golden hour lighting, smooth slow-motion camera movement, depth of field, photorealistic textures, 24fps motion blur, masterpiece film quality`,
        reasoningHe: 'צילום קולנועי עם תאורת שקיעה טבעית ועומק שדה ריאליסטי',
        tags: ['4K Ultra', '35mm Arri', '24fps Cinematic', 'Depth of Field'],
      },
      {
        id: 'style_2',
        styleKey: 'dramatic',
        titleHe: 'דרמטי ואמנותי',
        styleName: 'Dramatic & Artistic',
        prompt: `Dramatic high-contrast film scene depicting ${cleanIdea}, volumetric moody fog, chiaroscuro theatrical lighting, dynamic low-angle panning shot, epic visual storytelling, anamorphic lens flare, award-winning cinematography`,
        reasoningHe: 'תאורה דרמטית בניגודיות גבוהה עם זוויות צילום נמוכות ומלאות רגש',
        tags: ['Chiaroscuro', 'Anamorphic Lens', 'Epic Mood', 'Low Angle'],
      },
      {
        id: 'style_3',
        styleKey: 'vintage',
        titleHe: 'נוסטלגי ודינמי',
        styleName: 'Vintage / Dynamic',
        prompt: `Nostalgic 1990s VHS / Super 8mm aesthetic depicting ${cleanIdea}, vibrant retro film grain, dynamic rhythmic motion, warm analog color grading, soft light leaks, energetic handheld camera feel, authentic vintage look`,
        reasoningHe: 'תחושת רטרו אנלוגית וחמימה עם תנועה דינמית וגרעיניות פילם אותנטית',
        tags: ['Super 8mm', 'Analog Grain', 'Retro Warmth', 'Dynamic Handheld'],
      },
    ];
  }

  if (mediaType === 'music') {
    return [
      {
        id: 'style_1',
        styleKey: 'realistic',
        titleHe: 'ריאליסטי וקולנועי',
        styleName: 'Realistic & Cinematic',
        prompt: `Pristine studio-recorded instrumental track for ${cleanIdea}, organic acoustic instruments, rich stereo imaging, warm room reverb, polished mastering, emotive dynamic progression, 110 BPM`,
        reasoningHe: 'הקלטת אולפן חיה ואיכותית עם דינמיקה מרגשת וסאונד שקוף',
        tags: ['Studio Master', 'Live Instruments', 'Emotive Acoustic', 'High Fidelity'],
      },
      {
        id: 'style_2',
        styleKey: 'dramatic',
        titleHe: 'דרמטי ואמנותי',
        styleName: 'Dramatic & Artistic',
        prompt: `Epic dramatic orchestral and hybrid electronic score inspired by ${cleanIdea}, booming cinematic percussion, swelling cellos and violins, tense build-up, dark atmospheric synths, climactic drop`,
        reasoningHe: 'עיבוד תזמורתי דרמטי משולב סינתיסייזרים אפלים ועליות עוצמתיות',
        tags: ['Epic Orchestral', 'Heavy Percussion', 'Dark Synths', 'Climactic'],
      },
      {
        id: 'style_3',
        styleKey: 'vintage',
        titleHe: 'נוסטלגי ודינמי',
        styleName: 'Vintage / Dynamic',
        prompt: `Raw 1990s vintage rock and dynamic guitar solo riff, overdrive tube amplifier, punchy live drums, tape saturation, grunge energy inspired by ${cleanIdea}, energetic tempo, authentic cassette warmth`,
        reasoningHe: 'אנרגיית רוק ניינטיז בועטת עם סאונד מנורות חם וריפים מחשמלים',
        tags: ['90s Grunge', 'Tube Overdrive', 'Tape Saturation', 'Punchy Drums'],
      },
    ];
  }

  // Image defaults
  return [
    {
      id: 'style_1',
      styleKey: 'realistic',
      titleHe: 'ריאליסטי וקולנועי',
      styleName: 'Realistic & Cinematic',
      prompt: `Breathtaking ultra-detailed photograph of ${cleanIdea}, shot on Sony A7R V with 85mm f/1.4 lens, crisp hyper-realistic textures, natural studio lighting, delicate micro-details, 8K resolution, National Geographic quality`,
      reasoningHe: 'צילום מקצועי חד ומדויק בעדשת פורטרטים עם תאורה טבעית ומרקמים חיים',
      tags: ['8K Ultra HD', 'Sony A7R V', 'Photorealistic', 'Studio Lighting'],
    },
    {
      id: 'style_2',
      styleKey: 'dramatic',
      titleHe: 'דרמטי ואמנותי',
      styleName: 'Dramatic & Artistic',
      prompt: `Striking fine-art visual rendering of ${cleanIdea}, bold chiaroscuro shadow play, surreal atmospheric lighting, deep emotional resonance, concept art masterpiece, trending on ArtStation, rich color palette`,
      reasoningHe: 'קונספט ארט דרמטי עם משחקי אור וצל עמוקים ונוכחות אמנותית עזה',
      tags: ['Fine Art', 'Chiaroscuro', 'Concept Art', 'Rich Palette'],
    },
    {
      id: 'style_3',
      styleKey: 'vintage',
      titleHe: 'נוסטלגי ודינמי',
      styleName: 'Vintage / Dynamic',
      prompt: `Retro vibrant vintage illustration of ${cleanIdea}, Kodachrome 64 analog color tones, subtle film dust and warm grain, mid-century dynamic composition, nostalgic magazine editorial aesthetic`,
      reasoningHe: 'צבעוניות רטרו קודאכרום עשירה עם אופי נוסטלגי מובהק',
      tags: ['Kodachrome 64', 'Retro Grain', 'Vintage Magazine', 'Warm Tones'],
    },
  ];
}

// 1. STEP 1: FREE PROMPT GENERATOR (Gemini API with Pollinations.ai fallback)
app.post('/api/generate-prompts', async (req: Request, res: Response) => {
  const { idea, mediaType } = req.body;

  if (!idea || typeof idea !== 'string') {
    return res.status(400).json({ error: 'נא להזין רעיון' });
  }

  const selectedType = mediaType === 'video' || mediaType === 'music' ? mediaType : 'image';

  // System instruction for generating 3 targeted, high-converting English prompts
  const systemInstruction = `You are a world-class prompt engineering expert for generative AI (Flux image models, Fal.ai Wan/LTX video models, and Stable Audio music models).
Given a user idea (which might be in Hebrew or English) and a media type ('${selectedType}'), craft EXACTLY 3 distinct, professional English prompts tailored specifically for that medium, along with Hebrew metadata.

The 3 styles required are:
1. Style 1: Realistic & Cinematic (Hebrew title: "ריאליסטי וקולנועי", styleKey: "realistic")
   - For video: Cinematic camera, lighting (golden hour/studio), 35mm lens, 24fps, motion details.
   - For image: 8K, photorealistic textures, studio or natural lighting, depth of field.
   - For music: High-fidelity studio recorded, acoustic or live instruments, balanced mixing.

2. Style 2: Dramatic & Artistic (Hebrew title: "דרמטי ואמנותי", styleKey: "dramatic")
   - For video: Chiaroscuro, volumetric lighting, epic angles, intense atmosphere.
   - For image: Moody, concept art, rich contrast, fine-art masterpiece.
   - For music: Orchestral swells, heavy emotional build-ups, hybrid dark elements.

3. Style 3: Vintage / Dynamic (Hebrew title: "נוסטלגי ודינמי", styleKey: "vintage")
   - For video: 90s VHS / Super 8mm analog grain, handheld motion, retro warmth.
   - For image: Kodachrome, analog film grain, retro editorial aesthetic.
   - For music: 90s rock guitar riff, tape saturation, punchy vintage drums, grunge or synthwave.

Output MUST be valid JSON array with 3 objects containing:
[
  {
    "id": "style_1",
    "styleKey": "realistic",
    "titleHe": "ריאליסטי וקולנועי",
    "styleName": "Realistic & Cinematic",
    "prompt": "<Ultra-detailed English prompt under 70 words without boilerplate like 'here is a prompt'>",
    "reasoningHe": "<Short 1-sentence Hebrew explanation of the visual/audio direction>",
    "tags": ["<tag1>", "<tag2>", "<tag3>"]
  },
  ...
]`;

  // Attempt 1: Gemini API via @google/genai SDK
  if (process.env.GEMINI_API_KEY) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Media type: ${selectedType}\nUser idea: "${idea}"`,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
        },
      });

      const rawText = response.text?.trim() || '';
      if (rawText) {
        const parsed = JSON.parse(rawText);
        if (Array.isArray(parsed) && parsed.length >= 3) {
          return res.json({
            provider: 'Gemini 3.8 Flash ($0 Cost)',
            prompts: parsed.slice(0, 3),
          });
        }
      }
    } catch (err: unknown) {
      console.warn('Gemini prompt generation encountered an issue, trying Pollinations fallback:', err);
    }
  }

  // Attempt 2: Pollinations.ai Text API (100% Free Fallback)
  try {
    const pollinationsUrl = `https://text.pollinations.ai/${encodeURIComponent(
      `Format: JSON only. Generate 3 prompts for media: ${selectedType}, idea: ${idea}. ${systemInstruction}`
    )}?json=true`;

    const polliRes = await fetch(pollinationsUrl, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(6000),
    });

    if (polliRes.ok) {
      const polliText = await polliRes.text();
      // Extract json array if wrapped in backticks
      const jsonMatch = polliText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (Array.isArray(parsed) && parsed.length >= 3) {
          return res.json({
            provider: 'Pollinations AI Free Engine',
            prompts: parsed.slice(0, 3),
          });
        }
      }
    }
  } catch (err) {
    console.warn('Pollinations fallback error:', err);
  }

  // Attempt 3: High quality static prompt variations
  const fallbackPrompts = getStaticFallbackPrompts(idea, selectedType);
  return res.json({
    provider: 'ClipTap Smart Engine',
    prompts: fallbackPrompts,
  });
});

// 1.5. LOCKED CONCEPT RETAKE: REFINE PROMPT WITH GEMINI GUARDRAIL
app.post('/api/refine-prompt', async (req: Request, res: Response) => {
  const { originalPrompt, userFixRequest, mediaType } = req.body;

  if (!originalPrompt || typeof originalPrompt !== 'string') {
    return res.status(400).json({ error: 'פרומפט מקורי חסר' });
  }

  const fixText = userFixRequest && typeof userFixRequest === 'string' ? userFixRequest.trim() : 'Improve quality, coherence, and visual stability';
  const selectedType = mediaType === 'video' || mediaType === 'music' ? mediaType : 'image';

  const systemInstruction = `You are a precision AI prompt refinement assistant for generative media models (${selectedType}).
You are tasked with fixing or improving an existing generated asset based on user feedback.

CRITICAL GUARDRAIL RULES:
1. Modify the original prompt ONLY to fix the technical, visual, or audio issues mentioned in the user's feedback.
2. STRICT RULE: Keep the exact same core subject, scene, character, and concept.
3. If the user tries to ask for a completely different video, character, or topic, IGNORE the new topic and ONLY enhance the quality, motion smoothness, lighting, facial preservation, or stability of the original prompt.
4. Output MUST be valid JSON with two fields:
{
  "refinedPrompt": "<Complete updated English prompt under 80 words incorporating the requested fixes while preserving the core subject>",
  "explanationHe": "<Short 1-sentence explanation in Hebrew of the exact technical correction applied>"
}`;

  if (process.env.GEMINI_API_KEY) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Original Prompt: "${originalPrompt}"\nUser Fix Request: "${fixText}"\nMedia type: ${selectedType}`,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
        },
      });

      const rawText = response.text?.trim() || '';
      if (rawText) {
        const parsed = JSON.parse(rawText);
        if (parsed?.refinedPrompt) {
          return res.json({
            success: true,
            refinedPrompt: parsed.refinedPrompt,
            explanationHe: parsed.explanationHe || 'הפרומפט עודכן ותוקן לפי בקשתך תוך שמירה על הקונספט הנעול',
            provider: 'Gemini 3.8 Flash Guardrail',
          });
        }
      }
    } catch (err) {
      console.warn('Gemini prompt refinement failed, falling back to smart rule-based enhancer:', err);
    }
  }

  // Fallback guardrail prompt refinement
  const fixAdditions: string[] = [];
  const lowerFix = fixText.toLowerCase();
  if (lowerFix.includes('פנים') || lowerFix.includes('face')) {
    fixAdditions.push('consistent facial anatomy, perfectly preserved facial features, photorealistic face identity');
  }
  if (lowerFix.includes('תנועה') || lowerFix.includes('איטית') || lowerFix.includes('motion') || lowerFix.includes('slow')) {
    fixAdditions.push('smooth natural cinematic slow motion, stable camera physics, fluid movement without distortion');
  }
  if (lowerFix.includes('תאורה') || lowerFix.includes('איכות') || lowerFix.includes('light') || lowerFix.includes('quality')) {
    fixAdditions.push('balanced cinematic volumetric studio lighting, enhanced micro-details, ultra-sharp rendering');
  }
  if (lowerFix.includes('גיטרה') || lowerFix.includes('נגינה') || lowerFix.includes('instrument') || lowerFix.includes('guitar')) {
    fixAdditions.push('prominent resonant lead instrument mix, balanced acoustic presence, crisp stereo definition');
  }

  if (fixAdditions.length === 0) {
    fixAdditions.push('refined cinematic clarity, stabilized high-definition rendering, enhanced natural realism');
  }

  const refinedPrompt = `${originalPrompt}, ${fixAdditions.join(', ')}`;
  return res.json({
    success: true,
    refinedPrompt,
    explanationHe: 'הפרומפט דויק תוך נעילת הקונספט המקורי ושיפור היציבות',
    provider: 'ClipTap Smart Guardrail',
  });
});

// Curated high quality simulation samples for zero-cost testing
const SAMPLE_VIDEOS = [
  {
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    title: 'Cinematic Dynamic Motion',
  },
  {
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    title: 'Serene Nature Landscape',
  },
  {
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    title: 'Epic Slow Motion Action',
  },
  {
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    title: 'High Speed Cinematic Drive',
  },
];

const SAMPLE_MUSIC = [
  {
    url: 'https://cdn.freesound.org/previews/682/682052_11861866-lq.mp3',
    title: '90s Rock Guitar Solo & Grunge Riff',
    genre: 'Rock / Electric Guitar',
  },
  {
    url: 'https://cdn.freesound.org/previews/676/676395_5674468-lq.mp3',
    title: 'Cinematic Ambient Piano Melody',
    genre: 'Ambient / Piano',
  },
  {
    url: 'https://cdn.freesound.org/previews/689/689366_11861866-lq.mp3',
    title: 'Upbeat Electronic Synth Beat',
    genre: 'Electronic / Synthwave',
  },
  {
    url: 'https://cdn.freesound.org/previews/568/568853_11861866-lq.mp3',
    title: 'Warm Acoustic Indie Groove',
    genre: 'Acoustic / Warm Indie',
  },
];

// 2. STEP 2: MEDIA GENERATION ENGINE (Images via Free Pollinations Flux, Video & Audio via Fal.ai or Zero-Cost Simulator)
app.post('/api/generate-media', async (req: Request, res: Response) => {
  const { mediaType, prompt, referenceImage, falApiKey } = req.body;
  const resolution = (req.body.resolution as '480p' | '720p' | '1080p') || '480p';

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'פרומפט חסר' });
  }

  const selectedType = mediaType === 'video' || mediaType === 'music' ? mediaType : 'image';
  const effectiveFalKey = falApiKey || process.env.FAL_API_KEY;

  try {
    // --- 1. IMAGE ENGINE (100% Free Default via Pollinations Flux) ---
    if (selectedType === 'image') {
      let width = 1024;
      let height = 1024;
      if (resolution === '480p') {
        width = 768;
        height = 768;
      } else if (resolution === '720p') {
        width = 1024;
        height = 1024;
      } else if (resolution === '1080p') {
        width = 1920;
        height = 1080;
      }

      if (effectiveFalKey) {
        // Optional Fal.ai Flux Schnell if user provided their key
        try {
          const falImageSize =
            resolution === '1080p'
              ? 'landscape_16_9'
              : resolution === '720p'
              ? 'square_hd'
              : 'square';

          const falRes = await fetch('https://fal.run/fal-ai/flux/schnell', {
            method: 'POST',
            headers: {
              'Authorization': `Key ${effectiveFalKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              prompt,
              image_size: falImageSize,
              num_inference_steps: 4,
              enable_safety_checker: true,
            }),
          });
          if (falRes.ok) {
            const falData = (await falRes.json()) as { images?: Array<{ url: string }> };
            if (falData?.images?.[0]?.url) {
              return res.json({
                success: true,
                mediaType: 'image',
                mediaUrl: falData.images[0].url,
                engine: `Fal.ai Flux Schnell (${resolution})`,
                costEstimate: resolution === '1080p' ? 0.005 : 0.003,
                simulated: false,
                resolution,
              });
            }
          }
        } catch (err) {
          console.warn('Fal image generation failed, falling back to Pollinations:', err);
        }
      }

      // Default: Instant Zero-Cost Pollinations Flux
      const seed = Math.floor(Math.random() * 10000000);
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
        prompt
      )}?model=flux&width=${width}&height=${height}&nologo=true&seed=${seed}`;

      return res.json({
        success: true,
        mediaType: 'image',
        mediaUrl: imageUrl,
        engine: `Pollinations Flux (${resolution})`,
        costEstimate: 0,
        simulated: false,
        resolution,
      });
    }

    // --- 2. VIDEO ENGINE (~$0.015 via Fal.ai or Zero-Cost Simulation Fallback) ---
    if (selectedType === 'video') {
      const videoCostEstimate =
        resolution === '1080p' ? 0.04 : resolution === '720p' ? 0.025 : 0.015;

      if (effectiveFalKey) {
        try {
          // If reference image provided -> Image-to-Video, else Text-to-Video
          const endpoint = referenceImage
            ? 'https://fal.run/fal-ai/wan-i2v'
            : 'https://fal.run/fal-ai/wan-t2v';

          const requestBody = referenceImage
            ? {
                prompt,
                image_url: referenceImage,
                resolution,
                num_frames: 49,
              }
            : {
                prompt,
                aspect_ratio: '16:9',
                resolution,
                num_frames: 49,
              };

          const falRes = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Authorization': `Key ${effectiveFalKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          });

          if (falRes.ok) {
            const falData = (await falRes.json()) as { video?: { url: string } };
            if (falData?.video?.url) {
              return res.json({
                success: true,
                mediaType: 'video',
                mediaUrl: falData.video.url,
                engine: referenceImage ? `Fal.ai Wan-I2V (${resolution})` : `Fal.ai Wan-T2V (${resolution})`,
                costEstimate: videoCostEstimate,
                simulated: false,
                resolution,
              });
            }
          } else {
            const errorText = await falRes.text();
            console.warn('Fal.ai video error response:', errorText);
          }
        } catch (err) {
          console.warn('Fal video generation failed, falling back to simulation:', err);
        }
      }

      // Zero-Cost Simulation Fallback: return curated sample MP4
      const randomVideo = SAMPLE_VIDEOS[Math.floor(Math.random() * SAMPLE_VIDEOS.length)];
      return res.json({
        success: true,
        mediaType: 'video',
        mediaUrl: randomVideo.url,
        engine: `Zero-Cost Simulation Engine (${resolution})`,
        costEstimate: 0,
        simulated: true,
        sampleTitle: randomVideo.title,
        resolution,
      });
    }

    // --- 3. MUSIC ENGINE (~$0.01 via Fal.ai or Zero-Cost Simulation Fallback) ---
    if (selectedType === 'music') {
      if (effectiveFalKey) {
        try {
          const falRes = await fetch('https://fal.run/fal-ai/stable-audio', {
            method: 'POST',
            headers: {
              'Authorization': `Key ${effectiveFalKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              prompt,
              seconds_total: 30,
              steps: resolution === '1080p' ? 70 : resolution === '720p' ? 50 : 35,
            }),
          });

          if (falRes.ok) {
            const falData = (await falRes.json()) as { audio_file?: { url: string } };
            if (falData?.audio_file?.url) {
              return res.json({
                success: true,
                mediaType: 'music',
                mediaUrl: falData.audio_file.url,
                engine: `Fal.ai Stable Audio (${resolution})`,
                costEstimate: 0.01,
                simulated: false,
                resolution,
              });
            }
          }
        } catch (err) {
          console.warn('Fal music generation failed, falling back to simulation:', err);
        }
      }

      // Zero-Cost Simulation Fallback: pick matching audio sample
      let chosenAudio = SAMPLE_MUSIC[0];
      const lowerPrompt = prompt.toLowerCase();
      if (lowerPrompt.includes('ambient') || lowerPrompt.includes('piano') || lowerPrompt.includes('chill')) {
        chosenAudio = SAMPLE_MUSIC[1];
      } else if (lowerPrompt.includes('electronic') || lowerPrompt.includes('synth') || lowerPrompt.includes('beat')) {
        chosenAudio = SAMPLE_MUSIC[2];
      } else if (lowerPrompt.includes('acoustic') || lowerPrompt.includes('indie')) {
        chosenAudio = SAMPLE_MUSIC[3];
      }

      return res.json({
        success: true,
        mediaType: 'music',
        mediaUrl: chosenAudio.url,
        engine: `Zero-Cost Simulation Engine (${resolution})`,
        costEstimate: 0,
        simulated: true,
        sampleTitle: chosenAudio.title,
        resolution,
      });
    }

    return res.status(400).json({ error: 'סוג מדיה לא נתמך' });
  } catch (error: unknown) {
    console.error('Generation engine error:', error);
    return res.status(500).json({
      error: 'שגיאה ביצירת המדיה, נסה שוב בעוד מספר שניות',
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    geminiEnabled: Boolean(process.env.GEMINI_API_KEY),
    falEnabled: Boolean(process.env.FAL_API_KEY),
  });
});

// Setup Vite middleware in dev or static files in production
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[ClipTap AI] Server running on http://0.0.0.0:${PORT}`);
  });
}

start();
