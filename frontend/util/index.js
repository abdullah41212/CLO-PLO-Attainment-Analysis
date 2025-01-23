export function getFirstLetters(sentence) {
  return sentence
    .split(" ")
    .map((word) => word[0].toUpperCase())
    .join("");
}
