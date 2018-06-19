// @ts-check
import randomNumberRange from "./randomNumberRange";
import { mapGlobals } from "./globalVariables";

export default function positionGenerator() {
  const x =
    randomNumberRange(-mapGlobals.size / 100, mapGlobals.size / 100) * 10 + 5;
  const z =
    randomNumberRange(-mapGlobals.size / 100, mapGlobals.size / 100) * 10 + 5;
  return { x, z };
}
