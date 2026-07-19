import {
  LayoutDashboard,
  FolderKanban,
  Bell,
} from "lucide-react";

import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="w-72 min-h-screen bg-[#0f172a] border-r border-slate-800">

      {/* Logo */}
      <div className="px-8 pt-8 pb-10">
        <h1 className="text-5xl font-extrabold tracking-tight text-blue-500">
          Workspace
        </h1>

        <p className="mt-3 text-2xl text-slate-400">
          Agile Management
        </p>
      </div>

      {/* Navigation */}
      <nav className="px-4 flex flex-col gap-5">

        <SidebarItem
          icon={<LayoutDashboard size={24} />}
          title="Dashboard"
          active={location.pathname === "/dashboard"}
          onClick={() => navigate("/dashboard")}
        />

        <SidebarItem
          icon={<FolderKanban size={24} />}
          title="Workspaces"
          active={location.pathname === "/dashboard"}
          onClick={() => navigate("/dashboard")}
        />

        <SidebarItem
          icon={<Bell size={24} />}
          title="Invitations"
          active={location.pathname === "/invitations"}
          onClick={() => navigate("/invitations")}
        />

      </nav>

    </aside>
  );
}

function SidebarItem({
  icon,
  title,
  onClick,
  active = false,
}) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-5
        w-full
        rounded-3xl
        px-6
        py-5
        text-lg
        font-medium
        transition-all
        duration-300

        ${
          active
            ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg"
            : "bg-slate-800/40 text-slate-300 hover:bg-slate-800 hover:text-white"
        }
      `}
    >
      {icon}
      <span>{title}</span>
    </button>
  );
}