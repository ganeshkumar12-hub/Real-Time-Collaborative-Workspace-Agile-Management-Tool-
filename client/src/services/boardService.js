import axios from "axios";

const API_URL =
  "http://localhost:5000/api/boards";

export const getBoardsByWorkspace =
  async (workspaceId) => {
    const token =
      localStorage.getItem("token");

    const response =
      await axios.get(
        `${API_URL}/workspace/${workspaceId}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return response.data;
  };

export const createBoard =
  async (
    name,
    workspaceId
  ) => {
    const token =
      localStorage.getItem("token");

    const response =
      await axios.post(
        API_URL,
        {
          name,
          workspaceId,
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return response.data;
  };

export const deleteBoard =
  async (boardId) => {
    const token =
      localStorage.getItem("token");

    const response =
      await axios.delete(
        `${API_URL}/${boardId}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return response.data;
  };