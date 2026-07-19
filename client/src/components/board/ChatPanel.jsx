import { Send, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

export default function ChatPanel({
  chatMessages,
  chatText,
  setChatText,
  handleSendChat,
  chatEndRef,
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-lg"
    >
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare
          size={22}
          className="text-blue-400"
        />

        <h2 className="text-lg font-semibold">
          Team Chat
        </h2>
      </div>

      <div className="h-72 overflow-y-auto rounded-xl bg-slate-800 p-4 space-y-3">
        {chatMessages.length === 0 ? (
          <p className="text-slate-400">
            No messages yet.
          </p>
        ) : (
          chatMessages.map((msg) => (
            <div
              key={msg._id}
              className="rounded-xl bg-slate-700 p-3"
            >
              <p className="text-sm font-semibold text-blue-400">
                {msg.sender?.name || "Unknown"}
              </p>

              <p className="text-sm mt-1">
                {msg.message}
              </p>
            </div>
          ))
        )}

        <div ref={chatEndRef} />
      </div>

      <div className="mt-4 flex gap-3">
        <input
          type="text"
          placeholder="Type your message..."
          value={chatText}
          onChange={(e) =>
            setChatText(e.target.value)
          }
          onKeyDown={(e) =>
            e.key === "Enter" &&
            handleSendChat()
          }
          className="flex-1 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-blue-500"
        />

        <button
          onClick={handleSendChat}
          className="rounded-xl bg-blue-600 hover:bg-blue-500 px-5 flex items-center justify-center"
        >
          <Send size={18} />
        </button>
      </div>
    </motion.div>
  );
}