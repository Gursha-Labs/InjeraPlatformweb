import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    MessageCircle,

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
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { AdVideo } from "@/types/models/adVideo";
import { AdvertiserHoverCard } from "./AdvertiserHoverCard";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import ShareDialog from "./ShareDialog";
import { Link } from "react-router-dom";


interface VideoCardProps {
    v: AdVideo
    index: number;
    activeIndex: number;
}

export function VideoCard({
    v,
    index,
    activeIndex,
}: VideoCardProps) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    console.log(v)
    const points = 500
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



    const myCallback = () => (console.log('Video has ended'));

    return (
        <div
            className={cn(
                "relative h-screen w-full sm:w-[40%] mx-auto flex items-center justify-center snap-center",
                "bg-background text-foreground"
            )}
        >
            {/* Video Container */}
            <div className="relative h-full w-full rounded-2xl overflow-hidden">
                <video
                    ref={videoRef}
                    src={v.video_url}
                    className="h-full w-full object-cover"
                    onEnded={() => myCallback()}
                    playsInline
                />

                {/* Overlay gradient */}
                <div className="absolute inset-0  pointer-events-none" />

                {/* --- Top Info Bar --- */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
                    {/* ---info about the adveritser--- */}
                    <div>
                        <div className="flex items-center gap-2 bg-muted/40 backdrop-blur-md px-3 py-1 rounded-full mb-2">
                            <Coins className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm font-medium">{points}</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <Link to="/profile">
                                <Avatar>
                                    <AvatarImage src={v.advertiser?.avatar || "/placeholder-avatar.png"} />
                                    <AvatarFallback>
                                        {v.advertiser?.username?.charAt(0).toUpperCase() || "U"}
                                    </AvatarFallback>
                                </Avatar>
                            </Link>

                            <AdvertiserHoverCard v={v} />
                        </div>
                    </div>

                    {/* Search Button */}
                    <div className="p-2 rounded-full bg-muted/10 backdrop-blur hover:bg-muted/20 cursor-pointer transition">
                        <Link to="/search"><Search className="w-5 h-5" /></Link>
                    </div>
                </div>
                {/* -----tag section */}
                <div className="absolute bottom-16 left-5 max-w-[80%] z-10">
                    <h3 className="text-lg font-semibold">@{v.advertiser?.username}</h3>
                    <p className="text-sm text-muted-foreground">
                        {
                            v.tags.map((el) => el)
                        }
                    </p>
                </div>
                {/* actions section  */}
                <div className="absolute right-5 bottom-24 flex flex-col gap-5 items-center z-10">
                    <Sheet>
                        <SheetTrigger asChild>
                            <ActionButton icon={<MessageCircle />} label="Comments" />
                        </SheetTrigger>
                        <SheetContent>
                            <SheetTitle>Comment Section</SheetTitle>
                            <SheetDescription>
                                melat benatsh dekika chemrilgn , melat kfu nesh
                            </SheetDescription>
                            <SheetFooter>
                                <div className="flex justify-between items-center">
                                    <Textarea placeholder="Comment on the ad" />
                                    <Button variant="secondary" size="icon" className="ml-3">
                                        <SendIcon />
                                    </Button>
                                </div>
                            </SheetFooter>
                        </SheetContent>
                    </Sheet>

                    <ActionButton icon={<BookmarkPlus />} label="Save" />

                    <ShareDialog v={v} />

                    <ActionButton icon={<ExternalLink />} label="Visit" />
                </div>
            </div>
        </div >
    );
}

export function ActionButton({ icon, label }: { icon: React.ReactNode; label: string }) {
    return (
        <div className="flex flex-col items-center">
            <Button
                size="icon"
                variant="secondary"
                className="rounded-full bg-muted/10 hover:bg-muted/20 backdrop-blur"
            >
                {icon}
            </Button>
            <span className="text-xs mt-1 text-foreground">{label}</span>
        </div>
    );
}
