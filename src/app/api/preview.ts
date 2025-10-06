// /pages/api/preview.ts
import { NextApiRequest, NextApiResponse } from "next";
import seedrandom from "seedrandom";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { seed = "123", index = "0", page = "0" } = req.query;

  const rng = seedrandom(`${seed}-${index}-${page}`);

  const sampleRate = 22050; // Hz
  const duration = 5; // shorten for testing
  const samples = sampleRate * duration;

  // WAV buffer: header (44 bytes) + samples*2 bytes (16-bit mono)
  const wavBuffer = new ArrayBuffer(44 + samples * 2);
  const view = new DataView(wavBuffer);

  // WAV header
  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + samples * 2, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true); // PCM chunk size
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true); // byte rate
  view.setUint16(32, 2, true); // block align
  view.setUint16(34, 16, true); // bits per sample
  writeString(view, 36, "data");
  view.setUint32(40, samples * 2, true);

  // Generate audio samples
  const bpm = 100 + Math.floor(rng() * 40);
  const beat = 60 / bpm;
  const freqs = [220, 247, 262, 294, 330, 349, 392];

  for (let i = 0; i < samples; i++) {
    const t = i / sampleRate;

    // choose a note every half beat
    const noteIndex = Math.floor(t / (beat / 2)) % freqs.length;
    const freq = freqs[noteIndex];

    // envelope (simple saw shape)
    const env = 1 - (t % beat) / beat;
    let sample = Math.sin(2 * Math.PI * freq * t) * env * 0.6;

    // scale to int16
    const s = Math.max(-1, Math.min(1, sample));
    view.setInt16(44 + i * 2, s * 32767, true);
  }

  res.setHeader("Content-Type", "audio/wav");
  res.send(Buffer.from(wavBuffer));
}

function writeString(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}
