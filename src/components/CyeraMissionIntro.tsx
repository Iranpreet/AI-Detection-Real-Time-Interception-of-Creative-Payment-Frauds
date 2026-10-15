import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Crosshair, Volume2, VolumeX, ArrowRight, Zap, Terminal } from 'lucide-react';
import { SoundFX } from '../services/soundEffects';

interface CyeraMissionIntroProps {
  onBeginMission: () => void;
  isOpen: boolean;
}

const DIAGNOSTIC_MESSAGES = [
  { time: 10, text: '[SYS_01] CONNECTING NPCI UPI SECURE HIGHWAY GATEWAYS...' },
  { time: 30, text: '[AI_CORE] ENGAGING 500-TREE ISOLATION FOREST ENSEMBLE...' },
  { time: 55, text: '[NLP_VEC] CALIBRATING HINDI/ENGLISH SOCIAL-ENGINEERING DETECTOR...' },
  { time: 80, text: '[ZERO_DAY] SYNCHRONIZING REAL-TIME ANOMALY SCORING MATRIX...' },
  { time: 100, text: '[SYSTEM READY] ALL PAYMENT INTERCEPTION DEFENSES ARMED.' }
];

export const CyeraMissionIntro: React.FC<CyeraMissionIntroProps> = ({ onBeginMission, isOpen }) => {
  const [progress, setProgress] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isExiting, setIsExiting] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(SoundFX.isMuted());
  const [activeLog, setActiveLog] = useState<string>(DIAGNOSTIC_MESSAGES[0].text);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Background Studio Warm Ambient Particle Warp Animation (Not Blue, Warm Golden Amber & Charcoal)
  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Warm golden amber, honey gold, and emerald particles
    const particleCount = 100;
    const particles = Array.from({ length: particleCount }, () => ({
      x: (Math.random() - 0.5) * width * 1.5,
      y: (Math.random() - 0.5) * height * 1.5,
      z: Math.random() * width,
      size: Math.random() * 2 + 0.6,
      color: Math.random() > 0.4 ? '#f59e0b' : Math.random() > 0.3 ? '#fbbf24' : '#10b981'
    }));

    const render = () => {
      // Warm dark charcoal noir background
      ctx.fillStyle = 'rgba(11, 14, 20, 0.35)';
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // Draw warm amber cyber grid lines
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.04)';
      ctx.lineWidth = 1;
      const step = 60;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw perspective warm ambient particles
      particles.forEach(p => {
        p.z -= isLoaded ? 1.5 : 2.5;
        if (p.z <= 0) {
          p.z = width;
          p.x = (Math.random() - 0.5) * width * 1.5;
          p.y = (Math.random() - 0.5) * height * 1.5;
        }

        const k = 250 / p.z;
        const px = p.x * k + cx;
        const py = p.y * k + cy;

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          const alpha = Math.min(1, (1 - p.z / width) * 1.5);
          ctx.beginPath();
          ctx.arc(px, py, Math.max(0.6, p.size * k * 0.8), 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = alpha;
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [isOpen, isLoaded]);

  // Loading Progress Timer (0 -> 100%)
  useEffect(() => {
    if (!isOpen) return;
    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 4) + 1;
      if (current >= 100) {
        current = 100;
        setProgress(100);
        setIsLoaded(true);
        setActiveLog(DIAGNOSTIC_MESSAGES[4].text);
        clearInterval(interval);
      } else {
        setProgress(current);
        const matched = DIAGNOSTIC_MESSAGES.slice().reverse().find(m => current >= m.time);
        if (matched) {
          setActiveLog(matched.text);
        }
        if (current % 15 === 0) {
          SoundFX.playBootTick();
        }
      }
    }, 45);

    return () => clearInterval(interval);
  }, [isOpen]);

  const handleToggleSound = () => {
    const nextMuted = SoundFX.toggleMute();
    setIsMuted(nextMuted);
    if (!nextMuted) {
      SoundFX.playHoverBlip();
    }
  };

  const handleStart = () => {
    SoundFX.playMissionStart();
    setIsExiting(true);
    setTimeout(() => {
      onBeginMission();
      setIsExiting(false);
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0b0e14] text-white overflow-hidden transition-all duration-700 ${
        isExiting ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background Interactive Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Atmospheric Warm Golden Halos (matching cozy warm workspace lighting) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] bg-amber-500/12 rounded-full blur-[130px] pointer-events-none animate-pulse" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] bg-yellow-500/10 rounded-full blur-[90px] pointer-events-none" />

      {/* Top HUD Bar */}
      <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase">
              SHIELD-UPI · CC6-AI02
            </div>
            <div className="text-[10px] text-amber-200/60 font-mono">
              OPERATION: SECURE THE UNKNOWN
            </div>
          </div>
        </div>

        {/* Audio Toggle & Skip */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleToggleSound}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 border border-amber-500/30 hover:border-amber-400 text-xs text-amber-200 transition-all cursor-pointer font-mono"
            title="Toggle Audio Effects"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-500" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
            <span className="text-[11px]">{isMuted ? 'AUDIO OFF' : 'AUDIO ON'}</span>
          </button>

          <button
            type="button"
            onClick={handleStart}
            className="px-3.5 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-xs text-slate-400 hover:text-amber-300 transition-all cursor-pointer font-mono"
          >
            SKIP [ESC]
          </button>
        </div>
      </div>

      {/* Center Mission Core Unit */}
      <div className="relative z-20 flex flex-col items-center text-center max-w-2xl px-6">
        
        {/* Holographic Tactical Radar Reticle in Warm Amber */}
        <div className="relative w-44 h-44 sm:w-56 sm:h-56 mb-8 flex items-center justify-center">
          
          {/* Outer Rotating Counter Ring */}
          <div className="absolute inset-0 rounded-full border border-amber-500/25 animate-orbit border-dashed" />
          
          {/* Inner Counter Orbit Ring */}
          <div className="absolute inset-3 rounded-full border border-yellow-500/35 animate-counter-orbit" />
          
          {/* Glowing Target Ring */}
          <div className="absolute inset-8 rounded-full border-2 border-amber-400/50 shadow-[0_0_35px_rgba(245,158,11,0.35)] flex items-center justify-center">
            {/* Crosshairs */}
            <Crosshair className="w-8 h-8 text-amber-400 animate-pulse opacity-90" />
          </div>

          {/* Radar Sweep Effect */}
          <div className="absolute inset-8 rounded-full overflow-hidden pointer-events-none">
            <div className="w-full h-full animate-radar-sweep" />
          </div>

          {/* Central Logo Core */}
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 p-0.5 shadow-2xl shadow-amber-500/50">
            <div className="w-full h-full bg-[#12161f] rounded-[14px] flex items-center justify-center">
              <ShieldCheck className="w-10 h-10 text-amber-400 drop-shadow-[0_0_15px_rgba(245,158,11,0.8)]" />
            </div>
          </div>

          {/* Degree Coordinates */}
          <span className="absolute -top-3 font-mono text-[9px] text-amber-500/80 tracking-widest">000° NORTH</span>
          <span className="absolute -bottom-3 font-mono text-[9px] text-amber-500/80 tracking-widest">180° SOUTH</span>
          <span className="absolute -right-5 font-mono text-[9px] text-amber-500/80 tracking-widest">090° E</span>
          <span className="absolute -left-5 font-mono text-[9px] text-amber-500/80 tracking-widest">270° W</span>
        </div>

        {/* Title & Mission Statement */}
        <div className="space-y-3 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono tracking-widest uppercase">
            <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            NPCI REAL-TIME INTERCEPTION GRID
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-amber-100 via-yellow-200 to-amber-400 bg-clip-text text-transparent">
            SECURE THE UNKNOWN
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-lg mx-auto font-normal leading-relaxed">
            Payment fraud evolves faster than static rules. Detect novel zero-day vectors, remote access scams, and deceptive collect requests in &lt;120ms before money leaves the victim.
          </p>
        </div>

        {/* Dynamic Boot Sequence Progress Bar OR Begin Mission Button */}
        {!isLoaded ? (
          <div className="w-full max-w-md space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-amber-400 mb-1">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                INITIALIZING THREAT SHIELD
              </span>
              <span className="font-bold">{progress}%</span>
            </div>

            {/* Glowing Progress Track */}
            <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-amber-900/50">
              <div 
                className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-yellow-300 rounded-full transition-all duration-100 shadow-[0_0_15px_rgba(245,158,11,0.8)]"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Terminal Diagnostic Feed */}
            <div className="p-2.5 rounded-xl bg-black/60 border border-amber-500/25 text-left font-mono text-[11px] text-amber-300/90 flex items-center gap-2 shadow-inner">
              <Terminal className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">{activeLog}</span>
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in zoom-in duration-300 w-full max-w-md">
            {/* The Cinematic "BEGIN YOUR MISSION" CTA in Warm Amber/Gold */}
            <button
              type="button"
              onClick={handleStart}
              onMouseEnter={() => SoundFX.playHoverBlip()}
              className="group relative w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 p-0.5 shadow-[0_0_50px_rgba(245,158,11,0.45)] hover:shadow-[0_0_70px_rgba(245,158,11,0.75)] transition-all duration-300 cursor-pointer active:scale-98"
            >
              <div className="w-full h-full bg-[#12161f] group-hover:bg-[#12161f]/80 rounded-[14px] py-3.5 px-6 flex items-center justify-center gap-3 transition-colors">
                <Crosshair className="w-5 h-5 text-amber-400 group-hover:rotate-90 transition-transform duration-500" />
                <span className="text-base sm:text-lg font-extrabold tracking-wider text-amber-100 font-mono uppercase">
                  BEGIN YOUR MISSION
                </span>
                <ArrowRight className="w-5 h-5 text-amber-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            <div className="flex items-center justify-center gap-6 text-[11px] font-mono text-amber-200/70">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                CYBERCUP 2026 EDITION
              </span>
              <span>·</span>
              <span>NPCI COMPLIANT</span>
              <span>·</span>
              <span>7 THREAT VECTORS ARMED</span>
            </div>
          </div>
        )}

      </div>

      {/* Bottom Grid Overlay Specs */}
      <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-[10px] font-mono text-amber-300/40 pointer-events-none hidden sm:flex">
        <div>SYS_COORD: 18.9220° N, 72.8347° E [MUMBAI NPCI]</div>
        <div>ISOLATION_FOREST: 500 TREES · CONTAMINATION: 0.05 · PRECISION: 96.4%</div>
      </div>
    </div>
  );
};
