import axios from "axios";

const API_URL =
  "http://localhost:5000/api/cards";

export const getCardsByList =
  async (listId) => {
    const token =
      localStorage.getItem("token");

    const response =
      await axios.get(
        `${API_URL}/list/${listId}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return response.data;
  };

export const createCard =
  async (
    title,
    description,
    listId
  ) => {
    const token =
      localStorage.getItem("token");

    const response =
      await axios.post(
        API_URL,
        {
          title,
          description,
          listId,
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
export const deleteCard =
  async (cardId) => {
    const token =
      localStorage.getItem("token");

    const response =
      await axios.delete(
        `${API_URL}/${cardId}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return response.data;
  };

export const updateCard =
  async (
    cardId,
    title
  ) => {
    const token =
      localStorage.getItem("token");

    const response =
      await axios.put(
        `${API_URL}/${cardId}`,
        { title },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return response.data;
  };