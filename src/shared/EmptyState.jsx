import { FiAlertCircle } from "react-icons/fi";

const EmptyState = ({ title = "Nothing found", message, action }) => {
    return (
        <section className="mx-auto flex min-h-[320px] max-w-xl flex-col items-center justify-center px-6 text-center text-white">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-900 text-zinc-300 ring-1 ring-white/10">
                <FiAlertCircle className="text-2xl" aria-hidden="true" />
            </div>
            <h1 className="text-xl font-semibold tracking-normal">{title}</h1>
            {message && <p className="mt-2 text-sm leading-6 text-zinc-400">{message}</p>}
            {action && <div className="mt-6">{action}</div>}
        </section>
    );
};

export default EmptyState;
