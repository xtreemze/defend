import randomNumberRange from "./randomNumberRange";
import { mapGlobals } from "../main/globalVariables";

interface coordinates {
  x: number;
  z: number;
}

function randomNumber(): number {
  return Math.round(
    randomNumberRange(-mapGlobals.size / 30, mapGlobals.size / 30) * 10 + 5
  );
}

export default function positionGenerator(): coordinates {
  const x = randomNumber();

  const z = randomNumber();
  return { x, z };
}
