"use client";

import { Song } from "@/types";
import InfiniteScroll from "react-infinite-scroll-component";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function SongsGallery({ seed, lang, likes }: { seed: string; lang: string; likes: number }) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  async function fetchSongs(nextPage: number) {
    const res = await fetch(`/api/songs?seed=${seed}&lang=${lang}&likes=${likes}&page=${nextPage}&pageSize=20`);
    const data = await res.json();
    setSongs((prev) => [...prev, ...data.songs]);
    setHasMore(data.hasMore);
  }

  useEffect(() => {
    // reset when seed/lang/likes changes
    setSongs([]);
    setPage(0);
    fetchSongs(0);
  }, [seed, lang, likes]);

  const loadMore = () => {
    const nextPage = page + 1;
    fetchSongs(nextPage);
    setPage(nextPage);
  };

  return (
    <InfiniteScroll dataLength={songs.length} next={loadMore} hasMore={hasMore} loader={<h4 className="text-center">Loading...</h4>}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
        {songs.map((song) => (
          <div key={song.id} className="border rounded shadow p-2 bg-white text-black">
            <Image src={song.coverUrl} alt={song.album} width={200} height={200} className="w-full h-40 object-cover rounded" />
            <h3 className="font-bold mt-2">{song.title}</h3>
            <p className="text-sm text-gray-600">{song.artist}</p>
            <audio controls src={song.previewUrl} className="w-full mt-2" />
          </div>
        ))}
      </div>
    </InfiniteScroll>
  );
}
