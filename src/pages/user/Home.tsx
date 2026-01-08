import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { VideoCard } from "@/components/user/VideoCard";
import { fetchAdFeed } from "@/api/feed";
import { cn } from "@/lib/utils";
import { Loading } from "@/components/Loading";

export default function Home() {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
    } = useInfiniteQuery({
        queryKey: ["videos"],
        initialPageParam: 1,
        queryFn: ({ pageParam }) => fetchAdFeed({ pageParam }),
        getNextPageParam: (lastPage) =>
            lastPage.has_more ? lastPage.nextPage : undefined,
    });


    const [activeIndex, setActiveIndex] = useState(0);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!loadMoreRef.current || !hasNextPage) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 0.8 }
        );

        observer.observe(loadMoreRef.current);
        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    const allVideos =
        data?.pages.flatMap((page) => page.data) || [];

    if (status === "pending")
        return (
            <div className="flex flex-col gap-4 items-center justify-center h-screen bg-background text-foreground">
                <Loading />
            </div>
        );

    if (status === "error")
        return (
            <p className="text-center mt-10 text-destructive">
                Failed to load videos.
            </p>
        );

    return (
        <div
            className={cn(
                "h-screen w-full overflow-y-scroll snap-y snap-mandatory scrollbar-none",
                "bg-background text-foreground"
            )}
            onScroll={(e) => {
                const scrollTop = e.currentTarget.scrollTop;
                const windowHeight = window.innerHeight;
                const index = Math.round(scrollTop / windowHeight);
                setActiveIndex(index);
            }}
        >


            {allVideos.map((v, i) => (

                <div key={v.id || i} className="snap-center">
                    <VideoCard
                        v={v}
                        index={i}
                        activeIndex={activeIndex}
                    />


                </div>
            ))}

            {/* Infinite scroll trigger */}
            <div
                ref={loadMoreRef}
                className="h-20 w-full flex justify-center items-center text-muted-foreground"
            >
                {isFetchingNextPage && <p>Loading more videos...</p>}
            </div>
        </div>
    );
}
