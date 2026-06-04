import axios from "axios";

const BASE_URL = "https://www.googleapis.com/youtube/v3";
const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY || process.env.VITE_YOUTUBE_API_KEY;

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 15000,
    params: { key: API_KEY || "" },
});

const getErrorMessage = (error) => {
    if (!API_KEY) {
        return "Missing YouTube Data API key. Add REACT_APP_YOUTUBE_API_KEY or VITE_YOUTUBE_API_KEY to your .env file.";
    }

    if (error.response?.status === 429) {
        return "The API rate limit was reached. Please try again later.";
    }

    if (error.response?.status === 401 || error.response?.status === 403) {
        return "The API key is invalid or not authorized for this endpoint.";
    }

    if (error.code === "ECONNABORTED") {
        return "The request timed out. Check your network and try again.";
    }

    return error.response?.data?.error?.message || error.response?.data?.message || "Unable to load videos right now.";
};

const parseIsoDuration = (duration) => {
    if (typeof duration !== "string") {
        return 0;
    }

    const matches = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!matches) {
        return 0;
    }

    const hours = Number(matches[1] || 0);
    const minutes = Number(matches[2] || 0);
    const seconds = Number(matches[3] || 0);

    return hours * 3600 + minutes * 60 + seconds;
};

const normalizeThumbnails = (thumbnails = {}) => {
    if (typeof thumbnails !== "object" || thumbnails === null) {
        return [];
    }

    return Object.values(thumbnails)
        .filter(Boolean)
        .sort((a, b) => (a.width || 0) - (b.width || 0))
        .map((thumb) => ({ url: thumb.url, width: thumb.width, height: thumb.height }));
};

const normalizeSearchVideo = (item) => {
    const snippet = item?.snippet || {};
    const videoId = item?.id?.videoId || item?.id;

    return {
        videoId,
        title: snippet.title,
        descriptionSnippet: snippet.description,
        thumbnails: normalizeThumbnails(snippet.thumbnails),
        lengthSeconds: 0,
        publishedTimeText: snippet.publishedAt,
        author: {
            channelId: snippet.channelId,
            title: snippet.channelTitle,
            avatar: normalizeThumbnails(snippet.thumbnails),
        },
        stats: {
            views: 0,
            likes: 0,
        },
    };
};

const normalizeVideoDetails = (item, channelData) => {
    const snippet = item?.snippet || {};
    const statistics = item?.statistics || {};
    const contentDetails = item?.contentDetails || {};

    return {
        videoId: item?.id,
        title: snippet.title,
        description: snippet.description,
        thumbnails: normalizeThumbnails(snippet.thumbnails),
        lengthSeconds: parseIsoDuration(contentDetails.duration),
        publishedTimeText: snippet.publishedAt,
        author: {
            channelId: snippet.channelId,
            title: snippet.channelTitle,
            avatar: channelData?.avatar || normalizeThumbnails(snippet.thumbnails),
            stats: {
                subscribers: Number(channelData?.stats?.subscribers || 0),
            },
        },
        stats: {
            views: Number(statistics.viewCount || 0),
            likes: Number(statistics.likeCount || 0),
        },
    };
};

const normalizeChannelDetails = (item) => {
    const snippet = item?.snippet || {};
    const statistics = item?.statistics || {};

    return {
        title: snippet.title,
        description: snippet.description,
        avatar: normalizeThumbnails(snippet.thumbnails),
        stats: {
            subscribers: Number(statistics.subscriberCount || 0),
        },
    };
};

const fetchChannelById = async (channelId, signal) => {
    const { data } = await api.get("/channels", {
        params: { part: "snippet,statistics", id: channelId },
        signal,
    });
    return data.items?.[0] || null;
};

const fetchSearchResults = async (params = {}, signal) => {
    const { q = "", relevanceLanguage, pageToken } = params;
    const { data } = await api.get("/search", {
        params: {
            part: "snippet",
            maxResults: 24,
            type: "video",
            q,
            pageToken,
            relevanceLanguage,
        },
        signal,
    });

    return {
        contents: Array.isArray(data.items)
            ? data.items.map((item) => ({ type: "video", video: normalizeSearchVideo(item) }))
            : [],
        nextPageToken: data.nextPageToken || null,
    };
};

const fetchVideoById = async (id, signal) => {
    const { data } = await api.get("/videos", {
        params: {
            part: "snippet,statistics,contentDetails",
            id,
        },
        signal,
    });

    const item = data.items?.[0] || null;
    if (!item) {
        return null;
    }

    const channelData = item?.snippet?.channelId
        ? await fetchChannelById(item.snippet.channelId, signal)
        : null;

    return normalizeVideoDetails(item, channelData ? normalizeChannelDetails(channelData) : null);
};

const fetchRelatedVideos = async (id, signal) => {
    const { data } = await api.get("/search", {
        params: {
            part: "snippet",
            relatedToVideoId: id,
            type: "video",
            maxResults: 24,
        },
        signal,
    });

    return {
        contents: Array.isArray(data.items)
            ? data.items.map((item) => ({ type: "video", video: normalizeSearchVideo(item) }))
            : [],
    };
};

const fetchChannelVideos = async (id, signal) => {
    const { data } = await api.get("/search", {
        params: {
            part: "snippet",
            channelId: id,
            type: "video",
            order: "date",
            maxResults: 24,
        },
        signal,
    });

    return {
        contents: Array.isArray(data.items)
            ? data.items.map((item) => ({ type: "video", video: normalizeSearchVideo(item) }))
            : [],
    };
};

export const fetchDataFromApi = async (url, config = {}) => {
    if (!API_KEY) {
        throw new Error(getErrorMessage({}));
    }

    const params = config.params || {};
    const signal = config.signal;

    try {
        switch (url) {
            case "search/":
                return await fetchSearchResults(params, signal);
            case "video/details/":
                return await fetchVideoById(params.id, signal);
            case "video/related-contents/":
                return await fetchRelatedVideos(params.id, signal);
            case "channel/details/": {
                const { data } = await api.get("/channels", {
                    params: {
                        part: "snippet,statistics",
                        id: params.id,
                    },
                    signal,
                });

                const item = data.items?.[0] || null;
                return item ? normalizeChannelDetails(item) : null;
            }
            case "channel/videos/":
                return await fetchChannelVideos(params.id, signal);
            default: {
                const { data } = await api.get(url, { params, signal });
                return data;
            }
        }
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
};
