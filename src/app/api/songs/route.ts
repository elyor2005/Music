import { NextResponse } from "next/server";
import { Faker, en, ru, base } from "@faker-js/faker";
import seedrandom from "seedrandom";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const seed = searchParams.get("seed") || "default";
  const lang = searchParams.get("lang") || "en";
  const avgLikes = Number(searchParams.get("likes") || 5);

  const page = Number(searchParams.get("page") || 0);
  const pageSize = Number(searchParams.get("pageSize") || 10);

  let locale;
  switch (lang) {
    case "ru":
      locale = ru;
      break;
    default:
      locale = en;
  }

  const faker = new Faker({ locale: [locale, en, base] });
  const rng = seedrandom(seed);
  faker.seed(rng.int32());

  const previewSamples = ["https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"];

  const total = 200;
  const allSongs = Array.from({ length: total }, (_, i) => ({
    id: i + 1,
    title: faker.music.songName(),
    artist: faker.person.fullName(),
    album: faker.music.genre(),
    genre: faker.music.genre(),
    likes: Math.floor(Math.max(0, faker.number.float({ min: 0, max: avgLikes }))),
    coverUrl: faker.image.urlPicsumPhotos({ width: 200, height: 200 }), //
    previewUrl: faker.helpers.arrayElement(previewSamples), //
    createdAt: faker.date.past(),
  }));

  // Pagination slice
  const start = page * pageSize;
  const end = start + pageSize;
  const songs = allSongs.slice(start, end);

  return NextResponse.json({
    songs,
    total,
    page,
    pageSize,
    hasMore: end < total,
  });
}
