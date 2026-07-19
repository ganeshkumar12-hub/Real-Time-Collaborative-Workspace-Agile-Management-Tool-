import axios from "axios";

const API_URL = "http://localhost:5000/api/workspaces";

export const getWorkspaces = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const createWorkspace = async (name) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    API_URL,
    { name },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
export const deleteWorkspace = async (id) => {
  const token = localStorage.getItem("token");

  const response = await axios.delete(
    `${API_URL}/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};