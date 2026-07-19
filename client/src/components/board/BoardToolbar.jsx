import { Search, Plus } from "lucide-react";
import { motion } from "framer-motion";

export default function BoardToolbar({
  searchQuery,
  setSearchQuery,
  listTitle,
  setListTitle,
  handleCreateList,
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-lg"
    >
      <div className="flex flex-col lg:flex-row gap-4 justify-between">

        {/* Search */}

        <div className="relative flex-1">
          <Search
            size={20}
            className="absolute left-4 top-3.5 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery(e.target.value)
            }
            className="w-full rounded-xl bg-slate-800 border border-slate-700 pl-12 pr-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        {/* Create List */}

        <div className="flex gap-3">

          <input
            type="text"
            placeholder="New List"
            value={listTitle}
            onChange={(e) =>
              setListTitle(e.target.value)
            }
            onKeyDown={(e) =>
              e.key === "Enter" &&
              handleCreateList()
            }
            className="rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 outline-none focus:border-blue-500"
          />

          <button
            onClick={handleCreateList}
            className="rounded-xl bg-blue-600 hover:bg-blue-500 px-5 py-3 flex items-center gap-2 font-semibold"
          >
            <Plus size={18} />

            Add List
          </button>

        </div>

      </div>
    </motion.div>
  );
}