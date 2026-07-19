import { motion } from "framer-motion";

export default function Card({ children, className = "" }) {
  return (
    <motion.div
      whileHover={{
        y: -5,
      }}
      className={`
      rounded-2xl
      bg-slate-900
      border
      border-slate-800
      shadow-xl
      p-6
      ${className}
      `}
    >
      {children}
    </motion.div>
  );
}