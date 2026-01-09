import { fetchsearchpagead } from "@/api/search"
import { useQuery } from "@tanstack/react-query"
import type { AdVideo } from "@/types/models/adVideo"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye } from "lucide-react"

type VideoCardProps = {
    video: AdVideo
}

export default function Search() {
    const { data, isLoading, error } = useQuery({
        queryKey: ["fetchsearchpagead"],
        queryFn: fetchsearchpagead,
    })

    if (error) {
        return (
            <div className="text-center text-destructive">
                Failed to load videos
            </div>
        )
    }

    return (
        <div className="px-4 py-3">
            {/* HEADER */}
            <h2 className="text-lg font-semibold mb-2">
                Discover
            </h2>

            <Separator className="mb-4" />

            {/* LOADING STATE */}
            {isLoading && (
                <div className="grid grid-cols-2 gap-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton
                            key={i}
                            className="aspect-[9/16] rounded-xl"
                        />
                    ))}
                </div>
            )}

            {/* VIDEO GRID */}
            {!isLoading && (
                <div className="grid grid-cols-2 gap-3">
                    {data?.data?.map((video: AdVideo) => (
                        <VideoCard key={video.id} video={video} />
                    ))}
                </div>
            )}
        </div>
    )
}

export function VideoCard({ video }: VideoCardProps) {
    return (
        <Card className="relative overflow-hidden aspect-[9/16] bg-black border-none cursor-pointer group">
            {/* VIDEO */}
            <video
                src={video.video_url}
                className="h-full w-full object-cover"
                muted
                playsInline
                onMouseEnter={(e) => e.currentTarget.play()}
                onMouseLeave={(e) => e.currentTarget.pause()}
            />

            {/* VIEW COUNT */}
            <Badge
                variant="secondary"
                className="absolute top-2 left-2 flex items-center gap-1 text-xs bg-black/60 text-white border-none"
            >
                <Eye size={14} />
                {video.view_count}
            </Badge>

            {/* INFO OVERLAY */}
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-white text-xs font-medium line-clamp-1">
                    {video.title}
                </p>
                <p className="text-white/70 text-[11px]">
                    @{video.advertiser.username}
                </p>
            </div>

            {/* HOVER EFFECT */}
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition" />
        </Card>
    )
}
