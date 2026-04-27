function escape(text: string): string {
    if (!text) return "";
    return text
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

function e(val: any): string {
    if (val === null || val === undefined) return "";
    return escape(String(val));
}

// ─── Section builders ────────────────────────────────────────────────────────

function buildSkillsSection(skills: string[]): string {
    if (!skills || skills.length === 0) return "";
    const skillList = skills.map((s) => e(s)).join(", ");
    return `\\section{Technical Skills}
  \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
      \\textbf{Skills}{: ${skillList}}
    }}
  \\end{itemize}`;
}

function buildExperienceSection(
    experience: Array<{
        title?: string;
        company?: string;
        year?: string;
        description?: string;
    }>
): string {
    if (!experience || experience.length === 0) return "";

    const items = experience.map((exp) => {
        const company = e(exp.company || "");
        const title = e(exp.title || "");
        const year = e(exp.year || "");

        // Convert description into bullet points (split by ". " or newlines)
        const rawDesc = exp.description || "";
        const bullets = rawDesc
            .split(/\.\s+|\n/)
            .map((b) => b.trim())
            .filter((b) => b.length > 0);

        const bulletItems =
            bullets.length > 0
                ? `
      \\resumeItemListStart
${bullets.map((b) => `        \\resumeItem{${e(b)}}`).join("\n")}
      \\resumeItemListEnd`
                : "";

        return `    \\resumeSubheading
      {${company}}{${year}}
      {${title}}{}${bulletItems}`;
    });

    return `\\section{Experience}
  \\resumeSubHeadingListStart
${items.join("\n")}
  \\resumeSubHeadingListEnd`;
}

function buildProjectsSection(
    projects: Array<{
        name?: string;
        description?: string;
    }>
): string {
    if (!projects || projects.length === 0) return "";

    const items = projects.map((proj) => {
        const name = e(proj.name || "Project");
        const desc = e(proj.description || "");

        const descBlock = desc
            ? `
      \\resumeItemListStart
        \\resumeItem{${desc}}
      \\resumeItemListEnd`
            : "";

        return `    \\resumeProjectHeading
      {\\textbf{${name}}}{}${descBlock}`;
    });

    return `\\section{Projects}
  \\vspace{-5pt}
  \\resumeSubHeadingListStart
${items.join("\n")}
  \\resumeSubHeadingListEnd`;
}

// ─── Main builder ────────────────────────────────────────────────────────────

export function buildLatex(resumeData: Record<string, any>): string {
    const name = e(resumeData.name || "Your Name");
    const role = e(resumeData.role || "");
    const email = resumeData.email || "";
    const phone = e(resumeData.phone || "");
    const location = e(resumeData.location || "");
    const summary = e(resumeData.summary || "");

    // Contact line
    const contactParts: string[] = [];
    if (phone) contactParts.push(phone);
    if (email)
        contactParts.push(
            `\\href{mailto:${email}}{\\underline{${e(email)}}}`
        );
    if (location) contactParts.push(location);
    const contactLine = contactParts.join(" $|$ ");

    // Sections
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