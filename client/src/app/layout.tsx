import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://chatcv-gamma.vercel.app"),

  title: {
    default: "ChatCV - AI-Powered Resume Builder",
    template: "%s | ChatCV",
  },

  description:
    "Build your resume using AI chat. No forms, just chat and create professional resumes instantly.",

  keywords: [
    "AI Resume Builder",
    "Resume Builder",
    "ChatCV",
    "ATS Resume Builder",
    "Online Resume Builder",
    "Resume Maker",
    "Resume for Freshers",
    "AI CV Builder",
    "Chat Resume Builder",
    "Professional Resume Builder",
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
    url: "https://chatcv-gamma.vercel.app",
    title: "ChatCV - AI-Powered Resume Builder",
    description:
      "Build your resume using AI chat. No forms, just chat and create professional resumes instantly.",
    siteName: "ChatCV",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ChatCV AI Resume Builder",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "ChatCV - AI-Powered Resume Builder",
    description:
      "Build your resume using AI chat. No forms, just chat and create professional resumes instantly.",
    creator: "@chatcv",
    images: ["/og-image.png"],
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },

  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="bg-black text-white antialiased">
        {children}
      </body>
    </html>
  );
}