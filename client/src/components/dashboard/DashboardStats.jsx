import {
  FolderKanban,
  Users,
  ClipboardList,
  Activity,
} from "lucide-react";

import StatCard from "../ui/StatCard";

export default function DashboardStats({
  workspaces,
}) {

  const workspaceCount = workspaces.length;

  const memberCount = workspaces.reduce(
    (total, workspace) =>
      total + (workspace.members?.length || 0),
    0
  );

  const boardCount = workspaces.reduce(
    (total, workspace) =>
      total + (workspace.boards?.length || 0),
    0
  );

  return (

    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 mb-10">

      <StatCard
        title="Workspaces"
        value={workspaceCount}
        icon={<FolderKanban size={38} />}
      />

      <StatCard
        title="Members"
        value={memberCount}
        icon={<Users size={38} />}
      />

      <StatCard
        title="Boards"
        value={boardCount}
        icon={<ClipboardList size={38} />}
      />

      <StatCard
        title="Active"
        value={`${workspaceCount}`}
        icon={<Activity size={38} />}
      />

    </div>

  );
}