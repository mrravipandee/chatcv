"use client";

import { useEffect, useState } from "react";
import { List } from "lucide-react";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents() {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const articleContainer = document.querySelector("article");
    if (!articleContainer) return;

    const headingElements = Array.from(
      articleContainer.querySelectorAll("h2, h3")
    ) as HTMLElement[];

    const items: TOCItem[] = headingElements.map((el) => {
      if (!el.id) {
        el.id = el.textContent
          ? el.textContent
              .toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/[^\w-]/g, "")
          : Math.random().toString(36).substr(2, 9);
      }
      return {
        id: el.id,
        text: el.textContent || "",
        level: el.tagName === "H2" ? 2 : 3,
      };
    });

    setHeadings(items);

    // Spy scroll observers
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      const visibleEntries = entries.filter((e) => e.isIntersecting);
      if (visibleEntries.length > 0) {
        // Set the active id to the first visible heading on screen
        setActiveId(visibleEntries[0].target.id);
      }
    };

    const observer = new IntersectionObserver(observerCallback, {
      rootMargin: "-100px 0px -65% 0px",
      threshold: 0.1,
    });

    headingElements.forEach((el) => observer.observe(el));

    return () => {
      headingElements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, []);

  if (headings.length === 0) return null;

  return (
    <div className="w-full bg-gradient-to-b from-zinc-900/60 to-zinc-950/80 rounded-2xl border border-white/10 p-6 backdrop-blur-xl shadow-xl">
      <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
        <List className="w-4 h-4 text-[#00ff9c]" />
        <h4 className="text-xs uppercase tracking-widest text-zinc-400 font-extrabold">
          Outline
        </h4>
      </div>

      <nav className="relative pl-3 border-l border-white/5 space-y-3.5">
        {/* ACTIVE SECTION FLOATING VERTICAL CURSOR INDICATOR */}
        <div className="absolute left-[-1px] w-[1px] bg-gradient-to-b from-[#00ff9c] to-emerald-400 transition-all duration-300 pointer-events-none" 
             style={{
               height: '16px',
               // Rough estimation helper or active state position mappings
               top: `${Math.max(0, headings.findIndex(h => h.id === activeId)) * 36 + 12}px`,
               opacity: activeId ? 1 : 0
             }}
        />

        {headings.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={(e) => {
              e.preventDefault();
              const element = document.getElementById(item.id);
              if (element) {
                const offset = 90; // account for fixed header
                const bodyRect = document.body.getBoundingClientRect().top;
                const elementRect = element.getBoundingClientRect().top;
                const elementPosition = elementRect - bodyRect;
                const offsetPosition = elementPosition - offset;

                window.scrollTo({
                  top: offsetPosition,
                  behavior: "smooth"
                });
                
                setActiveId(item.id);
              }
            }}
            className={`block text-xs transition-all duration-300 hover:text-white ${
              item.level === 3 ? "pl-4 opacity-80" : "font-semibold"
            } ${
              activeId === item.id
                ? "text-[#00ff9c] font-black translate-x-1"
                : "text-zinc-400"
            }`}
          >
            {item.text}
          </a>
        ))}
      </nav>
    </div>
  );
}
