import Card from "../ui/Card";
import Input from "../ui/Input";
import Button from "../ui/Button";

export default function CreateBoardCard({
  boardName,
  setBoardName,
  handleCreateBoard,
}) {
  return (
    <Card>

      <h2 className="text-xl font-bold mb-5">
        Create New Board
      </h2>

      <Input
        placeholder="Board Name"
        value={boardName}
        onChange={(e) =>
          setBoardName(e.target.value)
        }
      />

      <Button
        className="mt-5 w-full"
        onClick={handleCreateBoard}
      >
        + Create Board
      </Button>

    </Card>
  );
}