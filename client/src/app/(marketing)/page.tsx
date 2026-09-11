export const dynamic = "force-dynamic";

import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import { PricingStore } from "@/components/ui/PricingStore";
import CTA from "@/components/CTA";

export default function Home() {
  return (
    <main className="bg-[#030712] min-h-screen text-white selection:bg-emerald-500 selection:text-black">
      <Hero />
      <HowItWorks />
      <Features />
      <PricingStore />
      <CTA />
    </main>
  );
}