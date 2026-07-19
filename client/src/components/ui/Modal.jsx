export default function Modal({
  children,
  open,
}) {
  if (!open) return null;

  return (
    <div
      className="
      fixed
      inset-0
      bg-black/60
      backdrop-blur-sm
      flex
      items-center
      justify-center
      z-50
      "
    >

      <div
        className="
        w-full
        max-w-lg
        rounded-2xl
        bg-slate-900
        border
        border-slate-800
        p-8
        "
      >
        {children}
      </div>

    </div>
  );
}