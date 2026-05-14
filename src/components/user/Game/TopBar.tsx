import { fetchuserprofile } from "@/api/profile";
import { useQuery } from "@tanstack/react-query";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function TopBar() {
  const { data, isLoading } = useQuery({
    queryKey: ["fetchuserprofile"],
    queryFn: fetchuserprofile,
  });

  const profile = data?.profile;

  if (isLoading) {
    return (
      <div className="w-full h-16 flex items-center justify-between px-6 border-b">
        <Skeleton className="h-6 w-24" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-16 flex items-center justify-between px-6 border-b bg-background">
      {/* Game title */}
      <h1 className="text-lg font-semibold">🎮 Game</h1>

      {/* Right section */}
      <div className="flex items-center gap-4">
        {/* Points */}
        <Badge variant="secondary" className="flex gap-1 items-center">
          🪙 {Number(profile?.points_balance).toLocaleString()}
        </Badge>

        {/* Money */}
        <Badge variant="outline" className="flex gap-1 items-center">
          💰 ${Number(profile?.money_balance).toFixed(2)}
        </Badge>

        {/* User */}
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage
              src={`http://localhost:8000/storage/${profile?.profile_picture}`}
            />
            <AvatarFallback>{profile?.first_name?.[0]}</AvatarFallback>
          </Avatar>

          <span className="text-sm font-medium">{profile?.first_name}</span>
        </div>
      </div>
    </div>
  );
}
