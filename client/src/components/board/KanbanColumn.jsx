import { Droppable } from "@hello-pangea/dnd";
import { Plus, Trash2 } from "lucide-react";
import TaskCard from "./TaskCard";

export default function KanbanColumn({
  list,
  cards,
  users,
  comments,
  commentText,
  typingUsers,
  handleAssignUser,
  handleCommentChange,
  handleSendComment,
  handleDeleteComment,
  handleDeleteCard,
  openModal,
}) {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-5 w-80 flex-shrink-0">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg">
          {list.title}
        </h2>

        <button
          onClick={() =>
            openModal({
              type: "deleteList",
              listId: list._id,
            })
          }
          className="text-red-400 hover:text-red-500"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <button
        onClick={() => {
          console.log("Button clicked", list._id);

          openModal({
            type: "createCard",
            listId: list._id,
          });
        }}
        className="mb-4 w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-2 flex justify-center items-center gap-2"
      >
        <Plus size={18} />
        Add Task
      </button>

      <Droppable droppableId={list._id}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="space-y-4 min-h-[120px]"
          >
            {cards.map((card, index) => (
              <TaskCard
                key={card._id}
                index={index}
                card={card}
                list={list}
                users={users}
                comments={comments}
                commentText={commentText}
                typingUsers={typingUsers}
                handleAssignUser={handleAssignUser}
                handleCommentChange={handleCommentChange}
                handleSendComment={handleSendComment}
                handleDeleteComment={handleDeleteComment}
                handleDeleteCard={handleDeleteCard}
                openModal={openModal}
              />
            ))}

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}