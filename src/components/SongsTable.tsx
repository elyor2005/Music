"use client";

import React, { useState, useRef, useEffect } from "react";
import { useReactTable, getCoreRowModel, flexRender, ColumnDef } from "@tanstack/react-table";
import { ChevronDown, ChevronUp } from "lucide-react";

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

export default function SongsTable({ songs, setSongs, page, totalPages, onPageChange }: { songs: Song[]; setSongs: React.Dispatch<React.SetStateAction<Song[]>>; page: number; totalPages: number; onPageChange: (p: number) => void }) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const columns: ColumnDef<Song>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "title", header: "Title" },
    { accessorKey: "artist", header: "Artist" },
    { accessorKey: "album", header: "Album" },
    { accessorKey: "genre", header: "Genre" },
    {
      header: "Likes",
      cell: ({ row }) => {
        const song = row.original;
        return (
          <input
            type="number"
            step="0.5"
            min="0"
            max="5"
            value={song.likes}
            onChange={(e) => {
              const newLikes = Number(e.target.value);
              setSongs((prev) => prev.map((s) => (s.id === song.id ? { ...s, likes: newLikes } : s)));
            }}
            className="w-16 border rounded px-1 text-sm"
          />
        );
      },
    },
  ];

  const table = useReactTable({
    data: songs,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // sync lyrics highlight
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handler = () => setCurrentTime(audio.currentTime);
    audio.addEventListener("timeupdate", handler);
    return () => audio.removeEventListener("timeupdate", handler);
  }, [expandedRow]);

  return (
    <div className="mb-5 mt-4">
      <div className="overflow-x-auto border rounded-lg shadow-sm">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th key={header.id} className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
                <th className="px-4 py-2 text-sm font-semibold text-gray-700">Details</th>
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map((row) => (
              <React.Fragment key={row.id}>
                <tr className="hover:bg-gray-50 border-b transition">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-2 text-sm text-gray-600">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                  <td className="px-4 py-2 text-center">
                    <button onClick={() => setExpandedRow(expandedRow === row.original.id ? null : row.original.id)} className="text-gray-600 hover:text-black">
                      {expandedRow === row.original.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                  </td>
                </tr>

                {expandedRow === row.original.id && (
                  <tr>
                    <td colSpan={columns.length + 1} className="bg-gray-50 p-4">
                      <div className="flex gap-4 items-start">
                        <div
                          className="w-20 h-20 flex items-center justify-center rounded-lg shadow text-white font-bold"
                          style={{
                            backgroundColor: `hsl(${(row.original.album.charCodeAt(0) * 137.5) % 360}, 60%, 50%)`,
                          }}
                        >
                          {row.original.album.slice(0, 2).toUpperCase()}
                        </div>

                        <div className="flex-1">
                          <p className="text-gray-700 mb-2 font-semibold">Preview:</p>
                          <audio ref={audioRef} src={row.original.preview} controls className="mb-3 w-64" />

                          {row.original.lyrics && (
                            <div className="text-sm text-gray-700 max-h-40 overflow-y-auto border-l-2 pl-3">
                              {row.original.lyrics.map((line, i) => {
                                const active = currentTime >= line.time && (i === row.original.lyrics.length - 1 || currentTime < row.original.lyrics[i + 1].time);
                                return (
                                  <p key={i} className={`mb-1 ${active ? "text-blue-600 font-semibold" : ""}`}>
                                    {line.text}
                                  </p>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div className="flex justify-between items-center mt-4">
        <button onClick={() => onPageChange(page - 1)} disabled={page === 0} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 text-black">
          Previous
        </button>

        <span className="px-3 py-1 bg-gray-200 rounded text-black">
          Page {page + 1} of {totalPages}
        </span>

        <button onClick={() => onPageChange(page + 1)} disabled={page >= totalPages - 1} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 text-black">
          Next
        </button>
      </div>
    </div>
  );
}
