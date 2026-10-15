import React, { useEffect, useRef } from 'react';
import { FraudCategory, HourlyTrend } from '../types';

interface RiskGaugeProps {
  score: number;
  isDark: boolean;
}

export const RiskGaugeCanvas: React.FC<RiskGaugeProps> = ({ score, isDark }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(dpr, dpr);
    const width = rect.width;
    const height = rect.height;

    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height * 0.72;
    const radius = Math.min(width * 0.42, height * 0.58);
    const startAngle = Math.PI * 0.85;
    const endAngle = Math.PI * 2.15;
    const currentAngle = startAngle + (endAngle - startAngle) * (score / 100);

    // Track Background
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)";
    ctx.lineWidth = 14;
    ctx.lineCap = "round";
    ctx.stroke();

    // Colored Active Arc
    let strokeColor = "#10b981"; // Safe Green
    let glowColor = isDark ? "rgba(16, 185, 129, 0.5)" : "rgba(16, 185, 129, 0.3)";
    if (score >= 70) {
      strokeColor = "#ef4444"; // Crimson Red
      glowColor = isDark ? "rgba(239, 68, 68, 0.6)" : "rgba(239, 68, 68, 0.35)";
    } else if (score >= 35) {
      strokeColor = "#f59e0b"; // Amber Warning
      glowColor = isDark ? "rgba(245, 158, 11, 0.5)" : "rgba(245, 158, 11, 0.3)";
    }

    ctx.save();
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, currentAngle);
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 14;
    ctx.lineCap = "round";
    ctx.stroke();
    ctx.restore();

    // Score Value Center Text
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.font = "800 34px Inter, sans-serif";
    ctx.fillStyle = strokeColor;
    ctx.fillText(`${score}`, centerX, centerY - 14);

    ctx.font = "600 11px Inter, sans-serif";
    ctx.fillStyle = isDark ? "rgba(156, 163, 175, 0.9)" : "#64748b";
    ctx.fillText("RISK SCORE / 100", centerX, centerY + 16);

    // Risk Level Badge Text
    let label = "SAFE (LOW RISK)";
    if (score >= 70) label = "CRITICAL / HIGH RISK";
    else if (score >= 35) label = "SUSPICIOUS / REVIEW";

    ctx.font = "700 11px Inter, sans-serif";
    ctx.fillStyle = strokeColor;
    ctx.fillText(label, centerX, centerY + 36);
  }, [score, isDark]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

interface DonutChartProps {
  data: FraudCategory[];
  isDark: boolean;
}

export const DonutChartCanvas: React.FC<DonutChartProps> = ({ data, isDark }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(dpr, dpr);
    const width = rect.width;
    const height = rect.height;

    ctx.clearRect(0, 0, width, height);

    const centerX = width * 0.35;
    const centerY = height / 2;
    const outerRadius = Math.min(width * 0.28, height * 0.40);
    const innerRadius = outerRadius * 0.62;

    const total = data.reduce((sum, item) => sum + item.count, 0);
    let startAngle = -Math.PI / 2;

    data.forEach(item => {
      const sliceAngle = (item.count / total) * (Math.PI * 2);
      const endAngle = startAngle + sliceAngle;

      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, startAngle, endAngle);
      ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);
      ctx.closePath();

      ctx.fillStyle = item.color;
      ctx.fill();

      ctx.strokeStyle = isDark ? "#0f172a" : "#ffffff";
      ctx.lineWidth = 2;
      ctx.stroke();

      startAngle = endAngle;
    });

    // Center hole text
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "700 18px Inter, sans-serif";
    ctx.fillStyle = isDark ? "#f8fafc" : "#0f172a";
    ctx.fillText(`${total}`, centerX, centerY - 8);

    ctx.font = "600 10px Inter, sans-serif";
    ctx.fillStyle = isDark ? "#94a3b8" : "#64748b";
    ctx.fillText("FLAGGED", centerX, centerY + 10);

    // Legend on right side
    const legendX = width * 0.68;
    const startY = height * 0.16;
    const itemHeight = (height * 0.72) / data.length;

    data.forEach((item, index) => {
      const y = startY + index * itemHeight;

      // Color marker
      ctx.fillStyle = item.color;
      ctx.beginPath();
      ctx.roundRect(legendX - 16, y - 5, 10, 10, 2);
      ctx.fill();

      // Label & Percent
      ctx.textAlign = "left";
      ctx.font = "600 11px Inter, sans-serif";
      ctx.fillStyle = isDark ? "#e2e8f0" : "#1e293b";
      ctx.fillText(item.category, legendX, y + 2);

      ctx.font = "500 10px Inter, sans-serif";
      ctx.fillStyle = isDark ? "#94a3b8" : "#64748b";
      ctx.fillText(`${item.percentage}% (${item.count})`, legendX, y + 15);
    });
  }, [data, isDark]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

interface HourlyTrendProps {
  data: HourlyTrend[];
  isDark: boolean;
}

export const HourlyTrendCanvas: React.FC<HourlyTrendProps> = ({ data, isDark }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(dpr, dpr);
    const width = rect.width;
    const height = rect.height;

    ctx.clearRect(0, 0, width, height);

    const padLeft = 45;
    const padRight = 20;
    const padTop = 25;
    const padBottom = 30;

    const chartW = width - padLeft - padRight;
    const chartH = height - padTop - padBottom;

    const maxBlocked = Math.max(...data.map(d => d.blocked)) * 1.15;

    // Horizontal grid lines
    ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.07)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padTop + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(width - padRight, y);
      ctx.stroke();

      const val = Math.round(maxBlocked - (maxBlocked / 4) * i);
      ctx.fillStyle = isDark ? "#64748b" : "#64748b";
      ctx.font = "500 9px Inter, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(val.toString(), padLeft - 6, y + 3);
    }

    const points = data.map((d, i) => {
      const x = padLeft + (i / (data.length - 1)) * chartW;
      const y = padTop + chartH - (d.blocked / maxBlocked) * chartH;
      return { x, y, hour: d.hour, blocked: d.blocked, rate: d.fraud_rate };
    });

    // Gradient fill area
    const gradient = ctx.createLinearGradient(0, padTop, 0, padTop + chartH);
    gradient.addColorStop(0, isDark ? "rgba(239, 68, 68, 0.35)" : "rgba(239, 68, 68, 0.20)");
    gradient.addColorStop(1, isDark ? "rgba(239, 68, 68, 0.0)" : "rgba(239, 68, 68, 0.0)");

    ctx.beginPath();
    ctx.moveTo(points[0].x, padTop + chartH);
    points.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(points[points.length - 1].x, padTop + chartH);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Line Path
    ctx.beginPath();
    points.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Points & Labels
    points.forEach((p, i) => {
      const isNightSpike = i <= 4 || i >= 22;
      ctx.beginPath();
      ctx.arc(p.x, p.y, isNightSpike ? 3.5 : 2, 0, Math.PI * 2);
      ctx.fillStyle = isNightSpike ? "#dc2626" : "#ef4444";
      ctx.fill();

      if (i % 3 === 0) {
        ctx.fillStyle = isDark
          ? (isNightSpike ? "#fca5a5" : "#94a3b8")
          : (isNightSpike ? "#dc2626" : "#475569");
        ctx.font = "500 9px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(p.hour, p.x, height - 10);
      }
    });

    ctx.font = "600 10px Inter, sans-serif";
    ctx.fillStyle = isDark ? "#f87171" : "#dc2626";
    ctx.textAlign = "left";
    ctx.fillText("⚡ Peak Fraud Spike (11 PM - 3 AM)", padLeft + 15, padTop + 14);
  }, [data, isDark]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

interface RocCurveProps {
  threshold: number;
  isDark: boolean;
}

export const RocCurveCanvas: React.FC<RocCurveProps> = ({ threshold, isDark }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(dpr, dpr);
    const width = rect.width;
    const height = rect.height;

    ctx.clearRect(0, 0, width, height);

    const padLeft = 45;
    const padRight = 20;
    const padTop = 20;
    const padBottom = 35;

    const chartW = width - padLeft - padRight;
    const chartH = height - padTop - padBottom;

    // Grid lines
    ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.08)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padTop + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(width - padRight, y);
      ctx.stroke();

      const label = ((4 - i) / 4).toFixed(2);
      ctx.fillStyle = isDark ? "#64748b" : "#64748b";
      ctx.font = "500 9px Inter, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(label, padLeft - 6, y + 3);
    }

    // Diagonal reference line (Random guess)
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = isDark ? "rgba(148, 163, 184, 0.3)" : "rgba(100, 116, 139, 0.35)";
    ctx.beginPath();
    ctx.moveTo(padLeft, padTop + chartH);
    ctx.lineTo(padLeft + chartW, padTop);
    ctx.stroke();
    ctx.setLineDash([]);

    // Realistic ROC Curve points (AUC = 0.985)
    const rocPoints = [
      { fpr: 0.0, tpr: 0.0 },
      { fpr: 0.002, tpr: 0.88 },
      { fpr: 0.008, tpr: 0.93 },
      { fpr: 0.0118, tpr: 0.948 },
      { fpr: 0.025, tpr: 0.975 },
      { fpr: 0.060, tpr: 0.990 },
      { fpr: 0.150, tpr: 0.998 },
      { fpr: 1.0, tpr: 1.0 }
    ];

    // Draw ROC Curve
    ctx.beginPath();
    rocPoints.forEach((p, idx) => {
      const x = padLeft + p.fpr * chartW;
      const y = padTop + chartH - p.tpr * chartH;
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = "#10b981"; // Emerald
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Mark Operating Threshold Point based on threshold slider
    // Operating default: FPR 0.0118, TPR 0.948 at threshold 0.50
    // Dynamic adjustment slightly shifts operating point as threshold moves
    const effectiveFpr = Math.max(0.002, Math.min(0.08, 0.0118 * (0.50 / threshold)));
    const effectiveTpr = Math.max(0.85, Math.min(0.99, 0.948 * Math.pow(threshold / 0.50, 0.05)));

    const opX = padLeft + effectiveFpr * chartW;
    const opY = padTop + chartH - effectiveTpr * chartH;

    ctx.beginPath();
    ctx.arc(opX, opY, 5, 0, Math.PI * 2);
    ctx.fillStyle = "#f59e0b";
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Label on operating point
    ctx.fillStyle = isDark ? "#fbbf24" : "#d97706";
    ctx.font = "700 10px Inter, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`★ Operating Point (FPR ${(effectiveFpr * 100).toFixed(2)}%, Recall ${(effectiveTpr * 100).toFixed(1)}%)`, opX + 10, opY + 4);

    // X Axis Label
    ctx.fillStyle = isDark ? "#94a3b8" : "#475569";
    ctx.font = "600 10px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("False Positive Rate (FPR) →", padLeft + chartW / 2, height - 10);

    // Y Axis Label
    ctx.save();
    ctx.translate(14, padTop + chartH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("True Positive Rate (Recall) →", 0, 0);
    ctx.restore();
  }, [threshold, isDark]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};
