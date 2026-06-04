import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import ytLogo from "../images/yt-logo.png";
import ytLogoMobile from "../images/yt-logo-mobile.png";

import { CgClose } from "react-icons/cg";
import { FiBell, FiMic } from "react-icons/fi";
import { IoIosSearch } from "react-icons/io";
import { RiVideoAddLine } from "react-icons/ri";
import { SlMenu } from "react-icons/sl";

import { Context } from "../context/contextApi";
import Loader from "../shared/loader";

const Header = () => {
    const { pathname } = useLocation();
    const searchTerm = useMemo(() => {
        const parts = pathname.split("/").filter(Boolean);
        return parts[0] === "search" ? parts.slice(1).join("/") : "";
    }, [pathname]);
    const [searchQuery, setSearchQuery] = useState(decodeURIComponent(searchTerm));
    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef(null);
    const { loading, mobileMenu, setMobileMenu } = useContext(Context);
    const navigate = useNavigate();
    const pageName = pathname?.split("/")?.filter(Boolean)?.[0];

    useEffect(() => {
        if (pageName === "search") {
            setSearchQuery(decodeURIComponent(searchTerm));
        }
    }, [pageName, searchTerm]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setProfileOpen(false);
            }
        };

        window.addEventListener("click", handleClickOutside);
        return () => window.removeEventListener("click", handleClickOutside);
    }, []);

    const submitSearch = () => {
        const trimmedQuery = searchQuery.trim();
        if (trimmedQuery) {
            navigate(`/search/${encodeURIComponent(trimmedQuery)}`);
            setMobileMenu(false);
        }
    };

    return (
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-2 border-b border-white/10 bg-black/90 px-3 text-white backdrop-blur md:px-5">
            {loading && <Loader />}

            <div className="flex min-w-0 items-center gap-1">
                {pageName !== "video" && (
                    <button
                        className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-red-500 md:hidden"
                        onClick={() => setMobileMenu((value) => !value)}
                        type="button"
                        aria-label={mobileMenu ? "Close navigation menu" : "Open navigation menu"}
                        aria-expanded={mobileMenu}
                    >
                        {mobileMenu ? <CgClose className="text-xl" /> : <SlMenu className="text-xl" />}
                    </button>
                )}
                <Link to="/" className="flex h-6 shrink-0 items-center" aria-label="StreamHub home">
                    <img className="hidden h-full md:block" src={ytLogo} alt="StreamHub" />
                    <img className="h-full md:hidden" src={ytLogoMobile} alt="StreamHub" />
                </Link>
            </div>

            <form
                className="flex min-w-0 flex-1 justify-center"
                onSubmit={(event) => {
                    event.preventDefault();
                    submitSearch();
                }}
                role="search"
            >
                <div className="flex w-full max-w-2xl">
                    <label className="sr-only" htmlFor="site-search">
                        Search videos
                    </label>
                    <input
                        id="site-search"
                        type="search"
                        className="h-10 min-w-0 flex-1 rounded-l-full border border-zinc-700 bg-zinc-950 px-4 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-blue-500"
                        onChange={(event) => setSearchQuery(event.target.value)}
                        placeholder="Search"
                        value={searchQuery}
                    />
                    <button
                        className="flex h-10 w-12 shrink-0 items-center justify-center rounded-r-full border border-l-0 border-zinc-700 bg-zinc-900 transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-red-500 md:w-16"
                        type="submit"
                        aria-label="Search"
                    >
                        <IoIosSearch className="text-xl" />
                    </button>
                </div>
            </form>

            <div className="flex shrink-0 items-center gap-2">
                <button
                    className="hidden h-10 w-10 items-center justify-center rounded-full transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-red-500 md:flex"
                    type="button"
                    aria-label="Voice search"
                >
                    <FiMic className="text-xl" />
                </button>
                <button
                    className="hidden h-10 w-10 items-center justify-center rounded-full transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-red-500 md:flex"
                    type="button"
                    aria-label="Create video"
                >
                    <RiVideoAddLine className="text-xl" />
                </button>
                <button
                    className="hidden h-10 w-10 items-center justify-center rounded-full transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-red-500 md:flex"
                    type="button"
                    aria-label="Notifications"
                >
                    <FiBell className="text-xl" />
                </button>
                <div className="relative" ref={profileRef}>
                    <button
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-zinc-900 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-red-500"
                        type="button"
                        onClick={() => setProfileOpen((value) => !value)}
                        aria-label="Open profile menu"
                    >
                        <img
                            className="h-8 w-8 rounded-full object-cover"
                            src="/dp.png"
                            alt="Ashish profile"
                            loading="lazy"
                        />
                    </button>
                    {profileOpen && (
                        <div className="absolute right-0 top-12 z-50 w-48 rounded-2xl border border-white/10 bg-zinc-950 p-3 text-sm shadow-2xl shadow-black/40">
                            <button
                                type="button"
                                className="mb-2 w-full rounded-xl px-3 py-2 text-left text-white transition hover:bg-white/5"
                            >
                                Your channel
                            </button>
                            <button
                                type="button"
                                className="mb-2 w-full rounded-xl px-3 py-2 text-left text-white transition hover:bg-white/5"
                            >
                                Purchases and memberships
                            </button>
                            <button
                                type="button"
                                className="w-full rounded-xl px-3 py-2 text-left text-white transition hover:bg-white/5"
                            >
                                Sign out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
