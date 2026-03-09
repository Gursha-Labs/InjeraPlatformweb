import { Card } from "@/components/ui/card";

const games = [
  { id: 1, name: "Spinner", icon: "🎡" },
  { id: 2, name: "Dice", icon: "🎲" },
  { id: 3, name: "Scratch", icon: "🪙" },
  { id: 4, name: "Wheel", icon: "🎯" },
];

export default function GameList() {
  return (
    <div
      className="
      flex
      md:flex-col
      gap-3
      p-3
      overflow-x-auto
      md:overflow-visible
    "
    >
      {games.map((game) => (
        <Card
          key={game.id}
          className="
            flex
            items-center
            gap-3
            p-4
            min-w-[140px]
            md:min-w-0
            cursor-pointer
            hover:bg-muted
            transition
          "
        >
          <span className="text-xl">{game.icon}</span>
          <span className="font-medium">{game.name}</span>
        </Card>
      ))}
    </div>
  );
}
