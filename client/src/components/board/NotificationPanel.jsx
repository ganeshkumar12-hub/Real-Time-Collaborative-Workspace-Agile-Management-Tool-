import { Bell } from "lucide-react";
import { motion } from "framer-motion";

export default function NotificationPanel({
  notifications,
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-lg"
    >
      <div className="flex items-center gap-2 mb-4">
        <Bell
          size={20}
          className="text-yellow-400"
        />

        <h2 className="text-lg font-semibold">
          Notifications
        </h2>
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <p className="text-slate-400">
            No notifications
          </p>
        ) : (
          notifications
            .slice(0, 5)
            .map((notification) => (
              <div
                key={notification._id}
                className="rounded-xl bg-slate-800 p-3"
              >
                {notification.message}
              </div>
            ))
        )}
      </div>
    </motion.div>
  );
}