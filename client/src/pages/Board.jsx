import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  createList,
  getListsByBoard,
  deleteList,
} from "../services/listService";

import {
  createCard,
  deleteCard,
  getCardsByList,
  updateCard,
  updateDueDate,
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
          const listCards =
            await getCardsByList(list._id);

          cardsData[list._id] =
            listCards;
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
      const list =
        await createList(listTitle, id);

      setLists([...lists, list]);

      setListTitle("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteList =
    async (listId) => {
      if (
        !window.confirm(
          "Delete this list?"
        )
      )
        return;

      try {
        await deleteList(listId);

        setLists(
          lists.filter(
            (list) =>
              list._id !== listId
          )
        );

        const updatedCards = {
          ...cards,
        };

        delete updatedCards[listId];

        setCards(updatedCards);
      } catch (error) {
        console.log(error);
      }
    };

  const handleCreateCard =
    async (listId) => {
      const title =
        prompt("Task Title");

      if (!title) return;

      const description =
        prompt(
          "Task Description"
        ) || "";

      try {
        const card =
          await createCard(
            title,
            description,
            listId
          );

        setCards({
          ...cards,
          [listId]: [
            ...(cards[listId] ||
              []),
            card,
          ],
        });
      } catch (error) {
        console.log(error);
      }
    };

  const handleDeleteCard =
    async (
      listId,
      cardId
    ) => {
      try {
        await deleteCard(cardId);

        setCards({
          ...cards,
          [listId]:
            cards[listId].filter(
              (card) =>
                card._id !== cardId
            ),
        });
      } catch (error) {
        console.log(error);
      }
    };

  const handleEditCard =
    async (
      listId,
      cardId,
      currentTitle,
      currentDescription,
      currentDueDate
    ) => {
      const newTitle =
        prompt(
          "Task Title",
          currentTitle
        );

      if (!newTitle) return;

      const newDescription =
        prompt(
          "Task Description",
          currentDescription || ""
        );

      try {
        const updatedCard =
          await updateCard(
            cardId,
            newTitle,
            newDescription,
            currentDueDate
          );

        setCards({
          ...cards,
          [listId]:
            cards[listId].map(
              (card) =>
                card._id === cardId
                  ? updatedCard
                  : card
            ),
        });
      } catch (error) {
        console.log(error);
      }
    };

  const handleSetDueDate =
    async (
      listId,
      cardId
    ) => {
      const dueDate =
        prompt(
          "Enter Due Date (YYYY-MM-DD)"
        );

      if (!dueDate) return;

      try {
        const updatedCard =
          await updateDueDate(
            cardId,
            dueDate
          );

        setCards({
          ...cards,
          [listId]:
            cards[listId].map(
              (card) =>
                card._id === cardId
                  ? updatedCard
                  : card
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

      <input
        type="text"
        placeholder="List Title"
        value={listTitle}
        onChange={(e) =>
          setListTitle(
            e.target.value
          )
        }
      />

      <button
        onClick={handleCreateList}
      >
        Create List
      </button>

      <div
        style={{
          display: "flex",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {lists.map((list) => (
          <div
            key={list._id}
            style={{
              background:
                "#1e293b",
              padding: "20px",
              borderRadius:
                "12px",
              minWidth:
                "300px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
              }}
            >
              <h3>
                {list.title}
              </h3>

              <button
                onClick={() =>
                  handleDeleteList(
                    list._id
                  )
                }
              >
                X
              </button>
            </div>

            <button
              onClick={() =>
                handleCreateCard(
                  list._id
                )
              }
            >
              + Add Task
            </button>

            <div
              style={{
                marginTop:
                  "15px",
              }}
            >
              {(cards[
                list._id
              ] || []).map(
                (card) => (
                  <div
                    key={
                      card._id
                    }
                    style={{
                      background:
                        "#334155",
                      padding:
                        "12px",
                      borderRadius:
                        "8px",
                      marginBottom:
                        "10px",
                    }}
                  >
                    <h4>
                      {
                        card.title
                      }
                    </h4>

                    <p>
                      {
                        card.description
                      }
                    </p>

                    {card.dueDate && (
                      <p>
                        📅 Due:
                        {" "}
                        {new Date(
                          card.dueDate
                        ).toLocaleDateString()}
                      </p>
                    )}

                    <button
                      onClick={() =>
                        handleEditCard(
                          list._id,
                          card._id,
                          card.title,
                          card.description,
                          card.dueDate
                        )
                      }
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleSetDueDate(
                          list._id,
                          card._id
                        )
                      }
                    >
                      Due Date
                    </button>

                    <button
                      onClick={() =>
                        handleDeleteCard(
                          list._id,
                          card._id
                        )
                      }
                    >
                      Delete
                    </button>
                  </div>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Board;