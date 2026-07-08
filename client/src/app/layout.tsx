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
  metadataBase: new URL("https://chatcv-gamma.vercel.app"),

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

  // manifest: "/site.webmanifest",
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