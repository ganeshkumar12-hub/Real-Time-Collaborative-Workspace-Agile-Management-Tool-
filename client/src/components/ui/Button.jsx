import { motion } from "framer-motion";

export default function Button({
  children,
  onClick,
  type = "button",
  className = "",
  disabled = false,
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
      px-5
      py-3
      rounded-xl
      bg-blue-600
      hover:bg-blue-700
      transition
      font-semibold
      shadow-lg
      shadow-blue-600/20
      disabled:opacity-50
      ${className}
      `}
    >
      {children}
    </motion.button>
  );
}