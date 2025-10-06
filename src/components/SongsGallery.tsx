"use client";

type Song = {
  id: string;
  title: string;
  artist: string;
  album: string;
  likes: number;
  preview: string;
  lyrics: { time: number; text: string }[];
};

export default function SongsGallery({ songs, setSongs }: { songs: Song[]; setSongs: React.Dispatch<React.SetStateAction<Song[]>> }) {
  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {songs.map((song) => (
          <div key={song.id} className="bg-white rounded-lg shadow hover:shadow-lg p-3 transition">
            <div
              className="w-full h-40 rounded-lg flex items-center justify-center text-white font-bold text-lg"
              style={{
                backgroundColor: `hsl(${(song.album.charCodeAt(0) * 137.5) % 360}, 60%, 50%)`,
              }}
            >
              {song.album.slice(0, 2).toUpperCase()}
            </div>

            <div className="mt-3">
              <h3 className="text-sm font-semibold text-gray-900 truncate">{song.title}</h3>
              <p className="text-xs text-gray-600 truncate">{song.artist}</p>
            </div>

            {/* Editable Likes */}
            <div className="mt-2 text-xs text-gray-700">
              ❤️ {song.likes} likes
              <input
                type="range"
                min="0"
                max="5"
                step="0.5"
                value={song.likes}
                onChange={(e) => {
                  const newLikes = Number(e.target.value);
                  setSongs((prev) => prev.map((s) => (s.id === song.id ? { ...s, likes: newLikes } : s)));
                }}
                className="w-full mt-1"
              />
            </div>

            {/* Audio Preview */}
            <div className="mt-2">
              <audio src={song.preview} controls className="w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
