import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  getListsByBoard,
  createList,
} from "../services/listService";

import {
  getCardsByList,
  createCard,
} from "../services/cardService";

function Board() {
  const { id } = useParams();

  const [lists, setLists] =
    useState([]);

  const [cards, setCards] =
    useState({});

  const [listTitle, setListTitle] =
    useState("");

  const [cardTitle, setCardTitle] =
    useState("");

  useEffect(() => {
    const loadLists =
      async () => {
        try {
          const data =
            await getListsByBoard(id);

          setLists(data);

          const cardsData = {};

          for (const list of data) {
            const listCards =
              await getCardsByList(
                list._id
              );

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

  const handleCreateList =
    async () => {
      if (!listTitle) return;

      try {
        const list =
          await createList(
            listTitle,
            id
          );

        setLists([
          ...lists,
          list,
        ]);

        setListTitle("");
      } catch (error) {
        console.log(error);
      }
    };

  const handleCreateCard =
    async (listId) => {
      if (!cardTitle) return;

      try {
        const card =
          await createCard(
            cardTitle,
            "",
            listId
          );

        setCards({
          ...cards,
          [listId]: [
            ...(cards[listId] || []),
            card,
          ],
        });

        setCardTitle("");
      } catch (error) {
        console.log(error);
      }
    };

  return (
    <div
      style={{
        padding: "30px",
      }}
    >
      <h1>
        Board Details
      </h1>

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
        onClick={
          handleCreateList
        }
      >
        Create List
      </button>

      <div
        style={{
          display: "flex",
          gap: "20px",
          marginTop: "30px",
          alignItems:
            "flex-start",
        }}
      >
        {lists.map(
          (list) => (
            <div
              key={list._id}
              style={{
                background:
                  "#1e293b",
                color:
                  "white",
                padding:
                  "20px",
                minWidth:
                  "250px",
                borderRadius:
                  "10px",
              }}
            >
              <h3>
                {list.title}
              </h3>

              <input
                type="text"
                placeholder="Task Title"
                value={cardTitle}
                onChange={(e) =>
                  setCardTitle(
                    e.target.value
                  )
                }
              />

              <button
                onClick={() =>
                  handleCreateCard(
                    list._id
                  )
                }
              >
                Add Task
              </button>

              <div
                style={{
                  marginTop:
                    "15px",
                }}
              >
                {(
                  cards[
                    list._id
                  ] || []
                ).map(
                  (card) => (
                    <div
                      key={
                        card._id
                      }
                      style={{
                        background:
                          "#334155",
                        padding:
                          "10px",
                        marginBottom:
                          "10px",
                        borderRadius:
                          "8px",
                      }}
                    >
                      {
                        card.title
                      }
                    </div>
                  )
                )}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default Board;