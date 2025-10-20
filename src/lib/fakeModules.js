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
  const modulesToAdd = 60;
  const data = [];

  for (let i = 0; i < modulesToAdd; i++) {
    const moduleTimestamp = Timestamp.fromDate(getRandomDateBefore());

    const ratingsData = [];

    // Generate a random number of ratings/reviews for this restaurant
    for (let j = 0; j < randomNumberBetween(0, 5); j++) {
      const ratingTimestamp = Timestamp.fromDate(
        getRandomDateAfter(moduleTimestamp.toDate())
      );

      const ratingData = {
        rating:
          randomData.moduleReviews[
            randomNumberBetween(0, randomData.moduleReviews.length - 1)
          ].rating,
        text: randomData.moduleReviews[
          randomNumberBetween(0, randomData.moduleReviews.length - 1)
        ].text,
        userId: `User #${randomNumberBetween()}`,
        timestamp: ratingTimestamp,
      };

      ratingsData.push(ratingData);
    }

    const avgRating = ratingsData.length
      ? ratingsData.reduce(
          (accumulator, currentValue) => accumulator + currentValue.rating,
          0
        ) / ratingsData.length
      : 0;

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

const shuffledNames = [...randomData.moduleNames]; // copy original array
shuffleArray(shuffledNames);

const data = [];

for (const name of shuffledNames) {
  const genre = randomItem(randomData.moduleGenres);
  const players = randomItem(randomData.modulePlayers);
  const ratingsData = generateRatingsForModule();
  const sumRating = ratingsData.reduce((acc, r) => acc + r.rating, 0);
  const avgRating = ratingsData.length ? sumRating / ratingsData.length : 0;

  const moduleData = {
    name,
    genre,
    players,
    numRatings: ratingsData.length,
    sumRating,
    avgRating,
    difficulty: randomNumberBetween(1, 5),
    photo: photoBasedOnGenre(genre),
    timestamp: moduleTimestamp,
  };

  data.push({ moduleData, ratingsData });
}

    
    console.log(`📝 Generated module ${i + 1}:`, moduleData.name, "with", ratingsData.length, "reviews");
  }
  
  console.log("✅ Generated", data.length, "modules total");
  return data;
}
