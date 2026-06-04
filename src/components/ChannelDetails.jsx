import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { usePageMeta } from "../hooks/usePageMeta";
import EmptyState from "../shared/EmptyState";
import { VideoGridSkeleton } from "../shared/Skeletons";
import { fetchDataFromApi } from "../utils/api";
import { compactNumber, getBestThumbnail, safeText } from "../utils/formatters";
import VideoCard from "./VideoCard";

const ChannelDetails = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [channel, setChannel] = useState(null);
    const [videos, setVideos] = useState([]);

    usePageMeta({
        title: safeText(channel?.title, "Channel"),
        description: `Watch videos from ${safeText(channel?.title, "this channel")} on StreamHub.`,
        image: getBestThumbnail(channel?.avatar),
    });

    useEffect(() => {
        const controller = new AbortController();

        const fetchChannel = async () => {
            setLoading(true);
            setError("");

            try {
                const [details, channelVideos] = await Promise.all([
                    fetchDataFromApi("channel/details/", {
                        params: { id, hl: "en", gl: "US" },
                        signal: controller.signal,
                    }),
                    fetchDataFromApi("channel/videos/", {
                        params: { id, hl: "en", gl: "US" },
                        signal: controller.signal,
                    }),
                ]);

                setChannel(details || null);
                setVideos(Array.isArray(channelVideos?.contents) ? channelVideos.contents : []);
            } catch (err) {
                if (err.name !== "CanceledError") {
                    setError(err.message);
                    setChannel(null);
                    setVideos([]);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchChannel();
        return () => controller.abort();
    }, [id]);

    const channelVideos = videos.filter((item) => item?.type === "video" && item?.video);

    return (
        <main className="flex-1 overflow-y-auto bg-black">
            {loading && (
                <section className="px-3 py-5 sm:px-5 lg:px-8">
                    <div className="mb-8 h-40 animate-pulse rounded-2xl bg-zinc-900" />
                    <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                        <VideoGridSkeleton />
                    </div>
                </section>
            )}

            {!loading && error && <EmptyState title="Channel unavailable" message={error} />}

            {!loading && !error && (
                <section className="px-3 py-5 sm:px-5 lg:px-8">
                    <div className="mb-8 overflow-hidden rounded-2xl border border-white/10 bg-zinc-950">
                        <div className="h-32 bg-gradient-to-r from-red-700 via-zinc-800 to-zinc-950 sm:h-44" />
                        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-end">
                            <img
                                className="-mt-14 h-24 w-24 rounded-full border-4 border-zinc-950 bg-zinc-800 object-cover sm:h-32 sm:w-32"
                                src={getBestThumbnail(channel?.avatar)}
                                alt=""
                                loading="lazy"
                            />
                            <div className="min-w-0 flex-1">
                                <h1 className="truncate text-2xl font-bold text-white sm:text-3xl">
                                    {safeText(channel?.title, "Channel")}
                                </h1>
                                <p className="mt-1 text-sm text-zinc-400">
                                    {compactNumber(channel?.stats?.subscribers)} subscribers
                                </p>
                                {channel?.description && (
                                    <p className="mt-3 line-clamp-2 max-w-3xl text-sm leading-6 text-zinc-400">
                                        {channel.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mx-auto grid max-w-[1800px] grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                        {channelVideos.map((item) => (
                            <VideoCard key={item.video.videoId} video={item.video} />
                        ))}
                    </div>

                    {channelVideos.length === 0 && (
                        <EmptyState
                            title="No channel videos"
                            message="This channel does not have videos available from the API right now."
                        />
                    )}
                </section>
            )}
        </main>
    );
};

export default ChannelDetails;
