import { Link } from "react-router-dom";

import EmptyState from "../shared/EmptyState";
import { usePageMeta } from "../hooks/usePageMeta";

const NotFound = () => {
    usePageMeta({
        title: "Page not found",
        description: "The StreamHub page you opened does not exist.",
    });

    return (
        <main className="flex flex-1 bg-black">
            <EmptyState
                title="Page not found"
                message="This route does not exist. Head back home and keep watching."
                action={
                    <Link
                        className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                        to="/"
                    >
                        Go home
                    </Link>
                }
            />
        </main>
    );
};

export default NotFound;
