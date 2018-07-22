import randomNumberRange from "./randomNumberRange";
import { mapGlobals } from "../main/globalVariables";

interface coordinates {
  x: number;
  z: number;
}

function randomNumber(): number {
  return Math.round(
    randomNumberRange(-mapGlobals.size / 35, mapGlobals.size / 35) * 10 + 5
  );
}

export default function positionGenerator(waveOrigin: number): coordinates {
  const x = ((mapGlobals.size * waveOrigin) / 25) * 10 + 5;
  const z = randomNumber();

  return { x, z };
}
