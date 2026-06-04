import { abbreviateNumber } from "js-abbreviation-number";
import moment from "moment";

export const fallbackThumbnail =
    "https://placehold.co/640x360/18181b/f8fafc?text=No+Preview";

export const getBestThumbnail = (thumbnails = []) => {
    if (!Array.isArray(thumbnails) || thumbnails.length === 0) {
        return fallbackThumbnail;
    }

    return thumbnails[thumbnails.length - 1]?.url || fallbackThumbnail;
};

export const compactNumber = (value) => {
    const number = Number(value || 0);
    return number > 0 ? abbreviateNumber(number, 1) : "0";
};

export const publishedFromNow = (date) => {
    if (!date) {
        return "Recently";
    }

    if (typeof date === "string" && /ago|streamed|premiered|scheduled/i.test(date)) {
        return date;
    }

    const parsedDate = moment(date);
    return parsedDate.isValid() ? parsedDate.fromNow() : "Recently";
};

export const safeText = (value, fallback = "Untitled") => {
    return typeof value === "string" && value.trim() ? value : fallback;
};
