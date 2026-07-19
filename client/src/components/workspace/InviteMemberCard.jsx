import Card from "../ui/Card";
import Button from "../ui/Button";

export default function InviteMemberCard({
  users,
  selectedUser,
  setSelectedUser,
  handleInviteUser,
}) {
  return (
    <Card>

      <h2 className="text-xl font-bold mb-5">
        Invite Member
      </h2>

      <select
        value={selectedUser}
        onChange={(e) =>
          setSelectedUser(e.target.value)
        }
        className="w-full rounded-xl bg-slate-800 border border-slate-700 p-3 mb-5"
      >
        <option value="">
          Select User
        </option>

        {users.map((user) => (
          <option
            key={user._id}
            value={user._id}
          >
            {user.name} ({user.email})
          </option>
        ))}

      </select>

      <Button
        onClick={handleInviteUser}
        className="w-full"
      >
        Invite Member
      </Button>

    </Card>
  );
}