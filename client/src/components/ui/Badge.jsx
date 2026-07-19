export default function Badge({
  children,
}) {
  return (
    <span
      className="
      bg-green-600/20
      text-green-400
      px-3
      py-1
      rounded-full
      text-xs
      font-semibold
      "
    >
      {children}
    </span>
  );
}