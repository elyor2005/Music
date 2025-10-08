"use client";

import { useEffect, useState, Fragment } from "react";
import Image from "next/image";

type Song = {
  id: number;
  title: string;
  artist: string;
  album: string;
  genre: string;
  likes: number;
  coverUrl: string;
  previewUrl: string;
};

type Props = {
  seed: string;
  lang: string;
  likes: number;
};

export default function SongsTable({ seed, lang, likes }: Props) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [page, setPage] = useState(1);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  // fetch songs when seed/lang/likes/page changes
  useEffect(() => {
    const fetchSongs = async () => {
      const res = await fetch(`/api/songs?page=${page}&pageSize=10&seed=${seed}&lang=${lang}&likes=${likes}`);
      const data = await res.json();
      setSongs(data.songs);
      setExpandedRow(null); // collapse when page changes
    };
    fetchSongs();
  }, [page, seed, lang, likes]);

  const toggleExpand = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <div className="space-y-4 ">
      <table className="w-full h-dvh border-collapse border border-gray-200 ">
        <thead>
          <tr className="bg-gray-200 text-black">
            <th className="p-2 text-left">№</th>
            <th className="p-2 text-left">Title</th>
            <th className="p-2 text-left">Artist</th>
            <th className="p-2 text-left">Album</th>
            <th className="p-2 text-left">Genre</th>
            <th className="p-2 text-left">Likes</th>
          </tr>
        </thead>
        <tbody>
          {songs.length > 0 ? (
            songs.map((song, idx) => (
              <Fragment key={song.id}>
                <tr className="cursor-pointer hover:bg-gray-100 hover:text-black" onClick={() => toggleExpand(song.id)}>
                  <td className="p-2">{(page - 1) * 10 + (idx + 1)}</td>
                  <td className="p-2">{song.title}</td>
                  <td className="p-2">{song.artist}</td>
                  <td className="p-2">{song.album}</td>
                  <td className="p-2">{song.genre}</td>
                  <td className="p-2">{song.likes}</td>
                </tr>

                {expandedRow === song.id && (
                  <tr>
                    <td colSpan={6} className="p-4 bg-gray-50 border-t text-black">
                      <div className="flex gap-4 items-start">
                        <div className="relative w-40 h-40 border rounded overflow-hidden">
                          <Image src={song.coverUrl} alt={`${song.title} cover`} fill className="object-cover" />
                          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1">
                            {song.artist} – {song.title}
                          </div>
                        </div>
                        <div className="flex-1">
                          <audio controls src={song.previewUrl} className="mb-2 w-full" />
                          <p className="text-sm italic">{generateRandomReview(song)}</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center p-4 text-gray-500">
                No songs available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination controls */}
      <div className="flex justify-between mt-4">
        <button disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 text-black">
          Previous
        </button>
        <span className="px-2">Page {page}</span>
        <button onClick={() => setPage((p) => p + 1)} className="px-3 py-1 bg-gray-200 rounded text-black">
          Next
        </button>
      </div>
    </div>
  );
}

function generateRandomReview(song: Song): string {
  const reviews = [`“${song.title}” by ${song.artist} is a refreshing blend of style and rhythm.`, `A bold release from ${song.artist} — ${song.album} showcases raw creativity.`, `${song.title} feels both nostalgic and new, an instant classic.`, `Catchy hooks, sharp lyrics, and a beat that won’t quit.`];
  return reviews[Math.floor(Math.random() * reviews.length)];
}
