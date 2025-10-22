/* eslint-disable */
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { VideoCard } from "@/components/user/VideoCard";

const fetchVideos = async ({ pageParam = 1 }) => {
    const res = await fetch(
        `https://api.pexels.com/videos/search?query=nature&per_page=5&page=${pageParam}`,
        {
            headers: {
                Authorization: import.meta.env.VITE_PEXELS_API_KEY,
            },
        }
    );

    if (!res.ok) throw new Error("Failed to fetch videos");
    const data = await res.json();

    const videos = data.videos.map((v: any) => ({
        id: v.id,
        url: v.video_files[0]?.link,
        username: v.user?.name || "Pexels User",
    }));

    return { videos, nextPage: pageParam + 1, hasMore: data.videos.length > 0 };
};

export default function Home() {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
    } = useInfiniteQuery({
        queryKey: ["videos"],
        queryFn: fetchVideos,
        initialPageParam: 1,
        getNextPageParam: (lastPage) =>
            lastPage.hasMore ? lastPage.nextPage : undefined,
    });

    const [activeIndex, setActiveIndex] = useState(0);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    // Infinite scroll observer (trigger load when near bottom)
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

    const allVideos = data?.pages.flatMap((page) => page.videos) || [];

    if (status === "pending")
        return <p className="text-center mt-10 text-white">Loading...</p>;
    if (status === "error")
        return (
            <p className="text-center mt-10 text-red-500">
                Failed to load videos.
            </p>
        );

    return (
        <div
            className="
        h-screen w-full
        overflow-y-scroll 
        snap-y snap-mandatory
        scrollbar-none 
        bg-black
      "
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
                        src={v.url}
                        username={v.username}
                        index={i}
                        activeIndex={activeIndex}
                    />
                </div>
            ))}

            {/* Infinite scroll trigger */}
            <div
                ref={loadMoreRef}
                className="h-20 w-full flex justify-center items-center text-white"
            >
                {isFetchingNextPage && <p>Loading more videos...</p>}
            </div>
        </div>
    );
}
