"use client";

import { useLayoutEffect, useRef } from "react";
import SkullRatingPicker from "@/src/components/RatingPicker.jsx";
import { handleReviewFormSubmission } from "@/src/app/actions.js";

const ReviewDialog = ({ isOpen, handleClose, review, onChange, userId, id }) => {
  const dialog = useRef();

  useLayoutEffect(() => {
    if (isOpen) {
      dialog.current.showModal();
    } else {
      dialog.current.close();
    }
  }, [isOpen]);

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
          {/* Skull Rating Picker */}
          <SkullRatingPicker
            rating={review.rating}
            onChange={(value) => onChange(value, "rating")}
          />
          <input type="hidden" name="rating" value={review.rating} />

          {/* Review Text */}
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



