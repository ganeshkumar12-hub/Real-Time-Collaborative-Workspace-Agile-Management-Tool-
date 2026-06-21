import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "react-router-dom";

import {
  getWorkspaceById,
} from "../services/workspaceDetailsService";

import {
  getBoardsByWorkspace,
  createBoard,
} from "../services/boardService";

function Workspace() {
  const { id } = useParams();

  const [workspace, setWorkspace] =
    useState(null);

  const [boards, setBoards] =
    useState([]);

  const [boardName, setBoardName] =
    useState("");

  useEffect(() => {
    const loadWorkspace =
      async () => {
        try {
          const data =
            await getWorkspaceById(
              id
            );

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

    loadWorkspace();
    loadBoards();
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
        Owner:
        {" "}
        {workspace.owner?.email}
      </p>

      <p>
        Total Members:
        {" "}
        {workspace.members?.length}
      </p>

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
              }}
            >
              {board.name}
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default Workspace;