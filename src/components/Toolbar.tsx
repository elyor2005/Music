"use client";

type ToolbarProps = {
  params: {
    seed: string;
    lang: string;
    count: number;
    likes: number;
    view: "table" | "gallery";
  };
  onChange: (params: { seed: string; lang: string; count: number; likes: number; view: "table" | "gallery" }) => void;
};

export default function Toolbar({ params, onChange }: ToolbarProps) {
  // Generate a random 64-bit seed in hex
  function generateRandomSeed() {
    const randomSeed = BigInt.asUintN(64, BigInt(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER))).toString(16);
    onChange({ ...params, seed: randomSeed });
  }

  return (
    <div className="flex items-end justify-start gap-6 p-4 bg-gray-100 rounded-lg shadow-md flex-wrap mt-4">
      {/* Seed input with random button */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700">Seed</label>
        <div className="flex gap-2">
          <input type="text" value={params.seed} onChange={(e) => onChange({ ...params, seed: e.target.value })} className="border rounded p-1 text-black w-40" />
          <button type="button" onClick={generateRandomSeed} className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600" title="Generate random seed">
            🎲
          </button>
        </div>
      </div>

      {/* Language select */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700">Language</label>
        <select value={params.lang} onChange={(e) => onChange({ ...params, lang: e.target.value })} className="border rounded p-1 text-black">
          <option value="en">English (USA)</option>
          <option value="de">Deutsch (Germany)</option>
          <option value="uk">Українська (Ukraine)</option>
        </select>
      </div>

      {/* Count input */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700">Songs Count</label>
        <input type="number" min={1} max={200} value={params.count} onChange={(e) => onChange({ ...params, count: Number(e.target.value) })} className="border rounded p-1 text-black w-24" />
      </div>

      {/* Likes input */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700">Avg Likes</label>
        <input type="number" min={0} max={10} step={0.1} value={params.likes} onChange={(e) => onChange({ ...params, likes: Number(e.target.value) })} className="border rounded p-1 text-black w-24" />
      </div>

      {/* View Mode toggle */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700">View Mode</label>
        <div className="flex gap-3">
          <label className="flex items-center gap-1 text-sm text-gray-800">
            <input type="radio" name="view" value="table" checked={params.view === "table"} onChange={() => onChange({ ...params, view: "table" })} />
            Table
          </label>
          <label className="flex items-center gap-1 text-sm text-gray-800">
            <input type="radio" name="view" value="gallery" checked={params.view === "gallery"} onChange={() => onChange({ ...params, view: "gallery" })} />
            Gallery
          </label>
        </div>
      </div>
    </div>
  );
}
