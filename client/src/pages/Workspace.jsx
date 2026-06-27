import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getWorkspaceById } from "../services/workspaceDetailsService";

import {
  createBoard,
  getBoardsByWorkspace,
  deleteBoard,
} from "../services/boardService";

import { getUsers } from "../services/userService";
import { inviteUser } from "../services/invitationService";

function Workspace() {
  const navigate = useNavigate();

  const { id } = useParams();

  const [workspace, setWorkspace] = useState(null);

  const [boards, setBoards] = useState([]);

  const [boardName, setBoardName] = useState("");

  const [users, setUsers] = useState([]);

  const [selectedUser, setSelectedUser] =
    useState("");

  useEffect(() => {
    const loadWorkspace =
      async () => {
        try {
          const data =
            await getWorkspaceById(id);

          setWorkspace(data);
        } catch (error) {
          console.log(error);
        }
      };

    const loadBoards =
      async () => {
        try {
          const data =
            await getBoardsByWorkspace(
              id
            );

          setBoards(data);
        } catch (error) {
          console.log(error);
        }
      };

    const loadUsers =
      async () => {
        try {
          const data =
            await getUsers();

          setUsers(data);
        } catch (error) {
          console.log(error);
        }
      };

    loadWorkspace();
    loadBoards();
    loadUsers();
  }, [id]);

  const handleCreateBoard =
    async () => {
      if (!boardName) return;

      try {
        const board =
          await createBoard(
            boardName,
            id
          );

        setBoards([
          ...boards,
          board,
        ]);

        setBoardName("");
      } catch (error) {
        console.log(error);
      }
    };

  const handleInviteUser =
    async () => {
      if (!selectedUser) return;

      try {
        await inviteUser(
          id,
          selectedUser
        );

        alert(
          "Invitation sent successfully!"
        );

        setSelectedUser("");
      } catch (error) {
        alert(
          error.response?.data
            ?.message ||
            "Failed to send invitation"
        );
      }
    };

  const handleDeleteBoard =
    async (boardId) => {
      const confirmDelete =
        window.confirm(
          "Delete this board?"
        );

      if (!confirmDelete)
        return;

      try {
        await deleteBoard(boardId);

        setBoards(
          boards.filter(
            (board) =>
              board._id !==
              boardId
          )
        );
      } catch (error) {
        console.log(error);
      }
    };

  if (!workspace) {
    return (
      <div
        style={{
          padding: "30px",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "30px",
      }}
    >
      <h1>
        Workspace Details
      </h1>

      <hr />

      <h2>
        {workspace.name}
      </h2>

      <p>
        Owner:{" "}
        {workspace.owner?.email}
      </p>

      <p>
        Total Members:{" "}
        {
          workspace.members
            ?.length
        }
      </p>

      <hr />

      <h2>
        Invite Member
      </h2>

      <select
        value={selectedUser}
        onChange={(e) =>
          setSelectedUser(
            e.target.value
          )
        }
      >
        <option value="">
          Select User
        </option>

        {users.map((user) => (
          <option
            key={user._id}
            value={user._id}
          >
            {user.name} (
            {user.email})
          </option>
        ))}
      </select>

      <button
        onClick={
          handleInviteUser
        }
        style={{
          marginLeft: "10px",
        }}
      >
        Invite
      </button>

      <hr />

      <h2>
        Boards
      </h2>

      <input
        type="text"
        placeholder="Board Name"
        value={boardName}
        onChange={(e) =>
          setBoardName(
            e.target.value
          )
        }
      />

      <button
        onClick={
          handleCreateBoard
        }
      >
        Create Board
      </button>

      <div
        style={{
          marginTop: "20px",
        }}
      >
        {boards.map(
          (board) => (
            <div
              key={board._id}
              style={{
                background:
                  "#1e293b",
                color:
                  "white",
                padding:
                  "15px",
                marginBottom:
                  "10px",
                borderRadius:
                  "10px",
                display:
                  "flex",
                justifyContent:
                  "space-between",
                alignItems:
                  "center",
              }}
            >
              <span
                onClick={() =>
                  navigate(
                    `/board/${board._id}`
                  )
                }
                style={{
                  cursor:
                    "pointer",
                  flex: 1,
                }}
              >
                {board.name}
              </span>

              <button
                onClick={() =>
                  handleDeleteBoard(
                    board._id
                  )
                }
                style={{
                  background:
                    "crimson",
                  color:
                    "white",
                  border:
                    "none",
                  padding:
                    "6px 10px",
                  borderRadius:
                    "5px",
                  cursor:
                    "pointer",
                }}
              >
                Delete
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default Workspace;