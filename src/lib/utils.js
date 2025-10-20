export function randomNumberBetween(min = 0, max = 1000) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function getRandomDateBefore(startingDate = new Date()) {
  const randomNumberOfDays = randomNumberBetween(20, 80);
  const randomDate = new Date(
    startingDate - randomNumberOfDays * 24 * 60 * 60 * 1000
  );
  return randomDate;
}

export function getRandomDateAfter(startingDate = new Date()) {
  const randomNumberOfDays = randomNumberBetween(1, 19);
  const randomDate = new Date(
    startingDate.getTime() + randomNumberOfDays * 24 * 60 * 60 * 1000
  );
  return randomDate;
}

export function photoBasedOnGenre(genre) {
  const baseUrl = "https://storage.googleapis.com/firestorequickstarts.appspot.com/modules";

  // normalize genre name
  const lower = genre.toLowerCase();

  // number of images per genre (adjust if some genres have more/less)
  const genreCounts = {
    horror: 12,
    fantasy: 6,
    scifi: 6,
    comedy: 6,
    romance: 6,
    adventure: 6,
    noir: 6,
    action: 6,
    western: 6
  };

  // if genre isn’t listed, use default
  const max = genreCounts[lower] || 1;
  const index = Math.floor(Math.random() * max) + 1;

  return `${baseUrl}/${lower}/${lower}${index}.png`;
}
