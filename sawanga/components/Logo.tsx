import React from "react";

export function Logo({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="goldgrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E4C677" />
          <stop offset="50%" stopColor="#C8A24B" />
          <stop offset="100%" stopColor="#A8842F" />
        </linearGradient>
      </defs>
      {/* roof / upward chart strokes */}
      <path
        d="M14 60 L40 34 L52 46 L84 16"
        stroke="url(#goldgrad)"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M72 16 L84 16 L84 28"
        stroke="url(#goldgrad)"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* house outline */}
      <path
        d="M30 52 L52 32 L74 52 L74 82 L30 82 Z"
        stroke="url(#goldgrad)"
        strokeWidth="5"
        strokeLinejoin="round"
        fill="none"
      />
      {/* stylized S */}
      <path
        d="M60 60 C60 56 56 54 50 54 C44 54 41 57 41 61 C41 69 60 65 60 73 C60 77 56 80 50 80 C44 80 40 77 40 73"
        stroke="url(#goldgrad)"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
