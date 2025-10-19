import { useState } from "react";
import { renderSkulls } from "./Skulls.jsx"; // adjust path if needed

export default function SkullRatingPicker({ rating, onChange }) {
  const [hovered, setHovered] = useState(0);

  // Render a single skull (filled or outline) for a button
  const SingleSkull = ({ filled }) => {
    // renderSkulls expects a number, so 1 = filled, 0 = outline
    return renderSkulls(filled ? 1 : 0).props.children[0]; // take only the first <li>
  };

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
            <SingleSkull filled={filled} />
          </button>
        );
      })}
    </div>
  );
}
