import { v4 as uuidv4 } from "uuid";
import { Resume } from "../modules/resume/models/resume.model";
import { buildLatex } from "./latex.builder";
import { compileLatex, LatexCompileError } from "./latex.compiler";
import { wsManager } from "../wa/ws.manager";
import { pdfStore } from "./pdf.store";

export async function generateLatexPdf(
  userId: string,
  resumeId: string
): Promise<string> {
  const jobId = uuidv4();

  // Run pipeline in background — don't await, let WS handle updates
  runPipeline(userId, resumeId, jobId).catch((err) => {
    console.error("[LATEX] Unhandled pipeline error:", err);
  });

  return jobId;
}

async function runPipeline(
  userId: string,
  resumeId: string,
  jobId: string
): Promise<void> {
  const sessionId = resumeId; // We use resumeId as the WS session key

  const notify = (step: string, message: string, extra: object = {}) => {
    wsManager.send(sessionId, { type: "status", jobId, step, message, ...extra });
  };

  try {
    // ── Step 1: Fetch resume from DB ────────────────────────────────────────
    notify("fetching", "Loading your resume data...");

    const resume = await Resume.findOne({ _id: resumeId, userId });
    if (!resume) throw new Error("Resume not found");

    const resumeData = resume.data as Record<string, any>;

    // ── Step 2: Build LaTeX source ──────────────────────────────────────────
    notify("building_latex", "Building LaTeX template...");

    const latexSource = buildLatex(resumeData);

    // ── Step 3: Compile via ytotech ─────────────────────────────────────────
    notify("compiling_pdf", "Compiling your PDF... (this takes ~10s)");

    const pdfBuffer = await compileLatex(latexSource);

    // ── Step 4: Store PDF and notify done ───────────────────────────────────
    pdfStore.put(jobId, pdfBuffer);

    notify("done", "Your PDF is ready!", {
      pdfUrl: `/api/latex/pdf/${jobId}`,
      latexSource,
    });
  } catch (err: any) {
    if (err instanceof LatexCompileError) {
      notify("error", `LaTeX compile error: ${err.message}`, {
        errorLog: err.log,
      });
    } else {
      notify("error", `Failed to generate PDF: ${err.message}`);
    }
  }
}