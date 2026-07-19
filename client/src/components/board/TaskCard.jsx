import { Draggable } from "@hello-pangea/dnd";
import {
  Calendar,
  Edit,
  Trash2,
  User,
} from "lucide-react";

import TaskComments from "./TaskComments";

export default function TaskCard({
  card,
  index,
  list,
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
    <Draggable
      draggableId={card._id}
      index={index}
    >
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={provided.draggableProps.style}
          className="rounded-2xl bg-slate-800 border border-slate-700 p-4 shadow-lg hover:border-blue-500 transition-all"
        >
          <h3 className="font-semibold text-lg">
            {card.title}
          </h3>

          {card.description && (
            <p className="text-sm text-slate-400 mt-2">
              {card.description}
            </p>
          )}

          <div className="mt-4 space-y-3">

            {card.dueDate && (
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Calendar size={16} />

                {new Date(
                  card.dueDate
                ).toLocaleDateString()}
              </div>
            )}

            <div className="flex items-center gap-2">

              <User size={16} />

              <select
                value={
                  card.assignedTo?._id ||
                  card.assignedTo ||
                  ""
                }
                onChange={(e) =>
                  handleAssignUser(
                    list._id,
                    card._id,
                    e.target.value
                  )
                }
                className="flex-1 rounded-lg bg-slate-700 border border-slate-600 p-2 text-sm"
              >
                <option value="">
                  Assign User
                </option>

                {users.map((user) => (
                  <option
                    key={user._id}
                    value={user._id}
                  >
                    {user.name}
                  </option>
                ))}
              </select>

            </div>

          </div>

          <TaskComments
            card={card}
            comments={comments}
            commentText={commentText}
            typingUsers={typingUsers}
            handleCommentChange={
              handleCommentChange
            }
            handleSendComment={
              handleSendComment
            }
            handleDeleteComment={
              handleDeleteComment
            }
          />

          <div className="mt-5 flex gap-2">

            <button
              onClick={() =>
                openModal({
                  type: "editCard",
                  listId: list._id,
                  cardId: card._id,
                  title: card.title,
                  description:
                    card.description,
                  dueDate: card.dueDate,
                })
              }
              className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-500 py-2 flex justify-center items-center gap-2"
            >
              <Edit size={16} />

              Edit
            </button>

            <button
              onClick={() =>
                openModal({
                  type: "dueDate",
                  listId: list._id,
                  cardId: card._id,
                })
              }
              className="rounded-xl bg-yellow-600 hover:bg-yellow-500 px-4"
            >
              <Calendar size={18} />
            </button>

            <button
              onClick={() =>
                handleDeleteCard(
                  list._id,
                  card._id
                )
              }
              className="rounded-xl bg-red-600 hover:bg-red-500 px-4"
            >
              <Trash2 size={18} />
            </button>

          </div>

        </div>
      )}
    </Draggable>
  );
}