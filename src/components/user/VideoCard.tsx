"use client";

import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    MessageCircle,
    Share2,
    Coins,
    Search,
    BookmarkPlus,
    ExternalLink,
} from "lucide-react";

interface VideoCardProps {
    src: string;
    index: number;
    activeIndex: number;
    username?: string;
    avatar?: string;
    points?: number;
}

export function VideoCard({
    src,
    index,
    activeIndex,
    username = "username",
    avatar = "https://api.dicebear.com/9.x/thumbs/svg?seed=user",
    points = 500,
}: VideoCardProps) {
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        if (index === activeIndex) {
            video.play();
        } else {
            video.pause();
            video.currentTime = 0;
        }
    }, [activeIndex, index]);

    return (
        <div className="relative h-screen w-full flex items-center justify-center snap-center bg-black">
            {/* Video Container */}
            <div
                className="
                relative 
                h-[90vh] w-full 
                sm:h-[98vh] sm:w-full 
                md:max-w-[520px] lg:max-w-[600px] 
                rounded-none sm:rounded-2xl 
                overflow-hidden shadow-2xl 
                border border-white/10
            "
            >
                <video
                    ref={videoRef}
                    src={src}
                    className="h-full w-full object-cover"
                    muted
                    loop
                    playsInline
                />

                {/* Top Info Bar */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white z-20">
                    <div>
                        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full mb-2">
                            <Coins className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm font-medium">{points}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <img
                                src={avatar}
                                alt={username}
                                className="w-10 h-10 rounded-full border-2 border-white object-cover"
                            />
                            <span className="font-semibold">@{username}</span>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="p-2 bg-white/10 rounded-full backdrop-blur hover:bg-white/20 cursor-pointer transition">
                        <Search className="text-white w-5 h-5" />
                    </div>
                </div>

                {/* Caption */}
                <div className="absolute bottom-16 left-5 text-white z-10 max-w-[80%]">
                    <h3 className="text-lg font-semibold">@{username}</h3>
                    <p className="text-sm text-gray-200">
                        Awesome video caption 🎵 #fun #trending
                    </p>
                </div>

                {/* Actions */}
                <div className="absolute right-5 bottom-24 flex flex-col gap-5 items-center z-10">
                    {/* Comment */}
                    <div className="flex flex-col items-center">
                        <Button
                            size="icon"
                            variant="secondary"
                            className="rounded-full bg-white/10 hover:bg-white/20 backdrop-blur"
                        >
                            <MessageCircle className="text-white w-5 h-5" />
                        </Button>
                        <span className="text-white text-xs mt-1">120</span>
                    </div>

                    {/* Save */}
                    <div className="flex flex-col items-center">
                        <Button
                            size="icon"
                            variant="secondary"
                            className="rounded-full bg-white/10 hover:bg-white/20 backdrop-blur"
                        >
                            <BookmarkPlus className="text-white w-5 h-5" />
                        </Button>
                        <span className="text-white text-xs mt-1">Save</span>
                    </div>

                    {/* Share */}
                    <div className="flex flex-col items-center">
                        <Button
                            size="icon"
                            variant="secondary"
                            className="rounded-full bg-white/10 hover:bg-white/20 backdrop-blur"
                        >
                            <Share2 className="text-white w-5 h-5" />
                        </Button>
                        <span className="text-white text-xs mt-1">Share</span>
                    </div>

                    {/* Visit */}
                    <div className="flex flex-col items-center">
                        <Button
                            size="icon"
                            variant="secondary"
                            className="rounded-full bg-white/10 hover:bg-white/20 backdrop-blur"
                        >
                            <ExternalLink className="text-white w-5 h-5" />
                        </Button>
                        <span className="text-white text-xs mt-1">Visit</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
