"use client";

import { useLayoutEffect, useRef } from "react";
import { handleReviewFormSubmission } from "@/src/app/actions.js";

/**
 * ReviewDialog Component
 * A modal dialog component for adding restaurant reviews
 * 
 * @param {boolean} isOpen - Controls whether the dialog is visible
 * @param {function} handleClose - Function to close the dialog
 * @param {object} review - Current review object containing text and rating
 * @param {function} onChange - Function to handle changes to review fields
 * @param {string} userId - ID of the user submitting the review
 * @param {string} id - ID of the restaurant being reviewed
 */
const ReviewDialog = ({ isOpen, handleClose, review, onChange, userId, id }) => {
  const dialog = useRef();

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
          {/* SKULL RATING PICKER */}
          <div className="skull-rating">
            {[5, 4, 3, 2, 1].map((value) => (
              <span key={value}>
                <input
                  type="radio"
                  id={`skull${value}`}
                  name="rating"
                  value={value}
                  className="radio-input"
                  checked={review.rating === value}
                  onChange={() => onChange(value, "rating")}
                />
                <label htmlFor={`skull${value}`} className="radio-label"></label>
              </span>
            ))}
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

