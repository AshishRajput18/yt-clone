const Loader = () => {
    return (
        <div className="fixed left-0 right-0 top-0 z-50 h-1 overflow-hidden bg-zinc-900" role="status" aria-label="Loading">
            <div className="h-full w-1/3 animate-[loading-bar_1.2s_ease-in-out_infinite] rounded-r-full bg-red-600" />
        </div>
    );
};

export default Loader;
