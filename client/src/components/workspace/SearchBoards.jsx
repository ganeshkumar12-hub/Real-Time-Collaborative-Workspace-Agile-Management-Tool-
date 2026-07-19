import { Search } from "lucide-react";

export default function SearchBoards({
  search,
  setSearch,
}) {
  return (
    <div className="relative mb-8">
      <Search
        className="absolute left-4 top-3.5 text-slate-400"
        size={20}
      />

      <input
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        placeholder="Search boards..."
        className="w-full rounded-xl bg-slate-900 border border-slate-700 pl-12 pr-4 py-3 outline-none focus:border-blue-500"
      />
    </div>
  );
}