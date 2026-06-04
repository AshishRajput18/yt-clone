import React, { useEffect, useState, useContext } from "react";
import ReactPlayer from "react-player";
import { Link, useParams } from "react-router-dom";

import { usePageMeta } from "../hooks/usePageMeta";
import EmptyState from "../shared/EmptyState";
import { ListSkeleton } from "../shared/Skeletons";
import { fetchDataFromApi } from "../utils/api";
import { compactNumber, getBestThumbnail, safeText } from "../utils/formatters";
import SuggestionVideoCard from "./SuggestionVideoCard";
import { Context } from "../context/contextApi";

const normalizeRelatedContents = (data) => {
    if (!data) {
        return [];
    }

    if (Array.isArray(data)) {
        return data;
    }

    if (Array.isArray(data.contents)) {
        return data.contents;
    }

    if (Array.isArray(data.items)) {
        return data.items;
    }

    if (typeof data.contents === "object" && data.contents !== null) {
        return Object.values(data.contents).flatMap((item) => {
            if (Array.isArray(item?.contents)) {
                return item.contents;
            }
            if (Array.isArray(item?.items)) {
                return item.items;
            }
            return [];
        });
    }

    const firstArray = Object.values(data).find((value) => Array.isArray(value));
    return Array.isArray(firstArray) ? firstArray : [];
};

const VideoDetails = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [relatedLoading, setRelatedLoading] = useState(true);
    const [error, setError] = useState("");
    const [relatedError, setRelatedError] = useState("");
    const [video, setVideo] = useState(null);
    const [relatedVideos, setRelatedVideos] = useState([]);

    usePageMeta({
        title: safeText(video?.title, "Video"),
        description: safeText(video?.description, "Watch this video on StreamHub."),
        image: getBestThumbnail(video?.thumbnails),
    });

    useEffect(() => {
        const controller = new AbortController();

        const fetchVideo = async () => {
            setLoading(true);
            setRelatedLoading(true);
            setError("");
            setRelatedError("");

            const detailsRequest = fetchDataFromApi("video/details/", {
                params: { id, hl: "en", gl: "US" },
                signal: controller.signal,
            });

            const relatedRequest = fetchDataFromApi("video/related-contents/", {
                params: { id, hl: "en", gl: "US" },
                signal: controller.signal,
            });

            const [detailsResult, relatedResult] = await Promise.allSettled([
                detailsRequest,
                relatedRequest,
            ]);

            if (detailsResult.status === "fulfilled") {
                setVideo(detailsResult.value || null);
            } else if (detailsResult.reason?.name !== "CanceledError") {
                setVideo(null);
                setError(detailsResult.reason?.message || "Video details could not be loaded.");
            }

            if (relatedResult.status === "fulfilled") {
                setRelatedVideos(normalizeRelatedContents(relatedResult.value));
            } else if (relatedResult.reason?.name !== "CanceledError") {
                setRelatedVideos([]);
                setRelatedError(
                    relatedResult.reason?.message || "Related videos could not be loaded."
                );
            }

            setLoading(false);
            setRelatedLoading(false);
        };

        fetchVideo();
        return () => controller.abort();
    }, [id]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [id]);

    const { searchResults = [] } = useContext(Context);

    const related = relatedVideos.filter((item) => item?.video?.videoId);
    const relatedItems = related.map((item) => item.video);

    const fallbackFromContext = Array.isArray(searchResults)
        ? searchResults
              .filter((it) => it?.type === "video" && it?.video?.videoId && it.video.videoId !== id)
              .map((it) => it.video)
        : [];

    const suggestions = relatedItems.length > 0 ? relatedItems : fallbackFromContext;
    const channelId = video?.author?.channelId;

    return (
        <main className="flex-1 overflow-y-auto bg-black px-3 py-4 sm:px-5 lg:px-8">
            <div className="mx-auto w-full max-w-[1800px]">
                {loading && (
                    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
                    <div className="space-y-4">
                        <div className="aspect-video animate-pulse rounded-2xl bg-zinc-900" />
                        <div className="h-7 w-3/4 animate-pulse rounded bg-zinc-900" />
                        <div className="h-20 animate-pulse rounded-xl bg-zinc-900" />
                    </div>
                    <div className="space-y-4">
                        <ListSkeleton count={6} />
                    </div>
                </div>
            )}

            {!loading && (
                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
                    <section className="min-w-0">
                        <div className="aspect-video overflow-hidden rounded-2xl bg-zinc-950 shadow-2xl shadow-black/50">
                            <ReactPlayer
                                key={id}
                                url={`https://www.youtube.com/watch?v=${id}`}
                                width="100%"
                                height="100%"
                                controls
                                playing={false}
                                config={{
                                    youtube: {
                                        playerVars: {
                                            origin: window.location.origin,
                                        },
                                    },
                                }}
                            />
                        </div>

                        <h1 className="mt-4 text-xl font-semibold leading-7 text-white md:text-2xl">
                            {safeText(video?.title, "YouTube video")}
                        </h1>

                        {error && (
                            <div className="mt-4 rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-4 text-sm leading-6 text-yellow-100">
                                Video is playable, but details could not be loaded: {error}
                            </div>
                        )}

                        {!error && video && (
                            <div className="mt-4 flex flex-col gap-4 rounded-2xl border border-white/10 bg-zinc-950/80 p-4 sm:flex-row sm:items-center sm:justify-between">
                            <Link
                                to={channelId ? `/channel/${channelId}` : "#"}
                                className="flex min-w-0 items-center gap-3"
                            >
                                <img
                                    className="h-11 w-11 shrink-0 rounded-full bg-zinc-800 object-cover"
                                    src={getBestThumbnail(video.author?.avatar)}
                                    alt=""
                                    loading="lazy"
                                />
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-white">
                                        {safeText(video.author?.title, "Unknown channel")}
                                    </p>
                                    <p className="text-xs text-zinc-500">
                                        {compactNumber(video.author?.stats?.subscribers)} subscribers
                                    </p>
                                </div>
                            </Link>
                            <div className="flex flex-wrap gap-2 text-sm text-zinc-300">
                                <span className="rounded-full bg-white/10 px-3 py-1">
                                    {compactNumber(video?.stats?.views)} views
                                </span>
                                <span className="rounded-full bg-white/10 px-3 py-1">
                                    {compactNumber(video?.stats?.likes)} likes
                                </span>
                            </div>
                            </div>
                        )}

                        {video?.description && (
                            <section className="mt-4 rounded-2xl border border-white/10 bg-zinc-950 p-4">
                                <h2 className="mb-2 text-sm font-semibold text-white">Description</h2>
                                <p className="whitespace-pre-line text-sm leading-6 text-zinc-300">
                                    {video.description}
                                </p>
                            </section>
                        )}
                    </section>

                    <aside className="min-w-0 space-y-4 xl:sticky xl:top-20 xl:max-h-[calc(100vh-6rem)] xl:overflow-y-auto" aria-label="Related videos">
                        <h2 className="text-base font-semibold text-white">Up next</h2>
                        {relatedLoading && <ListSkeleton count={6} />}
                        {suggestions.map((video) => (
                            <SuggestionVideoCard key={video.videoId} video={video} />
                        ))}
                        {!relatedLoading && relatedError && suggestions.length === 0 && (
                            <EmptyState title="Suggestions unavailable" message={relatedError} />
                        )}
                        {!relatedLoading && !relatedError && suggestions.length === 0 && (
                            <EmptyState
                                title="No related videos"
                                message="There are no suggestions for this video yet."
                            />
                        )}
                    </aside>
                </div>
            )}
            </div>
        </main>
    );
};

export default VideoDetails;
