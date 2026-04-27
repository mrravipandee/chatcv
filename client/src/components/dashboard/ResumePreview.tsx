"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import {
  Briefcase, Eye, FolderOpen, User, Zap,
  FileDown, Loader2, CheckCircle, XCircle,
  Code, Copy, Check, X,
} from "lucide-react";

interface Experience {
  title?: string;
  company?: string;
  year?: string;
  description?: string;
}

interface Project {
  name?: string;
  description?: string;
}

export interface ResumeData {
  name?: string;
  fullName?: string;
  role?: string;
  title?: string;
  email?: string;
  phone?: string;
  location?: string;
  summary?: string;
  skills?: (string | { name: string })[];
  experience?: Experience[];
  projects?: Project[];
}

interface ResumePreviewProps {
  resumeData: ResumeData | null;
  resumeId?: string;
}

type PdfStatus =
  | { stage: "idle" }
  | { stage: "connecting" }
  | { stage: "fetching"; message: string }
  | { stage: "building_latex"; message: string }
  | { stage: "compiling_pdf"; message: string }
  | { stage: "done"; pdfUrl: string }
  | { stage: "error"; message: string };

// ── Client-side LaTeX preview builder (no API call) ───────────────────────────
function buildLatexPreview(resumeData: ResumeData): string {
  const esc = (v: unknown) =>
    String(v ?? "")
      .replace(/\\/g, "\\textbackslash{}")
      .replace(/&/g, "\\&")
      .replace(/%/g, "\\%")
      .replace(/\$/g, "\\$")
      .replace(/#/g, "\\#")
      .replace(/_/g, "\\_")
      .replace(/\{/g, "\\{")
      .replace(/\}/g, "\\}")
      .replace(/~/g, "\\textasciitilde{}")
      .replace(/\^/g, "\\textasciicircum{}");

  const skills = Array.isArray(resumeData.skills)
    ? resumeData.skills.map((s) => (typeof s === "string" ? s : s.name)).filter(Boolean)
    : [];

  const contactParts = [
    resumeData.phone ? esc(resumeData.phone) : "",
    resumeData.email
      ? `\\href{mailto:${resumeData.email}}{\\underline{${esc(resumeData.email)}}}`
      : "",
    resumeData.location ? esc(resumeData.location) : "",
  ].filter(Boolean).join(" $|$ ");

  const expSection = (resumeData.experience ?? [])
    .map((exp) => {
      const bullets = (exp.description ?? "")
        .split(/\.\s+|\n/)
        .map((b) => b.trim())
        .filter(Boolean);
      const bulletItems = bullets.map((b) => `        \\resumeItem{${esc(b)}}`).join("\n");
      return `    \\resumeSubheading\n      {${esc(exp.company)}}{${esc(exp.year)}}\n      {${esc(exp.title)}}{}\n      \\resumeItemListStart\n${bulletItems}\n      \\resumeItemListEnd`;
    })
    .join("\n");

  const projSection = (resumeData.projects ?? [])
    .map(
      (p) =>
        `    \\resumeProjectHeading\n      {\\textbf{${esc(p.name)}}}{}\n      \\resumeItemListStart\n        \\resumeItem{${esc(p.description)}}\n      \\resumeItemListEnd`
    )
    .join("\n");

  return `\\documentclass[letterpaper,11pt]{article}
\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\usepackage{enumitem}

\\pagestyle{fancy}
\\fancyhf{}
\\renewcommand{\\headrulewidth}{0pt}

\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large\\bfseries
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

\\newcommand{\\resumeItem}[1]{\\item\\small{{#1}}}
\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{1.0\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & \\textbf{\\small #2} \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-7pt}
}
\\newcommand{\\resumeProjectHeading}[2]{
  \\item
  \\begin{tabular*}{1.001\\textwidth}{l@{\\extracolsep{\\fill}}r}
    \\small#1 & \\textbf{\\small #2}\\\\
  \\end{tabular*}\\vspace{-7pt}
}
\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.0in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

\\begin{document}

\\begin{center}
    {\\Huge \\scshape ${esc(resumeData.name || resumeData.fullName || "Your Name")}} \\\\ \\vspace{4pt}
    ${resumeData.role ? `{\\large ${esc(resumeData.role)}} \\\\ \\vspace{4pt}` : ""}
    \\small ${contactParts}
\\end{center}

${
  resumeData.summary
    ? `\\section{Summary}\n  ${esc(resumeData.summary)}\n`
    : ""
}
${
  expSection
    ? `\\section{Experience}\n  \\resumeSubHeadingListStart\n${expSection}\n  \\resumeSubHeadingListEnd`
    : ""
}
${
  projSection
    ? `\\section{Projects}\n  \\resumeSubHeadingListStart\n${projSection}\n  \\resumeSubHeadingListEnd`
    : ""
}
${
  skills.length
    ? `\\section{Technical Skills}\n  \\textbf{Skills}: ${skills.map(esc).join(", ")}`
    : ""
}

\\end{document}`;
}

export default function ResumePreview({ resumeData, resumeId }: ResumePreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const [pdfStatus, setPdfStatus] = useState<PdfStatus>({ stage: "idle" });
  const [showLatexModal, setShowLatexModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const data = resumeData ?? {};
  const skills = Array.isArray(data.skills)
    ? data.skills.map((s) => (typeof s === "string" ? s : s.name)).filter(Boolean)
    : [];
  const experience = Array.isArray(data.experience) ? data.experience : [];
  const projects = Array.isArray(data.projects) ? data.projects : [];
  const isEmpty = !resumeData;

  const latexSource = resumeData ? buildLatexPreview(resumeData) : "";

  // Cleanup WS on unmount
  useEffect(() => {
    return () => { wsRef.current?.close(); };
  }, []);

  // Close modal on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowLatexModal(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleCopyLatex = useCallback(async () => {
    if (!latexSource) return;
    await navigator.clipboard.writeText(latexSource);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [latexSource]);

  const handleDownloadLatexPdf = useCallback(async () => {
    if (!resumeId) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    wsRef.current?.close();
    setPdfStatus({ stage: "connecting" });

    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
    const WS_BASE = API_BASE.replace(/^http/, "ws");

    const ws = new WebSocket(`${WS_BASE}/ws/${resumeId}`);
    wsRef.current = ws;

    ws.onopen = async () => {
      setPdfStatus({ stage: "fetching", message: "Starting generation..." });
      try {
        const res = await fetch(`${API_BASE}/api/latex/generate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ resumeId }),
        });
        if (!res.ok) {
          const err = await res.json() as { message?: string };
          setPdfStatus({ stage: "error", message: err.message ?? "Failed to start generation" });
          ws.close();
        }
      } catch {
        setPdfStatus({ stage: "error", message: "Network error. Please try again." });
        ws.close();
      }
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data as string) as {
          type: string;
          step: string;
          message?: string;
          pdfUrl?: string;
        };
        if (msg.type !== "status") return;

        // ✅ Declare fullUrl outside switch — fixes TS lexical declaration error
        let fullUrl = "";

        switch (msg.step) {
          case "fetching":
          case "building_latex":
          case "compiling_pdf":
            setPdfStatus({
              stage: msg.step as "fetching" | "building_latex" | "compiling_pdf",
              message: msg.message ?? "",
            });
            break;

          case "done":
            setPdfStatus({ stage: "done", pdfUrl: msg.pdfUrl ?? "" });
            ws.close();
            fullUrl = `${API_BASE}${msg.pdfUrl ?? ""}`;
            fetch(fullUrl, { headers: { Authorization: `Bearer ${token}` } })
              .then((r) => r.blob())
              .then((blob) => {
                const a = document.createElement("a");
                a.href = URL.createObjectURL(blob);
                a.download = "resume.pdf";
                a.click();
                URL.revokeObjectURL(a.href);
                setTimeout(() => setPdfStatus({ stage: "idle" }), 3000);
              });
            break;

          case "error":
            setPdfStatus({ stage: "error", message: msg.message ?? "Unknown error" });
            ws.close();
            break;
        }
      } catch {
        // ignore malformed messages
      }
    };

    ws.onerror = () => {
      setPdfStatus({ stage: "error", message: "WebSocket connection failed." });
    };

    ws.onclose = () => { wsRef.current = null; };
  }, [resumeId]);

  const isGenerating =
    pdfStatus.stage === "connecting" ||
    pdfStatus.stage === "fetching" ||
    pdfStatus.stage === "building_latex" ||
    pdfStatus.stage === "compiling_pdf";

  const statusMessage =
    pdfStatus.stage === "connecting" ? "Connecting..."
    : pdfStatus.stage === "fetching" || pdfStatus.stage === "building_latex" || pdfStatus.stage === "compiling_pdf"
    ? pdfStatus.message
    : pdfStatus.stage === "done" ? "Downloaded!"
    : pdfStatus.stage === "error" ? "Error — retry?"
    : null;

  return (
    <>
      <section className="hidden h-full flex-col border-l border-white/10 bg-linear-to-b from-zinc-950 to-black lg:flex">
        {/* Header */}
        <div className="shrink-0 flex items-center justify-between border-b border-white/10 px-6 py-4 bg-black/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#00ff9c]/10">
              <Eye size={18} className="text-[#00ff9c]" />
            </div>
            <h3 className="text-sm font-semibold text-white">Live Preview</h3>
          </div>

          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-2">
              {/* .tex button */}
              <button
                onClick={() => setShowLatexModal(true)}
                disabled={isEmpty}
                title="View & copy LaTeX source"
                className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-gray-300 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Code size={15} />
                .tex
              </button>

              {/* PDF button */}
              <button
                onClick={handleDownloadLatexPdf}
                disabled={isEmpty || isGenerating || !resumeId}
                className="flex items-center gap-2 rounded-lg bg-linear-to-r from-[#00ff9c] to-[#00cc7a] px-4 py-2 text-sm font-semibold text-black transition hover:scale-105 hover:shadow-lg hover:shadow-[#00ff9c]/30 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
              >
                {isGenerating ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : pdfStatus.stage === "done" ? (
                  <CheckCircle size={16} />
                ) : pdfStatus.stage === "error" ? (
                  <XCircle size={16} />
                ) : (
                  <FileDown size={16} />
                )}
                PDF
              </button>
            </div>

            {statusMessage && (
              <p className={`text-xs font-medium ${
                pdfStatus.stage === "error" ? "text-red-400"
                : pdfStatus.stage === "done" ? "text-[#00ff9c]"
                : "text-gray-400"
              }`}>
                {statusMessage}
              </p>
            )}
          </div>
        </div>

        {/* Progress bar */}
        {isGenerating && (
          <div className="h-0.5 bg-white/5">
            <div className="h-full bg-[#00ff9c] animate-pulse w-full" />
          </div>
        )}

        {/* Resume Preview */}
        <div className="flex-1 overflow-y-auto p-6">
          {isEmpty ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-4 rounded-2xl bg-white/5 p-6 border border-white/10">
                <Eye size={32} className="text-gray-600 mx-auto" />
              </div>
              <p className="text-base font-semibold text-gray-300">No resume yet</p>
              <p className="mt-2 text-sm text-gray-500 max-w-xs">
                Start chatting with AI to generate your resume
              </p>
            </div>
          ) : (
            <div ref={previewRef} className="mx-auto max-w-2xl rounded-xl bg-white p-8 text-black shadow-2xl border border-gray-200">
              <div className="border-b-2 border-gray-200 pb-6">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                  {data.name || data.fullName || "Your Name"}
                </h1>
                <p className="mt-2 text-base font-semibold text-[#00aa6c]">
                  {data.role || data.title || "Your Role"}
                </p>
                <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
                  {data.email && <span>📧 {data.email}</span>}
                  {data.phone && <span>📱 {data.phone}</span>}
                  {data.location && <span>📍 {data.location}</span>}
                </div>
              </div>

              {data.summary && (
                <div className="mt-8">
                  <div className="mb-3 flex items-center gap-2">
                    <User size={16} className="text-[#00aa6c]" />
                    <h2 className="text-sm font-bold uppercase tracking-widest text-gray-700">Summary</h2>
                  </div>
                  <p className="text-sm leading-8 text-gray-700 whitespace-pre-line">{data.summary}</p>
                </div>
              )}

              {skills.length > 0 && (
                <div className="mt-8">
                  <div className="mb-4 flex items-center gap-2">
                    <Zap size={16} className="text-[#00aa6c]" />
                    <h2 className="text-sm font-bold uppercase tracking-widest text-gray-700">Skills</h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, i) => (
                      <span key={i} className="rounded-lg bg-[#00aa6c]/10 px-3 py-1.5 text-sm font-medium text-[#00aa6c] border border-[#00aa6c]/30">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {experience.length > 0 && (
                <div className="mt-8">
                  <div className="mb-4 flex items-center gap-2">
                    <Briefcase size={16} className="text-[#00aa6c]" />
                    <h2 className="text-sm font-bold uppercase tracking-widest text-gray-700">Experience</h2>
                  </div>
                  <div className="space-y-6">
                    {experience.map((item, i) => (
                      <div key={i} className="border-l-4 border-[#00aa6c] pl-5">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-base font-bold text-gray-900">{item.title}</p>
                            <p className="text-sm text-[#00aa6c] font-semibold">{item.company}</p>
                          </div>
                          {item.year && (
                            <span className="rounded-md bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600 whitespace-nowrap">
                              {item.year}
                            </span>
                          )}
                        </div>
                        {item.description && (
                          <p className="mt-3 text-sm leading-7 text-gray-700 whitespace-pre-line">{item.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {projects.length > 0 && (
                <div className="mt-8">
                  <div className="mb-4 flex items-center gap-2">
                    <FolderOpen size={16} className="text-[#00aa6c]" />
                    <h2 className="text-sm font-bold uppercase tracking-widest text-gray-700">Projects</h2>
                  </div>
                  <div className="space-y-5">
                    {projects.map((item, i) => (
                      <div key={i} className="border-l-4 border-[#00aa6c] pl-5">
                        <p className="text-base font-bold text-gray-900">{item.name}</p>
                        {item.description && (
                          <p className="mt-2 text-sm leading-7 text-gray-700 whitespace-pre-line">{item.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <p className="mt-10 text-center text-xs text-gray-500 border-t border-gray-200 pt-6">
                ✨ Generated with ChatCV AI Resume Builder
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── LaTeX Modal ────────────────────────────────────────────────────── */}
      {showLatexModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setShowLatexModal(false)}
        >
          <div
            className="relative flex flex-col w-full max-w-3xl max-h-[85vh] rounded-xl border border-white/10 bg-zinc-900 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-md bg-[#00ff9c]/10">
                  <Code size={16} className="text-[#00ff9c]" />
                </div>
                <h2 className="text-sm font-semibold text-white">LaTeX Source</h2>
                <span className="text-xs text-gray-500 font-mono bg-white/5 px-2 py-0.5 rounded">
                  resume.tex
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyLatex}
                  className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-gray-300 transition hover:bg-white/10 hover:text-white"
                >
                  {copied ? (
                    <>
                      <Check size={13} className="text-[#00ff9c]" />
                      <span className="text-[#00ff9c]">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={13} />
                      Copy
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowLatexModal(false)}
                  className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-gray-400 transition hover:bg-white/10 hover:text-white"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Code area */}
            <div className="flex-1 overflow-y-auto bg-zinc-950 rounded-b-none">
              <pre className="p-5 text-xs leading-relaxed text-gray-300 font-mono whitespace-pre-wrap wrap-break-word">
                {latexSource}
              </pre>
            </div>

            {/* Modal footer */}
            <div className="px-5 py-3 border-t border-white/10 flex items-center justify-between shrink-0 rounded-b-xl bg-zinc-900">
              <p className="text-xs text-gray-500">
                Paste into{" "}
                <a
                  href="https://overleaf.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#00ff9c] hover:underline"
                >
                  Overleaf
                </a>{" "}
                to compile and edit online
              </p>
              <p className="text-xs text-gray-600">
                <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-gray-400">Esc</kbd>{" "}
                to close
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}