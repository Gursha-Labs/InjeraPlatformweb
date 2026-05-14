import { Card } from "@/components/ui/card";

export default function GameBox() {
  return (
    <div className="p-4 md:p-6 h-full">
      <Card
        className="
        h-full
        flex
        items-center
        justify-center
        text-center
        p-6
      "
      >
        <div className="space-y-2">
          <h2 className="text-xl md:text-2xl font-bold">Select a Game</h2>

          <p className="text-sm md:text-base text-muted-foreground">
            Choose a game from the list to start playing.
          </p>
        </div>
      </Card>
    </div>
  );
}
