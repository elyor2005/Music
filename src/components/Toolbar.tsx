"use client";

type ToolbarProps = {
  seed: string;
  onSeedChange: (seed: string) => void;
  onSeedReset: () => void;
  lang: string;
  onLangChange: (lang: string) => void;
  likes: number;
  onLikesChange: (likes: number) => void;
  view: "table" | "gallery";
  onViewChange: (view: "table" | "gallery") => void;
};

export default function Toolbar({ seed, onSeedChange, onSeedReset, lang, onLangChange, likes, onLikesChange, view, onViewChange }: ToolbarProps) {
  return (
    <div className="flex flex-wrap gap-4 items-center bg-gray-100 p-4 rounded-md shadow text-black">
      {/* Seed input */}
      <div className="flex items-center gap-2">
        <label className="font-medium">Seed:</label>
        <input type="text" value={seed} onChange={(e) => onSeedChange(e.target.value)} className="border px-2 py-1 rounded" placeholder="Enter seed..." />
        <button onClick={onSeedReset} className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400">
          Reset
        </button>
      </div>

      {/* Language selector */}
      <div className="flex items-center gap-2">
        <label className="font-medium">Language:</label>
        <select value={lang} onChange={(e) => onLangChange(e.target.value)} className="border px-2 py-1 rounded">
          <option value="en">English</option>
          <option value="ru">Русский</option>
        </select>
      </div>

      {/* Likes selector */}
      <div className="flex items-center gap-2">
        <label className="font-medium">Likes:</label>
        <input type="number" value={likes} step="0.5" min="0" onChange={(e) => onLikesChange(Number(e.target.value))} className="border px-2 py-1 rounded w-20" />
      </div>

      {/* View toggle */}
      <div className="flex items-center gap-2">
        <label className="font-medium">View:</label>
        <select value={view} onChange={(e) => onViewChange(e.target.value as "table" | "gallery")} className="border px-2 py-1 rounded">
          <option value="table">Table</option>
          <option value="gallery">Gallery</option>
        </select>
      </div>
    </div>
  );
}
