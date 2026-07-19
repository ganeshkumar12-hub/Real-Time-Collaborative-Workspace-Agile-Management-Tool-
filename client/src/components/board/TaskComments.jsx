import { MessageSquare, Send } from "lucide-react";

export default function TaskComments({
  card,
  comments,
  commentText,
  typingUsers,
  handleCommentChange,
  handleSendComment,
  handleDeleteComment,
}) {
  return (
    <div className="mt-5 border-t border-slate-700 pt-4">

      <div className="flex items-center gap-2 mb-3">
        <MessageSquare size={18} />

        <span className="font-medium">
          Comments
        </span>
      </div>

      {(comments[card._id] || []).map(
        (comment) => (
          <div
            key={comment._id}
            className="mb-2 rounded-lg bg-slate-700 p-2"
          >
            <div className="flex justify-between">

              <p className="text-sm">
                <strong>
                  {comment.author?.name}
                </strong>
                : {comment.text}
              </p>

              <button
                onClick={() =>
                  handleDeleteComment(
                    comment._id
                  )
                }
                className="text-red-400"
              >
                ✕
              </button>

            </div>
          </div>
        )
      )}

      {typingUsers[card._id] && (
        <p className="text-xs italic text-blue-400 mb-2">
          {typingUsers[card._id]} is typing...
        </p>
      )}

      <div className="flex gap-2">

        <input
          value={
            commentText[card._id] || ""
          }
          onChange={(e) =>
            handleCommentChange(
              card._id,
              e.target.value
            )
          }
          onKeyDown={(e) =>
            e.key === "Enter" &&
            handleSendComment(card._id)
          }
          placeholder="Write a comment..."
          className="flex-1 rounded-lg bg-slate-700 border border-slate-600 px-3 py-2"
        />

        <button
          onClick={() =>
            handleSendComment(card._id)
          }
          className="rounded-lg bg-blue-600 hover:bg-blue-500 px-4"
        >
          <Send size={16} />
        </button>

      </div>

    </div>
  );
}