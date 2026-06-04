import React from "react";
import { Link } from "react-router-dom";

import VideoLength from "../shared/videoLength";
import {
    compactNumber,
    getBestThumbnail,
    publishedFromNow,
    safeText,
} from "../utils/formatters";

const VideoCard = ({ video }) => {
    if (!video?.videoId) {
        return null;
    }

    const title = safeText(video.title);
    const channelId = video.author?.channelId;

    return (
        <article className="group min-w-0 overflow-hidden rounded-3xl bg-zinc-950 shadow-sm shadow-black/20 transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40">
            <Link
                to={`/video/${video.videoId}`}
                className="block overflow-hidden rounded-t-3xl bg-zinc-900 outline-none ring-0"
                aria-label={`Watch ${title}`}
            >
                <div className="relative aspect-video bg-zinc-900">
                    <img
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        src={getBestThumbnail(video.thumbnails)}
                        alt=""
                        loading="lazy"
                    />
                    <VideoLength time={video.lengthSeconds} />
                </div>
            </Link>
            <div className="p-4">
                <div className="mb-3 flex items-start gap-3">
                <Link
                    to={channelId ? `/channel/${channelId}` : "#"}
                    className="h-11 w-11 shrink-0 overflow-hidden rounded-full bg-zinc-900 ring-1 ring-white/10"
                    aria-label={`Open ${safeText(video.author?.title, "channel")}`}
                >
                    <img
                        className="h-full w-full object-cover"
                        src={getBestThumbnail(video.author?.avatar)}
                        alt=""
                        loading="lazy"
                    />
                </Link>
                <div className="min-w-0 flex-1">
                    <Link
                        to={`/video/${video.videoId}`}
                        className="line-clamp-2 text-sm font-semibold leading-5 text-white transition hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                    >
                        {title}
                    </Link>
                    <Link
                        to={channelId ? `/channel/${channelId}` : "#"}
                        className="mt-1 block truncate text-sm text-zinc-400 transition hover:text-white"
                    >
                        {safeText(video.author?.title, "Unknown channel")}
                    </Link>
                    <p className="mt-2 truncate text-sm text-zinc-500">
                        {compactNumber(video.stats?.views)} views • {publishedFromNow(video.publishedTimeText)}
                    </p>
                </div>
            </div>
        </div>
        </article>
    );
};

export default React.memo(VideoCard);
