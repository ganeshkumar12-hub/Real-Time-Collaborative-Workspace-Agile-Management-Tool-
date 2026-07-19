import BoardHeader from "../components/board/BoardHeader";
import BoardToolbar from "../components/board/BoardToolbar";
import KanbanBoard from "../components/board/KanbanBoard";
import OnlineUsers from "../components/board/OnlineUsers";
import ChatPanel from "../components/board/ChatPanel";
import NotificationPanel from "../components/board/NotificationPanel";
import ActivityPanel from "../components/board/ActivityPanel";
import BoardModal from "../components/board/BoardModal";
import EmptyState from "../components/board/EmptyState";

import toast from "react-hot-toast";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
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
import { getMessages, sendMessage } from "../services/chatService";
import {
  createComment,
  deleteComment,
  getComments,
} from "../services/commentService";
import {
  createList,
  deleteList,
  getListsByBoard,
} from "../services/listService";
import { getNotifications } from "../services/notificationService";
import socket from "../services/socket";
import { getUsers } from "../services/userService";
import useAuthStore from "../store/authStore";

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
  // Step 5.4: online users state
  const [onlineUsers, setOnlineUsers] = useState([]);

  // Refs to hold per-card typing timers (so we can clearTimeout on each)
  const typingTimers = useRef({});

  // ── Socket connection ──────────────────────────────────────────
  useEffect(() => {
    // Step 5.5: send user info when joining the board
    socket.emit("joinBoard", {
      boardId: id,
      user: {
        id: user?.id,
        name: user?.name,
        email: user?.email,
      },
    });

    socket.on("connect", () => {
      console.log("Connected to Socket Server:", socket.id);
      // Re-join board on reconnect with user info
      socket.emit("joinBoard", {
        boardId: id,
        user: {
          id: user?.id,
          name: user?.name,
          email: user?.email,
        },
      });
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
            c._id === card._id ? card : c,
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

    // Step 5.6: Listen for online users broadcast
    socket.on("onlineUsers", (users) => {
      setOnlineUsers(users);
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
      // Step 5.7: cleanup onlineUsers listener
      socket.off("onlineUsers");
    };
  }, [id, user]);

  // ── Chat ───────────────────────────────────────────────────────
  const loadChatMessages = useCallback(async () => {
    try {
      const data = await getMessages(id);
      setChatMessages(data);
    } catch (err) {
      console.error(err);
    }
  }, [id]);

  // ── Comments ───────────────────────────────────────────────────
  const loadComments = async (cardId) => {
    try {
      const data = await getComments(cardId);
      setComments((prev) => ({ ...prev, [cardId]: data }));
    } catch (err) {
      console.error(err);
    }
  };

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
          ]),
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
  }, [id, loadChatMessages]);

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
  // Step 4.12: Send chat message
  const handleSendChat = async () => {
    if (!chatText.trim()) {
      toast.error("Message cannot be empty.");
      return;
    }

    try {
      await sendMessage(id, chatText);
      setChatText("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to send message.");
    }
  };

  // ── Comments ───────────────────────────────────────────────────
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
    if (!commentText[cardId]?.trim()) {
      toast.error("Comment cannot be empty.");
      return;
    }

    const toastId = toast.loading("Posting comment...");

    try {
      await createComment(commentText[cardId], cardId);

      setCommentText((prev) => ({
        ...prev,
        [cardId]: "",
      }));

      socket.emit("stopTyping", {
        cardId,
        boardId: id,
      });

      if (typingTimers.current[cardId]) {
        clearTimeout(typingTimers.current[cardId]);
      }

      toast.success("Comment added!", {
        id: toastId,
      });
    } catch (err) {
      console.error(err);

      toast.error("Failed to add comment!", {
        id: toastId,
      });
    }
  };

  const handleDeleteComment = async (commentId) => {
    const toastId = toast.loading("Deleting comment...");

    try {
      await deleteComment(commentId);

      toast.success("Comment deleted!", {
        id: toastId,
      });
    } catch (err) {
      console.error(err);

      toast.error("Failed to delete comment!", {
        id: toastId,
      });
    }
  };

  // ── Assign user ────────────────────────────────────────────────
  const handleAssignUser = async (listId, cardId, userId) => {
    const toastId = toast.loading("Assigning user...");

    try {
      const updatedCard = await assignUser(cardId, userId);

      setCards((prev) => ({
        ...prev,
        [listId]: prev[listId].map((card) =>
          card._id === cardId ? updatedCard : card
        ),
      }));

      toast.success("User assigned successfully!", {
        id: toastId,
      });
    } catch (err) {
      console.error(err);

      setError("Failed to assign user.");

      toast.error("Failed to assign user!", {
        id: toastId,
      });
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
    console.log("Modal opened:", shape);

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

    let toastId;

    try {
      // ===========================
      // CREATE TASK
      // ===========================
      if (modal.type === "createCard") {
        if (!modalTitle.trim()) {
          toast.error("Task title is required.");
          return;
        }

        toastId = toast.loading("Creating task...");

        // cardCreated socket event will update state
        await createCard(
          modalTitle,
          modalDescription,
          modal.listId
        );

        closeModal();

        toast.success("Task created successfully!", {
          id: toastId,
        });

        return;
      }

      // ===========================
      // EDIT TASK
      // ===========================
      if (modal.type === "editCard") {
        if (!modalTitle.trim()) {
          toast.error("Task title is required.");
          return;
        }

        toastId = toast.loading("Updating task...");

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

        toast.success("Task updated successfully!", {
          id: toastId,
        });

        return;
      }

      // ===========================
      // DUE DATE
      // ===========================
      if (modal.type === "dueDate") {
        if (!modalDueDate) {
          toast.error("Please select a due date.");
          return;
        }

        toastId = toast.loading("Updating due date...");

        const updatedCard = await updateDueDate(
          modal.cardId,
          modalDueDate
        );

        setCards((prev) => ({
          ...prev,
          [modal.listId]: prev[modal.listId].map((c) =>
            c._id === modal.cardId ? updatedCard : c
          ),
        }));

        closeModal();

        toast.success("Due date updated!", {
          id: toastId,
        });

        return;
      }

      // ===========================
      // DELETE LIST
      // ===========================
      if (modal.type === "deleteList") {
        toastId = toast.loading("Deleting list...");

        await deleteList(modal.listId);

        setLists((prev) =>
          prev.filter((l) => l._id !== modal.listId)
        );

        setCards((prev) => {
          const next = { ...prev };
          delete next[modal.listId];
          return next;
        });

        closeModal();

        toast.success("List deleted successfully!", {
          id: toastId,
        });

        return;
      }
    } catch (err) {
      console.error(err);

      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong. Please try again.";

      setError(errorMessage);

      toast.error(errorMessage, {
        id: toastId,
      });
    }
  };

  // ── List actions ───────────────────────────────────────────────
  const handleCreateList = async () => {
    if (!listTitle.trim()) {
      toast.error("List title is required!");
      return;
    }

    const toastId = toast.loading("Creating list...");

    try {
      const list = await createList(listTitle, id);

      setLists((prev) => [...prev, list]);

      setCards((prev) => ({
        ...prev,
        [list._id]: [],
      }));

      setListTitle("");

      toast.success("List created successfully!", {
        id: toastId,
      });
    } catch (err) {
      console.error(err);

      setError("Failed to create list.");

      toast.error("Failed to create list!", {
        id: toastId,
      });
    }
  };

  // ── Card actions ───────────────────────────────────────────────
  const handleDeleteCard = async (listId, cardId) => {
    const toastId = toast.loading("Deleting task...");

    try {
      await deleteCard(cardId);

      setCards((prev) => ({
        ...prev,
        [listId]: prev[listId].filter((c) => c._id !== cardId),
      }));

      toast.success("Task deleted successfully!", {
        id: toastId,
      });
    } catch (err) {
      console.error(err);

      setError("Failed to delete card.");

      toast.error("Failed to delete task!", {
        id: toastId,
      });
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
  const pageStyle = {
    padding: "30px",
    minHeight: "100vh",
    background: "#0f172a",
    color: "white",
    fontFamily: "sans-serif",
  };

  const errorStyle = {
    background: "#7f1d1d",
    color: "#fca5a5",
    padding: "10px 14px",
    borderRadius: "6px",
    marginBottom: "16px",
    fontSize: "13px",
  };


  const modalConfig = {
    createCard: {
      title: "Add Task",
      confirmLabel: "Add",
      showTitle: true,
      showDesc: true,
    },
    editCard: {
      title: "Edit Task",
      confirmLabel: "Save",
      showTitle: true,
      showDesc: true,
    },
    dueDate: { title: "Set Due Date", confirmLabel: "Save", showDueDate: true },
    deleteList: {
      title: "Delete List",
      confirmLabel: "Delete",
      isDanger: true,
    },
  };

  const cfg = modal ? modalConfig[modal.type] : null;

  return (
    <div style={pageStyle}>
      <BoardHeader
        title="Project Board"
        onlineUsers={onlineUsers}
      />

      <OnlineUsers onlineUsers={onlineUsers} />

      {/* Global error */}
      {error && !modal && <div style={errorStyle}>{error}</div>}

      <BoardToolbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        listTitle={listTitle}
        setListTitle={setListTitle}
        handleCreateList={handleCreateList}
      />

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

      <NotificationPanel
        notifications={notifications}
      />

      <ActivityPanel
        activities={activities}
      />

      <ChatPanel
        chatMessages={chatMessages}
        chatText={chatText}
        setChatText={setChatText}
        handleSendChat={handleSendChat}
        chatEndRef={chatEndRef}
      />

      {/* Board */}
      {lists.length === 0 ? (
        <EmptyState onCreateList={handleCreateList} />
      ) : (
        <KanbanBoard
          lists={lists}
          cards={cards}
          users={users}
          comments={comments}
          typingUsers={typingUsers}
          commentText={commentText}
          handleDragEnd={handleDragEnd}
          handleAssignUser={handleAssignUser}
          handleCommentChange={handleCommentChange}
          handleSendComment={handleSendComment}
          handleDeleteComment={handleDeleteComment}
          handleDeleteCard={handleDeleteCard}
          openModal={openModal}
        />
      )}

      <BoardModal
        modal={modal}
        cfg={cfg}
        error={error}
        modalTitle={modalTitle}
        setModalTitle={setModalTitle}
        modalDescription={modalDescription}
        setModalDescription={setModalDescription}
        modalDueDate={modalDueDate}
        setModalDueDate={setModalDueDate}
        closeModal={closeModal}
        handleModalSubmit={handleModalSubmit}
      />
    </div>
  );
}

export default Board;