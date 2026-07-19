import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://resume-builder-chatcv.vercel.app"),

  title: {
    default: "ChatCV - Free AI Resume Builder & AI Resume Maker",
    template: "%s | ChatCV",
  },

  description:
    "Create professional, ATS-friendly resumes in minutes with ChatCV, the best free AI resume builder and AI resume maker. Chat with our assistant to build your CV for free.",

  keywords: [
    "Resume Builder",
    "Ai Resume Maker",
    "free resume builder",
    "resume builder free",
    "resume builder ai",
    "AI Resume Builder",
    "ChatCV",
    "ATS Resume Builder",
    "Online Resume Builder",
    "Resume Maker",
    "Resume for Freshers",
    "AI CV Builder",
    "Chat Resume Builder",
    "Professional Resume Builder",
    "CV Builder",
    "CV Maker",
    "best AI resume builder",
    "best free resume builder",
    "ATS friendly resume",
    "ATS resume scanner",
    "resume parser optimizer",
    "LaTeX resume builder",
    "LaTeX resume templates",
    "online CV builder",
    "free CV builder",
    "modern resume templates",
    "AI resume writer",
    "ChatGPT resume builder",
    "ATS friendly CV maker",
    "resume optimizer",
    "resume keywords generator",
    "ATS resume checker",
    "PDF resume builder",
    "download PDF resume",
    "professional CV builder",
    "minimalist resume builder",
    "creative resume maker",
    "clean CV templates",
    "one page resume template",
    "professional resume layout",
    "best resume format 2026",
    "curriculum vitae template",
    "AI CV writer",
    "AI resume assistant",
    "write resume with AI",
    "AI resume editor",
    "auto resume generator",
    "AI bullet point writer",
    "AI resume summary generator",
    "copilot resume maker",
    "smart resume builder",
    "AI cover letter writer",
    "AI resume formatting",
    "AI job application assistant",
    "software engineer resume builder",
    "developer resume examples",
    "product manager resume templates",
    "data scientist CV builder",
    "marketing resume generator",
    "designer resume builder",
    "project manager resume",
    "student resume builder",
    "entry level resume maker",
    "executive resume builder",
    "tech industry CV templates",
    "finance resume examples",
    "sales resume builder",
    "engineering resume templates",
    "how to write a resume",
    "resume summary examples",
    "resume objectives examples",
    "resume skills checklist",
    "action verbs for resume",
    "resume experience section",
    "resume contact info template",
    "resume achievements list",
    "career gap resume helper",
    "professional summary creator",
    "CV writing tips",
    "resume checklists",
    "how to improve resume score",
    "job description keyword matcher",
    "chatcv resume builder",
    "create CV online",
    "make resume for free",
    "build resume free",
    "instant resume maker",
    "ATS optimized CV",
    "professional CV layout",
    "online CV creator",
    "resume writing services free",
    "AI powered career tools",
    "interactive resume builder",
    "easy resume maker",
    "quick CV builder",
    "resume templates 2026",
    "CV formats for freshers",
    "write my resume for me free",
    "ATS score checker online",
    "best AI resume builder 2026",
    "free resume templates PDF download",
    "modern tech CV templates",
    "artificial intelligence resume builder",
    "resume bullet points generator",
    "resume formatting tool",
    "AI career assistant",
    "tailor resume to job description",
    "job description match score",
    "resume bullet point optimizer",
    "AI generated CV",
    "professional profile builder",
    "career accomplishments resume",
    "technical skills resume list",
    "soft skills resume examples",
    "work experience rewrite tool",
    "ATS check CV",
    "is chatcv free",
    "chatcv resume maker review",
    "free online CV maker with PDF download",
    "academic CV builder",
    "LaTeX CV code generator",
    "ATS compliant CV format",
    "AI CV scanner online",
    "ATS friendly resume format",
    "copy LaTeX resume source",
    "best online CV builder",
    "AI resume checker",
    "resume keyword optimizer",
    "optimize resume for job",
    "AI CV writer free",
    "AI job description scanner",
    "ATS keywords list",
    "ATS check my resume",
    "resume format for tech jobs",
    "custom LaTeX resume",
    "ATS compliant resume template",
    "ATS friendly resume template free",
    "automatic resume builder",
    "AI resume optimizer free",
    "improve resume ATS score",
    "make ATS friendly resume",
    "how to beat ATS resume scanner",
    "AI resume generator free",
    "CV builder online free",
    "easy to use resume builder",
    "resume formatting helper",
    "ATS compatible resume format",
    "AI CV optimization",
    "resume tailoring tool",
    "professional resume templates free",
  ],

  authors: [{ name: "ChatCV Team" }],
  creator: "ChatCV",
  publisher: "ChatCV",

  applicationName: "ChatCV",

  category: "technology",

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },

  openGraph: {
    type: "website",
    url: "https://resume-builder-chatcv.vercel.app",
    title: "ChatCV - Free AI Resume Builder & AI Resume Maker",
    description:
      "Create professional, ATS-friendly resumes in minutes with ChatCV, the best free AI resume builder and AI resume maker. Chat with our assistant to build your CV for free.",
    siteName: "ChatCV",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ChatCV - Free AI Resume Builder & AI Resume Maker",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "ChatCV - Free AI Resume Builder & AI Resume Maker",
    description:
      "Create professional, ATS-friendly resumes in minutes with ChatCV, the best free AI resume builder and AI resume maker. Chat with our assistant to build your CV for free.",
    creator: "@chatcv",
    images: ["/og-image.png"],
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },

  verification: {
    google: "1XnLLnxNOnoegYOvO9BGs1Ld1gDXj18RsKLtySms5G0",
  },

  // manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ChatCV",
    "url": "https://resume-builder-chatcv.vercel.app",
    "logo": "https://resume-builder-chatcv.vercel.app/chatcv.svg",
    "sameAs": [
      "https://github.com/mrravipandee/chatcv"
    ]
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "ChatCV",
    "url": "https://resume-builder-chatcv.vercel.app",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://resume-builder-chatcv.vercel.app/blog?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "ChatCV AI Resume Builder",
    "operatingSystem": "All",
    "applicationCategory": "BusinessApplication",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    },
    "description": "Create professional, ATS-friendly resumes in minutes with ChatCV, the best free AI resume builder and AI resume maker.",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "1250"
    }
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="bg-black text-white antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
        />
        {children}
      </body>
    </html>
  );
}