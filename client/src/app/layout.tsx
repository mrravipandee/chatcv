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