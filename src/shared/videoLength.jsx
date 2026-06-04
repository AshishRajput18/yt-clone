const formatDuration = (duration) => {
    const totalSeconds = Number(duration || 0);

    if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) {
        return "";
    }

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    return [hours, minutes, seconds]
        .filter((value, index) => value > 0 || index > 0)
        .map((value, index) => (index === 0 ? `${value}` : `${value}`.padStart(2, "0")))
        .join(":");
};

const VideoLength = ({ time }) => {
    const duration = formatDuration(time);

    if (!duration) {
        return null;
    }

    return (
        <span className="absolute bottom-2 right-2 rounded bg-black/85 px-1.5 py-0.5 text-xs font-semibold text-white shadow">
            {duration}
        </span>
    );
};

export default VideoLength;
