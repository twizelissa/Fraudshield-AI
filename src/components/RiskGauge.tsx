"use client";

import { useEffect, useState } from "react";

interface RiskGaugeProps {
  score: number;
  riskLevel: string;
  size?: number;
}

function getGaugeColor(score: number) {
  if (score <= 30) return "#00f2fe"; // Cyber Cyan
  if (score <= 70) return "#4f46e5"; // Neon Indigo
  return "#d946ef"; // Cyber Violet
}

export default function RiskGauge({ score, riskLevel, size = 160 }: RiskGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      let current = 0;
      const step = score / 40;
      const interval = setInterval(() => {
        current = Math.min(current + step, score);
        setAnimatedScore(Math.round(current));
        if (current >= score) clearInterval(interval);
      }, 20);
      return () => clearInterval(interval);
    }, 300);
    return () => clearTimeout(timer);
  }, [score]);

  const radius = (size - 24) / 2; // Sleek padding for radar ring
  const color = getGaugeColor(score);

  // SVG arc: start from bottom-left, sweep 270deg
  const cx = size / 2;
  const cy = size / 2;
  const startAngle = 135; // degrees
  const endAngle = 135 + 270; // 405 degrees

  function polarToCartesian(angle: number) {
    const rad = ((angle - 90) * Math.PI) / 180;
    return {
      x: cx + radius * Math.cos(rad),
      y: cy + radius * Math.sin(rad),
    };
  }

  function describeArc(startDeg: number, endDeg: number) {
    const start = polarToCartesian(startDeg);
    const end = polarToCartesian(endDeg);
    const largeArc = endDeg - startDeg <= 180 ? "0" : "1";
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`;
  }

  const progressEndAngle = startAngle + (animatedScore / 100) * 270;

  return (
    <div className="flex flex-col items-center gap-2 animate-scale-in">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform rotate-0">
          {/* Radar outer dashed ring - high-tech radar grid */}
          <circle
            cx={cx}
            cy={cy}
            r={radius + 8}
            fill="none"
            stroke={color}
            strokeWidth="1"
            strokeDasharray="4 5"
            className="opacity-20 animate-pulse"
          />

          {/* Background arc - sleek dark track */}
          <path
            d={describeArc(startAngle, endAngle)}
            fill="none"
            stroke="#1e293b"
            strokeWidth="5"
            strokeLinecap="round"
            className="opacity-30"
          />

          {/* Progress arc - glowing neon vector */}
          {animatedScore > 0 && (
            <path
              d={describeArc(startAngle, Math.min(progressEndAngle, endAngle - 0.01))}
              fill="none"
              stroke={color}
              strokeWidth="5"
              strokeLinecap="round"
              className="filter drop-shadow-[0_0_8px_#00f2fe]"
              style={{
                filter: `drop-shadow(0 0 6px ${color})`,
              }}
            />
          )}
        </svg>

        {/* Center text - neon typography glow */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-4xl font-extrabold tabular-nums leading-none tracking-widest font-mono"
            style={{ 
              color,
              textShadow: `0 0 12px ${color}60`
            }}
          >
            {animatedScore}
          </span>
          <span className="text-[7.5px] font-black text-slate-500 mt-1 uppercase tracking-widest font-mono">Buffer Risk</span>
        </div>
      </div>

      {/* Risk level label - sleek dark cyber badge */}
      <div
        className="px-2.5 py-0.5 rounded-md text-[9px] font-black tracking-widest uppercase border font-mono"
        style={{
          backgroundColor: `${color}10`,
          color,
          borderColor: `${color}30`,
          boxShadow: `0 0 10px ${color}10`
        }}
      >
        {riskLevel}
      </div>
    </div>
  );
}
