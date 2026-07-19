import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import WorkspaceHeader from "../components/workspace/WorkspaceHeader";
import InviteMemberCard from "../components/workspace/InviteMemberCard";
import CreateBoardCard from "../components/workspace/CreateBoardCard";
import BoardGrid from "../components/workspace/BoardGrid";
import SearchBoards from "../components/workspace/SearchBoards";

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
  const [selectedUser, setSelectedUser] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [workspace, boards, users] = await Promise.all([
          getWorkspaceById(id),
          getBoardsByWorkspace(id),
          getUsers(),
        ]);

        setWorkspace(workspace);
        setBoards(boards);
        setUsers(users);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load workspace.");
      }
    };

    fetchData();
  }, [id]);

  const handleCreateBoard = async () => {
    if (!boardName.trim()) {
      toast.error("Board name is required!");
      return;
    }

    const toastId = toast.loading("Creating board...");

    try {
      const board = await createBoard(boardName, id);

      setBoards((prevBoards) => [...prevBoards, board]);
      setBoardName("");

      toast.success("Board created successfully!", {
        id: toastId,
      });
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to create board!",
        {
          id: toastId,
        }
      );
    }
  };

  const handleInviteUser = async () => {
    if (!selectedUser) {
      toast.error("Please select a user.");
      return;
    }

    const toastId = toast.loading("Sending invitation...");

    try {
      await inviteUser(id, selectedUser);

      setSelectedUser("");

      toast.success("Invitation sent successfully!", {
        id: toastId,
      });
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to send invitation!",
        {
          id: toastId,
        }
      );
    }
  };

  const handleDeleteBoard = async (boardId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this board?\n\nThis action cannot be undone."
    );

    if (!confirmed) return;

    const toastId = toast.loading("Deleting board...");

    try {
      await deleteBoard(boardId);

      setBoards((prevBoards) =>
        prevBoards.filter(
          (board) => board._id !== boardId
        )
      );

      toast.success("Board deleted successfully!", {
        id: toastId,
      });
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to delete board!",
        {
          id: toastId,
        }
      );
    }
  };

  const filteredBoards = boards
    .filter((board) =>
      board.name
        ?.toLowerCase()
        .includes(search.toLowerCase())
    )
    .sort((a, b) =>
      (a.name || "").localeCompare(b.name || "")
    );

  if (!workspace) {
    return (
      <div className="flex items-center justify-center h-[70vh] text-xl">
        Loading Workspace...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <WorkspaceHeader
        workspace={workspace}
        boardCount={boards.length}
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SearchBoards
            search={search}
            setSearch={setSearch}
          />

          <BoardGrid
            boards={filteredBoards}
            navigate={navigate}
            handleDeleteBoard={handleDeleteBoard}
          />
        </div>

        <div className="space-y-6">
          <CreateBoardCard
            boardName={boardName}
            setBoardName={setBoardName}
            handleCreateBoard={handleCreateBoard}
          />

          <InviteMemberCard
            users={users}
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            handleInviteUser={handleInviteUser}
          />
        </div>
      </div>
    </div>
  );
}

export default Workspace;