"use client";

import { useEffect, useState } from "react";

interface RiskGaugeProps {
  score: number;
  riskLevel: string;
  size?: number;
}

function getGaugeColor(score: number) {
  if (score <= 30) return "#16A34A"; // Crisp pine green
  if (score <= 70) return "#D97706"; // Warm amber
  return "#DC2626"; // Crimson
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

  const radius = (size - 24) / 2;
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
    <div className="flex flex-col items-center gap-3 animate-scale-in">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform rotate-0">
          {/* Outer subtle ring */}
          <circle
            cx={cx}
            cy={cy}
            r={radius + 6}
            fill="none"
            stroke="#E5E0D8"
            strokeWidth="1"
            className="opacity-70"
          />

          {/* Background track */}
          <path
            d={describeArc(startAngle, endAngle)}
            fill="none"
            stroke="#FAF8F5"
            strokeWidth="7"
            strokeLinecap="round"
          />

          {/* Progress arc */}
          {animatedScore > 0 && (
            <path
              d={describeArc(startAngle, Math.min(progressEndAngle, endAngle - 0.01))}
              fill="none"
              stroke={color}
              strokeWidth="7"
              strokeLinecap="round"
              className="transition-all duration-300"
            />
          )}
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-4xl font-extrabold tabular-nums leading-none tracking-tight text-[#111827]"
          >
            {animatedScore}
          </span>
          <span className="text-[10px] font-bold text-black mt-1.5 uppercase tracking-wider">Risk Score</span>
        </div>
      </div>

      {/* Risk level label - editorial pill */}
      <div
        className="px-3 py-1 rounded-full text-xs font-semibold tracking-wide border transition-all"
        style={{
          backgroundColor: score <= 30 ? "#F0FDF4" : score <= 70 ? "#FEF3C7" : "#FEF2F2",
          color: score <= 30 ? "#166534" : score <= 70 ? "#92400E" : "#991B1B",
          borderColor: score <= 30 ? "#BBF7D0" : score <= 70 ? "#FDE68A" : "#FECACA",
        }}
      >
        {riskLevel}
      </div>
    </div>
  );
}
