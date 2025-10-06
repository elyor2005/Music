// /pages/api/songs.ts
import { NextApiRequest, NextApiResponse } from "next";
import seedrandom from "seedrandom";

const WORD_BANK = {
  en: ["shining", "road", "echo", "dream", "river", "sky", "fire", "dance", "love", "endless"],
  de: ["glanz", "straße", "traum", "fluss", "himmel", "feuer", "tanz", "liebe", "ewig", "klang"],
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { seed = "123", lang = "en", page = "0", pageSize = "5" } = req.query;
  const rng = seedrandom(`${seed}-${page}`);

  const songs = Array.from({ length: Number(pageSize) }, (_, i) => {
    const index = Number(page) * Number(pageSize) + i + 1;

    const title = fakeTitle(rng, lang as string);
    const artist = fakeArtist(rng, lang as string);
    const album = rng() < 0.5 ? "Single" : fakeTitle(rng, lang as string);
    const genre = fakeGenre(rng);

    const lyrics = generateLyrics(`${seed}-${page}-${i}`, lang as string);

    return {
      id: `${seed}-${lang}-${index}`,
      index,
      title,
      artist,
      album,
      genre,
      likes: Math.floor(rng() * 10),
      coverUrl: `/api/cover?seed=${seed}&index=${i}&page=${page}`,
      previewUrl: `/api/preview?seed=${seed}&index=${i}&page=${page}`,
      previewDuration: 15,
      lyrics,
    };
  });

  res.json({ songs, page: Number(page), pageSize: Number(pageSize) });
}

function fakeTitle(rng: seedrandom.prng, lang: string) {
  const bank = WORD_BANK[lang] || WORD_BANK["en"];
  return `${pick(bank, rng)} ${pick(bank, rng)}`;
}

function fakeArtist(rng: seedrandom.prng, lang: string) {
  const bank = WORD_BANK[lang] || WORD_BANK["en"];
  return rng() < 0.5 ? `The ${pick(bank, rng)}s` : `${pick(bank, rng)} ${pick(bank, rng)}`;
}

function fakeGenre(rng: seedrandom.prng) {
  const genres = ["Pop", "Rock", "Jazz", "Hip-Hop", "Classical"];
  return genres[Math.floor(rng() * genres.length)];
}

function pick(arr: string[], rng: seedrandom.prng) {
  return arr[Math.floor(rng() * arr.length)];
}

// Auto-generate lyrics aligned with 3 lines
function generateLyrics(seed: string, lang: string) {
  const rng = seedrandom(seed);
  const bank = WORD_BANK[lang] || WORD_BANK["en"];
  const lines = [];
  const lineDur = 5; // seconds
  for (let i = 0; i < 3; i++) {
    const words = Array.from({ length: 4 }, () => pick(bank, rng)).join(" ");
    lines.push({ time: i * lineDur, text: words });
  }
  return lines;
}
