"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import {
  Eye, FileDown, Loader2, CheckCircle, XCircle,
  Code, Copy, Check, X, Sparkles
} from "lucide-react";
import { ResumeData, SkillGroup, Experience, Project, Education, Achievement } from "@/types/resume";

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

// ── Client-side LaTeX preview builder (matches backend updates) ──────
function buildLatexPreview(data: ResumeData): string {
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

  const links = data.links || [];
  const validLinks = links.filter((l: any) => typeof l === "object" && (l.label || l.name) && l.url);
  const linkParts = validLinks.map((link: any) => {
    const label = link.label || link.name || "Link";
    const rawUrl = String(link.url || "").trim();
    const cleanUrl = rawUrl.replace(/\\/g, "");
    const fullUrl = /^https?:\/\//.test(cleanUrl) ? cleanUrl : `https://${cleanUrl}`;
    return `\\href{${fullUrl}}{\\underline{${esc(label)}}}`;
  });

  const contactParts = [
    data.phone ? esc(data.phone) : "",
    data.email ? `\\href{mailto:${data.email}}{\\underline{${esc(data.email)}}}` : "",
    data.location ? esc(data.location) : "",
    ...linkParts
  ].filter(Boolean).join(" $|$ ");

  const skillsSection = data.skills?.length
    ? `\\section{Technical Skills}\n  \\begin{itemize}[leftmargin=0.15in, label={}]\n    \\small{\\item{\n      ${data.skills.map((sg) => `\\textbf{${esc(sg.category)}}{: ${sg.items.map(esc).join(", ")}}`).join(" \\\\\n      ")}\n    }}\n  \\end{itemize}`
    : "";

  const expSection = data.experience?.length
    ? `\\section{Experience}\n  \\resumeSubHeadingListStart\n${data.experience.map((exp) => {
      const bullets = exp.bullets?.map((b) => `        \\resumeItem{${esc(b)}}`).join("\n") ?? "";
      return `    \\resumeSubheading\n      {${esc(exp.company)}}{${esc(exp.startDate)} -- ${exp.isCurrent ? "Present" : esc(exp.endDate)}}\n      {${esc(exp.role)}}{${esc(exp.location)}}${bullets ? `\n      \\resumeItemListStart\n${bullets}\n      \\resumeItemListEnd` : ""}`;
    }).join("\n")}\n  \\resumeSubHeadingListEnd`
    : "";

  const projSection = data.projects?.length
    ? `\\section{Projects}\n  \\resumeSubHeadingListStart\n${data.projects.map((p) => {
      const linksList: string[] = [];
      if (p.githubUrl) {
        const cleanUrl = String(p.githubUrl).trim().replace(/\\/g, "");
        const fullUrl = /^https?:\/\//.test(cleanUrl) ? cleanUrl : `https://${cleanUrl}`;
        linksList.push(`\\href{${fullUrl}}{\\underline{GitHub}}`);
      }
      if (p.liveUrl) {
        const cleanUrl = String(p.liveUrl).trim().replace(/\\/g, "");
        const fullUrl = /^https?:\/\//.test(cleanUrl) ? cleanUrl : `https://${cleanUrl}`;
        linksList.push(`\\href{${fullUrl}}{\\underline{Live Demo}}`);
      }
      const linkStr = linksList.length > 0 ? linksList.join(" $|$ ") : "";

      const tags = p.tags?.length
        ? `\\small\\textit{${p.tags.map(esc).join(", ")}} & \\\\\n      `
        : "";

      const bullets = p.bullets?.map((b) => `        \\resumeItem{${esc(b)}}`).join("\n") ?? "";

      return `    \\item\n    \\begin{tabular*}{1.0\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}\n      \\textbf{${esc(p.name)}} & \\small ${linkStr} \\\\\n      ${tags}\\end{tabular*}\\vspace{-7pt}${bullets ? `\n      \\resumeItemListStart\n${bullets}\n      \\resumeItemListEnd` : ""}`;
    }).join("\n")}\n  \\resumeSubHeadingListEnd`
    : "";

  const eduSection = data.education?.length
    ? `\\section{Education}\n  \\resumeSubHeadingListStart\n${data.education.map((edu) =>
      `    \\resumeSubheading\n      {${esc(edu.institution)}}{${esc(edu.startYear)} -- ${esc(edu.endYear)}}\n      {${esc(edu.degree)}}{${esc(edu.location)}}${edu.grade ? `\n      \\resumeItemListStart\n        \\resumeItem{Grade: ${esc(edu.grade)}}\n      \\resumeItemListEnd` : ""}`
    ).join("\n")}\n  \\resumeSubHeadingListEnd`
    : "";

  const sections = [
    data.summary ? `\\section{Summary}\n  \\small{${esc(data.summary)}}` : "",
    expSection,
    projSection,
    skillsSection,
    eduSection,
  ].filter(Boolean).join("\n\n");

  return `\\documentclass[letterpaper,11pt]{article}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}

\\pagestyle{fancy}
\\fancyhf{}
\\renewcommand{\\headrulewidth}{0pt}

\\addtolength{\\oddsidemargin}{-0.6in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1.19in}
\\addtolength{\\topmargin}{-.7in}
\\addtolength{\\textheight}{1.4in}

\\urlstyle{same}
\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large\\bfseries
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

\\newcommand{\\resumeItem}[1]{\\item\\small{{#1 \\vspace{-2pt}}}}
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
    {\\Huge \\scshape ${esc(data.name || "Your Name")}} \\\\ \\vspace{4pt}
    ${data.role ? `{\\large ${esc(data.role)}} \\\\ \\vspace{4pt}` : ""}
    \\small ${contactParts}
    \\vspace{-8pt}
\\end{center}

${sections}

\\end{document}`;
}

export default function ResumePreview({ resumeData, resumeId }: ResumePreviewProps) {
  const wsRef = useRef<WebSocket | null>(null);
  const [pdfStatus, setPdfStatus] = useState<PdfStatus>({ stage: "idle" });
  const [showLatexModal, setShowLatexModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // States for Compiled PDF Live Preview
  const [previewBlobUrl, setPreviewBlobUrl] = useState<string | null>(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const [compileStep, setCompileStep] = useState("");
  const [compileError, setCompileError] = useState<string | null>(null);
  const [backendLatexSource, setBackendLatexSource] = useState("");

  const data: ResumeData = resumeData ?? {
    name: "", role: "", email: "", phone: "", location: "", summary: "",
    links: [], skills: [], experience: [], projects: [], education: [], achievements: [],
  };

  const isEmpty = !resumeData;
  const latexSource = backendLatexSource || (resumeData ? buildLatexPreview(resumeData) : "");

  useEffect(() => {
    return () => {
      wsRef.current?.close();
      if (previewBlobUrl) {
        URL.revokeObjectURL(previewBlobUrl);
      }
    };
  }, [previewBlobUrl]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowLatexModal(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // ── Automatic Background Compiler ──────────────────────────────────────────
  const compilePreview = useCallback(async () => {
    if (!resumeId) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    // Close any existing compilation socket
    wsRef.current?.close();

    setIsCompiling(true);
    setCompileError(null);
    setCompileStep("Connecting...");

    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
    const WS_BASE = API_BASE.replace(/^http/, "ws");
    const ws = new WebSocket(`${WS_BASE}/ws/${resumeId}`);
    wsRef.current = ws;

    ws.onopen = async () => {
      setCompileStep("Requesting compilation...");
      try {
        const res = await fetch(`${API_BASE}/api/latex/generate`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ resumeId }),
        });
        if (!res.ok) {
          const err = (await res.json()) as { message?: string };
          setCompileError(err.message ?? "Failed to start compilation");
          setIsCompiling(false);
          ws.close();
        }
      } catch {
        setCompileError("Network error starting compilation");
        setIsCompiling(false);
        ws.close();
      }
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data as string) as {
          type: string; step: string; message?: string; pdfUrl?: string; latexSource?: string;
        };
        if (msg.type !== "status") return;
        switch (msg.step) {
          case "fetching":
            setCompileStep("Loading resume details...");
            break;
          case "building_latex":
            setCompileStep("Generating LaTeX template...");
            break;
          case "compiling_pdf":
            setCompileStep("Compiling PDF via LaTeX...");
            break;
          case "done":
            if (msg.latexSource) {
              setBackendLatexSource(msg.latexSource);
            }
            const fullUrl = `${API_BASE}${msg.pdfUrl ?? ""}`;
            fetch(fullUrl, { headers: { Authorization: `Bearer ${token}` } })
              .then((r) => r.blob())
              .then((blob) => {
                const objectUrl = URL.createObjectURL(blob);
                setPreviewBlobUrl((prev) => {
                  if (prev) URL.revokeObjectURL(prev); // clean up old url
                  return objectUrl;
                });
                setIsCompiling(false);
                setCompileStep("");
                ws.close();
              })
              .catch(() => {
                setCompileError("Failed to retrieve compiled PDF");
                setIsCompiling(false);
                ws.close();
              });
            break;
          case "error":
            setCompileError(msg.message ?? "Compilation failed");
            setIsCompiling(false);
            ws.close();
            break;
        }
      } catch { /* ignore malformed */ }
    };

    ws.onerror = () => {
      setCompileError("WebSocket connection lost");
      setIsCompiling(false);
    };

    ws.onclose = () => {
      wsRef.current = null;
    };
  }, [resumeId]);

  // Recompile whenever the resume changes (debounced by network response updates)
  useEffect(() => {
    if (!isEmpty && resumeId) {
      compilePreview();
    }
  }, [resumeId, JSON.stringify(resumeData), compilePreview]);

  const handleCopyLatex = useCallback(async () => {
    if (!latexSource) return;
    await navigator.clipboard.writeText(latexSource);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [latexSource]);

  // Instant download since the PDF is already compiled in state!
  const handleDownloadPdf = useCallback(() => {
    if (previewBlobUrl) {
      setPdfStatus({ stage: "connecting" });
      const a = document.createElement("a");
      a.href = previewBlobUrl;
      a.download = `${data.name || "resume"}.pdf`;
      a.click();
      setPdfStatus({ stage: "done", pdfUrl: previewBlobUrl });
      setTimeout(() => setPdfStatus({ stage: "idle" }), 2000);
    } else {
      // If preview is not ready, fall back to compiling and downloading
      compilePreview();
    }
  }, [previewBlobUrl, compilePreview, data.name]);

  return (
    <>
      <section className="hidden h-full flex-col border-l border-white/5 bg-[#09090b] lg:flex">
        {/* Header */}
        <div className="shrink-0 flex items-center justify-between border-b border-white/5 px-6 py-4 bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-[#00ff9c]/10 to-[#00cc7a]/5 border border-[#00ff9c]/20 shadow-inner">
              <Eye size={18} className="text-[#00ff9c]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-white">Live PDF Preview</h3>
                {isCompiling && (
                  <span className="flex h-2 w-2 rounded-full bg-[#00ff9c] animate-ping" />
                )}
              </div>
              <p className="text-xs text-gray-400 mt-0.5 font-medium">
                {isCompiling ? "Compiling updates..." : "Synced with chat"}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowLatexModal(true)}
                disabled={isEmpty}
                title="View & copy LaTeX source"
                className="flex items-center gap-1.5 rounded-lg border border-white/5 bg-white/5 px-3 py-2 text-sm font-semibold text-gray-300 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Code size={15} />
                .tex
              </button>

              <button
                onClick={handleDownloadPdf}
                disabled={isEmpty || !previewBlobUrl}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#00ff9c] to-[#00cc7a] px-4 py-2 text-sm font-bold text-black transition hover:scale-[1.03] hover:shadow-lg hover:shadow-[#00ff9c]/20 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {pdfStatus.stage === "connecting" ? <Loader2 size={16} className="animate-spin" />
                  : pdfStatus.stage === "done" ? <CheckCircle size={16} />
                  : pdfStatus.stage === "error" ? <XCircle size={16} />
                  : <FileDown size={16} />}
                Download PDF
              </button>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        {isCompiling && (
          <div className="h-[2px] bg-white/5 w-full shrink-0">
            <div className="h-full bg-gradient-to-r from-[#00ff9c] to-[#00cc7a] animate-pulse w-2/3" />
          </div>
        )}

        {/* Resume Preview Area */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col justify-stretch">
          {isEmpty ? (
            <div className="flex h-full flex-col items-center justify-center text-center self-center my-auto">
              <div className="mb-5 rounded-2xl bg-white/5 p-6 border border-white/5 shadow-md">
                <Eye size={36} className="text-gray-600 mx-auto" />
              </div>
              <p className="text-base font-bold text-white tracking-tight">No preview yet</p>
              <p className="mt-2 text-sm text-gray-400 max-w-xs leading-relaxed">
                Start chatting with the assistant to build your resume and watch the PDF compile live here.
              </p>
            </div>
          ) : isCompiling && !previewBlobUrl ? (
            // Full-screen loading on initial load
            <div className="flex h-full flex-col items-center justify-center text-center self-center my-auto">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#00ff9c]/10 to-[#00cc7a]/5 border border-[#00ff9c]/25 shadow-lg shadow-[#00ff9c]/5">
                <Loader2 size={28} className="animate-spin text-[#00ff9c]" />
              </div>
              <p className="text-base font-bold text-white tracking-tight">Compiling PDF</p>
              <p className="mt-2 text-sm text-gray-400 font-medium tracking-wide animate-pulse">
                {compileStep}
              </p>
            </div>
          ) : compileError && !previewBlobUrl ? (
            // Error handling
            <div className="flex h-full flex-col items-center justify-center text-center self-center my-auto">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/25">
                <XCircle size={28} className="text-red-400" />
              </div>
              <p className="text-base font-bold text-white">Compilation Failed</p>
              <p className="mt-2 text-sm text-red-400 max-w-xs leading-relaxed">
                {compileError}
              </p>
              <button
                onClick={compilePreview}
                className="mt-5 rounded-xl border border-white/5 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 transition"
              >
                Retry Compile
              </button>
            </div>
          ) : (
            // PDF iframe display
            <div className="relative flex-1 w-full h-full rounded-2xl overflow-hidden bg-[#18181b] border border-white/5 shadow-2xl flex flex-col justify-stretch">
              {previewBlobUrl && (
                <iframe
                  src={`${previewBlobUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                  className="w-full h-full border-0 flex-1 bg-white"
                  title="Compiled Resume PDF"
                />
              )}
              {isCompiling && (
                <div className="absolute bottom-4 right-4 flex items-center gap-2.5 rounded-xl bg-black/80 border border-white/5 px-4 py-2 backdrop-blur-md shadow-lg z-20">
                  <Loader2 size={13} className="animate-spin text-[#00ff9c]" />
                  <span className="text-[11px] font-bold text-white uppercase tracking-wider">Compiling...</span>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* LaTeX Modal */}
      {showLatexModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
          onClick={() => setShowLatexModal(false)}
        >
          <div
            className="relative flex flex-col w-full max-w-3xl max-h-[85vh] rounded-2xl border border-white/5 bg-[#18181b] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#00ff9c]/10 border border-[#00ff9c]/10 shadow-sm">
                  <Code size={18} className="text-[#00ff9c]" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">LaTeX Source</h2>
                  <p className="text-xs text-gray-500 font-mono mt-0.5">resume.tex</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyLatex}
                  className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/5 px-3 py-2 text-xs font-bold text-gray-300 transition hover:bg-white/10 hover:text-white"
                >
                  {copied ? <><Check size={13} className="text-[#00ff9c]" /><span className="text-[#00ff9c]">Copied!</span></> : <><Copy size={13} />Copy</>}
                </button>
                <button
                  onClick={() => setShowLatexModal(false)}
                  className="rounded-lg border border-white/5 bg-white/5 p-2 text-gray-400 transition hover:bg-white/10 hover:text-white"
                >
                  <X size={15} />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto bg-[#09090b]">
              <pre className="p-6 text-[11px] leading-relaxed text-gray-300 font-mono whitespace-pre-wrap break-words">
                {latexSource}
              </pre>
            </div>
            <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between shrink-0 rounded-b-2xl bg-[#18181b]">
              <p className="text-xs text-gray-500">
                Paste into{" "}
                <a href="https://overleaf.com" target="_blank" rel="noreferrer" className="text-[#00ff9c] font-semibold hover:underline">
                  Overleaf
                </a>{" "}
                to compile online
              </p>
              <p className="text-xs text-gray-500">
                <kbd className="rounded bg-white/5 px-2 py-1 border border-white/5 font-mono text-gray-400 text-[10px]">Esc</kbd> to close
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}