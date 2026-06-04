import React from "react";

import { AiFillHome, AiFillLike, AiOutlineClockCircle, AiOutlineFlag, AiOutlineHistory, AiOutlineVideoCamera } from "react-icons/ai";
import { MdLocalFireDepartment, MdOutlineSubscriptions, MdPlaylistPlay } from "react-icons/md";
import { FiSettings, FiHelpCircle } from "react-icons/fi";

export const sidebarItems = [
    { name: "Home", icon: <AiFillHome />, type: "home" },
    { name: "Shorts", icon: <AiOutlineVideoCamera />, type: "category" },
    { name: "Subscriptions", icon: <MdOutlineSubscriptions />, type: "category" },
    { name: "History", icon: <AiOutlineHistory />, type: "category" },
    { name: "Playlists", icon: <MdPlaylistPlay />, type: "category" },
    { name: "Watch Later", icon: <AiOutlineClockCircle />, type: "category" },
    { name: "Liked Videos", icon: <AiFillLike />, type: "category" },
    { name: "Trending", icon: <MdLocalFireDepartment />, type: "category", divider: true },
    { name: "Settings", icon: <FiSettings />, type: "menu" },
    { name: "Report History", icon: <AiOutlineFlag />, type: "menu" },
    { name: "Help", icon: <FiHelpCircle />, type: "menu" },
];

export const feedCategories = [
    { name: "Trending" },
    { name: "Music" },
    { name: "Gaming" },
    { name: "News" },
    { name: "Learning" },
    { name: "Technology" },
    { name: "Comedy" },
    { name: "Sports" },
    { name: "Movies" },
    { name: "Travel" },
];
