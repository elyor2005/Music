"use client";

import { useEffect, useState, useCallback } from "react";
import SongsGallery from "./SongsGallery";
import SongsTable from "./SongsTable";
import { Song } from "@/types"; // ✅ import shared type

export default function SongsContainer({ seed, lang, count, likes, view }: { seed: string; lang: string; count: number; likes: number; view: "table" | "gallery" }) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchSongs = useCallback(async () => {
    const res = await fetch(`/api/songs?seed=${seed}&lang=${lang}&count=${count}&likes=${likes}&page=${page}&pageSize=12`);
    const data = await res.json();
    setSongs(data.songs);
    setTotalPages(data.totalPages || 1);
  }, [seed, lang, count, likes, page]);

  useEffect(() => {
    fetchSongs();
  }, [fetchSongs]);

  return <div className="space-y-10">{view === "gallery" ? <SongsGallery songs={songs} setSongs={setSongs} /> : <SongsTable songs={songs} setSongs={setSongs} page={page} totalPages={totalPages} onPageChange={setPage} />}</div>;
}
