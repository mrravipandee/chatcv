import type { Metadata } from "next";
import ChatCVWaitlist from "./SubscribeClient";

export const metadata: Metadata = {
  title: "Join the Waitlist | ChatCV AI Resume Builder",
  description: "Get early access to ChatCV, the AI-powered resume builder. Build your professional, ATS-optimized LaTeX resume by chatting with our AI assistant.",
  alternates: {
    canonical: "https://resumebuilder-chatcv.vercel.app/subscribe",
  },
  openGraph: {
    type: "website",
    url: "https://resumebuilder-chatcv.vercel.app/subscribe",
    title: "Join the Waitlist | ChatCV AI Resume Builder",
    description: "Get early access to ChatCV, the AI-powered resume builder. Build your professional, ATS-optimized LaTeX resume by chatting with our AI assistant.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Join the Waitlist | ChatCV AI Resume Builder",
    description: "Get early access to ChatCV, the AI-powered resume builder. Build your professional, ATS-optimized LaTeX resume by chatting with our AI assistant.",
  },
};

export default function SubscribePage() {
  return <ChatCVWaitlist />;
}