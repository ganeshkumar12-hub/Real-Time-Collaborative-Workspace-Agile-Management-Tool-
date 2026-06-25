import axios from "axios";

const API_URL =
  "http://localhost:5000/api/comments";

const getToken = () => {
  return localStorage.getItem("token");
};

export const getComments = async (
  cardId
) => {
  const response = await axios.get(
    `${API_URL}/${cardId}`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return response.data;
};

export const createComment =
  async (text, cardId) => {
    const response =
      await axios.post(
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