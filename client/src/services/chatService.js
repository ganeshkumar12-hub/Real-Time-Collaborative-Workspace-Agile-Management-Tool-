import axios from "axios";

const API_URL = "http://localhost:5000/api/chat";

const getToken = () => {
  return localStorage.getItem("token");
};

// Get all messages for a board
export const getMessages = async (boardId) => {
  const response = await axios.get(
    `${API_URL}/${boardId}`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return response.data;
};

// Send a message
export const sendMessage = async (
  boardId,
  message
) => {
  const response = await axios.post(
    API_URL,
    {
      boardId,
      message,
    },
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return response.data;
};