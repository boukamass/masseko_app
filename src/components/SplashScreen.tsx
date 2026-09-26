import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Perfectly balanced progress over ~2.0 seconds so user can read and appreciate
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 40);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const timeout = setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => {
          onFinish();
        }, 450); // smooth exit fade
      }, 350);
      return () => clearTimeout(timeout);
    }
  }, [progress, onFinish]);

  const handleTapToSkip = () => {
    setIsExiting(true);
    setTimeout(() => {
      onFinish();
    }, 250);
  };

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(8px)', scale: 1.02 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          onClick={handleTapToSkip}
          className="fixed inset-0 z-[99999] flex flex-col justify-between p-6 bg-gradient-to-b from-[#041622] via-[#062438] to-[#03111B] text-white rounded-none border-0 m-0 overflow-hidden select-none cursor-pointer w-screen h-screen"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            maxWidth: '100vw',
            maxHeight: '100vh',
            margin: 0,
            borderRadius: 0,
            border: 'none',
            outline: 'none',
            boxShadow: 'none',
          }}
        >
          {/* Subtle Ambient Glowing Halos */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-teal-500/15 blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/3 left-1/3 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

          {/* Elegant Animated Coastal Waves & Sand Dunes SVG Lines */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-60">
            <svg
              className="w-full h-full"
              viewBox="0 0 1440 900"
              fill="none"
              preserveAspectRatio="none"
            >
              {/* Golden Coastal Sand Dunes Curve (Subtle Warm Amber) */}
              <motion.path
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.35 }}
                transition={{ duration: 1.8, ease: "easeInOut" }}
                d="M-100,720 C320,640 540,820 900,710 C1200,620 1380,740 1600,680"
                stroke="url(#duneGradient)"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
              <motion.path
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.25 }}
                transition={{ duration: 2.0, delay: 0.2, ease: "easeInOut" }}
                d="M-80,760 C380,700 620,850 980,750 C1260,680 1420,790 1600,740"
                stroke="url(#duneGradient)"
                strokeWidth="1.5"
              />

              {/* Coastal Waves (Teal & Emerald Oceanic Currents) */}
              <motion.path
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.55 }}
                transition={{ duration: 1.6, ease: "easeInOut" }}
                d="M-100,560 C240,490 480,620 820,530 C1140,450 1360,570 1600,510"
                stroke="url(#oceanWaveGradient1)"
                strokeWidth="2.5"
              />
              <motion.path
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.4 }}
                transition={{ duration: 1.9, delay: 0.15, ease: "easeInOut" }}
                d="M-100,600 C280,540 520,660 880,570 C1180,500 1390,610 1600,560"
                stroke="url(#oceanWaveGradient2)"
                strokeWidth="1.8"
              />

              {/* Linear Gradients Definitions */}
              <defs>
                <linearGradient id="oceanWaveGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0D9488" stopOpacity="0.2" />
                  <stop offset="50%" stopColor="#14B8A6" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.3" />
                </linearGradient>
                <linearGradient id="oceanWaveGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0284C7" stopOpacity="0.1" />
                  <stop offset="50%" stopColor="#2DD4BF" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#34D399" stopOpacity="0.2" />
                </linearGradient>
                <linearGradient id="duneGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#D97706" stopOpacity="0.1" />
                  <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#FBBF24" stopOpacity="0.1" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Top Location Pill */}
          <div className="pt-2 flex justify-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="px-3 py-1 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-[10.5px] font-medium tracking-wider text-teal-200 uppercase flex items-center gap-2 shadow-xs"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Pointe-Noire • Côte Sauvage & Frayères</span>
            </motion.div>
          </div>

          {/* Center Logo, Turtle in Safety & Slogan */}
          <div className="my-auto flex flex-col items-center text-center space-y-4 relative z-10 px-4">
            {/* Turtle in Safe Protective Shield Ring */}
            <motion.div
              initial={{ scale: 0.75, opacity: 0, rotate: -8 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-teal-600/30 via-emerald-500/20 to-teal-400/40 border border-teal-300/40 backdrop-blur-xl shadow-[0_0_35px_rgba(20,184,166,0.25)] text-teal-200"
            >
              {/* Outer protective ring animation */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[-6px] rounded-3xl border border-dashed border-teal-400/30 pointer-events-none"
              />

              {/* Safety Badge Micro Icon */}
              <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-md border-2 border-[#041622]">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-950" />
              </div>

              {/* Safe Turtle SVG */}
              <svg className="w-11 h-11 text-teal-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a4 4 0 0 0-4 4v1a7 7 0 0 0-7 7v1a2 2 0 0 0 2 2h1a7 7 0 0 0 14 0h1a2 2 0 0 0 2-2v-1a7 7 0 0 0-7-7V6a4 4 0 0 0-4-4z" fill="currentColor" fillOpacity="0.25" />
                <circle cx="12" cy="11" r="5" stroke="currentColor" strokeWidth="2" fill="none" />
                <path d="M12 6v10M7 11h10M8.5 7.5l7 7M15.5 7.5l-7 7" stroke="currentColor" strokeWidth="1.5" />
                <path d="M4 11c-1.5-2-2.5-3-2-5s2.5-1 4 1" stroke="currentColor" strokeWidth="2" />
                <path d="M20 11c1.5-2 2.5-3 2-5s-2.5-1-4 1" stroke="currentColor" strokeWidth="2" />
                <path d="M6 17c-1 2-2 3.5-3 4s-2-1-1-3" stroke="currentColor" strokeWidth="2" />
                <path d="M18 17c1 2 2 3.5 3 4s2-1 1-3" stroke="currentColor" strokeWidth="2" />
              </svg>
            </motion.div>

            {/* Typography & Slogan */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.55 }}
              className="space-y-2 max-w-xs"
            >
              <h1 className="text-3xl font-bold tracking-[0.22em] text-transparent bg-clip-text bg-gradient-to-r from-white via-teal-100 to-emerald-200">
                MASSEKO
              </h1>
              
              <p className="text-xs font-semibold text-teal-300 tracking-wide uppercase">
                Protection des Tortues Marines & Sanctuaire Côtier
              </p>

              {/* Inspiring Slogan centered on sea turtles */}
              <div className="pt-1">
                <p className="text-xs text-slate-300/90 font-normal leading-relaxed italic px-2">
                  « Protéger les tortues marines, sécuriser chaque nid, préserver la vie. »
                </p>
              </div>
            </motion.div>
          </div>

          {/* Bottom Progress Bar & Mode Status */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="pb-3 flex flex-col items-center space-y-2.5 w-full relative z-10"
          >
            {/* Elegant Gradient Progress Bar */}
            <div className="w-36 h-[3px] bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
              <div
                className="h-full bg-gradient-to-r from-teal-400 via-cyan-300 to-emerald-400 rounded-full transition-all duration-100 shadow-[0_0_10px_rgba(45,212,191,0.5)]"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex items-center justify-between w-full max-w-xs text-[10px] text-slate-400 px-2 font-normal">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                Système Prêt
              </span>
              <span className="font-mono text-teal-300">{progress}%</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
