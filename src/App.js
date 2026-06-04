import React, { Suspense, lazy } from "react";
import { BrowserRouter, Navigate, Route, Routes, useParams } from "react-router-dom";

import Header from "./components/Header";
import { AppContext } from "./context/contextApi";
import Loader from "./shared/loader";

const Feed = lazy(() => import("./components/Feed"));
const SearchResult = lazy(() => import("./components/SearchResult"));
const VideoDetails = lazy(() => import("./components/VideoDetails"));
const ChannelDetails = lazy(() => import("./components/ChannelDetails"));
const NotFound = lazy(() => import("./components/NotFound"));

const LegacySearchRedirect = () => {
    const { searchTerm = "" } = useParams();
    return <Navigate to={`/search/${encodeURIComponent(searchTerm)}`} replace />;
};

const App = () => {
    return (
        <AppContext>
            <BrowserRouter>
                <div className="flex min-h-screen flex-col bg-black text-white">
                    <Header />
                    <Suspense fallback={<Loader />}>
                        <Routes>
                            <Route path="/" element={<Feed />} />
                            <Route path="/search/:searchTerm" element={<SearchResult />} />
                            <Route path="/searchResult/:searchTerm" element={<LegacySearchRedirect />} />
                            <Route path="/video/:id" element={<VideoDetails />} />
                            <Route path="/channel/:id" element={<ChannelDetails />} />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </Suspense>
                </div>
            </BrowserRouter>
        </AppContext>
    );
};

export default App;
