/*eslint-disable */
import { useEffect, useState } from "react";
import { VideoCard } from "@/components/user/VideoCard";

export default function Home() {
    const [videos, setVideos] = useState<string[]>([]);

    useEffect(() => {
        fetch("https://api.pexels.com/videos/search?query=nature&per_page=1", {
            headers: {
                Authorization: import.meta.env.VITE_PEXELS_API_KEY,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                const urls = data.videos.map((v: any) => v.video_files[0].link);
                setVideos(urls);
            });
    }, []);

    return (
        <>
            {videos.map((url, i) => (
                <VideoCard src={url} index={i} activeIndex={i} />
            ))}
        </>
    );
}
