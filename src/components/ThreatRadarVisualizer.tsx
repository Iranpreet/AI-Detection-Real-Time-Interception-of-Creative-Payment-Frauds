import React, { useEffect, useRef } from 'react';
import { SCAM_PRESETS } from '../data/presets';

interface ThreatRadarVisualizerProps {
  activePresetId: string;
  onSelectPreset: (id: string) => void;
  isDark: boolean;
  currentRiskScore: number;
}

export const ThreatRadarVisualizer: React.FC<ThreatRadarVisualizerProps> = ({
  activePresetId,
  onSelectPreset,
  isDark
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Angular positions for presets around the radar orbit (warm amber/charcoal palette)
  const nodePositions = [
    { id: 'collect_refund', angle: 0.15 * Math.PI, radiusFactor: 0.68, label: 'Collect Fraud', color: '#ef4444' },
    { id: 'qr_tamper', angle: 0.45 * Math.PI, radiusFactor: 0.58, label: 'QR Tamper', color: '#f59e0b' },
    { id: 'screenshare_rat', angle: 0.82 * Math.PI, radiusFactor: 0.75, label: 'Screenshare RAT', color: '#ea580c' },
    { id: 'mule_velocity', angle: 1.15 * Math.PI, radiusFactor: 0.62, label: 'Velocity Ring', color: '#dc2626' },
    { id: 'phishing_bill', angle: 1.45 * Math.PI, radiusFactor: 0.70, label: 'Phishing SMS', color: '#d97706' },
    { id: 'zero_day_novel', angle: 1.72 * Math.PI, radiusFactor: 0.78, label: 'Zero-Day AI', color: '#fbbf24' },
    { id: 'safe_legit', angle: 1.95 * Math.PI, radiusFactor: 0.45, label: 'Verified Safe', color: '#10b981' },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animationId: number;
    let sweepAngle = 0;

    const render = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.scale(dpr, dpr);
      const w = rect.width;
      const h = rect.height;
      const cx = w / 2;
      const cy = h / 2;
      const maxRadius = Math.min(cx, cy) - 24;

      ctx.clearRect(0, 0, w, h);

      // Radar Concentric Circles in warm amber tone
      ctx.lineWidth = 1;
      const rings = [0.25, 0.50, 0.75, 1.0];
      rings.forEach(rFrac => {
        ctx.beginPath();
        ctx.arc(cx, cy, maxRadius * rFrac, 0, Math.PI * 2);
        ctx.strokeStyle = isDark ? 'rgba(245, 158, 11, 0.08)' : 'rgba(0, 0, 0, 0.06)';
        ctx.stroke();
      });

      // Axis crosshairs
      ctx.beginPath();
      ctx.moveTo(cx - maxRadius, cy);
      ctx.lineTo(cx + maxRadius, cy);
      ctx.moveTo(cx, cy - maxRadius);
      ctx.lineTo(cx, cy + maxRadius);
      ctx.strokeStyle = isDark ? 'rgba(245, 158, 11, 0.05)' : 'rgba(0, 0, 0, 0.04)';
      ctx.stroke();

      // Radar Sweep Fan in Warm Golden Amber
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, maxRadius, sweepAngle, sweepAngle + 0.35 * Math.PI);
      ctx.closePath();
      const sweepGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxRadius);
      sweepGradient.addColorStop(0, 'rgba(245, 158, 11, 0.22)');
      sweepGradient.addColorStop(1, 'rgba(245, 158, 11, 0.0)');
      ctx.fillStyle = sweepGradient;
      ctx.fill();
      ctx.restore();

      // Radar Sweep Leading Line
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(
        cx + Math.cos(sweepAngle + 0.35 * Math.PI) * maxRadius,
        cy + Math.sin(sweepAngle + 0.35 * Math.PI) * maxRadius
      );
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.65)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Center Core
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? '#f59e0b' : '#d97706';
      ctx.fill();

      // Render Threat Nodes
      nodePositions.forEach(node => {
        const x = cx + Math.cos(node.angle) * (maxRadius * node.radiusFactor);
        const y = cy + Math.sin(node.angle) * (maxRadius * node.radiusFactor);
        const isActive = activePresetId === node.id;

        // Connecting orbital ray
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(x, y);
        ctx.strokeStyle = isActive 
          ? (isDark ? 'rgba(245, 158, 11, 0.5)' : 'rgba(217, 119, 6, 0.4)')
          : (isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)');
        ctx.setLineDash([2, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Node Glow Ring
        if (isActive) {
          ctx.beginPath();
          ctx.arc(x, y, 14, 0, Math.PI * 2);
          ctx.fillStyle = isDark ? 'rgba(245, 158, 11, 0.30)' : 'rgba(245, 158, 11, 0.25)';
          ctx.fill();
        }

        // Node Point
        ctx.beginPath();
        ctx.arc(x, y, isActive ? 7 : 4.5, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();
        ctx.strokeStyle = isDark ? '#0b0e14' : '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Node Label
        ctx.font = isActive ? '600 11px Plus Jakarta Sans, sans-serif' : '500 10px Plus Jakarta Sans, sans-serif';
        ctx.fillStyle = isActive
          ? (isDark ? '#fef3c7' : '#1f2937')
          : (isDark ? '#a8a29e' : '#64748b');
        ctx.textAlign = 'center';
        ctx.fillText(node.label, x, y + 16);
      });

      sweepAngle = (sweepAngle + 0.015) % (Math.PI * 2);
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [activePresetId, isDark]);

  return (
    <div className="relative w-full h-72 sm:h-80 flex flex-col items-center justify-center">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full cursor-pointer"
        onClick={(e) => {
          const canvas = canvasRef.current;
          if (!canvas) return;
          const rect = canvas.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const clickY = e.clientY - rect.top;
          const cx = rect.width / 2;
          const cy = rect.height / 2;
          const maxRadius = Math.min(cx, cy) - 24;

          // Check if user clicked near any node
          nodePositions.forEach(node => {
            const nx = cx + Math.cos(node.angle) * (maxRadius * node.radiusFactor);
            const ny = cy + Math.sin(node.angle) * (maxRadius * node.radiusFactor);
            const dist = Math.hypot(clickX - nx, clickY - ny);
            if (dist < 28) {
              onSelectPreset(node.id);
            }
          });
        }}
      />
      <div className="absolute bottom-2 left-0 right-0 text-center pointer-events-none">
        <span className="text-[10px] text-amber-200/60 tracking-wide uppercase font-mono">
          Interactive Payment Threat Constellation · Click any node to inspect telemetry
        </span>
      </div>
    </div>
  );
};
