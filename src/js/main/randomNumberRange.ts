/**
 * Returns a random interger from a given range.
 */
export default function randomNumberRange(Min = 0, Max = 10): number {
  return Math.floor(Math.random() * (Max - Min + 1)) + Min;
}
