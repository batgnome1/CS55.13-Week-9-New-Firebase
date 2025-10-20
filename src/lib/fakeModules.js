import {
  randomNumberBetween,
  getRandomDateAfter,
  getRandomDateBefore,
} from "@/src/lib/utils.js";
import { randomData } from "@/src/lib/randomData.js";

import { Timestamp } from "firebase/firestore";
import photoBasedOnGenre from "./utils.js";

export async function generateModulesAndReviews() {
  console.log("🎲 Generating fake modules and reviews...");

  // Shuffle module names to avoid duplicates
  const shuffledNames = [...randomData.moduleNames];
  for (let i = shuffledNames.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledNames[i], shuffledNames[j]] = [shuffledNames[j], shuffledNames[i]];
  }

  const data = [];

  for (let i = 0; i < shuffledNames.length; i++) {
    const name = shuffledNames[i];
    const moduleTimestamp = Timestamp.fromDate(getRandomDateBefore());

    // Generate random 0–5 ratings for this module
    const ratingsData = [];
    const numRatings = randomNumberBetween(0, 5);
    for (let j = 0; j < numRatings; j++) {
      const ratingTimestamp = Timestamp.fromDate(
        getRandomDateAfter(moduleTimestamp.toDate())
      );

      const review = randomData.moduleReviews[
        randomNumberBetween(0, randomData.moduleReviews.length - 1)
      ];

      ratingsData.push({
        rating: review.rating,
        text: review.text,
        userId: `User #${randomNumberBetween(1, 1000)}`,
        timestamp: ratingTimestamp,
      });
    }

    // Compute sum and average
    const sumRating = ratingsData.reduce((acc, r) => acc + r.rating, 0);
    const avgRating = ratingsData.length ? sumRating / ratingsData.length : 0;

    // Create module data
    const genre = randomData.moduleGenres[randomNumberBetween(0, randomData.moduleGenres.length - 1)];

    const moduleData = {
      name,
      genre: genre,
      players: randomData.modulePlayers[randomNumberBetween(0, randomData.modulePlayers.length - 1)],
      numRatings: ratingsData.length,
      sumRating,
      avgRating,
      difficulty: randomNumberBetween(1, 5),
      photo: photoBasedOnGenre(genre),
      timestamp: moduleTimestamp,
    };

    data.push({ moduleData, ratingsData });

    console.log(
      `📝 Generated module ${i + 1}: ${moduleData.name} with ${ratingsData.length} reviews`
    );
  }

  console.log("✅ Generated", data.length, "modules total");
  return data;
}
