import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { Context } from "../context/contextApi";
import { sidebarItems } from "../utils/constants";
import LeftNavMenuItem from "./LeftNavMenuItem";

const LeftNav = () => {
    const { selectedCategory, setSelectedCategory, mobileMenu, setMobileMenu } =
        useContext(Context);
    const navigate = useNavigate();

    const clickHandler = (name, type) => {
        if (type === "category" || type === "home") {
            setSelectedCategory(name);
            navigate("/");
            setMobileMenu(false);
        }
    };

    return (
        <>
            {mobileMenu && (
                <button
                    className="fixed inset-0 z-20 bg-black/60 md:hidden"
                    onClick={() => setMobileMenu(false)}
                    type="button"
                    aria-label="Close navigation menu"
                />
            )}
            <aside
                className={`fixed bottom-0 left-0 top-14 z-30 w-[240px] overflow-y-auto border-r border-white/10 bg-black py-4 transition-transform duration-200 md:sticky md:top-14 md:z-auto md:block md:h-[calc(100vh-56px)] md:translate-x-0 ${
                    mobileMenu ? "translate-x-0" : "-translate-x-full"
                }`}
                aria-label="Primary navigation"
            >
                <nav className="flex flex-col px-3">
                    {sidebarItems.map((item) => {
                        const active = selectedCategory === item.name;

                        return (
                            <React.Fragment key={item.name}>
                                <LeftNavMenuItem
                                    text={item.type === "home" ? "Home" : item.name}
                                    icon={item.icon}
                                    action={() => clickHandler(item.name, item.type)}
                                    active={active}
                                    className={active ? "bg-white/15 font-semibold" : ""}
                                />
                                {item.divider && <hr className="my-4 border-white/10" />}
                            </React.Fragment>
                        );
                    })}
                    <hr className="my-4 border-white/10" />
                    <p className="px-3 text-xs leading-5 text-zinc-500">
                        StreamHub portfolio build
                    </p>
                </nav>
            </aside>
        </>
    );
};

export default LeftNav;
