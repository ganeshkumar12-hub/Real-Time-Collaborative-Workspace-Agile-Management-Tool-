import { motion } from "framer-motion";
import {
  Trash2,
  ArrowRight,
  FolderKanban,
  Users,
  Calendar,
} from "lucide-react";

export default function BoardCard({
  board,
  navigate,
  handleDeleteBoard,
}) {
  return (
    <motion.div
      whileHover={{
        y: -8,
        scale: 1.02,
      }}
      transition={{ duration: 0.2 }}
      className="rounded-2xl border border-slate-700 bg-gradient-to-br from-slate-900 to-slate-800 p-6 shadow-xl"
    >
      <div className="flex justify-between">

        <div className="flex gap-4">

          <div className="h-14 w-14 rounded-xl bg-blue-600 flex items-center justify-center">
            <FolderKanban size={26} />
          </div>

          <div>

            <h3 className="text-xl font-bold">
              {board.name}
            </h3>

            <p className="text-slate-400">
              Agile Board
            </p>

          </div>

        </div>

        <button
          onClick={() =>
            handleDeleteBoard(board._id)
          }
          className="text-red-400 hover:text-red-500"
        >
          <Trash2 size={22} />
        </button>

      </div>

      <div className="mt-6 space-y-3">

        <div className="flex justify-between text-sm">

          <div className="flex items-center gap-2">

            <Users size={16} />

            <span>Members</span>

          </div>

          <span>Team</span>

        </div>

        <div className="flex justify-between text-sm">

          <div className="flex items-center gap-2">

            <Calendar size={16} />

            <span>Updated</span>

          </div>

          <span>Today</span>

        </div>

      </div>

      <div className="mt-6">

        <div className="flex justify-between mb-2">

          <span>Progress</span>

          <span>80%</span>

        </div>

        <div className="h-3 rounded-full bg-slate-700">

          <div
            className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
            style={{
              width: "80%",
            }}
          />

        </div>

      </div>

      <button
        onClick={() =>
          navigate(`/board/${board._id}`)
        }
        className="mt-6 w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-3 font-semibold flex justify-center items-center gap-2"
      >
        Open Board

        <ArrowRight size={18} />
      </button>
    </motion.div>
  );
}