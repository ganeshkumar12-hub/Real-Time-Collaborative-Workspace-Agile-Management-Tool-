import Card from "../ui/Card";
import { CheckCircle2 } from "lucide-react";

const tasks = [
  "Complete Login UI",
  "Workspace Redesign",
  "Kanban Improvements",
  "Deploy Backend",
];

export default function UpcomingTasks() {
  return (
    <Card>
      <h2 className="text-xl font-bold mb-5">
        Upcoming Tasks
      </h2>

      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task}
            className="flex items-center gap-3"
          >
            <CheckCircle2
              size={18}
              className="text-green-400"
            />

            <span>{task}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}