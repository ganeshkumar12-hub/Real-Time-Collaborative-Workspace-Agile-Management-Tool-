import BoardCard from "./BoardCard";

export default function BoardGrid({
  boards,
  navigate,
  handleDeleteBoard,
}) {
  return (
    <div>

      <h2 className="text-2xl font-bold mb-6">
        Workspace Boards
      </h2>

      {boards.length === 0 ? (

        <div className="rounded-2xl border border-dashed border-slate-700 p-12 text-center text-slate-400">
          No boards created yet.
        </div>

      ) : (

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

          {boards.map((board) => (

            <BoardCard
              key={board._id}
              board={board}
              navigate={navigate}
              handleDeleteBoard={handleDeleteBoard}
            />

          ))}

        </div>

      )}

    </div>
  );
}