import React from "react";
import { Link } from "react-router-dom";

import VideoLength from "../shared/videoLength";
import {
    compactNumber,
    getBestThumbnail,
    publishedFromNow,
    safeText,
} from "../utils/formatters";

const SearchResultVideoCard = ({ video }) => {
    if (!video?.videoId) {
        return null;
    }

    const title = safeText(video.title);
    const channelId = video.author?.channelId;

    return (
        <article className="group flex min-w-0 flex-col gap-3 sm:flex-row">
            <Link
                to={`/video/${video.videoId}`}
                className="relative block aspect-video w-full shrink-0 overflow-hidden rounded-xl bg-zinc-900 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 sm:w-64 lg:w-80"
                aria-label={`Watch ${title}`}
            >
                <img
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    src={getBestThumbnail(video.thumbnails)}
                    alt=""
                    loading="lazy"
                />
                <VideoLength time={video.lengthSeconds} />
            </Link>
            <div className="min-w-0 flex-1">
                <Link
                    to={`/video/${video.videoId}`}
                    className="line-clamp-2 text-base font-semibold leading-6 text-white hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 md:text-lg"
                >
                    {title}
                </Link>
                <p className="mt-1 text-sm text-zinc-500">
                    {compactNumber(video.stats?.views)} views • {publishedFromNow(video.publishedTimeText)}
                </p>
                <Link
                    to={channelId ? `/channel/${channelId}` : "#"}
                    className="mt-3 flex w-fit max-w-full items-center gap-2 rounded-full pr-3 text-sm text-zinc-400 transition hover:text-white"
                >
                    <span className="h-7 w-7 shrink-0 overflow-hidden rounded-full bg-zinc-800">
                        <img
                            className="h-full w-full object-cover"
                            src={getBestThumbnail(video.author?.avatar)}
                            alt=""
                            loading="lazy"
                        />
                    </span>
                    <span className="truncate">{safeText(video.author?.title, "Unknown channel")}</span>
                </Link>
                {video.descriptionSnippet && (
                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-zinc-400">
                        {safeText(video.descriptionSnippet)}
                    </p>
                )}
            </div>
        </article>
    );
};

export default React.memo(SearchResultVideoCard);
