import { Wifi } from "lucide-react";
import { motion } from "framer-motion";

export default function OnlineUsers({
  onlineUsers,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-lg"
    >
      <div className="flex items-center gap-2 mb-4">
        <Wifi
          size={20}
          className="text-green-400"
        />

        <h2 className="text-lg font-semibold">
          Online Users
        </h2>
      </div>

      {onlineUsers.length === 0 ? (
        <p className="text-slate-400">
          No users online
        </p>
      ) : (
        <div className="space-y-3">
          {onlineUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-3 rounded-xl bg-slate-800 p-3"
            >
              <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center font-bold">
                {user.name?.charAt(0).toUpperCase()}
              </div>

              <div className="flex-1">
                <p className="font-medium">
                  {user.name}
                </p>

                <p className="text-xs text-green-400">
                  ● Online
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}