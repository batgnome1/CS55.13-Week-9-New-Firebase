import { useState } from "react";

export default function SkullRatingPicker({ rating, onChange }) {
  const [hovered, setHovered] = useState(0);

const SkullIcon = ({ filled }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth={filled ? 0 : 1.5}
    className={`h-10 w-10 ${filled ? "text-purple-600" : "text-gray-400"}`}
  >
    <path d="M12 2C10 2 8 4 8 6c0 1.5 0 3 0 3s-2 0-2 2c0 3 4 3 6 3s6 0 6-3c0-2-2-2-2-2s0-1.5 0-3c0-2-2-4-4-4zm0 7a1 1 0 110-2 1 1 0 010 2zm-3 4a1 1 0 110-2 1 1 0 010 2zm6 0a1 1 0 110-2 1 1 0 010 2zm-3 5c-2 0-4-1.5-4-3v-1h8v1c0 1.5-2 3-4 3z" />
  </svg>
);

  return (
    <div className="skull-rating flex justify-center gap-2">
      {[1, 2, 3, 4, 5].map((value) => {
        const filled = value <= (hovered || rating);
        return (
          <button
            key={value}
            type="button"
            onMouseEnter={() => setHovered(value)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onChange(value)}
            className="focus:outline-none transform transition-transform hover:scale-125"
          >
            <SkullIcon filled={filled} />
          </button>
        );
      })}
    </div>
  );
}
