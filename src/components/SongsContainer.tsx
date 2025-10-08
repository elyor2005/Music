"use client";

import SongsGallery from "./SongsGallery";
import SongsTable from "./SongsTable";

export default function SongsContainer({ seed, lang, likes, view }: { seed: string; lang: string; likes: number; view: "table" | "gallery" }) {
  return <div className="space-y-10">{view === "gallery" ? <SongsGallery seed={seed} lang={lang} likes={likes} /> : <SongsTable seed={seed} lang={lang} likes={likes} />}</div>;
}
