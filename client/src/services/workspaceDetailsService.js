import axios from "axios";

const API_URL =
  "http://localhost:5000/api/workspaces";

export const getWorkspaceById =
  async (id) => {
    const token =
      localStorage.getItem("token");

    const response =
      await axios.get(
        `${API_URL}/${id}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return response.data;
  };