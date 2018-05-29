// @ts-check

/**
 * Returns a random interger from a given range.
 * @param {number} Min
 * @param {number} Max
 * @returns {number}
 */
export default function randomNumberRange(Min = 0, Max = 10) {
  return Math.floor(Math.random() * (Max - Min + 1)) + Min;
}
