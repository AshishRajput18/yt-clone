import React from "react";

const LeftNavMenuItem = ({ text, icon, className = "", action, active = false }) => {
    return (
        <button
            className={`mb-1 flex h-10 w-full items-center rounded-lg px-3 text-left text-sm text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-red-500 ${className}`}
            onClick={action}
            type="button"
            aria-current={active ? "page" : undefined}
        >
            <span className="mr-5 text-xl" aria-hidden="true">
                {icon}
            </span>
            <span className="truncate">{text}</span>
        </button>
    );
};

export default React.memo(LeftNavMenuItem);
