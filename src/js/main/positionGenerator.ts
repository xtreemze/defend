import randomNumberRange from "./randomNumberRange";
import { mapGlobals } from "./globalVariables";

interface coordinates {
  x: number;
  z: number;
}

export default function positionGenerator(): coordinates {
  const x =
    randomNumberRange(-mapGlobals.size / 100, mapGlobals.size / 100) * 10 + 5;
  const z =
    randomNumberRange(-mapGlobals.size / 100, mapGlobals.size / 100) * 10 + 5;
  return { x, z };
}
