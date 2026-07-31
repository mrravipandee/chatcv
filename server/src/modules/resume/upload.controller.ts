import { Response, Request } from 'express';
import multer, { MulterError } from 'multer';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { Resume, IResumeData } from './models/resume.model';
import { setCachedResume } from '../../config/redis.client';
import { GoogleGenAI } from '@google/genai';
import { asyncHandler } from '../../utils/asyncHandler';
import { BadRequestError } from '../../errors/BadRequestError';
import { AppError } from '../../errors/AppError';

import dotenv from 'dotenv';
dotenv.config();

const MODEL = 'gemini-2.5-flash';

// pdf-parse v1 — exports a simple async function directly
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require('pdf-parse') as (
  buffer: Buffer
) => Promise<{ text: string; numpages: number }>;

// ── Multer — memory storage, 5 MB limit ──────────────────────────────────────
const multerUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    // Accept PDF and plain text
    if (file.mimetype === 'application/pdf' || file.mimetype === 'text/plain') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF (.pdf) and plain text (.txt) files are accepted'));
    }
  },
});

// ── Promisify multer ──────────────────────────────────────────────────────────
function runMulter(req: Request, res: Response): Promise<void> {
  return new Promise((resolve, reject) => {
    multerUpload.single('resume')(req, res, (err: unknown) => {
      if (!err) {
        resolve();
        return;
      }
      if (err instanceof MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          reject(new BadRequestError('File too large. Maximum size is 5 MB.'));
        } else {
          reject(new BadRequestError(`Upload error: ${err.message}`));
        }
      } else if (err instanceof Error) {
        reject(new BadRequestError(err.message));
      } else {
        reject(new BadRequestError('Unknown upload error'));
      }
    });
  });
}

// ── Extract text from uploaded file ──────────────────────────────────────────
async function extractTextFromFile(file: Express.Multer.File): Promise<string> {
  if (file.mimetype === 'application/pdf') {
    try {
      const result = await pdfParse(file.buffer);
      return result.text;
    } catch (err) {
      console.error('[UPLOAD] pdf-parse error:', err);
      throw new AppError(422, 'UNPROCESSABLE_ENTITY', 'Failed to parse PDF. Please try a text file instead.');
    }
  }
  return file.buffer.toString('utf-8');
}

// ── Call AI to parse resume text → structured JSON ────────────────────────────
async function extractResumeFromText(rawText: string): Promise<Partial<IResumeData>> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new AppError(500, 'GEMINI_CONFIG_ERROR', 'GEMINI_API_KEY is not set');

  const prompt = `You are a resume parser. Extract structured resume data from the text below.

## RESUME TEXT
${rawText.slice(0, 5000)}

## EXTRACTION RULES
1. Extract ALL available information — be thorough.
2. Return ONLY a valid JSON object — NO markdown code fences, NO extra text whatsoever.
3. Skills should be grouped by category where possible.
4. Experience bullets should be individual achievements.
5. Normalize URLs — add https:// if missing.
6. Format dates as "Month YYYY" or "YYYY" strings.

Return a JSON object with these fields (omit empty/unknown ones):
{
  "name": "Full Name",
  "role": "Current/Target Job Title",
  "email": "email@example.com",
  "phone": "+91...",
  "location": "City, Country",
  "summary": "Professional summary paragraph",
  "links": [{ "label": "GitHub", "url": "https://github.com/..." }],
  "skills": [{ "category": "Frontend", "items": ["React", "TypeScript"] }],
  "experience": [
    {
      "role": "Software Engineer",
      "company": "Company Name",
      "location": "City",
      "startDate": "Jan 2022",
      "endDate": "Mar 2024",
      "isCurrent": false,
      "bullets": ["Built X achieving Y", "Led team of Z"]
    }
  ],
  "projects": [
    {
      "name": "Project Name",
      "tags": ["React", "Node.js"],
      "bullets": ["Description bullet 1"],
      "liveUrl": "https://...",
      "githubUrl": "https://github.com/..."
    }
  ],
  "education": [
    {
      "degree": "B.Tech Computer Science",
      "institution": "University Name",
      "location": "City",
      "startYear": "2018",
      "endYear": "2022",
      "grade": "8.5 CGPA"
    }
  ],
  "achievements": [
    { "title": "Achievement Title", "description": "Details" }
  ]
}`;

  console.log('[UPLOAD] Calling Gemini API for extraction...');

  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
    },
  });

  const raw = response.text?.trim() || '{}';

  const cleaned = raw
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  console.log('[UPLOAD] Extraction preview:', cleaned.slice(0, 150));

  try {
    return JSON.parse(cleaned) as Partial<IResumeData>;
  } catch {
    console.error('[UPLOAD] Failed to parse extraction JSON:', cleaned.slice(0, 300));
    return {};
  }
}

// ── Controller ────────────────────────────────────────────────────────────────
export const uploadResumeController = asyncHandler(async (req: AuthRequest, res: Response) => {
  // Step 1: Run multer manually
  await runMulter(req as Request, res);

  // Step 2: Validate file was received
  const file = (req as Request & { file?: Express.Multer.File }).file;
  if (!file) {
    throw new BadRequestError('No file received. Please attach a PDF or TXT file.');
  }

  console.log(`[UPLOAD] Received file: ${file.originalname} (${file.mimetype}, ${file.size} bytes)`);

  const userId = req.user!.id;

  // Step 3: Extract text
  const rawText = await extractTextFromFile(file);

  if (!rawText || rawText.trim().length < 30) {
    throw new AppError(
      422,
      'UNPROCESSABLE_ENTITY',
      'File appears to be empty or unreadable. Please try a different file.'
    );
  }

  console.log(`[UPLOAD] Extracted ${rawText.length} characters of text`);

  // Step 4: AI extraction
  let extractedData: Partial<IResumeData>;
  try {
    extractedData = await extractResumeFromText(rawText);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'AI extraction failed';
    throw new AppError(502, 'BAD_GATEWAY', msg);
  }

  // Step 5: Save to DB
  const title =
    typeof extractedData.name === 'string' && extractedData.name.trim()
      ? extractedData.name.trim()
      : typeof extractedData.role === 'string' && extractedData.role.trim()
        ? extractedData.role.trim()
        : 'Uploaded Resume';

  const resume = await Resume.create({
    userId,
    title,
    data: extractedData,
  });

  // Cache (non-blocking)
  setCachedResume(resume._id.toString(), extractedData).catch(() => {});

  console.log(`[UPLOAD] Resume created: ${resume._id}`);

  return res.status(201).json({
    success: true,
    message: 'Resume extracted successfully!',
    data: {
      resumeId: resume._id.toString(),
      resumeData: resume.data,
    },
  });
});
