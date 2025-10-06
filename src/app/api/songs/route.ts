// /api/songs/route.ts
import { NextResponse } from "next/server";
import { Faker, en, ru, de, fr, base } from "@faker-js/faker";
import seedrandom from "seedrandom";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const seed = searchParams.get("seed") || "default";
  const count = Number(searchParams.get("count") || 100);
  const lang = searchParams.get("lang") || "en";
  const avgLikes = Number(searchParams.get("likes") || 5);

  // Pagination params
  const page = Number(searchParams.get("page") || 0);
  const pageSize = Number(searchParams.get("pageSize") || 10);

  // pick locale
  let locale;
  switch (lang) {
    case "ru":
      locale = ru;
      break;
    case "de":
      locale = de;
      break;
    case "fr":
      locale = fr;
      break;
    default:
      locale = en;
  }

  const faker = new Faker({ locale: [locale, en, base] });

  // seeded randomness
  const rng = seedrandom(seed);
  faker.seed(rng.int32());

  // helper to generate likes with fractional averages
  function generateLikes(): number {
    const floor = Math.floor(avgLikes);
    const fraction = avgLikes - floor;
    if (fraction > 0) {
      return floor + (rng() < fraction ? 1 : 0);
    }
    return floor;
  }

  // helper to generate deterministic lyrics with timestamps
  function generateLyrics(songSeed: string) {
    const localRng = seedrandom(songSeed);
    const lines = [];
    let time = 0;

    const possibleWords = ["love", "dream", "fire", "sky", "heart", "dance", "light", "night", "world", "fly", "together", "forever", "sing", "shine", "strong"];

    const lineCount = 6 + Math.floor(localRng() * 6); // 6–12 lines
    for (let i = 0; i < lineCount; i++) {
      const words = [];
      const wordCount = 3 + Math.floor(localRng() * 5); // 3–7 words
      for (let j = 0; j < wordCount; j++) {
        words.push(possibleWords[Math.floor(localRng() * possibleWords.length)]);
      }
      lines.push({ time, text: words.join(" ") });
      time += 4 + Math.floor(localRng() * 3); // advance 4–6 seconds
    }
    return lines;
  }

  // generate ALL songs
  const allSongs = Array.from({ length: count }).map((_, i) => ({
    id: `${seed}-${lang}-${i}`, // unique stable ID
    title: faker.music.songName(),
    artist: faker.person.fullName(),
    album: faker.music.album(),
    genre: faker.music.genre(),
    createdAt: faker.date.past().toISOString(),
    likes: generateLikes(),
    preview: `/api/preview?seed=${seed}&lang=${lang}&index=${i}`, // ✅ audio URL
    lyrics: generateLyrics(`${seed}-${lang}-${i}`), // ✅ synced lyrics
  }));

  // slice just the current page
  const start = page * pageSize;
  const pagedSongs = allSongs.slice(start, start + pageSize);

  return NextResponse.json({
    songs: pagedSongs,
    total: count,
    page,
    pageSize,
    totalPages: Math.ceil(count / pageSize),
  });
}
