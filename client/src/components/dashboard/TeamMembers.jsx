import Card from "../ui/Card";

const members = [
  "Ganesh",
  "Rahul",
  "Sai",
  "John",
];

export default function TeamMembers() {
  return (
    <Card>
      <h2 className="text-xl font-bold mb-5">
        Team Members
      </h2>

      <div className="flex gap-3">
        {members.map((member) => (
          <div
            key={member}
            className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center font-bold"
            title={member}
          >
            {member[0]}
          </div>
        ))}
      </div>

      <p className="text-slate-400 mt-6">
        4 members currently active
      </p>
    </Card>
  );
}