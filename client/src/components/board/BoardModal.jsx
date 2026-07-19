import { X } from "lucide-react";

export default function BoardModal({
  modal,
  cfg,
  error,
  modalTitle,
  setModalTitle,
  modalDescription,
  setModalDescription,
  modalDueDate,
  setModalDueDate,
  closeModal,
  handleModalSubmit,
}) {
  if (!modal || !cfg) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 z-40"
        onClick={closeModal}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl text-white">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700 p-5">
          <h2 className="text-xl font-semibold">
            {cfg.title}
          </h2>

          <button
            onClick={closeModal}
            className="rounded-lg p-2 hover:bg-slate-800"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">

          {error && (
            <div className="rounded-lg bg-red-900/40 border border-red-600 p-3 text-red-300 text-sm">
              {error}
            </div>
          )}

          {cfg.showTitle && (
            <div>
              <label className="block mb-2 text-sm">
                Task Title
              </label>

              <input
                type="text"
                value={modalTitle}
                onChange={(e) => setModalTitle(e.target.value)}
                className="w-full rounded-lg border border-slate-600 bg-slate-800 p-3 outline-none focus:border-blue-500"
              />
            </div>
          )}

          {cfg.showDesc && (
            <div>
              <label className="block mb-2 text-sm">
                Description
              </label>

              <textarea
                rows="4"
                value={modalDescription}
                onChange={(e) =>
                  setModalDescription(e.target.value)
                }
                className="w-full rounded-lg border border-slate-600 bg-slate-800 p-3 outline-none focus:border-blue-500"
              />
            </div>
          )}

          {cfg.showDueDate && (
            <div>
              <label className="block mb-2 text-sm">
                Due Date
              </label>

              <input
                type="date"
                value={modalDueDate}
                onChange={(e) =>
                  setModalDueDate(e.target.value)
                }
                className="w-full rounded-lg border border-slate-600 bg-slate-800 p-3 outline-none focus:border-blue-500"
              />
            </div>
          )}

          {cfg.isDanger && (
            <p className="text-red-300">
              Are you sure you want to delete this list?
            </p>
          )}

        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-slate-700 p-5">

          <button
            onClick={closeModal}
            className="rounded-xl border border-slate-600 px-5 py-2 hover:bg-slate-800"
          >
            Cancel
          </button>

          <button
            onClick={handleModalSubmit}
            className={`rounded-xl px-5 py-2 font-medium ${
              cfg.isDanger
                ? "bg-red-600 hover:bg-red-500"
                : "bg-blue-600 hover:bg-blue-500"
            }`}
          >
            {cfg.confirmLabel}
          </button>

        </div>

      </div>
    </>
  );
}