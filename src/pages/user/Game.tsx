import GameBox from "@/components/user/Game/GameBox";
import GameList from "@/components/user/Game/GameList";
import TopBar from "@/components/user/Game/TopBar";

export default function Game() {
  return (
    <div className="h-screen flex flex-col">

      {/* TopBar */}
      <TopBar />

      {/* Main */}
      <div className="flex flex-1 flex-col md:flex-row overflow-hidden">

        {/* Game List */}
        <div className="
          w-full
          md:w-64
          border-b md:border-b-0 md:border-r
        ">
          <GameList />
        </div>

        {/* Game Screen */}
        <div className="flex-1 overflow-auto">
          <GameBox />
        </div>

      </div>

    </div>
  );
}