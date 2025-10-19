import { useState } from "react";

export default function SkullRatingPicker() {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);

  // Proper skull SVG (from Lucide Icons)
  const SkullIcon = ({ filled }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.5"
      className={`h-10 w-10 ${
        filled ? "text-purple-600" : "text-gray-400"
      } transition-transform duration-150 transform ${
        filled ? "scale-110" : ""
      }`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 2a9 9 0 0 0-9 9c0 3.2 1.7 5.9 4.2 7.4V21a1 1 0 0 0 1 1h2v-2h2v2h2a1 1 0 0 0 1-1v-2.6A9 9 0 0 0 21 11a9 9 0 0 0-9-9Zm-3 9a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm6 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm-3 4c-1.7 0-3-1.3-3-3h6c0 1.7-1.3 3-3 3Z"
      />
    </svg>
  );

  return (
    <div className="flex justify-center gap-2 py-4">
      {[1, 2, 3, 4, 5].map((value) => (
        <button
          key={value}
          type="button"
          onMouseEnter={() => setHovered(value)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => setRating(value)}
          className="focus:outline-none"
          title={`${value} skull${value > 1 ? "s" : ""}`}
        >
          <SkullIcon filled={value <= (hovered || rating)} />
        </button>
      ))}
    </div>
  );
}

