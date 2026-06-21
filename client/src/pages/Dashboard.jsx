import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { createWorkspace, getWorkspaces } from "../services/workspaceService";
import useAuthStore from "../store/authStore";

function Dashboard() {
  const navigate = useNavigate();

  const logout = useAuthStore((state) => state.logout);

  const [workspaces, setWorkspaces] = useState([]);

  const [workspaceName, setWorkspaceName] = useState("");

  useEffect(() => {
    const loadWorkspaces = async () => {
      try {
        const data = await getWorkspaces();

        setWorkspaces(data);
      } catch (error) {
        console.log(error);
      }
    };

    loadWorkspaces();
  }, []);

  const handleCreateWorkspace = async () => {
    if (!workspaceName) return;

    try {
      const newWorkspace = await createWorkspace(workspaceName);

      setWorkspaces([...workspaces, newWorkspace]);

      setWorkspaceName("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        padding: "30px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Workspace Dashboard</h1>

        <button onClick={handleLogout}>Logout</button>
      </div>

      <hr />

      <div
        style={{
          marginTop: "20px",
          marginBottom: "20px",
        }}
      >
        <input
          type="text"
          placeholder="Workspace Name"
          value={workspaceName}
          onChange={(e) => setWorkspaceName(e.target.value)}
        />

        <button onClick={handleCreateWorkspace}>Create Workspace</button>
      </div>

      <h3>Total Workspaces: {workspaces.length}</h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
          gap: "20px",
        }}
      >
        {workspaces.map((workspace) => (
          <div
            key={workspace._id}
            onClick={() => navigate(`/workspace/${workspace._id}`)}
            style={{
              background: "#1e293b",
              padding: "20px",
              borderRadius: "12px",
              cursor: "pointer",
            }}
          >
            <h2>{workspace.name}</h2>

            <p>Members: {workspace.members?.length}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
