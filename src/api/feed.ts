/*eslint-disable*/
export const fetchVideos = async ({ pageParam = 1 }) => {
  try {
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
  } catch (err: any) {
    throw new Error(err.message);
  }
};
