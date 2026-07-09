"use client";

import { useState, useEffect } from "react";
import { Link2, Check } from "lucide-react";

interface ShareButtonsProps {
  title: string;
}

export default function ShareButtons({ title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy url: ", err);
    }
  };

  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `Check out: ${title}`
  )}&url=${encodeURIComponent(currentUrl)}`;

  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    currentUrl
  )}`;

  return (
    <div className="flex items-center gap-2">
      {/* TWITTER */}
      <a
        href={tweetUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-9 h-9 rounded-xl bg-zinc-900 border border-white/10 text-zinc-400 hover:text-[#00ff9c] hover:border-[#00ff9c]/30 hover:bg-[#00ff9c]/5 transition-all duration-200"
        title="Share on Twitter"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      </a>

      {/* LINKEDIN */}
      <a
        href={linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-9 h-9 rounded-xl bg-zinc-900 border border-white/10 text-zinc-400 hover:text-[#00ff9c] hover:border-[#00ff9c]/30 hover:bg-[#00ff9c]/5 transition-all duration-200"
        title="Share on LinkedIn"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      </a>

      {/* COPY LINK */}
      <button
        onClick={handleCopy}
        className="flex items-center justify-center w-9 h-9 rounded-xl bg-zinc-900 border border-white/10 text-zinc-400 hover:text-[#00ff9c] hover:border-[#00ff9c]/30 hover:bg-[#00ff9c]/5 transition-all duration-200 relative group"
        title="Copy Link"
      >
        {copied ? (
          <Check className="w-4 h-4 text-[#00ff9c]" />
        ) : (
          <Link2 className="w-4 h-4" />
        )}
        {copied && (
          <span className="absolute -top-8 bg-black text-[#00ff9c] border border-[#00ff9c]/30 text-[10px] px-2 py-0.5 rounded whitespace-nowrap">
            Copied!
          </span>
        )}
      </button>
    </div>
  );
}
