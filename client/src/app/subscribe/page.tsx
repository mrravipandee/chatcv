"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, PartyPopper, Rocket } from 'lucide-react';


export default function ChatCVWaitlist() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center bg-[#050505] text-white overflow-hidden p-6 play-font">
      
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 -left-20 w-96 h-96 bg-[#00ff9c]/10 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#c1ff23]/10 rounded-full blur-[120px]"
        />
      </div>

      {/* Main Content Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-lg"
      >
        <div className="bg-zinc-900/40 backdrop-blur-2xl border border-zinc-800 p-8 md:p-12 rounded-[2.5rem] shadow-2xl text-center">
          
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                {/* Branding / Icon */}
                <div className="mb-8 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-[#00ff9c] to-[#c1ff23] p-px">
                  <div className="w-full h-full bg-[#050505] rounded-[15px] flex items-center justify-center">
                    <span className="text-2xl"><MessageSquare /></span>
                  </div>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-linear-to-b from-white to-zinc-400 bg-clip-text text-transparent">
                  Build Your Resume by Chatting
                </h1>
                
                <p className="text-zinc-400 text-lg mb-10 leading-relaxed">
                  Join early users and get access to ChatCV <br className="hidden md:block" /> when we launch.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative group">
                    <input
                      required
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-6 py-4 outline-none transition-all duration-300 focus:border-[#00ff9c] focus:ring-1 focus:ring-[#00ff9c]/50 placeholder:text-zinc-600"
                    />
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(0, 255, 156, 0.3)" }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full py-4 rounded-2xl font-bold text-black bg-linear-to-r from-[#00ff9c] to-[#c1ff23] transition-all duration-300 shadow-[0_0_15px_rgba(0,255,156,0.1)]"
                  >
                    <div className="flex items-center justify-center">
                        <span className="">Join Waitlist</span>
                        <span className="ml-2"><Rocket /></span>
                    </div>
                  </motion.button>
                </form>

                <p className="mt-6 text-zinc-500 text-sm">
                  No spam. Only important updates.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-10"
              >
                <div className="text-5xl mb-6 flex justify-around items-center"><PartyPopper /></div>
                <h2 className="text-3xl font-bold mb-3 play-font">You&apos;re on the list</h2>
                <p className="text-zinc-400">
                  We&apos;ve saved your spot. Keep an eye on <br /> 
                  <span className="text-[#00ff9c] font-medium">{email}</span>
                </p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="mt-8 text-sm text-zinc-500 hover:text-white transition-colors"
                >
                  Go back
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Subtle Footer */}
      <div className="absolute bottom-8 left-0 right-0 text-center z-10">
        <p className="text-zinc-700 text-xs tracking-widest uppercase font-medium">
          Powered by ChatCV AI
        </p>
      </div>
    </main>
  );
}