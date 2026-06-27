import axios from "axios";

const API_URL = "http://localhost:5000/api/comments";

const getToken = () => {
  return localStorage.getItem("token");
};

// Get all comments for a card
export const getComments = async (cardId) => {
  const response = await axios.get(`${API_URL}/${cardId}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response.data;
};

// Create a new comment
export const createComment = async (text, cardId) => {
  const response = await axios.post(
    API_URL,
    {
      text,
      cardId,
    },
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return response.data;
};

// Delete a comment
export const deleteComment = async (commentId) => {
  const response = await axios.delete(
    `${API_URL}/${commentId}`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return response.data;
};