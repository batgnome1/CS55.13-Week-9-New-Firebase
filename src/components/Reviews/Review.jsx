import renderSkulls from "@/src/components/Skulls.jsx";

export function Review({ rating, text, timestamp }) {
  return (
    <li className="review__item">
      <ul className="module__rating">{renderSkulls(rating)}</ul>
      <p>{text}</p>

      <time>
        {new Intl.DateTimeFormat("en-GB", {
          dateStyle: "medium",
        }).format(timestamp)}
      </time>
    </li>
  );
}

export function ReviewSkeleton() {
  return (
    <li className="review__item">
      <div className="module__rating">
        <div
          style={{
            height: "2rem",
            backgroundColor: "rgb(156 163 175)",
            width: "10rem",
          }}
        ></div>
      </div>
      <div
        style={{
          height: "19px",
          backgroundColor: "rgb(156 163 175)",
          width: "12rem",
        }}
      ></div>
      <p>{"   "}</p>
    </li>
  );
}
