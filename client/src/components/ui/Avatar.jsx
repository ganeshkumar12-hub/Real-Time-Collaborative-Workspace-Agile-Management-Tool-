export default function Avatar({
  name = "G",
}) {
  return (
    <div
      className="
      h-11
      w-11
      rounded-full
      bg-blue-600
      flex
      items-center
      justify-center
      font-bold
      text-lg
      "
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}