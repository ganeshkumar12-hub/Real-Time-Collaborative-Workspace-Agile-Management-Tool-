import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { createList, getListsByBoard } from "../services/listService";

import {
  createCard,
  deleteCard,
  getCardsByList,
  updateCard,
} from "../services/cardService";

function Board() {
  const { id } = useParams();

  const [lists, setLists] = useState([]);
  const [cards, setCards] = useState({});
  const [listTitle, setListTitle] = useState("");

  useEffect(() => {
    const loadLists = async () => {
      try {
        const data = await getListsByBoard(id);

        setLists(data);

        const cardsData = {};

        for (const list of data) {
          const listCards = await getCardsByList(list._id);

          cardsData[list._id] = listCards;
        }

        setCards(cardsData);
      } catch (error) {
        console.log(error);
      }
    };

    loadLists();
  }, [id]);

  const handleCreateList = async () => {
    if (!listTitle) return;

    try {
      const list = await createList(listTitle, id);

      setLists([...lists, list]);

      setListTitle("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateCard = async (listId) => {
    const title = prompt("Task Title");

    if (!title) return;

    const description = prompt("Task Description") || "";

    try {
      const card = await createCard(title, description, listId);

      setCards({
        ...cards,
        [listId]: [...(cards[listId] || []), card],
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteCard = async (listId, cardId) => {
    try {
      await deleteCard(cardId);

      setCards({
        ...cards,
        [listId]: cards[listId].filter((card) => card._id !== cardId),
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditCard = async (listId, cardId, currentTitle) => {
    const newTitle = prompt("Enter new task title", currentTitle);

    if (!newTitle || newTitle === currentTitle) return;

    try {
      const updatedCard = await updateCard(cardId, newTitle);

      setCards({
        ...cards,
        [listId]: cards[listId].map((card) =>
          card._id === cardId ? updatedCard : card,
        ),
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      style={{
        padding: "30px",
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
      }}
    >
      <h1>Board Details</h1>

      <hr />

      <div
        style={{
          marginBottom: "20px",
        }}
      >
        <input
          type="text"
          placeholder="List Title"
          value={listTitle}
          onChange={(e) => setListTitle(e.target.value)}
          style={{
            padding: "10px",
            marginRight: "10px",
          }}
        />

        <button onClick={handleCreateList}>Create List</button>
      </div>

      <div
        style={{
          display: "flex",
          gap: "20px",
          alignItems: "flex-start",
          overflowX: "auto",
        }}
      >
        {lists.map((list) => (
          <div
            key={list._id}
            style={{
              background: "#1e293b",
              padding: "20px",
              borderRadius: "12px",
              minWidth: "300px",
            }}
          >
            <h3>{list.title}</h3>

            <button onClick={() => handleCreateCard(list._id)}>
              + Add Task
            </button>

            <div
              style={{
                marginTop: "15px",
              }}
            >
              {(cards[list._id] || []).map((card) => (
                <div
                  key={card._id}
                  style={{
                    background: "#334155",
                    padding: "12px",
                    borderRadius: "8px",
                    marginBottom: "10px",
                  }}
                >
                  <h4>{card.title}</h4>

                  {card.description && (
                    <p
                      style={{
                        fontSize: "14px",
                        opacity: 0.8,
                      }}
                    >
                      {card.description}
                    </p>
                  )}

                  <div>
                    <button
                      onClick={() =>
                        handleEditCard(list._id, card._id, card.title)
                      }
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDeleteCard(list._id, card._id)}
                      style={{
                        marginLeft: "10px",
                        background: "crimson",
                        color: "white",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Board;
