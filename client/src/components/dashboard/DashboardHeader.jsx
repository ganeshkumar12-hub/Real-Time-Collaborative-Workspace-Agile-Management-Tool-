import { motion } from "framer-motion";
import { Sparkles, Plus } from "lucide-react";

export default function DashboardHeader({
  user,
  onCreateWorkspace,
}) {
  const hour = new Date().getHours();

  let greeting = "Good Evening";

  if (hour < 12) {
    greeting = "Good Morning";
  } else if (hour < 18) {
    greeting = "Good Afternoon";
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-10"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-blue-600/20 p-3">
            <Sparkles
              className="text-blue-400"
              size={28}
            />
          </div>

          <div>
            <h1 className="text-4xl font-bold">
              {greeting}, {user?.name || "User"} 👋
            </h1>

            <p className="mt-2 text-slate-400 text-lg">
              Welcome back! Here's what's happening with your
              workspace today.
            </p>
          </div>
        </div>

        <button
          onClick={onCreateWorkspace}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-700 transition"
        >
          <Plus size={18} />
          New Workspace
        </button>
      </div>
    </motion.div>
  );
}