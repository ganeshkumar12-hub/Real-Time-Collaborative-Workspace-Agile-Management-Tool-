import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardStats from "../components/dashboard/DashboardStats";
import WorkspaceGrid from "../components/dashboard/WorkspaceGrid";
import ActivityTimeline from "../components/dashboard/ActivityTimeline";
import UpcomingTasks from "../components/dashboard/UpcomingTasks";
import TeamMembers from "../components/dashboard/TeamMembers";

import {
  getWorkspaces,
  createWorkspace,
} from "../services/workspaceService";

import useAuthStore from "../store/authStore";

import Modal from "../components/ui/Modal";
import Button from "../components/ui/Button";

export default function Dashboard() {
  const { user } = useAuthStore();

  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openModal, setOpenModal] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");
  const [creating, setCreating] = useState(false);

  async function loadWorkspaces() {
    try {
      setLoading(true);

      const data = await getWorkspaces();
      setWorkspaces(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load workspaces");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateWorkspace() {
    if (!workspaceName.trim()) {
      toast.error("Workspace name is required");
      return;
    }

    const toastId = toast.loading("Creating workspace...");

    try {
      setCreating(true);

      await createWorkspace(workspaceName);

      toast.success("Workspace created successfully!", {
        id: toastId,
      });

      setWorkspaceName("");
      setOpenModal(false);

      await loadWorkspaces();
    } catch (error) {
      console.error(error);

      toast.error("Failed to create workspace!", {
        id: toastId,
      });
    } finally {
      setCreating(false);
    }
  }
useEffect(() => {
  toast.success("Dashboard Loaded!");
}, []);
  useEffect(() => {
    loadWorkspaces();

    // Test Toast (Remove later)
    
toast.success("Dashboard Loaded!");
  }, []);

  return (
    <div>
      <DashboardHeader
        user={user}
        onCreateWorkspace={() => setOpenModal(true)}
      />

      <DashboardStats workspaces={workspaces} />

      <WorkspaceGrid
        workspaces={workspaces}
        loading={loading}
        onRefresh={loadWorkspaces}
      />

      <div className="grid lg:grid-cols-3 gap-6 mt-10">
        <div className="lg:col-span-2">
          <ActivityTimeline />
        </div>

        <div className="space-y-6">
          <UpcomingTasks />
          <TeamMembers />
        </div>
      </div>

      <Modal open={openModal}>
        <h2 className="text-2xl font-bold mb-6">
          Create Workspace
        </h2>

        <input
          type="text"
          placeholder="Workspace Name"
          value={workspaceName}
          onChange={(e) => setWorkspaceName(e.target.value)}
          className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 mb-6 outline-none"
        />

        <div className="flex justify-end gap-3">
          <Button
            className="bg-slate-700 hover:bg-slate-600"
            onClick={() => setOpenModal(false)}
          >
            Cancel
          </Button>

          <Button
            onClick={handleCreateWorkspace}
            disabled={creating}
          >
            {creating ? "Creating..." : "Create"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}