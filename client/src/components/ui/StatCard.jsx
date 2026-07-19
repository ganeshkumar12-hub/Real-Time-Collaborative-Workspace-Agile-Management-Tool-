import Card from "./Card";

export default function StatCard({
  title,
  value,
  icon,
}) {
  return (
    <Card>

      <div className="flex justify-between items-center">

        <div>

          <p className="text-slate-400">
            {title}
          </p>

          <h2 className="text-4xl font-bold mt-2">
            {value}
          </h2>

        </div>

        <div className="text-blue-500">
          {icon}
        </div>

      </div>

    </Card>
  );
}