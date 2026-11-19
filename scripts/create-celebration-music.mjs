// Original, seamless 16-bar wedding instrumental. No samples or external assets.
// Run with: node scripts/create-celebration-music.mjs
import { mkdirSync, writeFileSync } from 'node:fs';

const rate = 24000;
const beat = 60 / 104;
const duration = 64 * beat;
const frames = Math.round(duration * rate);
const left = new Float32Array(frames);
const right = new Float32Array(frames);
const frequency = midi => 440 * 2 ** ((midi - 69) / 12);

function note(midi, startBeat, length, gain, pan, voice = 'pluck') {
  const hz = frequency(midi);
  const seconds = length * beat;
  const tail = voice === 'pad' ? 0.5 : 1.2;
  for (let i = 0; i < (seconds + tail) * rate; i++) {
    const t = i / rate;
    const phase = 2 * Math.PI * hz * t;
    const envelope = voice === 'pad'
      ? Math.min(1, t / 0.18) * Math.min(1, Math.max(0, (seconds + tail - t) / 0.6))
      : (1 - Math.exp(-t * 120)) * Math.exp(-t * (voice === 'bass' ? 3.5 : 4.2)) * Math.min(1, (seconds + tail - t) / 0.1);
    const tone = voice === 'pad'
      ? Math.sin(phase) * 0.8 + Math.sin(phase * 2.002) * 0.12
      : Math.sin(phase) + Math.sin(phase * 2) * 0.26 * Math.exp(-t * 5) + Math.sin(phase * 3) * 0.09 * Math.exp(-t * 9);
    const sample = tone * envelope * gain;
    const index = (Math.round(startBeat * beat * rate) + i) % frames;
    left[index] += sample * Math.sqrt((1 - pan) / 2);
    right[index] += sample * Math.sqrt((1 + pan) / 2);
    // A quiet stereo echo adds room around the plucked melody.
    if (voice === 'pluck') {
      const echo = (index + Math.round(beat * 0.75 * rate)) % frames;
      left[echo] += sample * 0.13 * Math.sqrt((1 + pan) / 2);
      right[echo] += sample * 0.13 * Math.sqrt((1 - pan) / 2);
    }
  }
}

const chords = [[60,64,67], [60,65,69], [62,67,71], [60,64,67]];
const melodies = [
  [76,79,81,79,76,74,72,74], [77,81,84,81,79,77,76,72],
  [74,79,83,81,79,77,74,71], [72,76,79,76,74,72,67,72],
  [79,76,79,84,83,79,76,74], [81,77,81,84,86,84,81,77],
  [79,83,86,83,81,79,77,74], [76,79,84,79,76,74,72,72],
];
for (let bar = 0; bar < 16; bar++) {
  const chord = chords[bar % 4];
  chord.forEach((pitch, index) => note(pitch, bar * 4, 3.8, 0.026, (index - 1) * 0.5, 'pad'));
  for (let step = 0; step < 8; step++) {
    note(chord[[0,1,2,1,0,2,1,2][step]], bar * 4 + step / 2, 0.5, 0.068, -0.4);
    note(melodies[bar % 8][step], bar * 4 + step / 2, 0.7, step % 2 ? 0.075 : 0.105, 0.3);
  }
  note(chord[0] - 24, bar * 4, 1.8, 0.13, 0, 'bass');
  note(chord[2] - 24, bar * 4 + 2, 1.8, 0.10, 0, 'bass');
}
let peak = 0;
for (let i = 0; i < frames; i++) peak = Math.max(peak, Math.abs(left[i]), Math.abs(right[i]));
const bytes = Buffer.alloc(44 + frames * 4);
bytes.write('RIFF', 0); bytes.writeUInt32LE(bytes.length - 8, 4); bytes.write('WAVEfmt ', 8);
bytes.writeUInt32LE(16, 16); bytes.writeUInt16LE(1, 20); bytes.writeUInt16LE(2, 22);
bytes.writeUInt32LE(rate, 24); bytes.writeUInt32LE(rate * 4, 28);
bytes.writeUInt16LE(4, 32); bytes.writeUInt16LE(16, 34); bytes.write('data', 36); bytes.writeUInt32LE(frames * 4, 40);
for (let i = 0; i < frames; i++) {
  bytes.writeInt16LE(Math.round(left[i] / peak * 26000), 44 + i * 4);
  bytes.writeInt16LE(Math.round(right[i] / peak * 26000), 46 + i * 4);
}
mkdirSync(new URL('../public/audio/', import.meta.url), { recursive: true });
writeFileSync(new URL('../public/audio/celebration.wav', import.meta.url), bytes);
console.log(`Created ${duration.toFixed(1)}s stereo celebration loop (${bytes.length} bytes).`);
