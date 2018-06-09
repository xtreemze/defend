import * as Tone from "tone";

//create a synth and connect it to the master output (your speakers)
const synth = new Tone.Synth({ volume: -25 }).toMaster();

function playNote() {
  synth.triggerAttackRelease("E4", "12n");
}

function shootAudio() {
  synth.triggerAttackRelease("A4", "42n");
}

const noise = new Tone.Noise({
  volume: -20,
  type: "brown"
}).toMaster();

const noiseControl = {
  start: function() {
    noise.start();
    Tone.Master.volume.rampTo(-12, 0.03);
  },
  stop: function() {
    //so it doesn't click
    Tone.Master.volume.rampTo(-Infinity, 0.05);
  }
};

let frequency = new Tone.Signal(0.5);
//the move the 0 to 1 value into frequency range
let scale = new Tone.ScaleExp(110, 440);

//multiply the frequency by 2.5 to get a 10th above
let mult = new Tone.Multiply(2.5);

const signal = () => {
  //initially muted
  Tone.Master.mute = true;
  //use this to pan the two oscillators hard left/right
  var merge = new Tone.Merge().toMaster();
  //two oscillators panned hard left / hard right
  var rightOsc = new Tone.Oscillator({
    type: "sawtooth",
    volume: -20
  })
    .connect(merge.right)
    .start();
  var leftOsc = new Tone.Oscillator({
    type: "square",
    volume: -20
  })
    .connect(merge.left)
    .start();
  //create an oscillation that goes from 0 to 1200
  //connection it to the detune of the two oscillators
  var detuneLFO = new Tone.LFO({
    type: "square",
    min: 0,
    max: 1200
  })
    .fan(rightOsc.detune, leftOsc.detune)
    .start();
  //the frequency signal

  //chain the components together
  frequency.chain(scale, mult);
  scale.connect(rightOsc.frequency);
  mult.connect(leftOsc.frequency);
  //multiply the frequency by 2 to get the octave above
  var detuneScale = new Tone.Scale(14, 4);
  frequency.chain(detuneScale, detuneLFO.frequency);
};

// GUI //
const signalControl = {
  set: function(value: number) {
    frequency.rampTo(value, 0.8);
    Tone.Master.volume.rampTo(-value * 20, 0.8);
  },
  start: function() {
    Tone.Master.volume.rampTo(-120, 0.8);
    Tone.Master.mute = false;
  },
  stop: function() {
    Tone.Master.mute = true;
  },
  name: "frequency",
  min: 0,
  max: 1,
  exp: 0.5,
  value: 0.5,
  position: 5
};

// signal();

export { playNote, shootAudio, noiseControl, signalControl };
