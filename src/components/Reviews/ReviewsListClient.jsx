"use client";

import React, { useState, useEffect } from "react";
import { getReviewsSnapshotByModuleId } from "@/src/lib/firebase/firestore.js";
import { Review } from "@/src/components/Reviews/Review";

export default function ReviewsListClient({
  initialReviews,
  moduleId,
  userId,
}) {
  const [reviews, setReviews] = useState(initialReviews);

  useEffect(() => {
    return getReviewsSnapshotByModuleId(moduleId, (data) => {
      setReviews(data);
    });
  }, [moduleId]);
  return (
    <article>
      <ul className="reviews">
        {reviews.length > 0 ? (
          <ul>
            {reviews.map((review) => (
              <Review
                key={review.id}
                rating={review.rating}
                text={review.text}
                timestamp={review.timestamp}
              />
            ))}
          </ul>
        ) : (
          <p>
            This GNOMERCY scenario has not yet received a scene,{" "}
            {!userId ? "first login and then" : ""} add your own scene!
          </p>
        )}
      </ul>
    </article>
  );
}
