// ─── Escape helper ────────────────────────────────────────────────────────────

function escape(text: string): string {
  if (!text) return "";
  return String(text)
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
}

function e(val: unknown): string {
  if (val === null || val === undefined) return "";
  if (typeof val === "object") return ""; // never stringify objects
  return escape(String(val));
}

// ─── Section builders ────────────────────────────────────────────────────────

// Links — schema: { label: string; url: string }[]
function buildLinksSection(links: Array<{ label?: string; name?: string; url?: string }>): string {
  if (!links || links.length === 0) return "";

  const valid = links.filter(
    (l) => typeof l === "object" && (l.label || l.name) && l.url
  );
  if (valid.length === 0) return "";

  const linkItems = valid
    .map((link) => {
      const label = e(link.label || link.name || "");
      const rawUrl = String(link.url || "").trim();
      // Strip LaTeX escapes to keep the actual URL valid for \href
      const cleanUrl = rawUrl.replace(/\\/g, "");
      const fullUrl = /^https?:\/\//.test(cleanUrl) ? cleanUrl : `https://${cleanUrl}`;
      return `    \\resumeItem{\\href{${fullUrl}}{\\underline{${label}}}}`;
    })
    .join("\n");

  return `\\section{Links}
  \\resumeItemListStart
${linkItems}
  \\resumeItemListEnd`;
}

// Skills — schema: { category: string; items: string[] }[]  OR  string[]
function buildSkillsSection(
  skills: Array<{ category?: string; items?: string[] } | string>
): string {
  if (!skills || skills.length === 0) return "";

  let rows: string[] = [];

  // Detect if it's the rich SkillGroup[] format or flat string[]
  if (typeof skills[0] === "object" && skills[0] !== null && !Array.isArray(skills[0])) {
    // Rich format: SkillGroup[]
    rows = (skills as Array<{ category?: string; items?: string[] }>)
      .filter((sg) => sg && typeof sg === "object" && sg.category && Array.isArray(sg.items) && sg.items.length > 0)
      .map((sg) => {
        const cat = e(sg.category!);
        const items = sg.items!.map((i) => e(i)).join(", ");
        return `      \\textbf{${cat}}{: ${items}}`;
      });
  } else {
    // Flat string[]
    const items = (skills as string[]).map((s) => e(s)).join(", ");
    if (!items) return "";
    rows = [`      \\textbf{Skills}{: ${items}}`];
  }

  if (rows.length === 0) return "";

  return `\\section{Technical Skills}
  \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
${rows.join(" \\\\\n")}
    }}
  \\end{itemize}`;
}

// Experience — schema: { role, company, location, startDate, endDate, isCurrent, bullets[] }
function buildExperienceSection(
  experience: Array<{
    // New schema
    role?: string;
    company?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    isCurrent?: boolean;
    bullets?: string[];
    // Old schema fallback
    title?: string;
    year?: string;
    description?: string;
  }>
): string {
  if (!experience || experience.length === 0) return "";

  const items = experience
    .filter((exp) => typeof exp === "object" && exp !== null)
    .map((exp) => {
      // Support both old and new schema
      const company = e(exp.company || "");
      const role = e(exp.role || exp.title || "");
      const location = e(exp.location || "");

      // Date range
      let dateRange = e(exp.year || "");
      if (!dateRange) {
        const start = e(exp.startDate || "");
        const endRaw = exp.isCurrent ? "Present" : e(exp.endDate || "");
        dateRange = start && endRaw ? `${start} -- ${endRaw}` : start || endRaw;
      }

      const locationAndDate = location
        ? `${location}`
        : "";

      // Bullets: prefer bullets[] array, fall back to description string
      let bulletItems = "";
      if (Array.isArray(exp.bullets) && exp.bullets.length > 0) {
        const rendered = exp.bullets
          .filter((b) => typeof b === "string" && b.trim())
          .map((b) => `        \\resumeItem{${e(b)}}`)
          .join("\n");
        if (rendered) {
          bulletItems = `\n      \\resumeItemListStart\n${rendered}\n      \\resumeItemListEnd`;
        }
      } else if (exp.description) {
        const bullets = String(exp.description)
          .split(/\.\s+|\n/)
          .map((b) => b.trim())
          .filter((b) => b.length > 0);
        if (bullets.length > 0) {
          const rendered = bullets.map((b) => `        \\resumeItem{${e(b)}}`).join("\n");
          bulletItems = `\n      \\resumeItemListStart\n${rendered}\n      \\resumeItemListEnd`;
        }
      }

      return `    \\resumeSubheading
      {${company}}{${dateRange}}
      {${role}}{${locationAndDate}}${bulletItems}`;
    });

  if (items.length === 0) return "";

  return `\\section{Experience}
  \\resumeSubHeadingListStart
${items.join("\n")}
  \\resumeSubHeadingListEnd`;
}

// Projects — schema: { name, tags[], bullets[], liveUrl?, githubUrl? }
function buildProjectsSection(
  projects: Array<{
    name?: string;
    tags?: string[];
    bullets?: string[];
    liveUrl?: string;
    githubUrl?: string;
    // Old schema fallback
    description?: string;
  }>
): string {
  if (!projects || projects.length === 0) return "";

  const items = projects
    .filter((p) => typeof p === "object" && p !== null)
    .map((proj) => {
      const name = e(proj.name || "Project");

      // Build heading with optional links at the end
      const links: string[] = [];
      if (proj.githubUrl) {
        const rawUrl = String(proj.githubUrl).trim().replace(/\\/g, "");
        const fullUrl = /^https?:\/\//.test(rawUrl) ? rawUrl : `https://${rawUrl}`;
        links.push(`\\href{${fullUrl}}{\\underline{GitHub}}`);
      }
      if (proj.liveUrl) {
        const rawUrl = String(proj.liveUrl).trim().replace(/\\/g, "");
        const fullUrl = /^https?:\/\//.test(rawUrl) ? rawUrl : `https://${rawUrl}`;
        links.push(`\\href{${fullUrl}}{\\underline{Live Demo}}`);
      }
      const linkStr = links.length > 0 ? links.join(" $|$ ") : "";

      // Tech tags on the bottom line
      const techStr =
        Array.isArray(proj.tags) && proj.tags.length > 0
          ? `\\small\\textit{${proj.tags.map((t) => e(t)).join(", ")}} & \\\\\n      `
          : "";

      // Bullets
      let bulletItems = "";
      if (Array.isArray(proj.bullets) && proj.bullets.length > 0) {
        const rendered = proj.bullets
          .filter((b) => typeof b === "string" && b.trim())
          .map((b) => `        \\resumeItem{${e(b)}}`)
          .join("\n");
        if (rendered) {
          bulletItems = `\n      \\resumeItemListStart\n${rendered}\n      \\resumeItemListEnd`;
        }
      } else if (proj.description) {
        bulletItems = `\n      \\resumeItemListStart\n        \\resumeItem{${e(proj.description)}}\n      \\resumeItemListEnd`;
      }

      return `    \\item
    \\begin{tabular*}{1.0\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{${name}} & \\small ${linkStr} \\\\
      ${techStr}\\end{tabular*}\\vspace{-7pt}${bulletItems}`;
    });

  if (items.length === 0) return "";

  return `\\section{Projects}
  \\vspace{-5pt}
  \\resumeSubHeadingListStart
${items.join("\n")}
  \\resumeSubHeadingListEnd`;
}

// Education — schema: { degree, institution, location, startYear, endYear, grade? }
function buildEducationSection(
  education: Array<{
    degree?: string;
    institution?: string;
    location?: string;
    startYear?: string;
    endYear?: string;
    grade?: string;
    // Old fallback
    school?: string;
    year?: string;
  }>
): string {
  if (!education || education.length === 0) return "";

  const items = education
    .filter((edu) => typeof edu === "object" && edu !== null)
    .map((edu) => {
      const institution = e(edu.institution || edu.school || "");
      const degree = e(edu.degree || "");
      const location = e(edu.location || "");
      const startY = e(edu.startYear || "");
      const endY = e(edu.endYear || edu.year || "");
      const dateRange = startY && endY ? `${startY} -- ${endY}` : startY || endY;

      const gradeBlock = edu.grade
        ? `\n      \\resumeItemListStart\n        \\resumeItem{Grade: ${e(edu.grade)}}\n      \\resumeItemListEnd`
        : "";

      return `    \\resumeSubheading
      {${institution}}{${dateRange}}
      {${degree}}{${location}}${gradeBlock}`;
    });

  if (items.length === 0) return "";

  return `\\section{Education}
  \\resumeSubHeadingListStart
${items.join("\n")}
  \\resumeSubHeadingListEnd`;
}

// Achievements — schema: { title, description? }[]
function buildAchievementsSection(
  achievements: Array<{ title?: string; description?: string }>
): string {
  if (!achievements || achievements.length === 0) return "";

  const valid = achievements.filter(
    (a) => typeof a === "object" && a !== null && a.title
  );
  if (valid.length === 0) return "";

  const items = valid.map((ach) => {
    const title = e(ach.title!);
    const desc = ach.description ? ` -- ${e(ach.description)}` : "";
    return `    \\resumeItem{\\textbf{${title}}${desc}}`;
  });

  return `\\section{Achievements}
  \\resumeItemListStart
${items.join("\n")}
  \\resumeItemListEnd`;
}

// ─── Main builder ─────────────────────────────────────────────────────────────

export function buildLatex(resumeData: Record<string, any>): string {
  const name = e(resumeData.name || "Your Name");
  const role = e(resumeData.role || "");
  const email = String(resumeData.email || "");
  const phone = e(resumeData.phone || "");
  const location = e(resumeData.location || "");
  const summary = e(resumeData.summary || "");

  // Contact line
  const contactParts: string[] = [];
  if (phone) contactParts.push(phone);
  if (email) contactParts.push(`\\href{mailto:${email}}{\\underline{${e(email)}}}`);
  if (location) contactParts.push(location);

  // Append links to the top contact section
  const links = resumeData.links || [];
  const validLinks = links.filter(
    (l: any) => typeof l === "object" && (l.label || l.name) && l.url
  );
  validLinks.forEach((link: any) => {
    const label = link.label || link.name || "Link";
    const rawUrl = String(link.url || "").trim();
    const cleanUrl = rawUrl.replace(/\\/g, "");
    const fullUrl = /^https?:\/\//.test(cleanUrl) ? cleanUrl : `https://${cleanUrl}`;
    contactParts.push(`\\href{${fullUrl}}{\\underline{${e(label)}}}`);
  });

  const contactLine = contactParts.join(" $|$ ");

  // Sections — standard ATS resume order
  const sections: string[] = [];

  if (summary) {
    sections.push(`\\section{Summary}
  \\small{${summary}}`);
  }

  const expSection = buildExperienceSection(resumeData.experience || []);
  if (expSection) sections.push(expSection);

  const projSection = buildProjectsSection(resumeData.projects || []);
  if (projSection) sections.push(projSection);

  const skillsSection = buildSkillsSection(resumeData.skills || []);
  if (skillsSection) sections.push(skillsSection);

  const eduSection = buildEducationSection(resumeData.education || []);
  if (eduSection) sections.push(eduSection);

  const achSection = buildAchievementsSection(resumeData.achievements || []);
  if (achSection) sections.push(achSection);

  const sectionsStr = sections.join("\n\n");

  return `\\documentclass[letterpaper,11pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\usepackage{multicol}
\\setlength{\\multicolsep}{-3.0pt}
\\setlength{\\columnsep}{-1pt}
\\input{glyphtounicode}

\\pagestyle{fancy}
\\fancyhf{}
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

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

\\pdfgentounicode=1

\\newcommand{\\resumeItem}[1]{
  \\item\\small{{#1 \\vspace{-2pt}}}
}

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

\\newcommand{\\resumeSubItem}[1]{\\resumeItem{#1}\\vspace{-4pt}}
\\renewcommand\\labelitemi{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}
\\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}
\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.0in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

\\begin{document}

\\begin{center}
    {\\Huge \\scshape ${name}} \\\\ \\vspace{4pt}
    ${role ? `{\\large ${role}} \\\\ \\vspace{4pt}` : ""}
    \\small ${contactLine}
    \\vspace{-8pt}
\\end{center}

${sectionsStr}

\\end{document}`;
}