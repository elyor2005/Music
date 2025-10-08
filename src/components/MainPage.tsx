"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Toolbar from "./Toolbar";
import SongsContainer from "./SongsContainer";

function generateRandomSeed() {
  return Math.random().toString(36).substring(2, 10);
}

export default function MainPage() {
  const router = useRouter();
  const params = useSearchParams();

  const [seed, setSeed] = useState(params.get("seed") || generateRandomSeed());
  const [lang, setLang] = useState(params.get("lang") || "en");
  const [likes, setLikes] = useState(Number(params.get("likes")) || 0);
  const [view, setView] = useState<"table" | "gallery">((params.get("view") as "table" | "gallery") || "table");

  // keep query string in sync
  useEffect(() => {
    const search = new URLSearchParams({
      seed,
      lang,
      likes: likes.toString(),
      view,
    });
    router.replace("?" + search.toString());
  }, [seed, lang, likes, view, router]);

  return (
    <div className="p-6 space-y-6">
      <Toolbar seed={seed} onSeedChange={setSeed} onSeedReset={() => setSeed(generateRandomSeed())} lang={lang} onLangChange={setLang} likes={likes} onLikesChange={setLikes} view={view} onViewChange={setView} />
      <SongsContainer seed={seed} lang={lang} likes={likes} view={view} />
    </div>
  );
}
