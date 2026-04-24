"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
    return (
        <div className="w-full fixed top-6 z-50 flex justify-center px-4">
            <motion.nav
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-5xl bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
            >
                <div className="flex justify-between items-center">

                    {/* LOGO SECTION WITH CUSTOM SVG */}
                    <Link href="/" className="flex items-center gap-2 group cursor-pointer">
                        <div className="relative">
                            {/* Glow effect */}
                            <div className="absolute inset-0 bg-[#00ff9c] blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />

                            {/* Custom SVG Logo Container */}
                            <div>
                                <Image src="./chatcv.svg" alt="ChatCV logo" width={100} height={24} className="h-12 w-auto object-contain" />
                            </div>
                        </div>
                    </Link>

                    {/* NAV LINKS */}
                    <div className="hidden md:flex gap-8 items-center">
                        {['Features', 'How it Works', 'Waitlist'].map((item) => {
                            const isWaitlist = item === 'Waitlist';
                            return (
                                <Link
                                    key={item}
                                    href={isWaitlist ? "/subscribe" : `#${item.toLowerCase().replace(/\s+/g, '')}`}
                                    className="relative text-zinc-400 text-sm font-medium hover:text-white transition-colors group"
                                >
                                    {item}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00ff9c] transition-all duration-300 group-hover:w-full" />
                                </Link>
                            );
                        })}
                    </div>

                    {/* CTA BUTTON */}
                    <Link href="/subscribe">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative group bg-[#00ff9c] text-black px-5 py-2.5 rounded-xl font-bold text-sm overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            <span className="relative z-10">Get Started</span>
                        </motion.button>
                    </Link>

                </div>
            </motion.nav>
        </div>
    );
}