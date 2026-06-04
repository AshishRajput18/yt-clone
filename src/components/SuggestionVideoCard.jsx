import React from "react";
import { Link } from "react-router-dom";

import VideoLength from "../shared/videoLength";
import { compactNumber, getBestThumbnail, publishedFromNow, safeText } from "../utils/formatters";

const SuggestionVideoCard = ({ video }) => {
    if (!video?.videoId) {
        return null;
    }

    return (
        <article className="group flex min-w-0 gap-3">
            <Link
                to={`/video/${video.videoId}`}
                className="relative aspect-video w-40 shrink-0 overflow-hidden rounded-lg bg-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 sm:w-44"
                aria-label={`Watch ${safeText(video.title)}`}
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
                    className="line-clamp-2 text-sm font-semibold leading-5 text-white hover:text-zinc-200"
                >
                    {safeText(video.title)}
                </Link>
                <p className="mt-1 truncate text-xs text-zinc-400">
                    {safeText(video.author?.title, "Unknown channel")}
                </p>
                <p className="text-xs text-zinc-500">
                    {compactNumber(video.stats?.views)} views • {publishedFromNow(video.publishedTimeText)}
                </p>
            </div>
        </article>
    );
};

export default React.memo(SuggestionVideoCard);
