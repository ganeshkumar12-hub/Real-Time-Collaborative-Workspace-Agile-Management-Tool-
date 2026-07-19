import { Activity } from "lucide-react";
import { motion } from "framer-motion";

export default function ActivityPanel({
  activities,
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-lg"
    >
      <div className="flex items-center gap-2 mb-4">
        <Activity
          size={20}
          className="text-cyan-400"
        />

        <h2 className="text-lg font-semibold">
          Activity Feed
        </h2>
      </div>

      <div className="space-y-3">
        {activities.length === 0 ? (
          <p className="text-slate-400">
            No activity
          </p>
        ) : (
          activities
            .slice(0, 10)
            .map((activity) => (
              <div
                key={activity._id}
                className="rounded-xl bg-slate-800 p-3"
              >
                {activity.action}
              </div>
            ))
        )}
      </div>
    </motion.div>
  );
}