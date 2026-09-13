export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Hero from "@/components/Hero";
import ProductShowcase from "@/components/marketing/ProductShowcase";
import ProductValue from "@/components/marketing/ProductValue";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import PricingSection from "@/components/marketing/PricingSection";
import FAQSection from "@/components/marketing/FAQSection";
import CTA from "@/components/CTA";

export const metadata: Metadata = {
  title: "ChatCV — Conversational AI Resume Builder with LaTeX Precision",
  description:
    "Build ATS-friendly resumes through conversation. Chat CV structures your career history into deterministic LaTeX and compiles standard PDF resumes in real time.",
  alternates: {
    canonical: "https://resumebuilder-chatcv.vercel.app",
  },
  openGraph: {
    title: "ChatCV — Conversational AI Resume Builder",
    description:
      "Transform your experience into a publication-grade LaTeX resume and ATS-proof PDF through natural conversation.",
    url: "https://resumebuilder-chatcv.vercel.app",
    siteName: "ChatCV",
    type: "website",
  },
};

export default function Home() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What makes Chat CV different from other AI resume builders?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Chat CV conducts a structured conversation to extract your actual achievements, converts them into quantified Google XYZ format, and compiles them using a deterministic, single-column LaTeX engine. You get mathematically clean typesetting with zero formatting headaches."
        }
      },
      {
        "@type": "Question",
        "name": "Do I need to know LaTeX to use Chat CV?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. You simply converse in plain English. Chat CV handles all LaTeX preamble setup, margin configurations, package imports, and character escaping behind the scenes. You can also copy the complete raw .tex code anytime to compile inside Overleaf."
        }
      },
      {
        "@type": "Question",
        "name": "Why is LaTeX better for ATS compliance?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Applicant Tracking Systems fail when resumes use multi-column text boxes, icon graphics, or non-standard tables. Chat CV generates clean, linear, single-column documents using standard vector fonts and clear semantic headings, ensuring parsers extract your information without corruption."
        }
      },
      {
        "@type": "Question",
        "name": "Can I import an existing resume instead of starting from scratch?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. You can upload an existing PDF or plain text resume using the paperclip button in the chat panel. Chat CV extracts your past work experience, education, skills, and contact details directly into your workspace."
        }
      },
      {
        "@type": "Question",
        "name": "How does the free tier work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Every new account receives 5 free AI chat messages upon email verification. This is plenty of usage to generate your initial resume, live-preview it, and download your finished PDF and LaTeX source code without entering a credit card."
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <main className="bg-[#05070a] min-h-screen text-white selection:bg-[#00ff9c] selection:text-black">
        <Hero />
        <ProductShowcase />
        <ProductValue />
        <HowItWorks />
        <Features />
        <PricingSection />
        <FAQSection />
        <CTA />
      </main>
    </>
  );
}