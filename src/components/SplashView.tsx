import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Flame, ChefHat, Activity } from 'lucide-react';

interface SplashViewProps {
  onDismiss: () => void;
}

const CONSOLE_STEPS = [
  '🌶️ Blending Durban House Spices...',
  '🥯 Firing up Pretoria Vetkoek ovens...',
  '🍟 Slicing hand-cut CBD slap chips...',
  '🔥 Adjusting Braai smoke intensity...',
  '🧀 Grating extra medium-fat Cheddar...',
  '🧄 Emulsifying home-style garlic sauce...',
  '🇿🇦 Securing Gauteng Cloud-Gateway...',
  '📱 Ready to Hot-Drop Lekker Bites!'
];

export default function SplashView({ onDismiss }: SplashViewProps) {
  const [progress, setProgress] = useState(0);
  const [currentStepText, setCurrentStepText] = useState(CONSOLE_STEPS[0]);

  useEffect(() => {
    // Progress increment timer logic (lasts about 2.5 seconds total)
    let stepIndex = 0;
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const nextProgress = prev + 1;
        if (nextProgress >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => {
            onDismiss();
          }, 300);
          return 100;
        }

        // Cycle through delicious cooking steps dynamically during progress
        const targetStep = Math.floor((nextProgress / 100) * CONSOLE_STEPS.length);
        if (targetStep !== stepIndex && CONSOLE_STEPS[targetStep]) {
          stepIndex = targetStep;
          setCurrentStepText(CONSOLE_STEPS[targetStep]);
        }

        return nextProgress;
      });
    }, 25); // 100 steps * 25ms = 2.5 sec

    return () => clearInterval(progressInterval);
  }, [onDismiss]);

  return (
    <div
      id="splash-landing-panel"
      className="flex-1 w-full flex flex-col justify-between p-6 text-white text-center relative overflow-hidden select-none"
      style={{
        background: 'radial-gradient(circle at 50% 30%, #291206 0%, #110602 60%, #060201 100%)',
      }}
    >
      {/* Background neon soft floating blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-orange-600/10 rounded-full blur-[90px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 left-1/3 w-60 h-60 bg-amber-500/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Top Corner Badge */}
      <div className="flex justify-center pt-6 z-10">
        <span className="text-[9px] tracking-[0.25em] text-[#f59e0b] font-mono font-black uppercase bg-[#ef4444]/10 border border-amber-500/20 px-3 py-1.5 rounded-full flex items-center gap-1.5 animate-pulse">
          <Sparkles size={10} className="text-amber-400 stroke-[3px]" />
          MZANSI FAST FOOD PREMIUM
        </span>
      </div>

      {/* Center Brand Core */}
      <div className="space-y-6 my-auto pt-4 z-10 flex flex-col items-center">
        {/* Lekker Bites Interactive Logo with Glow Wave effects */}
        <div className="relative">
          {/* Pulsating outer halo */}
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-500 to-orange-600 rounded-[32px] blur-xl opacity-30 animate-pulse" />
          
          <div className="relative w-24 h-24 bg-gradient-to-tr from-[#ea580c] via-[#f59e0b] to-[#dc2626] rounded-[32px] p-[2px] shadow-2xl shadow-orange-600/20 transition-transform duration-500 hover:scale-105 active:rotate-3">
            <div className="w-full h-full bg-[#0c0705] rounded-[30px] flex flex-col items-center justify-center space-y-1 relative overflow-hidden">
              {/* Flag detail overlay accent */}
              <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-red-500 via-white to-[#007a4a]" />
              
              <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 border border-amber-500/10">
                <Flame size={28} className="fill-amber-500 animate-[bounce_1.5s_infinite]" />
              </div>
              <span className="text-[11px] font-mono tracking-widest font-black text-white leading-none">
                🇿🇦 L B
              </span>
            </div>
          </div>
        </div>

        {/* Custom Application Name Design */}
        <div className="space-y-2">
          <h1 className="text-3.5xl font-black tracking-tight leading-none bg-gradient-to-r from-white via-amber-200 to-orange-400 bg-clip-text text-transparent uppercase font-sans">
            Lekker Bites
          </h1>
          
          {/* Mandatory Recruiter/Ownership Statement */}
          <div className="space-y-1 px-4 py-2 bg-white/5 border border-white/5 rounded-2xl backdrop-blur-md max-w-xs mx-auto">
            <span className="text-[8.5px] font-mono text-amber-500 tracking-wider block font-bold uppercase leading-none">ENGINEERED & CREATED BY:</span>
            <span className="text-sm font-black text-white tracking-wide block drop-shadow-sm font-sans uppercase">
              Nkululeko Khalishwayo
            </span>
          </div>
        </div>

        <p className="text-[10px] text-zinc-400 max-w-[280px] leading-relaxed mx-auto">
          High-performance, transactional food-delivery portal tailored for South African CBD communities.
        </p>
      </div>

      {/* Bottom Progress & Bypass Actions */}
      <div className="space-y-6 pb-6 z-10">
        {/* Dynamic Log & Progress bar */}
        <div className="space-y-2.5 max-w-xs mx-auto">
          <div className="flex justify-between items-center text-[9px] font-mono text-zinc-400 px-1">
            <span className="flex items-center gap-1">
              <ChefHat size={11} className="text-amber-500 animate-spin-slow" />
              <span className="text-white/90 font-bold truncate max-w-[190px] text-left">
                {currentStepText}
              </span>
            </span>
            <span className="text-amber-500 font-extrabold">{progress}%</span>
          </div>

          {/* Core progress tracker track bar */}
          <div className="w-full h-1.5 bg-neutral-950 rounded-full overflow-hidden border border-white/5 p-[1px]">
            <div
              className="h-full bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-400 rounded-full transition-all duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Enter Bypass key */}
        <button
          onClick={onDismiss}
          className="mx-auto flex items-center gap-1.5 px-6 py-2.5 bg-white/5 hover:bg-white/10 active:bg-white/20 border border-white/10 hover:border-white/20 transition-all rounded-full text-[10px] tracking-widest font-black uppercase text-amber-400 hover:text-white cursor-pointer group shadow-lg"
        >
          <span>Tap to Enter</span>
          <ArrowRight size={11} className="transition-transform group-hover:translate-x-1" />
        </button>

        {/* Encryption Assurance Footer */}
        <div className="flex items-center justify-center gap-1.5 text-[8.5px] font-mono text-zinc-500 tracking-wider">
          <ShieldCheck size={11} className="text-emerald-500" />
          <span>FIREBASE AUTH 256-BIT ISOLATED SYSTEM</span>
        </div>
      </div>
    </div>
  );
}
