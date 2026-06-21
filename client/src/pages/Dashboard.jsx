import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import useAuthStore from "../store/authStore";
import { getWorkspaces } from "../services/workspaceService";

function Dashboard() {
  const navigate = useNavigate();

  const logout = useAuthStore(
    (state) => state.logout
  );

  const [workspaces, setWorkspaces] =
    useState([]);

  useEffect(() => {
    const loadWorkspaces = async () => {
      try {
        console.log(
          "TOKEN:",
          localStorage.getItem("token")
        );

        const data =
          await getWorkspaces();

        console.log(
          "WORKSPACES:",
          data
        );

        setWorkspaces(data);
      } catch (error) {
        console.log(
          "WORKSPACE ERROR:",
          error
        );

        console.log(
          error.response?.data
        );
      }
    };

    loadWorkspaces();
  }, []);

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
          justifyContent:
            "space-between",
          alignItems: "center",
        }}
      >
        <h1>
          Workspace Dashboard
        </h1>

        <button onClick={handleLogout}>
          Logout
        </button>
      </div>

      <hr />

      <button
        style={{
          padding: "10px 20px",
          marginTop: "20px",
          marginBottom: "20px",
        }}
      >
        + Create Workspace
      </button>

      <h3>
        Total Workspaces:
        {" "}
        {workspaces.length}
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(250px,1fr))",
          gap: "20px",
        }}
      >
        {workspaces.map(
          (workspace) => (
            <div
              key={workspace._id}
              style={{
                background:
                  "#1e293b",
                padding: "20px",
                borderRadius:
                  "12px",
              }}
            >
              <h2>
                {workspace.name}
              </h2>

              <p>
                Members:
                {" "}
                {
                  workspace
                    .members
                    .length
                }
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default Dashboard;