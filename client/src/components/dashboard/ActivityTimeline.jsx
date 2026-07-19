import Card from "../ui/Card";
import { Clock3 } from "lucide-react";

const activities = [
  {
    user: "Ganesh",
    action: "created a new workspace",
    time: "2 min ago",
  },
  {
    user: "Rahul",
    action: "moved a task to Done",
    time: "15 min ago",
  },
  {
    user: "Sai",
    action: "commented on Project Alpha",
    time: "1 hour ago",
  },
];

export default function ActivityTimeline() {
  return (
    <Card>
      <h2 className="text-xl font-bold mb-5">
        Recent Activity
      </h2>

      <div className="space-y-5">
        {activities.map((item, index) => (
          <div key={index} className="flex gap-4">
            <div className="mt-1">
              <Clock3 size={18} className="text-blue-400" />
            </div>

            <div>
              <p>
                <span className="font-semibold">{item.user}</span>{" "}
                {item.action}
              </p>

              <p className="text-sm text-slate-400">
                {item.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}