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
    SendIcon,
} from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Textarea } from "../ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

interface VideoCardProps {
    src: string;
    username?: string;
    avatar?: string;
    points?: number;
    index: number;
    activeIndex: number;
}

export function VideoCard({
    src,
    username = "username",
    avatar = "https://api.dicebear.com/9.x/thumbs/svg?seed=user",
    points = 500,
    index,
    activeIndex,
}: VideoCardProps) {
    const videoRef = useRef<HTMLVideoElement | null>(null);

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


    return (
        <div className="relative h-screen w-full sm:w-[40%] mx-auto flex items-center justify-center bg-black snap-center">
            {/* Video Container */}
            <div className="relative h-full w-full rounded-2xl overflow-hidden">
                <video
                    ref={videoRef}
                    src={src}
                    className="h-full w-full object-cover"
                    muted
                    loop
                    playsInline
                />

                {/* Overlay gradient for better readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />

                {/* --- Top Info Bar --- */}
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

                    {/* Search Button */}
                    <div className="p-2 bg-white/10 rounded-full backdrop-blur hover:bg-white/20 cursor-pointer transition">
                        <Search className="text-white w-5 h-5" />
                    </div>
                </div>

                {/* --- Caption (Bottom Left) --- */}
                <div className="absolute bottom-16 left-5 text-white z-10 max-w-[80%]">
                    <h3 className="text-lg font-semibold">@{username}</h3>
                    <p className="text-sm text-gray-200">
                        Awesome video caption 🎵 #fun #trending
                    </p>
                </div>

                {/* --- Actions (Right Side) --- */}
                <div className="absolute right-5 bottom-24 flex flex-col gap-5 items-center z-10">
                    <Sheet>
                        <SheetTrigger asChild>
                            <div className="flex flex-col items-center">
                                <Button size="icon"
                                    variant="secondary"
                                    className="rounded-full bg-white/10 hover:bg-white/20 backdrop-blur"><MessageCircle /></Button>
                                <span className="text-white text-xs mt-1">comments</span>

                            </div>

                        </SheetTrigger>
                        <SheetContent>

                            <SheetTitle >
                                comment section
                            </SheetTitle>
                            <SheetDescription>
                                melat benatsh dekika chemrilgn ,
                                melat kfu nesh
                            </SheetDescription>

                            <SheetFooter
                            >
                                <div className="flex justify-between items-center ">
                                    <Textarea placeholder="comment on the ad" />
                                    <Button variant="secondary" className="ml-3" size="icon">
                                        <SendIcon />

                                    </Button>

                                </div>

                            </SheetFooter>

                        </SheetContent>
                    </Sheet>
                    <ActionButton icon={<BookmarkPlus />} label="Save" />
                    <Dialog>
                        <DialogTrigger>
                            <div className="flex flex-col items-center">
                                <Button size="icon"
                                    variant="secondary"
                                    className="rounded-full bg-white/10 hover:bg-white/20 backdrop-blur" ><Share2 /></Button>
                                <span className="text-white text-xs mt-1">Share</span>
                            </div>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Share to your frends?</DialogTitle>
                                <DialogDescription>
                                    copy the link and send to your frends
                                </DialogDescription>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                    <ActionButton icon={<ExternalLink />} label="Visit" />
                </div>
            </div>
        </div>
    );
}

// Reusable small action button component
function ActionButton({
    icon,
    label,
}: {
    icon: React.ReactNode;
    label: string;
}) {
    return (
        <div className="flex flex-col items-center">
            <Button
                size="icon"
                variant="secondary"
                className="rounded-full bg-white/10 hover:bg-white/20 backdrop-blur"
            >
                {icon}
            </Button>
            <span className="text-white text-xs mt-1">{label}</span>
        </div>
    );
}
