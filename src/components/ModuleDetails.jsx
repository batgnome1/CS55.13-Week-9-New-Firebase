// This component shows restaurant metadata, and offers some actions to the user like uploading a new restaurant image, and adding a review.

import React from "react";
import renderSkulls from "@/src/components/Skulls.jsx";

const ModuleDetails = ({
  module,
  userId,
  handleModuleImage,
  setIsOpen,
  isOpen,
  children,
}) => {
  return (
    <section className="img__section">
      <img src={module.photo} alt={module.name} />

      <div className="actions">
        {userId && (
          <button className="test"

            onClick={() => {
              setIsOpen(!isOpen);
            }}>Add Review</button>
        )}
      </div>

      <div className="details__container">
        <div className="details">
          <h2>{module.name}</h2>

          <div className="module__rating">
            <ul>{renderSkulls(module.avgRating)}</ul>

            <span>({module.numRatings})</span>
          </div>
          <p>{module.description}</p>
          <p>
            <strong>Genre: </strong>{module.genre} | <strong>Players:</strong> {module.players}
          </p>
          <p><strong>Difficulty:</strong> {"💀".repeat(module.difficulty)}</p>
          {children}
        </div>
      </div>
    </section>
  );
};

export default ModuleDetails;
