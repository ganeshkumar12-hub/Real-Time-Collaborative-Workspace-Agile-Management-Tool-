import { useState } from "react";
import { ArrowRight, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { deleteWorkspace } from "../../services/workspaceService";
import Card from "../ui/Card";

export default function WorkspaceGrid({
  workspaces,
  loading,
  onRefresh,
}) {
  const navigate = useNavigate();
  const [deletingId, setDeletingId] = useState(null);

  if (loading) {
    return (
      <p className="text-slate-400 text-lg">
        Loading workspaces...
      </p>
    );
  }

  async function handleDelete(id, e) {
    e.stopPropagation();

    const confirmed = window.confirm(
      "Are you sure you want to delete this workspace?\n\nThis action cannot be undone."
    );

    if (!confirmed) return;

    const toastId = toast.loading("Deleting workspace...");

    try {
      setDeletingId(id);

      // Delete workspace
      await deleteWorkspace(id);

      // Refresh workspace list
      await onRefresh();

      // Show success only after refresh succeeds
      toast.success("Workspace deleted successfully!", {
        id: toastId,
      });
    } catch (error) {
      console.error("Delete Workspace Error:", error);

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to delete workspace!",
        {
          id: toastId,
        }
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <>
      <h2 className="text-2xl font-bold mb-6">
        Your Workspaces
      </h2>

      <div className="grid lg:grid-cols-3 gap-6">
        {workspaces.map((workspace) => (
          <div
            key={workspace._id}
            onClick={() => navigate(`/workspace/${workspace._id}`)}
            className="cursor-pointer"
          >
            <Card className="hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
              <div className="flex justify-end">
                <button
                  onClick={(e) => handleDelete(workspace._id, e)}
                  disabled={deletingId === workspace._id}
                  className="rounded-lg p-2 text-red-400 hover:bg-red-500/10 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <h3 className="text-xl font-bold">
                🚀 {workspace.name}
              </h3>

              <p className="text-slate-400 mt-3">
                Members: {workspace.members?.length || 0}
              </p>

              <div className="mt-6">
                <div className="flex justify-between mb-2">
                  <span>Progress</span>
                  <span>80%</span>
                </div>

                <div className="h-3 rounded-full bg-slate-700">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                    style={{ width: "80%" }}
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center text-blue-400 font-medium">
                Open Workspace
                <ArrowRight size={18} className="ml-2" />
              </div>
            </Card>
          </div>
        ))}
      </div>
    </>
  );
}