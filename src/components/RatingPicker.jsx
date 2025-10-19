"use client";
import { useState } from "react";

// Single skull component
function Skull({ filled }) {
  if (filled) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-10 w-10 text-purple-600"
      >
        <path d="M12 2C7.03 2 3 6.03 3 11a8.99 8.99 0 005 8v2a1 1 0 001 1h2v-2h2v2h2a1 1 0 001-1v-2a8.99 8.99 0 005-8c0-4.97-4.03-9-9-9zm-3 9a1 1 0 110-2 1 1 0 010 2zm6 0a1 1 0 110-2 1 1 0 010 2zm-3 4c-1.66 0-3-1.34-3-3h6c0 1.66-1.34 3-3 3z" />
      </svg>
    );
  } else {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="h-10 w-10 text-purple-600"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 3c-4.97 0-9 4.03-9 9a9 9 0 005 8v2h2v-2h2v2h2v-2h2v2h2v-2a9 9 0 005-8c0-4.97-4.03-9-9-9zM9 11h.01M15 11h.01M9 14h6"
        />
      </svg>
    );
  }
}

export default function SkullRatingPicker({ rating, onChange }) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex justify-center gap-2 py-2">
      {[1, 2, 3, 4, 5].map((value) => {
        const filled = value <= (hovered || rating);
        return (
          <button
            key={value}
            type="button"
            onMouseEnter={() => setHovered(value)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onChange(value)}
            className="focus:outline-none p-1"
          >
            <Skull filled={filled} />
          </button>
        );
      })}
    </div>
  );
}
