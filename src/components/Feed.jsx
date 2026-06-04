import React, { useContext, useEffect } from "react";

import { Context } from "../context/contextApi";
import { usePageMeta } from "../hooks/usePageMeta";
import EmptyState from "../shared/EmptyState";
import { VideoGridSkeleton } from "../shared/Skeletons";
import LeftNav from "./LeftNav";
import VideoCard from "./VideoCard";
import { feedCategories } from "../utils/constants";

const Feed = () => {
    const { loading, loadingMore, error, searchResults, selectedCategory, setSelectedCategory, loadMoreVideos, hasMore } = useContext(Context);

    usePageMeta({
        title: selectedCategory === "Home" ? "Home" : selectedCategory,
        description: `Watch the latest ${selectedCategory} videos on StreamHub.`,
    });

    useEffect(() => {
        document.getElementById("root")?.classList.remove("custom-h");
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (loading || loadingMore || !hasMore) return;
            const distanceFromBottom = document.documentElement.scrollHeight - window.scrollY - window.innerHeight;
            if (distanceFromBottom < 800) {
                loadMoreVideos();
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [hasMore, loadMoreVideos, loading, loadingMore]);

    const videos = searchResults.filter((item) => item?.type === "video" && item?.video);

    return (
        <main className="flex flex-1 overflow-auto bg-black">
            <LeftNav />
            <section className="min-w-0 flex-1 overflow-y-auto px-3 py-4 sm:px-5 lg:px-6">
                <div className="mx-auto w-full max-w-[1800px]">
                    <div className="mb-5 flex flex-wrap items-center gap-3 rounded-full border border-white/10 bg-zinc-950/80 p-3 shadow-sm shadow-black/20">
                        {feedCategories.map((item) => {
                            const active = selectedCategory === item.name;
                            return (
                                <button
                                    key={item.name}
                                    type="button"
                                    onClick={() => setSelectedCategory(item.name)}
                                    className={`rounded-full px-4 py-2 text-sm transition ${
                                        active
                                            ? "bg-white text-black shadow-lg shadow-white/10"
                                            : "bg-zinc-900 text-zinc-300 hover:bg-white/10 hover:text-white"
                                    }`}
                                >
                                    {item.name}
                                </button>
                            );
                        })}
                    </div>
                    <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                        {loading && <VideoGridSkeleton />}
                        {!loading && videos.map((item) => <VideoCard key={item.video.videoId} video={item.video} />)}
                    </div>

                    {!loading && error && (
                        <EmptyState title="Could not load videos" message={error} />
                    )}

                    {!loading && !error && videos.length === 0 && (
                        <EmptyState
                            title="No videos found"
                            message="Try a different category or search for something specific."
                        />
                    )}

                    {loadingMore && (
                        <div className="mt-8 flex justify-center py-8">
                            <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-white" />
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
};

export default Feed;
