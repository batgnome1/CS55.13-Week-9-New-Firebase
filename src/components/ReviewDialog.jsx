"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { handleReviewFormSubmission } from "@/src/app/actions.js";

const ReviewDialog = ({ isOpen, handleClose, review, onChange, userId, id }) => {
  const dialog = useRef();
  const [hovered, setHovered] = useState(0); // For hover preview

  useLayoutEffect(() => {
    if (isOpen) {
      dialog.current.showModal();
    } else {
      dialog.current.close();
    }
  }, [isOpen, dialog]);

  const handleClick = (e) => {
    if (e.target === dialog.current) {
      handleClose();
    }
  };

  return (
    <dialog ref={dialog} onMouseDown={handleClick}>
      <form
        action={handleReviewFormSubmission}
        onSubmit={(e) => {
          const text = e.target.text.value;
          const rating = e.target.rating.value;
          const userId = e.target.userId.value;
          const modId = e.target.moduleId.value;
          handleClose();
        }}
      >
        <header>
          <h3>Add your review</h3>
        </header>

        <article>
          {/* SKULL RATING PICKER WITH HOVER */}
          <div className="skull-rating flex gap-2 justify-center py-2">
            {[1, 2, 3, 4, 5].map((value) => {
              const filled = value <= (hovered || review.rating);
              return (
                <button
                  key={value}
                  type="button"
                  onMouseEnter={() => setHovered(value)}
                  onMouseLeave={() => setHovered(0)}
                  onClick={() => onChange(value, "rating")}
                  className="focus:outline-none"
                  title={`${value} skull${value > 1 ? "s" : ""}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={filled ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth={filled ? 0 : 1.5}
                    className={`h-10 w-10 ${
                      filled ? "text-purple-600" : "text-gray-400"
                    } transition-colors`}
                  >
                    <path d="M12 2C7.03 2 3 6.03 3 11a8.99 8.99 0 005 8v2a1 1 0 001 1h2v-2h2v2h2a1 1 0 001-1v-2a8.99 8.99 0 005-8c0-4.97-4.03-9-9-9zm-3 9a1 1 0 110-2 1 1 0 010 2zm6 0a1 1 0 110-2 1 1 0 010 2zm-3 4c-1.66 0-3-1.34-3-3h6c0 1.66-1.34 3-3 3z" />
                  </svg>
                </button>
              );
            })}
          </div>

          <input type="hidden" name="rating" value={review.rating} />

          {/* Review text */}
          <p>
            <input
              type="text"
              name="text"
              id="review"
              placeholder="Write your thoughts here"
              required
              value={review.text}
              onChange={(e) => onChange(e.target.value, "text")}
            />
          </p>

          {/* Hidden inputs for IDs */}
          <input type="hidden" name="moduleId" value={id} />
          <input type="hidden" name="userId" value={userId} />
        </article>

        <footer>
          <menu>
            <button
              autoFocus
              type="reset"
              onClick={handleClose}
              className="button--cancel"
            >
              Cancel
            </button>
            <button type="submit" value="confirm" className="button--confirm">
              Submit
            </button>
          </menu>
        </footer>
      </form>
    </dialog>
  );
};

export default ReviewDialog;


