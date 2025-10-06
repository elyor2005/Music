"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import SongsGallery from "./SongsGallery";
import SongsTable from "./SongsTable";

type Song = {
  id: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  likes: number;
  preview: string;
  lyrics: { time: number; text: string }[];
};

export default function SongsContainer({ seed, lang, count, likes }: { seed: string; lang: string; count: number; likes: number }) {
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

  return (
    <div className="space-y-10">
      <SongsGallery songs={songs} setSongs={setSongs} />
      <SongsTable songs={songs} setSongs={setSongs} page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
