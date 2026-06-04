import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";

import { fetchDataFromApi } from "../utils/api";

export const Context = createContext(null);

export const AppContext = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("Home");
    const [nextPageToken, setNextPageToken] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [mobileMenu, setMobileMenu] = useState(false);

    const getSearchQuery = (query) => {
        if (!query || query === "Home") {
            return "Trending";
        }
        return query;
    };

    const fetchSelectedCategoryData = useCallback(
        async (query, signal, append = false, pageToken = undefined) => {
            if (append) {
                setLoadingMore(true);
            } else {
                setLoading(true);
                setError("");
                setHasMore(true);
            }

            try {
                const data = await fetchDataFromApi("search/", {
                    params: { q: getSearchQuery(query), pageToken, hl: "en", gl: "US" },
                    signal,
                });

                const contents = Array.isArray(data?.contents) ? data.contents : [];
                setSearchResults((prevResults) =>
                    append ? [...prevResults, ...contents] : contents
                );
                setNextPageToken(data.nextPageToken || null);
                setHasMore(Boolean(data.nextPageToken));
            } catch (err) {
                if (err.name !== "CanceledError") {
                    if (!append) {
                        setSearchResults([]);
                        setError(err.message);
                    }
                }
            } finally {
                if (append) {
                    setLoadingMore(false);
                } else {
                    setLoading(false);
                }
            }
        },
        []
    );

    useEffect(() => {
        const controller = new AbortController();
        fetchSelectedCategoryData(selectedCategory, controller.signal);
        return () => controller.abort();
    }, [selectedCategory, fetchSelectedCategoryData]);

    const loadMoreVideos = useCallback(() => {
        if (!nextPageToken || loadingMore || loading) {
            return;
        }

        const controller = new AbortController();
        fetchSelectedCategoryData(selectedCategory, controller.signal, true, nextPageToken);
        return () => controller.abort();
    }, [fetchSelectedCategoryData, nextPageToken, loading, loadingMore, selectedCategory]);

    const value = useMemo(
        () => ({
            loading,
            loadingMore,
            error,
            searchResults,
            selectedCategory,
            setSelectedCategory,
            mobileMenu,
            setMobileMenu,
            fetchSelectedCategoryData,
            loadMoreVideos,
            hasMore,
        }),
        [
            loading,
            loadingMore,
            error,
            searchResults,
            selectedCategory,
            mobileMenu,
            fetchSelectedCategoryData,
            loadMoreVideos,
            hasMore,
        ]
    );

    return <Context.Provider value={value}>{children}</Context.Provider>;
};
