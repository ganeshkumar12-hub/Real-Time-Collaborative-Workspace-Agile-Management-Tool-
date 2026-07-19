import { DragDropContext } from "@hello-pangea/dnd";
import KanbanColumn from "./KanbanColumn";

export default function KanbanBoard({
  lists,
  cards,
  users,
  comments,
  commentText,
  typingUsers,
  handleDragEnd,
  handleAssignUser,
  handleCommentChange,
  handleSendComment,
  handleDeleteComment,
  handleDeleteCard,
  openModal,
}) {
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-6 overflow-x-auto pb-4">
        {lists.map((list) => (
          <KanbanColumn
            key={list._id}
            list={list}
            cards={cards[list._id] || []}
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
      </div>
    </DragDropContext>
  );
}