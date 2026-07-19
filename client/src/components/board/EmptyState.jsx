import { ClipboardList, Plus } from "lucide-react";
import { motion } from "framer-motion";

export default function EmptyState({ onCreateList }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-900 py-20 px-6 text-center"
    >
      <ClipboardList
        size={70}
        className="text-slate-500 mb-6"
      />

      <h2 className="text-2xl font-bold mb-3">
        No Lists Yet
      </h2>

      <p className="text-slate-400 max-w-md mb-8">
        Create your first list to start organizing tasks,
        assign team members, and collaborate in real time.
      </p>

      <button
        onClick={onCreateList}
        className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-6 py-3 font-semibold transition"
      >
        <Plus size={18} />
        Create First List
      </button>
    </motion.div>
  );
}