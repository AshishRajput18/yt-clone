import { useEffect } from "react";

const DEFAULT_DESCRIPTION =
    "A polished React YouTube clone with responsive video discovery, search, playback, and channel pages.";

const setMeta = (name, content, attribute = "name") => {
    let tag = document.querySelector(`meta[${attribute}="${name}"]`);

    if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attribute, name);
        document.head.appendChild(tag);
    }

    tag.setAttribute("content", content);
};

export const usePageMeta = ({ title, description = DEFAULT_DESCRIPTION, image }) => {
    useEffect(() => {
        const pageTitle = title ? `${title} | StreamHub` : "StreamHub";
        document.title = pageTitle;

        setMeta("description", description);
        setMeta("og:title", pageTitle, "property");
        setMeta("og:description", description, "property");
        setMeta("og:type", "website", "property");
        setMeta("twitter:card", "summary_large_image");

        if (image) {
            setMeta("og:image", image, "property");
            setMeta("twitter:image", image);
        }
    }, [title, description, image]);
};
