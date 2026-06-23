import axios from "axios";

const API_URL =
  "http://localhost:5000/api/lists";

export const getListsByBoard =
  async (boardId) => {
    const token =
      localStorage.getItem("token");

    const response =
      await axios.get(
        `${API_URL}/board/${boardId}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return response.data;
  };

export const createList =
  async (
    title,
    boardId
  ) => {
    const token =
      localStorage.getItem("token");

    const response =
      await axios.post(
        API_URL,
        {
          title,
          boardId,
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

export const deleteList =
  async (listId) => {
    const token =
      localStorage.getItem("token");

    const response =
      await axios.delete(
        `${API_URL}/${listId}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return response.data;
  };