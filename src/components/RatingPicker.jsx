"use client";

import { useState } from "react";
import Skull from "./SingleSkull.jsx";

export default function SkullRatingPicker({ rating, onChange }) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex justify-center gap-2 py-2">
      {/* TEMP: hardcoded filled skull for testing */}
      <Skull filled={true} />
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
