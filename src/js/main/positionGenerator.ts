// @ts-check
import randomNumberRange from "./randomNumberRange";

export default function positionGenerator() {
  const x = randomNumberRange(-4, 4) * 10 + 5;
  const z = randomNumberRange(-4, 4) * 10 + 5;
  return { x, z };
}
