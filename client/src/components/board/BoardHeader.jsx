import { motion } from "framer-motion";
import { LayoutDashboard, Users } from "lucide-react";

export default function BoardHeader({
  title = "Project Board",
  onlineUsers = [],
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-slate-700 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 shadow-xl"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-blue-600 flex items-center justify-center">
            <LayoutDashboard size={30} />
          </div>

          <div>
            <h1 className="text-3xl font-bold">{title}</h1>

            <p className="text-slate-400">
              Collaborate with your team in real time.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Users className="text-green-400" size={22} />

          <span className="text-slate-300">
            {onlineUsers.length} Online
          </span>

          <div className="flex -space-x-2">
            {onlineUsers.slice(0, 5).map((user) => (
              <div
                key={user.id}
                className="h-10 w-10 rounded-full bg-blue-600 border-2 border-slate-900 flex items-center justify-center font-bold"
              >
                {user.name?.charAt(0).toUpperCase()}
              </div>
            ))}

            {onlineUsers.length > 5 && (
              <div className="h-10 w-10 rounded-full bg-slate-700 border-2 border-slate-900 flex items-center justify-center text-sm">
                +{onlineUsers.length - 5}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}