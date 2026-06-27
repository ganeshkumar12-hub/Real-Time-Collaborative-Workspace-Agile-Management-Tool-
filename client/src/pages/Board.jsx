import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getMessages, sendMessage } from "../services/chatService";
import useAuthStore from "../store/authStore";
import { getActivities } from "../services/activityService";
import {
  assignUser,
  createCard,
  deleteCard,
  getCardsByList,
  moveCard,
  searchCards,
  updateCard,
  updateDueDate,
} from "../services/cardService";
import {
  createComment,
  deleteComment,
  getComments,
} from "../services/commentService";
import { createList, deleteList, getListsByBoard } from "../services/listService";
import { getNotifications } from "../services/notificationService";
import socket from "../services/socket";
import { getUsers } from "../services/userService";

function Board() {
  const { id } = useParams();
  const user = useAuthStore((state) => state.user);
  const [users, setUsers] = useState([]);
  const [lists, setLists] = useState([]);
  const [cards, setCards] = useState({});
  const [listTitle, setListTitle] = useState("");
  const [error, setError] = useState("");
  const [comments, setComments] = useState({});
  const [commentText, setCommentText] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [activities, setActivities] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [typingUsers, setTypingUsers] = useState({});
  const [chatMessages, setChatMessages] = useState([]);
  const [chatText, setChatText] = useState("");
  const chatEndRef = useRef(null);

  // Refs to hold per-card typing timers (so we can clearTimeout on each)
  const typingTimers = useRef({});

  // ── Socket connection ──────────────────────────────────────────
  useEffect(() => {
    socket.emit("joinBoard", id);

    socket.on("connect", () => {
      console.log("Connected to Socket Server:", socket.id);
      socket.emit("joinBoard", id);
    });

    socket.on("cardCreated", (card) => {
      setCards((prev) => ({
        ...prev,
        [card.list]: [...(prev[card.list] || []), card],
      }));
    });

    socket.on("cardUpdated", (card) => {
      setCards((prev) => {
        const updated = {};
        Object.keys(prev).forEach((listId) => {
          updated[listId] = prev[listId].map((c) =>
            c._id === card._id ? card : c
          );
        });
        return updated;
      });
    });

    socket.on("cardDeleted", (cardId) => {
      setCards((prev) => {
        const updated = {};
        Object.keys(prev).forEach((listId) => {
          updated[listId] = prev[listId].filter((card) => card._id !== cardId);
        });
        return updated;
      });
    });

    socket.on("commentCreated", (comment) => {
      setComments((prev) => ({
        ...prev,
        [comment.card]: [...(prev[comment.card] || []), comment],
      }));
    });

    socket.on("commentDeleted", (commentId) => {
      setComments((prev) => {
        const updated = {};
        Object.keys(prev).forEach((cardId) => {
          updated[cardId] = prev[cardId].filter((c) => c._id !== commentId);
        });
        return updated;
      });
    });

    socket.on("typing", ({ cardId, user }) => {
      setTypingUsers((prev) => ({
        ...prev,
        [cardId]: user,
      }));
    });

    socket.on("stopTyping", ({ cardId }) => {
      setTypingUsers((prev) => {
        const updated = { ...prev };
        delete updated[cardId];
        return updated;
      });
    });

    // Step 4.11: Listen for live chat messages
    socket.on("chatMessage", (message) => {
      setChatMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.emit("leaveBoard", id);
      socket.off("connect");
      socket.off("cardCreated");
      socket.off("cardUpdated");
      socket.off("cardDeleted");
      socket.off("commentCreated");
      socket.off("commentDeleted");
      socket.off("typing");
      socket.off("stopTyping");
      socket.off("chatMessage");
    };
  }, [id]);

  // ── Load board data ────────────────────────────────────────────
  useEffect(() => {
    const loadData = async () => {
      try {
        const [listsData, usersData, notificationData, activityData] =
          await Promise.all([
            getListsByBoard(id),
            getUsers(),
            getNotifications(),
            getActivities(id),
          ]);
        setLists(listsData);
        setUsers(usersData);
        setNotifications(notificationData);
        setActivities(activityData);

        // Step 4.10: Load chat messages when board opens
        await loadChatMessages();

        const cardEntries = await Promise.all(
          listsData.map(async (list) => [
            list._id,
            await getCardsByList(list._id),
          ])
        );
        const cardsMap = Object.fromEntries(cardEntries);
        setCards(cardsMap);

        Object.values(cardsMap)
          .flat()
          .forEach((card) => loadComments(card._id));
      } catch (err) {
        setError("Failed to load board data.");
        console.error(err);
      }
    };

    loadData();
  }, [id]);

  // Step 4.13: Auto-scroll chat to bottom whenever messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // ── Search ─────────────────────────────────────────────────────
  useEffect(() => {
    const search = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }
      try {
        const results = await searchCards(searchQuery);
        setSearchResults(results);
      } catch (err) {
        console.error(err);
      }
    };

    const timer = setTimeout(search, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // ── Chat ───────────────────────────────────────────────────────
  const loadChatMessages = async () => {
    try {
      const data = await getMessages(id);
      setChatMessages(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Step 4.12: Send chat message
  const handleSendChat = async () => {
    if (!chatText.trim()) return;
    try {
      await sendMessage(id, chatText);
      setChatText("");
    } catch (err) {
      console.error(err);
    }
  };

  // ── Comments ───────────────────────────────────────────────────
  const loadComments = async (cardId) => {
    try {
      const data = await getComments(cardId);
      setComments((prev) => ({ ...prev, [cardId]: data }));
    } catch (err) {
      console.error(err);
    }
  };

  // Emit typing with the logged-in user's name so the server can broadcast it
  const handleCommentChange = (cardId, value) => {
    setCommentText((prev) => ({ ...prev, [cardId]: value }));

    socket.emit("typing", {
      cardId,
      boardId: id,
      user: user?.name,
    });

    // Reset the stopTyping debounce timer for this card
    if (typingTimers.current[cardId]) {
      clearTimeout(typingTimers.current[cardId]);
    }
    typingTimers.current[cardId] = setTimeout(() => {
      socket.emit("stopTyping", { cardId, boardId: id });
    }, 1500);
  };

  const handleSendComment = async (cardId) => {
    if (!commentText[cardId]?.trim()) return;
    try {
      await createComment(commentText[cardId], cardId);
      setCommentText((prev) => ({ ...prev, [cardId]: "" }));
      // Stop typing indicator immediately when comment is sent
      socket.emit("stopTyping", { cardId, boardId: id });
      if (typingTimers.current[cardId]) {
        clearTimeout(typingTimers.current[cardId]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
    } catch (err) {
      console.error(err);
    }
  };

  // ── Assign user ────────────────────────────────────────────────
  const handleAssignUser = async (listId, cardId, userId) => {
    try {
      const updatedCard = await assignUser(cardId, userId);
      setCards((prev) => ({
        ...prev,
        [listId]: prev[listId].map((card) =>
          card._id === cardId ? updatedCard : card
        ),
      }));
    } catch (err) {
      setError("Failed to assign user.");
      console.error(err);
    }
  };

  // ── Modal state ────────────────────────────────────────────────
  // modal shapes:
  // { type: "createCard", listId }
  // { type: "editCard", listId, cardId, title, description, dueDate }
  // { type: "dueDate", listId, cardId }
  // { type: "deleteList", listId }
  const [modal, setModal] = useState(null);
  const [modalTitle, setModalTitle] = useState("");
  const [modalDescription, setModalDescription] = useState("");
  const [modalDueDate, setModalDueDate] = useState("");

  const openModal = (shape) => {
    setModal(shape);
    setModalTitle(shape.title || "");
    setModalDescription(shape.description || "");
    setModalDueDate(shape.dueDate ? shape.dueDate.slice(0, 10) : "");
    setError("");
  };

  const closeModal = () => {
    setModal(null);
    setModalTitle("");
    setModalDescription("");
    setModalDueDate("");
    setError("");
  };

  const handleModalSubmit = async () => {
    if (!modal) return;

    try {
      if (modal.type === "createCard") {
        if (!modalTitle.trim()) {
          setError("Task title is required.");
          return;
        }
        // cardCreated socket event will update state
        await createCard(modalTitle, modalDescription, modal.listId);
        closeModal();
      }

      if (modal.type === "editCard") {
        if (!modalTitle.trim()) {
          setError("Task title is required.");
          return;
        }
        const updatedCard = await updateCard(
          modal.cardId,
          modalTitle,
          modalDescription,
          modalDueDate
        );
        setCards((prev) => ({
          ...prev,
          [modal.listId]: prev[modal.listId].map((c) =>
            c._id === modal.cardId ? updatedCard : c
          ),
        }));
        closeModal();
      }

      if (modal.type === "dueDate") {
        if (!modalDueDate) {
          setError("Please select a due date.");
          return;
        }
        const updatedCard = await updateDueDate(modal.cardId, modalDueDate);
        setCards((prev) => ({
          ...prev,
          [modal.listId]: prev[modal.listId].map((c) =>
            c._id === modal.cardId ? updatedCard : c
          ),
        }));
        closeModal();
      }

      if (modal.type === "deleteList") {
        await deleteList(modal.listId);
        setLists((prev) => prev.filter((l) => l._id !== modal.listId));
        setCards((prev) => {
          const next = { ...prev };
          delete next[modal.listId];
          return next;
        });
        closeModal();
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    }
  };

  // ── List actions ───────────────────────────────────────────────
  const handleCreateList = async () => {
    if (!listTitle.trim()) return;
    try {
      const list = await createList(listTitle, id);
      setLists((prev) => [...prev, list]);
      setListTitle("");
    } catch (err) {
      setError("Failed to create list.");
      console.error(err);
    }
  };

  // ── Card actions ───────────────────────────────────────────────
  const handleDeleteCard = async (listId, cardId) => {
    try {
      await deleteCard(cardId);
      setCards((prev) => ({
        ...prev,
        [listId]: prev[listId].filter((c) => c._id !== cardId),
      }));
    } catch (err) {
      setError("Failed to delete card.");
      console.error(err);
    }
  };

  // ── Drag & drop ────────────────────────────────────────────────
  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const sourceListId = source.droppableId;
    const destinationListId = destination.droppableId;
    const sourceCards = [...(cards[sourceListId] || [])];
    const destinationCards =
      sourceListId === destinationListId
        ? sourceCards
        : [...(cards[destinationListId] || [])];

    const [movedCard] = sourceCards.splice(source.index, 1);
    destinationCards.splice(destination.index, 0, movedCard);

    setCards((prev) => ({
      ...prev,
      [sourceListId]: sourceCards,
      [destinationListId]: destinationCards,
    }));

    try {
      await moveCard(draggableId, destinationListId);
    } catch (err) {
      setError("Failed to move card.");
      console.error(err);
    }
  };

  // ── Styles ─────────────────────────────────────────────────────
  const s = {
    page: {
      padding: "30px",
      minHeight: "100vh",
      background: "#0f172a",
      color: "white",
      fontFamily: "sans-serif",
    },
    topBar: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      marginBottom: "20px",
    },
    input: {
      padding: "8px 12px",
      borderRadius: "6px",
      border: "1px solid #475569",
      background: "#1e293b",
      color: "white",
      fontSize: "14px",
    },
    btn: (variant = "default") => ({
      padding: "8px 14px",
      borderRadius: "6px",
      border: "none",
      cursor: "pointer",
      fontSize: "13px",
      fontWeight: 500,
      background:
        variant === "danger"
          ? "#ef4444"
          : variant === "primary"
          ? "#3b82f6"
          : "#334155",
      color: "white",
    }),
    column: {
      background: "#1e293b",
      padding: "16px",
      borderRadius: "12px",
      minWidth: "280px",
      maxWidth: "280px",
    },
    columnHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "10px",
    },
    card: (draggableStyle) => ({
      background: "#334155",
      padding: "12px",
      borderRadius: "8px",
      marginBottom: "10px",
      ...draggableStyle,
    }),
    cardActions: {
      display: "flex",
      gap: "6px",
      marginTop: "8px",
    },
    error: {
      background: "#7f1d1d",
      color: "#fca5a5",
      padding: "10px 14px",
      borderRadius: "6px",
      marginBottom: "16px",
      fontSize: "13px",
    },
    userBadge: {
      display: "inline-block",
      background: "#1e293b",
      borderRadius: "999px",
      padding: "4px 12px",
      fontSize: "13px",
      marginRight: "6px",
      marginBottom: "6px",
    },
    select: {
      padding: "8px 12px",
      borderRadius: "6px",
      border: "1px solid #475569",
      background: "#1e293b",
      color: "white",
      fontSize: "13px",
      width: "100%",
      marginTop: "4px",
    },
    overlay: {
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.6)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    },
    modalBox: {
      background: "#1e293b",
      borderRadius: "12px",
      padding: "28px",
      width: "360px",
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    },
    modalTitle: {
      margin: 0,
      fontSize: "17px",
      fontWeight: 600,
    },
    label: {
      fontSize: "13px",
      color: "#94a3b8",
      marginBottom: "4px",
      display: "block",
    },
    modalActions: {
      display: "flex",
      gap: "8px",
      justifyContent: "flex-end",
      marginTop: "4px",
    },
  };

  const modalConfig = {
    createCard: { title: "Add Task", confirmLabel: "Add", showTitle: true, showDesc: true },
    editCard: { title: "Edit Task", confirmLabel: "Save", showTitle: true, showDesc: true },
    dueDate: { title: "Set Due Date", confirmLabel: "Save", showDueDate: true },
    deleteList: { title: "Delete List", confirmLabel: "Delete", isDanger: true },
  };

  const cfg = modal ? modalConfig[modal.type] : null;

  return (
    <div style={s.page}>
      <h1 style={{ marginBottom: "6px" }}>Board</h1>

      {/* Users */}
      {users.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <p style={{ color: "#94a3b8", fontSize: "13px", marginBottom: "8px" }}>
            Members
          </p>
          {users.map((user) => (
            <span key={user._id} style={s.userBadge}>
              {user.name}
            </span>
          ))}
        </div>
      )}

      {/* Global error */}
      {error && !modal && <div style={s.error}>{error}</div>}

      {/* Create list */}
      <div style={s.topBar}>
        <input
          style={s.input}
          type="text"
          placeholder="New list title…"
          value={listTitle}
          onChange={(e) => setListTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreateList()}
        />
        <button style={s.btn("primary")} onClick={handleCreateList}>
          Add List
        </button>
      </div>

      {/* Search */}
      <div style={{ marginBottom: "20px" }}>
        <input
          style={{ ...s.input, width: "300px" }}
          type="text"
          placeholder="🔍 Search cards..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Search results */}
      {searchQuery && (
        <div
          style={{
            background: "#1e293b",
            padding: "15px",
            borderRadius: "10px",
            marginBottom: "20px",
          }}
        >
          <h3>Search Results</h3>
          {searchResults.length === 0 ? (
            <p>No cards found.</p>
          ) : (
            searchResults.map((card) => (
              <div
                key={card._id}
                style={{ padding: "10px", borderBottom: "1px solid #334155" }}
              >
                <strong>{card.title}</strong>
                <p>{card.description}</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* Notifications */}
      <div
        style={{
          background: "#1e293b",
          padding: "15px",
          borderRadius: "10px",
          marginBottom: "20px",
        }}
      >
        <h3>Notifications</h3>
        {notifications.slice(0, 5).map((notification) => (
          <p key={notification._id}>🔔 {notification.message}</p>
        ))}
      </div>

      {/* Activity Feed */}
      <div
        style={{
          background: "#1e293b",
          padding: "15px",
          borderRadius: "10px",
          marginBottom: "20px",
        }}
      >
        <h3>Activity Feed</h3>
        {activities.slice(0, 10).map((activity) => (
          <p key={activity._id}>{activity.action}</p>
        ))}
      </div>

      {/* Team Chat */}
      <div
        style={{
          background: "#1e293b",
          padding: "15px",
          borderRadius: "10px",
          marginBottom: "20px",
        }}
      >
        <h3>Team Chat</h3>

        {/* Message list */}
        <div
          style={{
            maxHeight: "250px",
            overflowY: "auto",
            marginBottom: "10px",
            display: "flex",
            flexDirection: "column",
            gap: "6px",
          }}
        >
          {chatMessages.map((msg) => (
            <div
              key={msg._id}
              style={{
                background: "#334155",
                padding: "8px 12px",
                borderRadius: "8px",
                fontSize: "13px",
              }}
            >
              <strong style={{ color: "#60a5fa" }}>
                {msg.sender?.name || "Unknown"}:
              </strong>{" "}
              {msg.message}
            </div>
          ))}
          {/* Step 4.13: auto-scroll anchor */}
          <div ref={chatEndRef} />
        </div>

        {/* Chat input */}
        <div style={{ display: "flex", gap: "8px" }}>
          <input
            style={{ ...s.input, flex: 1 }}
            placeholder="Type a message..."
            value={chatText}
            onChange={(e) => setChatText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
          />
          <button style={s.btn("primary")} onClick={handleSendChat}>
            Send
          </button>
        </div>
      </div>

      {/* Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div style={{ display: "flex", gap: "20px", overflowX: "auto", paddingBottom: "20px" }}>
          {lists.map((list) => (
            <div key={list._id} style={s.column}>
              <div style={s.columnHeader}>
                <h3 style={{ margin: 0, fontSize: "15px" }}>{list.title}</h3>
                <button
                  style={s.btn("danger")}
                  onClick={() => openModal({ type: "deleteList", listId: list._id })}
                >
                  ✕
                </button>
              </div>

              <button
                style={{ ...s.btn("default"), width: "100%", marginBottom: "8px" }}
                onClick={() => openModal({ type: "createCard", listId: list._id })}
              >
                + Add Task
              </button>

              <Droppable droppableId={list._id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{ minHeight: "60px" }}
                  >
                    {(cards[list._id] || []).map((card, index) => (
                      <Draggable key={card._id} draggableId={card._id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={s.card(provided.draggableProps.style)}
                          >
                            <strong style={{ fontSize: "14px" }}>{card.title}</strong>

                            {card.description && (
                              <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#94a3b8" }}>
                                {card.description}
                              </p>
                            )}

                            {card.dueDate && (
                              <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#64748b" }}>
                                📅 {new Date(card.dueDate).toLocaleDateString()}
                              </p>
                            )}

                            {card.assignedTo && (
                              <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#94a3b8" }}>
                                👤 {card.assignedTo.name || card.assignedTo}
                              </p>
                            )}

                            <select
                              style={s.select}
                              value={card.assignedTo?._id || card.assignedTo || ""}
                              onChange={(e) =>
                                handleAssignUser(list._id, card._id, e.target.value)
                              }
                            >
                              <option value="">Assign User</option>
                              {users.map((user) => (
                                <option key={user._id} value={user._id}>
                                  {user.name}
                                </option>
                              ))}
                            </select>

                            {/* Comments */}
                            <div
                              style={{
                                marginTop: "10px",
                                borderTop: "1px solid #475569",
                                paddingTop: "8px",
                              }}
                            >
                              {(comments[card._id] || []).map((comment) => (
                                <div
                                  key={comment._id}
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "flex-start",
                                    margin: "4px 0",
                                  }}
                                >
                                  <p style={{ fontSize: "12px", margin: 0 }}>
                                    <strong>{comment.author?.name}:</strong>{" "}
                                    {comment.text}
                                  </p>
                                  <button
                                    style={{
                                      marginLeft: "8px",
                                      padding: "2px 6px",
                                      border: "none",
                                      borderRadius: "4px",
                                      background: "#ef4444",
                                      color: "white",
                                      cursor: "pointer",
                                      fontSize: "11px",
                                      flexShrink: 0,
                                    }}
                                    onClick={() => handleDeleteComment(comment._id)}
                                  >
                                    ✕
                                  </button>
                                </div>
                              ))}

                              {/* Typing indicator */}
                              {typingUsers[card._id] && (
                                <p
                                  style={{
                                    color: "#38bdf8",
                                    fontSize: "12px",
                                    margin: "6px 0 0",
                                    fontStyle: "italic",
                                  }}
                                >
                                  {typingUsers[card._id]} is typing...
                                </p>
                              )}

                              <input
                                style={{
                                  width: "100%",
                                  marginTop: "8px",
                                  padding: "6px",
                                  borderRadius: "5px",
                                  border: "1px solid #475569",
                                  background: "#1e293b",
                                  color: "white",
                                  boxSizing: "border-box",
                                }}
                                placeholder="Write a comment..."
                                value={commentText[card._id] || ""}
                                onChange={(e) =>
                                  handleCommentChange(card._id, e.target.value)
                                }
                                onKeyDown={(e) =>
                                  e.key === "Enter" && handleSendComment(card._id)
                                }
                              />

                              <button
                                style={{
                                  marginTop: "6px",
                                  width: "100%",
                                  padding: "6px",
                                  border: "none",
                                  borderRadius: "5px",
                                  background: "#3b82f6",
                                  color: "white",
                                  cursor: "pointer",
                                }}
                                onClick={() => handleSendComment(card._id)}
                              >
                                Send
                              </button>
                            </div>

                            <div style={s.cardActions}>
                              <button
                                style={s.btn()}
                                onClick={() =>
                                  openModal({
                                    type: "editCard",
                                    listId: list._id,
                                    cardId: card._id,
                                    title: card.title,
                                    description: card.description,
                                    dueDate: card.dueDate,
                                  })
                                }
                              >
                                Edit
                              </button>
                              <button
                                style={s.btn()}
                                onClick={() =>
                                  openModal({
                                    type: "dueDate",
                                    listId: list._id,
                                    cardId: card._id,
                                  })
                                }
                              >
                                📅
                              </button>
                              <button
                                style={s.btn("danger")}
                                onClick={() => handleDeleteCard(list._id, card._id)}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {/* Modal */}
      {modal && cfg && (
        <div style={s.overlay} onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div style={s.modalBox}>
            <h3 style={s.modalTitle}>{cfg.title}</h3>

            {error && <div style={s.error}>{error}</div>}

            {modal.type === "deleteList" && (
              <p style={{ color: "#94a3b8", margin: 0, fontSize: "14px" }}>
                Are you sure? All tasks in this list will be deleted.
              </p>
            )}

            {cfg.showTitle && (
              <div>
                <label style={s.label}>Title</label>
                <input
                  style={{ ...s.input, width: "100%", boxSizing: "border-box" }}
                  value={modalTitle}
                  onChange={(e) => setModalTitle(e.target.value)}
                  autoFocus
                />
              </div>
            )}

            {cfg.showDesc && (
              <div>
                <label style={s.label}>Description</label>
                <textarea
                  style={{
                    ...s.input,
                    width: "100%",
                    boxSizing: "border-box",
                    resize: "vertical",
                    minHeight: "80px",
                  }}
                  value={modalDescription}
                  onChange={(e) => setModalDescription(e.target.value)}
                />
              </div>
            )}

            {cfg.showDueDate && (
              <div>
                <label style={s.label}>Due Date</label>
                <input
                  style={{ ...s.input, width: "100%", boxSizing: "border-box" }}
                  type="date"
                  value={modalDueDate}
                  onChange={(e) => setModalDueDate(e.target.value)}
                />
              </div>
            )}

            <div style={s.modalActions}>
              <button style={s.btn()} onClick={closeModal}>
                Cancel
              </button>
              <button
                style={s.btn(cfg.isDanger ? "danger" : "primary")}
                onClick={handleModalSubmit}
              >
                {cfg.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Board;