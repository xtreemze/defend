/*~ If there are types, properties, or methods inside dotted names
 *~ of the module, declare them inside a 'namespace'.
 */
export = FX;
declare interface audioParams {
  /**
   * Attack time for the volume of the sound to go from silence to maximum level.
   *
   * @type {number}
   * @memberof audioParams
   */
  attack?: number;

  /**
   * Time it takes for the sound pressure level to drop in level by 60 dB from its original strength.
   *
   * @type {number}
   * @memberof audioParams
   */
  decay?: number;

  /**
   * The act of letting a musical note ring or sound out without cutting it off. In keyboard and synthesizer envelopes such as an ADSR the sustain parameter determines how loud a sound will ring out while the note is held.
   *
   * @type {number}
   * @memberof audioParams
   */
  sustain?: number;

  /**
   * The amount of time it takes for a processor, such as a compressor or gate to cease operating on a signal after the threshold is crossed. With a shorter or fast release time, the processor will “let go” of the signal more quickly after the threshold is crossed, a longer or slow release time will allow the processor to continue to operate on the signal for a certain period of time after the threshold is crossed.
   *
   * @type {number}
   * @memberof audioParams
   */
  release?: number;

  /**
   * How loud a sound will ring out while the note is held
   *
   * @type {number}
   * @memberof audioParams
   */
  sustainLevel?: number;

  frequency?: number;

  /**
   * A smooth variation in frequency from low to high, or vice versa.
   *
   * @type {number}
   * @memberof audioParams
   */
  sweep?: number;

  /**
   * Repeat
   *
   * @type {number}
   * @memberof audioParams
   */
  repeat?: number;
  jumpAt1?: number;
  jumpBy1?: number;
  jumpAt2?: number;
  jumpBy2?: number;

  volume?: number;
  source?: string;
  harmonics?: number;
  pulseWidth?: number;

  bitcrush?: number;
  tremolo?: number;
  tremoloFreq?: number;
  vibrato?: number;
  vibratoFreq?: number;

  lowpass?: number;
  lowpassSweep?: number;
  highpass?: number;
  highpassSweep?: number;
  bandpass?: number;
  bandpassQ?: number;
  bandpassSweep?: number;

  compressorThreshold?: number;

  soundX?: number;
  soundY?: number;
  soundZ?: number;
  rolloff?: number;
  refDistance?: number;
}

declare function FX(audioParams: audioParams);
declare namespace FX {
  //   /*~ For example, given this definition, someone could write:
  //      *~   import { subProp } from 'yourModule';
  //      *~   subProp.foo();
  //      *~ or
  //      *~   import * as yourMod from 'yourModule';
  //      *~   yourMod.subProp.foo();
  //      */

  export interface audioParams {
    /**
     * Attack time for the volume of the sound to go from silence to maximum level.
     *
     * @type {number}
     * @memberof audioParams
     */
    attack?: number;

    /**
     * Time it takes for the sound pressure level to drop in level by 60 dB from its original strength.
     *
     * @type {number}
     * @memberof audioParams
     */
    decay?: number;

    /**
     * The act of letting a musical note ring or sound out without cutting it off. In keyboard and synthesizer envelopes such as an ADSR the sustain parameter determines how loud a sound will ring out while the note is held.
     *
     * @type {number}
     * @memberof audioParams
     */
    sustain?: number;

    /**
     * The amount of time it takes for a processor, such as a compressor or gate to cease operating on a signal after the threshold is crossed. With a shorter or fast release time, the processor will “let go” of the signal more quickly after the threshold is crossed, a longer or slow release time will allow the processor to continue to operate on the signal for a certain period of time after the threshold is crossed.
     *
     * @type {number}
     * @memberof audioParams
     */
    release?: number;

    /**
     * How loud a sound will ring out while the note is held
     *
     * @type {number}
     * @memberof audioParams
     */
    sustainLevel?: number;

    frequency?: number;

    /**
     * A smooth variation in frequency from low to high, or vice versa.
     *
     * @type {number}
     * @memberof audioParams
     */
    sweep?: number;

    /**
     * Repeat
     *
     * @type {number}
     * @memberof audioParams
     */
    repeat?: number;
    jumpAt1?: number;
    jumpBy1?: number;
    jumpAt2?: number;
    jumpBy2?: number;

    volume?: number;
    source?: string;
    harmonics?: number;
    pulseWidth?: number;

    bitcrush?: number;
    tremolo?: number;
    tremoloFreq?: number;
    vibrato?: number;
    vibratoFreq?: number;

    lowpass?: number;
    lowpassSweep?: number;
    highpass?: number;
    highpassSweep?: number;
    bandpass?: number;
    bandpassQ?: number;
    bandpassSweep?: number;

    compressorThreshold?: number;

    soundX?: number;
    soundY?: number;
    soundZ?: number;
    rolloff?: number;
    refDistance?: number;
  }

  /**
   * Play Sound
   * @param audioParams
   */
  export function play(settings: audioParams): void;

  /**
   * Sets listener position
   * @param x
   * @param y
   * @param z
   */
  export function setListenerPosition(x: number, y: number, z: number): void;
  export function setListenerAngle(degrees: number): void;

  /**
   * Sets volume
   * @param number
   */
  export function setVolume(number: number): void;
  export const _tone;
  export function getDefaults();
}
