import { FolderKanban, Users, Crown } from "lucide-react";
import { motion } from "framer-motion";

export default function WorkspaceHeader({
  workspace,
  boardCount,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700 p-8 shadow-xl"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

        {/* Left Side */}
        <div className="flex items-center gap-5">

          <div className="h-20 w-20 rounded-2xl bg-blue-600 flex items-center justify-center text-4xl shadow-lg">
            🚀
          </div>

          <div>
            <h1 className="text-4xl font-bold">
              {workspace.name}
            </h1>

            <p className="text-slate-400 mt-2 text-lg">
              Manage your team's work efficiently.
            </p>
          </div>

        </div>

        {/* Right Side */}
        <div className="flex gap-10">

          <div className="text-center">
            <Users
              className="mx-auto text-blue-400 mb-2"
              size={28}
            />

            <h2 className="text-3xl font-bold">
              {workspace.members?.length || 0}
            </h2>

            <p className="text-slate-400">
              Members
            </p>
          </div>

          <div className="text-center">
            <FolderKanban
              className="mx-auto text-green-400 mb-2"
              size={28}
            />

            <h2 className="text-3xl font-bold">
              {boardCount}
            </h2>

            <p className="text-slate-400">
              Boards
            </p>
          </div>

          <div className="text-center">
            <Crown
              className="mx-auto text-yellow-400 mb-2"
              size={28}
            />

            <h2 className="text-lg font-bold">
              {workspace.owner?.name || "Owner"}
            </h2>

            <p className="text-slate-400">
              Workspace Owner
            </p>
          </div>

        </div>

      </div>
    </motion.div>
  );
}