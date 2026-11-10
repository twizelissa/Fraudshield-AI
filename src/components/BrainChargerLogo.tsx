import React from "react";

interface BrainChargerLogoProps {
  className?: string;
}

export default function BrainChargerLogo({
  className = "h-7 w-7 text-[#0B6A3B]",
}: BrainChargerLogoProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Left hemisphere brain lobes - crisp clean vector line art */}
      <path
        d="M13.5 6.5C10.5 6.5 8 8.8 8 12C8 13.2 8.4 14.3 9.1 15.2C7.3 16.2 6 18.2 6 20.5C6 23.8 8.5 26.5 11.8 26.5C12.4 26.5 13 26.4 13.5 26.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Left inner gyrus fold */}
      <path
        d="M11.5 12C9.8 12.8 9.5 15 11 16.5C12.5 18 10 19.5 9.5 21.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Right hemisphere brain lobes */}
      <path
        d="M18.5 6.5C21.5 6.5 24 8.8 24 12C24 13.2 23.6 14.3 22.9 15.2C24.7 16.2 26 18.2 26 20.5C26 23.8 23.5 26.5 20.2 26.5C19.6 26.5 19 26.4 18.5 26.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right inner gyrus fold */}
      <path
        d="M20.5 12C22.2 12.8 22.5 15 21 16.5C19.5 18 22 19.5 22.5 21.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Central charging lightning core */}
      <path
        d="M17 9.5L14.5 15H17.5L15 21.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Charger plug input connector at bottom base */}
      <path
        d="M14 26V28.5C14 29.3 14.7 30 15.5 30H16.5C17.3 30 18 29.3 18 28.5V26"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Charger cord line */}
      <path
        d="M16 30V31.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />

      {/* Power energy spark dots */}
      <circle cx="16" cy="5" r="0.8" fill="currentColor" />
      <circle cx="4.5" cy="18" r="0.7" fill="currentColor" />
      <circle cx="27.5" cy="18" r="0.7" fill="currentColor" />
    </svg>
  );
}
