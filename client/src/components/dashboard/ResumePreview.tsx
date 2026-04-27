"use client";

import { useRef } from "react";
import { Briefcase, Download, Eye, FolderOpen, User, Zap } from "lucide-react";

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
}

export default function ResumePreview({ resumeData }: ResumePreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null);
  const data = resumeData || {};

  const skills = Array.isArray(data.skills)
    ? data.skills
      .map((item) => (typeof item === "string" ? item : item.name))
      .filter(Boolean)
    : [];

  const experience = Array.isArray(data.experience) ? data.experience : [];
  const projects = Array.isArray(data.projects) ? data.projects : [];
  const isEmpty = !resumeData;

  // Replace the entire handleDownloadPDF function
  const handleDownloadPDF = () => {
    if (!previewRef.current) return;

    // Clone the resume node into a hidden print container
    const printContents = previewRef.current.innerHTML;
    const originalTitle = document.title;

    // Create a hidden iframe so we don't disturb the page
    const iframe = document.createElement("iframe");
    iframe.style.cssText = "position:fixed;top:0;left:0;width:0;height:0;border:none;visibility:hidden;";
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentWindow?.document;
    if (!iframeDoc) return;

    iframeDoc.open();
    iframeDoc.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${originalTitle}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Georgia, 'Times New Roman', serif; background: white; color: black; }
          .resume-print { max-width: 210mm; margin: 0 auto; padding: 20mm; }
          h1 { font-size: 28pt; font-weight: bold; color: #111; }
          h2 { font-size: 9pt; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; color: #555; margin-bottom: 8px; }
          p  { font-size: 10pt; line-height: 1.6; color: #333; }
          .role { font-size: 13pt; font-weight: 600; color: #00aa6c; margin-top: 6px; }
          .contact { display: flex; gap: 20px; margin-top: 12px; font-size: 9pt; color: #555; }
          .divider { border: none; border-top: 2px solid #e5e7eb; margin: 16px 0; }
          .section { margin-top: 20px; }
          .section-header { display: flex; align-items: center; gap-6px; margin-bottom: 10px; padding-bottom: 4px; border-bottom: 1px solid #e5e7eb; }
          .skills-wrap { display: flex; flex-wrap: wrap; gap: 6px; }
          .skill-tag { background: #f0fdf4; color: #00aa6c; border: 1px solid #bbf7d0; border-radius: 6px; padding: 3px 10px; font-size: 9pt; font-weight: 500; }
          .exp-item { margin-bottom: 14px; padding-left: 14px; border-left: 3px solid #00aa6c; }
          .exp-title { font-weight: bold; font-size: 11pt; }
          .exp-company { color: #00aa6c; font-size: 10pt; font-weight: 600; }
          .exp-year { font-size: 8pt; color: #888; }
          .exp-desc { font-size: 9pt; color: #555; margin-top: 4px; line-height: 1.6; }
          .footer { margin-top: 30px; text-align: center; font-size: 8pt; color: #aaa; border-top: 1px solid #eee; padding-top: 12px; }
          @media print {
            @page { size: A4; margin: 15mm; }
            body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>
        <div class="resume-print">${printContents}</div>
      </body>
    </html>
  `);
    iframeDoc.close();

    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();

    // Cleanup after print dialog closes
    setTimeout(() => document.body.removeChild(iframe), 1000);
  };

  return (
    <section className="hidden h-full flex-col border-l border-white/10 bg-gradient-to-b from-zinc-950 to-black lg:flex">
      <div className="shrink-0 flex items-center justify-between border-b border-white/10 px-6 py-4 bg-black/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#00ff9c]/10">
            <Eye size={18} className="text-[#00ff9c]" />
          </div>
          <h3 className="text-sm font-semibold text-white">Live Preview</h3>
        </div>
        <button
          onClick={handleDownloadPDF}
          disabled={isEmpty}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#00ff9c] to-[#00cc7a] px-4 py-2 text-sm font-semibold text-black transition hover:scale-105 hover:shadow-lg hover:shadow-[#00ff9c]/30 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
        >
          <Download size={16} />
          PDF
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {isEmpty ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-4 rounded-2xl bg-white/5 p-6 border border-white/10">
              <Eye size={32} className="text-gray-600 mx-auto" />
            </div>
            <p className="text-base font-semibold text-gray-300">No resume yet</p>
            <p className="mt-2 text-sm text-gray-500 max-w-xs">Start chatting with AI to generate your resume</p>
          </div>
        ) : (
          <div ref={previewRef} className="mx-auto max-w-2xl rounded-xl bg-white p-8 text-black shadow-2xl border border-gray-200">
            {/* Header */}
            <div className="border-b-2 border-gray-200 pb-6">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                {data.name || data.fullName || "Your Name"}
              </h1>
              <p className="mt-2 text-base font-semibold text-[#00aa6c]">{data.role || data.title || "Your Role"}</p>
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
                {data.email && <span className="flex items-center gap-1">📧 {data.email}</span>}
                {data.phone && <span className="flex items-center gap-1">📱 {data.phone}</span>}
                {data.location && <span className="flex items-center gap-1">📍 {data.location}</span>}
              </div>
            </div>

            {/* Summary */}
            {data.summary && (
              <div className="mt-8">
                <div className="mb-3 flex items-center gap-2">
                  <User size={16} className="text-[#00aa6c]" />
                  <h2 className="text-sm font-bold uppercase tracking-widest text-gray-700">Professional Summary</h2>
                </div>
                <p className="text-sm leading-8 text-gray-700 whitespace-pre-line">{data.summary}</p>
              </div>
            )}

            {/* Skills */}
            {skills.length > 0 && (
              <div className="mt-8">
                <div className="mb-4 flex items-center gap-2">
                  <Zap size={16} className="text-[#00aa6c]" />
                  <h2 className="text-sm font-bold uppercase tracking-widest text-gray-700">Skills</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, i) => (
                    <span
                      key={i}
                      className="rounded-lg bg-[#00aa6c]/10 px-3 py-1.5 text-sm font-medium text-[#00aa6c] border border-[#00aa6c]/30"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Experience */}
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
                          <p className="text-base font-bold text-gray-900">{item.title || "Role"}</p>
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

            {/* Projects */}
            {projects.length > 0 && (
              <div className="mt-8">
                <div className="mb-4 flex items-center gap-2">
                  <FolderOpen size={16} className="text-[#00aa6c]" />
                  <h2 className="text-sm font-bold uppercase tracking-widest text-gray-700">Projects</h2>
                </div>
                <div className="space-y-5">
                  {projects.map((item, i) => (
                    <div key={i} className="border-l-4 border-[#00aa6c] pl-5">
                      <p className="text-base font-bold text-gray-900">{item.name || "Project"}</p>
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
  );
}