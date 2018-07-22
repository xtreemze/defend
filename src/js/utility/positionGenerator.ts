import randomNumberRange from "./randomNumberRange";
import { mapGlobals } from "../main/globalVariables";

interface coordinates {
  x: number;
  z: number;
}

function randomNumber(): number {
  return Math.round(
    randomNumberRange(-mapGlobals.size / 25, mapGlobals.size / 25) * 10 + 15
  );
}

export default function positionGenerator(waveOrigin: number): coordinates {
  const x = ((mapGlobals.size * waveOrigin) / 35) * 10 + 5;
  const z = randomNumber();

  return { x, z };
}
