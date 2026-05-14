"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import {
  Eye, FileDown, Loader2, CheckCircle, XCircle,
  Code, Copy, Check, X, Briefcase, Zap, FolderOpen,
  GraduationCap, Trophy, Globe, Link2,
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

// ── Client-side LaTeX preview builder (matches backend latex.builder.ts) ──────
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

  const contactParts = [
    data.phone ? esc(data.phone) : "",
    data.email ? `\\href{mailto:${data.email}}{\\underline{${esc(data.email)}}}` : "",
    data.location ? esc(data.location) : "",
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
      const tags = p.tags?.length ? ` $|$ \\emph{${p.tags.map(esc).join(", ")}}` : "";
      const bullets = p.bullets?.map((b) => `        \\resumeItem{${esc(b)}}`).join("\n") ?? "";
      return `    \\resumeProjectHeading\n      {\\textbf{${esc(p.name)}}${tags}}{}${bullets ? `\n      \\resumeItemListStart\n${bullets}\n      \\resumeItemListEnd` : ""}`;
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
  const previewRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const [pdfStatus, setPdfStatus] = useState<PdfStatus>({ stage: "idle" });
  const [showLatexModal, setShowLatexModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const data: ResumeData = resumeData ?? {
    name: "", role: "", email: "", phone: "", location: "", summary: "",
    links: [], skills: [], experience: [], projects: [], education: [], achievements: [],
  };

  const isEmpty = !resumeData;
  const latexSource = resumeData ? buildLatexPreview(resumeData) : "";

  useEffect(() => { return () => { wsRef.current?.close(); }; }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setShowLatexModal(false); };
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
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ resumeId }),
        });
        if (!res.ok) {
          const err = (await res.json()) as { message?: string };
          setPdfStatus({ stage: "error", message: err.message ?? "Failed to start" });
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
          type: string; step: string; message?: string; pdfUrl?: string;
        };
        if (msg.type !== "status") return;
        switch (msg.step) {
          case "fetching":
          case "building_latex":
          case "compiling_pdf":
            setPdfStatus({ stage: msg.step as "fetching" | "building_latex" | "compiling_pdf", message: msg.message ?? "" });
            break;
          case "done":
            setPdfStatus({ stage: "done", pdfUrl: msg.pdfUrl ?? "" });
            ws.close();
            const fullUrl = `${API_BASE}${msg.pdfUrl ?? ""}`;
            fetch(fullUrl, { headers: { Authorization: `Bearer ${token}` } })
              .then((r) => r.blob())
              .then((blob) => {
                const a = document.createElement("a");
                a.href = URL.createObjectURL(blob);
                a.download = `${data.name || "resume"}.pdf`;
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
      } catch { /* ignore malformed */ }
    };

    ws.onerror = () => { setPdfStatus({ stage: "error", message: "WebSocket connection failed." }); };
    ws.onclose = () => { wsRef.current = null; };
  }, [resumeId, data.name]);

  const isGenerating = ["connecting", "fetching", "building_latex", "compiling_pdf"].includes(pdfStatus.stage);
  const statusMessage =
    pdfStatus.stage === "connecting" ? "Connecting..."
    : isGenerating ? (pdfStatus as { message: string }).message
    : pdfStatus.stage === "done" ? "Downloaded!"
    : pdfStatus.stage === "error" ? "Error — retry?"
    : null;

  return (
    <>
      <section className="hidden h-full flex-col border-l border-white/10 bg-gradient-to-b from-zinc-950 to-black lg:flex">
        {/* Header */}
        <div className="shrink-0 flex items-center justify-between border-b border-white/10 px-6 py-4 bg-black/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#00ff9c]/10">
              <Eye size={18} className="text-[#00ff9c]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Live Preview</h3>
              <p className="text-xs text-gray-500 mt-0.5">Updates as you chat</p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowLatexModal(true)}
                disabled={isEmpty}
                title="View & copy LaTeX source"
                className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-gray-300 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Code size={15} />
                .tex
              </button>

              <button
                onClick={handleDownloadLatexPdf}
                disabled={isEmpty || isGenerating || !resumeId}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#00ff9c] to-[#00cc7a] px-4 py-2 text-sm font-semibold text-black transition hover:scale-105 hover:shadow-lg hover:shadow-[#00ff9c]/30 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
              >
                {isGenerating ? <Loader2 size={16} className="animate-spin" />
                  : pdfStatus.stage === "done" ? <CheckCircle size={16} />
                  : pdfStatus.stage === "error" ? <XCircle size={16} />
                  : <FileDown size={16} />}
                PDF
              </button>
            </div>
            {statusMessage && (
              <p className={`text-xs font-medium ${pdfStatus.stage === "error" ? "text-red-400" : pdfStatus.stage === "done" ? "text-[#00ff9c]" : "text-gray-400"}`}>
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
                Start chatting with AI or upload your existing resume to get started.
              </p>
            </div>
          ) : (
            <div
              ref={previewRef}
              className="mx-auto max-w-2xl rounded-xl bg-white p-8 text-black shadow-2xl border border-gray-200"
            >
              {/* Header */}
              <div className="border-b-2 border-gray-800 pb-5">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 uppercase">
                  {data.name || "Your Name"}
                </h1>
                {data.role && (
                  <p className="mt-1 text-base font-semibold text-[#00aa6c]">{data.role}</p>
                )}
                <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-600">
                  {data.email && <span>✉ {data.email}</span>}
                  {data.phone && <span>✆ {data.phone}</span>}
                  {data.location && <span>⌖ {data.location}</span>}
                </div>

                {/* Links */}
                {data.links?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-3">
                    {data.links.map((link, i) => (
                      <a
                        key={i}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-[#00aa6c] hover:underline"
                      >
                        {link.label?.toLowerCase().includes("github") ? <Code size={13} />
                          : link.label?.toLowerCase().includes("portfolio") ? <Globe size={13} />
                          : <Link2 size={13} />}
                        {link.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Summary */}
              {data.summary && (
                <Section icon={<Eye size={14} className="text-[#00aa6c]" />} title="Summary">
                  <p className="text-sm leading-7 text-gray-700 whitespace-pre-line">{data.summary}</p>
                </Section>
              )}

              {/* Skills */}
              {data.skills?.length > 0 && (
                <Section icon={<Zap size={14} className="text-[#00aa6c]" />} title="Skills">
                  <div className="space-y-2">
                    {data.skills.map((sg: SkillGroup, i) => (
                      <div key={i} className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                        <span className="text-sm font-bold text-gray-800 min-w-fit">{sg.category}:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {sg.items.map((item, j) => (
                            <span key={j} className="rounded-md bg-[#00aa6c]/10 px-2 py-0.5 text-xs font-medium text-[#00aa6c] border border-[#00aa6c]/20">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {/* Experience */}
              {data.experience?.length > 0 && (
                <Section icon={<Briefcase size={14} className="text-[#00aa6c]" />} title="Experience">
                  <div className="space-y-6">
                    {data.experience.map((exp: Experience, i) => (
                      <div key={i}>
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-sm font-bold text-gray-900">{exp.role}</p>
                            <p className="text-sm text-[#00aa6c] font-semibold">{exp.company}{exp.location ? `, ${exp.location}` : ""}</p>
                          </div>
                          <span className="whitespace-nowrap rounded-md bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600">
                            {exp.startDate} – {exp.isCurrent ? "Present" : exp.endDate}
                          </span>
                        </div>
                        {exp.bullets?.length > 0 && (
                          <ul className="mt-2 space-y-1 list-disc list-outside ml-4">
                            {exp.bullets.map((b, j) => (
                              <li key={j} className="text-sm text-gray-700 leading-6">{b}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {/* Projects */}
              {data.projects?.length > 0 && (
                <Section icon={<FolderOpen size={14} className="text-[#00aa6c]" />} title="Projects">
                  <div className="space-y-5">
                    {data.projects.map((proj: Project, i) => (
                      <div key={i}>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-bold text-gray-900">{proj.name}</p>
                          {proj.liveUrl && (
                            <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="text-xs text-[#00aa6c] hover:underline flex items-center gap-1">
                              <Globe size={11} /> Live
                            </a>
                          )}
                          {proj.githubUrl && (
                            <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="text-xs text-[#00aa6c] hover:underline flex items-center gap-1">
                              <Code size={11} /> Code
                            </a>
                          )}
                        </div>
                        {proj.tags?.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {proj.tags.map((tag, j) => (
                              <span key={j} className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">{tag}</span>
                            ))}
                          </div>
                        )}
                        {proj.bullets?.length > 0 && (
                          <ul className="mt-2 space-y-1 list-disc list-outside ml-4">
                            {proj.bullets.map((b, j) => (
                              <li key={j} className="text-sm text-gray-700 leading-6">{b}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {/* Education */}
              {data.education?.length > 0 && (
                <Section icon={<GraduationCap size={14} className="text-[#00aa6c]" />} title="Education">
                  <div className="space-y-4">
                    {data.education.map((edu: Education, i) => (
                      <div key={i} className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-bold text-gray-900">{edu.degree}</p>
                          <p className="text-sm text-[#00aa6c] font-semibold">{edu.institution}{edu.location ? `, ${edu.location}` : ""}</p>
                          {edu.grade && <p className="text-xs text-gray-500 mt-0.5">Grade: {edu.grade}</p>}
                        </div>
                        <span className="whitespace-nowrap rounded-md bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600">
                          {edu.startYear} – {edu.endYear}
                        </span>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {/* Achievements */}
              {data.achievements?.length > 0 && (
                <Section icon={<Trophy size={14} className="text-[#00aa6c]" />} title="Achievements">
                  <div className="space-y-3">
                    {data.achievements.map((ach: Achievement, i) => (
                      <div key={i}>
                        <p className="text-sm font-bold text-gray-900">{ach.title}</p>
                        {ach.description && <p className="mt-0.5 text-sm text-gray-700">{ach.description}</p>}
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              <p className="mt-8 text-center text-xs text-gray-400 border-t border-gray-200 pt-4">
                ✨ Generated with ChatCV AI Resume Builder
              </p>
            </div>
          )}
        </div>
      </section>

      {/* LaTeX Modal */}
      {showLatexModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setShowLatexModal(false)}
        >
          <div
            className="relative flex flex-col w-full max-w-3xl max-h-[85vh] rounded-xl border border-white/10 bg-zinc-900 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-md bg-[#00ff9c]/10">
                  <Code size={16} className="text-[#00ff9c]" />
                </div>
                <h2 className="text-sm font-semibold text-white">LaTeX Source</h2>
                <span className="text-xs text-gray-500 font-mono bg-white/5 px-2 py-0.5 rounded">resume.tex</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyLatex}
                  className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-gray-300 transition hover:bg-white/10 hover:text-white"
                >
                  {copied ? <><Check size={13} className="text-[#00ff9c]" /><span className="text-[#00ff9c]">Copied!</span></> : <><Copy size={13} />Copy</>}
                </button>
                <button
                  onClick={() => setShowLatexModal(false)}
                  className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-gray-400 transition hover:bg-white/10 hover:text-white"
                >
                  <X size={15} />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto bg-zinc-950">
              <pre className="p-5 text-xs leading-relaxed text-gray-300 font-mono whitespace-pre-wrap break-words">
                {latexSource}
              </pre>
            </div>
            <div className="px-5 py-3 border-t border-white/10 flex items-center justify-between shrink-0 rounded-b-xl bg-zinc-900">
              <p className="text-xs text-gray-500">
                Paste into{" "}
                <a href="https://overleaf.com" target="_blank" rel="noreferrer" className="text-[#00ff9c] hover:underline">
                  Overleaf
                </a>{" "}
                to compile and edit online
              </p>
              <p className="text-xs text-gray-600">
                <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-gray-400">Esc</kbd> to close
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── Reusable Section wrapper ───────────────────────────────────────────────────
function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="mt-7">
      <div className="mb-3 flex items-center gap-2 pb-1 border-b border-gray-200">
        {icon}
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-700">{title}</h2>
      </div>
      {children}
    </div>
  );
}