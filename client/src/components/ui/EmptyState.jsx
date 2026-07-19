export default function EmptyState({
  title,
  subtitle,
}) {
  return (
    <div className="text-center py-20">

      <h2 className="text-3xl font-bold">
        {title}
      </h2>

      <p className="text-slate-400 mt-3">
        {subtitle}
      </p>

    </div>
  );
}