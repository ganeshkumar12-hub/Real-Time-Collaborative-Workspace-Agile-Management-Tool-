import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { createWorkspace, getWorkspaces } from "../services/workspaceService";

import useAuthStore from "../store/authStore";

function Dashboard() {
  const navigate = useNavigate();

  const logout = useAuthStore((state) => state.logout);

  const [workspaces, setWorkspaces] = useState([]);
  const [workspaceName, setWorkspaceName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredWorkspaces = workspaces.filter((workspace) =>
    workspace.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalMembers = workspaces.reduce(
    (total, workspace) => total + (workspace.members?.length || 0),
    0,
  );

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

      {/* Statistics Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: "20px",
          marginTop: "20px",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            background: "#1e293b",
            padding: "20px",
            borderRadius: "12px",
            textAlign: "center",
          }}
        >
          <h3>Total Workspaces</h3>
          <h1>{workspaces.length}</h1>
        </div>

        <div
          style={{
            background: "#1e293b",
            padding: "20px",
            borderRadius: "12px",
            textAlign: "center",
          }}
        >
          <h3>Total Members</h3>
          <h1>{totalMembers}</h1>
        </div>

        <div
          style={{
            background: "#1e293b",
            padding: "20px",
            borderRadius: "12px",
            textAlign: "center",
          }}
        >
          <h3>Active Workspaces</h3>
          <h1>{workspaces.length}</h1>
        </div>
      </div>

      {/* Search */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search Workspace..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: "10px", width: "250px" }}
        />
      </div>

      {/* Create Workspace */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Workspace Name"
          value={workspaceName}
          onChange={(e) => setWorkspaceName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreateWorkspace()}
          style={{ padding: "10px", marginRight: "10px" }}
        />
        <button onClick={handleCreateWorkspace}>Create Workspace</button>
      </div>

      {/* Pending Invitations */}
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => navigate("/invitations")}
          style={{ padding: "10px 20px", cursor: "pointer" }}
        >
          📩 Pending Invitations
        </button>
      </div>

      {/* Workspace Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
          gap: "20px",
        }}
      >
        {filteredWorkspaces.map((workspace) => (
          <div
            key={workspace._id}
            onClick={() => navigate(`/workspace/${workspace._id}`)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.border = "1px solid #60a5fa";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.border = "1px solid #334155";
            }}
            style={{
              background: "#1e293b",
              padding: "20px",
              borderRadius: "12px",
              cursor: "pointer",
              border: "1px solid #334155",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
            }}
          >
            <h2>📁 {workspace.name}</h2>
            <p>Members: {workspace.members?.length}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
