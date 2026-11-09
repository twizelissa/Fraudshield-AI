import React from "react";

interface BrainChargerLogoProps {
  className?: string;
  size?: number;
}

export default function BrainChargerLogo({
  className = "h-5 w-5",
}: BrainChargerLogoProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      stroke="currentColor"
    >
      {/* Left hemisphere contours - tech sketch line art */}
      <path
        d="M20 10C15 10 11 13.5 11 18C11 19.8 11.6 21.5 12.8 22.8C10.5 24.2 9 26.8 9 30C9 34.4 12.6 38 17 38C17.5 38 18.2 37.9 19 37.7"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Left inner brain fold lines */}
      <path
        d="M17 18C14.5 19 14 22 16.5 24C19 26 15 28 14.5 31C14.2 32.5 15.5 34 17.5 34"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 14C17.5 15.5 18 18 20 19"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {/* Right hemisphere contours */}
      <path
        d="M28 10C33 10 37 13.5 37 18C37 19.8 36.4 21.5 35.2 22.8C37.5 24.2 39 26.8 39 30C39 34.4 35.4 38 31 38C30.5 38 29.8 37.9 29 37.7"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right inner brain fold lines */}
      <path
        d="M31 18C33.5 19 34 22 31.5 24C29 26 33 28 33.5 31C33.8 32.5 32.5 34 30.5 34"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M29 14C30.5 15.5 30 18 28 19"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {/* Central charging lightning bolt / power core */}
      <path
        d="M25 15L21.5 22.5H26.5L23 30"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity="0.15"
      />

      {/* Charger plug at bottom base */}
      {/* Plug socket connection */}
      <rect
        x="21"
        y="36"
        width="6"
        height="4"
        rx="1"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Charger cord looping down */}
      <path
        d="M24 40V43C24 44.5 25.5 45.5 27 45H29"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Small tech sketch electrical dots/sparks */}
      <circle cx="24" cy="8" r="1.2" fill="currentColor" />
      <circle cx="7" cy="24" r="1" fill="currentColor" />
      <circle cx="41" cy="24" r="1" fill="currentColor" />
    </svg>
  );
}
