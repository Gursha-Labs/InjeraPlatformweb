import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    MessageCircle,
    Coins,
    Search,
    BookmarkPlus,
    ExternalLink,

} from "lucide-react";
import {
    Sheet,
    SheetContent,

    SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { AdVideo } from "@/types/models/adVideo";
import { AdvertiserHoverCard } from "./AdvertiserHoverCard";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import ShareDialog from "./ShareDialog";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { addVidoeFinshed, fetchUserPoints } from "@/api/feed";
import { useQuery } from "@tanstack/react-query";
import Comment from "./Comment";

interface VideoCardProps {
    v: AdVideo;
    index: number;
    activeIndex: number;
}

export function VideoCard({ v, index, activeIndex }: VideoCardProps) {
    const videoRef = useRef<HTMLVideoElement | null>(null);

    const { data, isLoading } = useQuery({
        queryKey: ["fetchUserPoints"],
        queryFn: fetchUserPoints,
        refetchInterval: 2000
    })

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        if (index === activeIndex) {
            video.play().catch(() => { });
        } else {
            video.pause();
            video.currentTime = 0;
        }
    }, [index, activeIndex]);
    const handleVideoFinish = async () => {
        await addVidoeFinshed(v.id)
    }

    return (
        <div
            className={cn(
                "relative h-screen w-full sm:w-[40%] mx-auto flex items-center justify-center snap-center"
            )}
        >
            <motion.div
                initial={{ opacity: 0.7, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="relative h-full w-full rounded-2xl overflow-hidden shadow-xl"
            >
                {/* Video */}
                <video
                    ref={videoRef}
                    src={`https://pub-7fa68a27c9094c06b1a9403bec80db5a.r2.dev/${v.video_url}`}
                    className="h-full w-full object-cover"
                    playsInline

                    onEnded={handleVideoFinish}
                />

                {/* 🔥 Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-black/70 z-10" />

                {/* ⭐ Top Section */}
                <div className="absolute top-5 left-5 right-5 flex items-start justify-between z-20">
                    <div>
                        {/* Coins */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 bg-white/20 backdrop-blur-md shadow-lg px-4 py-1.5 rounded-full"
                        >
                            <Coins className="w-4 h-4 text-yellow-300" />
                            <span className="text-sm font-semibold text-white">{isLoading ? <>Loading</> : data?.points}</span>
                        </motion.div>

                        {/* Advertiser */}
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="flex items-center gap-3 mt-3"
                        >
                            <Link to={`/injera/profile/${v.advertiser.id}`}>
                                <Avatar className="ring-2 ring-white/80 shadow">
                                    <AvatarImage src={v.advertiser.avatar} />
                                    <AvatarFallback>{v.advertiser.username?.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                            </Link>

                            <AdvertiserHoverCard v={v} />
                        </motion.div>
                    </div>

                    {/* Search Button */}
                    <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <Link
                            to="/injera/search"
                            className="p-2 rounded-full bg-white/20 backdrop-blur-md shadow hover:bg-white/30 transition"
                        >
                            <Search className="w-5 h-5 text-white" />
                        </Link>
                    </motion.div>
                </div>

                {/* 🔖 Tags + Title */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="absolute bottom-20 left-5 max-w-[80%] text-white z-20"
                >
                    <h2 className="text-lg font-semibold drop-shadow-md">{v.title}</h2>
                    <p className="text-xs text-gray-200 drop-shadow">
                        {v.tags.map((tag) => tag.name).join(" · ")}
                    </p>
                </motion.div>

                {/* Action Buttons */}
                <div className="absolute right-5 bottom-28 flex flex-col gap-6 items-center z-20">
                    <Sheet>
                        <SheetTrigger >
                            <ActionButton icon={<MessageCircle />} label="Comments" />
                        </SheetTrigger>
                        <SheetContent>
                            <Comment v={v} />
                        </SheetContent>
                    </Sheet>

                    <ActionButton icon={<BookmarkPlus />} label="Save" />
                    <ShareDialog v={v} />
                    <ActionButton icon={<ExternalLink />} label="Visit" />
                </div>
            </motion.div>
        </div>
    );
}

export function ActionButton({
    icon,
    label,
}: {
    icon: React.ReactNode;
    label: string;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center"
        >
            <Button
                size="icon"
                variant="secondary"
                className="rounded-full bg-white/20 text-white shadow backdrop-blur-md hover:bg-white/30 transition"
            >
                {icon}
            </Button>
            <span className="text-xs mt-1 text-white drop-shadow">{label}</span>
        </motion.div>
    );
}
