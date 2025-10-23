"use client";

import { useLayoutEffect, useRef } from "react";
import SkullRatingPicker from "@/src/components/RatingPicker.jsx";
import { handleReviewFormSubmission } from "@/src/app/actions.js";

const ReviewDialog = ({ isOpen, handleClose, review, onChange, userId, id }) => {
  const dialog = useRef();

  useLayoutEffect(() => {
    if (isOpen) dialog.current.showModal();
    else dialog.current.close();
  }, [isOpen]);

  return (
    <dialog ref={dialog} onMouseDown={(e) => e.target === dialog.current && handleClose()}>
      <form
        action={handleReviewFormSubmission}
        onSubmit={(e) => {
          e.preventDefault();
           console.log("Submitting review:", review);
          handleClose();
        }}
      >
        <header><h3>Add your review</h3></header>

        <article>
          <SkullRatingPicker rating={review.rating} onChange={(v) => onChange(v, "rating")} />
          <input type="hidden" name="rating" value={review.rating} />

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

          <input type="hidden" name="moduleId" value={id} />
          <input type="hidden" name="userId" value={userId} />
        </article>

        <footer>
          <menu>
            <button type="reset" onClick={handleClose} className="button--cancel">Cancel</button>
            <button type="submit" className="button--confirm">Submit</button>
          </menu>
        </footer>
      </form>
    </dialog>
  );
};

export default ReviewDialog;




