export const VideoGridSkeleton = ({ count = 12 }) => {
    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <div className="animate-pulse" key={index}>
                    <div className="aspect-video rounded-xl bg-zinc-900" />
                    <div className="mt-3 flex gap-3">
                        <div className="h-9 w-9 shrink-0 rounded-full bg-zinc-900" />
                        <div className="min-w-0 flex-1 space-y-2">
                            <div className="h-4 w-11/12 rounded bg-zinc-900" />
                            <div className="h-3 w-7/12 rounded bg-zinc-900" />
                            <div className="h-3 w-5/12 rounded bg-zinc-900" />
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
};

export const ListSkeleton = ({ count = 8 }) => {
    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <div className="flex animate-pulse flex-col gap-3 sm:flex-row" key={index}>
                    <div className="aspect-video w-full rounded-xl bg-zinc-900 sm:w-64 lg:w-80" />
                    <div className="flex-1 space-y-3">
                        <div className="h-5 w-11/12 rounded bg-zinc-900" />
                        <div className="h-3 w-1/2 rounded bg-zinc-900" />
                        <div className="h-3 w-2/3 rounded bg-zinc-900" />
                    </div>
                </div>
            ))}
        </>
    );
};
