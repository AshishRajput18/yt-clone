import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { usePageMeta } from "../hooks/usePageMeta";
import { fetchDataFromApi } from "../utils/api";
import EmptyState from "../shared/EmptyState";
import { ListSkeleton } from "../shared/Skeletons";
import LeftNav from "./LeftNav";
import SearchResultVideoCard from "./SearchResultVideoCard";

const SearchResult = () => {
    const { searchTerm = "" } = useParams();
    const decodedSearchTerm = decodeURIComponent(searchTerm);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [results, setResults] = useState([]);

    usePageMeta({
        title: `Search: ${decodedSearchTerm}`,
        description: `Search results for ${decodedSearchTerm} on StreamHub.`,
    });

    useEffect(() => {
        const controller = new AbortController();

        const fetchSearchResults = async () => {
            setLoading(true);
            setError("");

            try {
                const data = await fetchDataFromApi("search/", {
                    params: { q: decodedSearchTerm, hl: "en", gl: "US" },
                    signal: controller.signal,
                });
                setResults(Array.isArray(data?.contents) ? data.contents : []);
            } catch (err) {
                if (err.name !== "CanceledError") {
                    setResults([]);
                    setError(err.message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchSearchResults();
        return () => controller.abort();
    }, [decodedSearchTerm]);

    const videos = results.filter((item) => item?.type === "video" && item?.video);

    return (
        <main className="flex flex-1 overflow-auto bg-black">
            <LeftNav />
            <section className="min-w-0 flex-1 overflow-y-auto px-3 py-4 sm:px-5 lg:px-8">
                <div className="mx-auto w-full max-w-[1800px]">
                    <div className="mx-auto max-w-6xl">
                        <h1 className="mb-5 text-lg font-semibold text-white sm:text-xl">
                            Results for <span className="text-zinc-300">{decodedSearchTerm}</span>
                        </h1>
                        <div className="space-y-5">
                            {loading && <ListSkeleton />}
                            {!loading &&
                                videos.map((item) => (
                                    <SearchResultVideoCard key={item.video.videoId} video={item.video} />
                                ))}
                        </div>

                        {!loading && error && (
                            <EmptyState title="Search failed" message={error} />
                        )}

                        {!loading && !error && videos.length === 0 && (
                            <EmptyState
                                title="No matching videos"
                                message="Try a shorter query or a different keyword."
                            />
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
};

export default SearchResult;
