"use client";

import { Settings, Gamepad2, Home, Search } from "lucide-react";
import { useLocation, Link } from "react-router-dom";

export default function NavBar() {
    const pathname = useLocation().pathname;

    const tabs = [
        { icon: Home, label: "Home", href: "/" },
        { icon: Search, label: "Search", href: "/search" },
        { icon: Gamepad2, label: "Game", href: "/game" },
        { icon: Settings, label: "Setting", href: "/setting" },
    ];

    return (
        <>
            {/* 🌙 Mobile Navbar */}
            <div
                className="fixed bottom-0 left-0 right-0 
        bg-white/90 dark:bg-neutral-900/90 
        backdrop-blur-lg border-t border-neutral-200/50 dark:border-neutral-800/50 
        flex justify-around items-center 
        py-3 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] 
        z-50 lg:hidden"
            >
                {tabs.map(({ icon: Icon, href, label }) => {
                    const isActive = pathname === href;
                    return (
                        <Link
                            key={href}
                            to={href}
                            className="flex flex-col items-center group transition-all"
                        >
                            <div
                                className={`flex items-center justify-center w-11 h-11 rounded-full transition-all duration-300
                ${isActive
                                        ? "bg-primary text-primary-foreground scale-110 shadow-lg"
                                        : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200/60 dark:hover:bg-neutral-800/60"
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                            </div>
                            <span
                                className={`mt-1 text-[11px] font-medium tracking-wide transition-colors
                ${isActive
                                        ? "text-primary"
                                        : "text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-300"
                                    }`}
                            >
                                {label}
                            </span>
                        </Link>
                    );
                })}
            </div>

            {/* 💻 Desktop Sidebar */}
            <div
                className="hidden lg:flex fixed left-0 top-0 h-full w-24 
        flex-col items-center justify-between 
        bg-white/95 dark:bg-neutral-900/95 
        border-r border-neutral-200/50 dark:border-neutral-800/50 
        backdrop-blur-xl py-8 shadow-lg z-40"
            >
                {/* Logo Section */}
                <div className="text-xl font-bold text-primary mb-6">⚡</div>

                {/* Navigation Tabs */}
                <div className="flex flex-col gap-8 mt-4">
                    {tabs.map(({ icon: Icon, href, label }) => {
                        const isActive = pathname === href;
                        return (
                            <Link
                                key={href}
                                to={href}
                                className="flex flex-col items-center gap-1 transition-all group"
                            >
                                <div
                                    className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300
                  ${isActive
                                            ? "bg-primary text-primary-foreground scale-105 shadow-md"
                                            : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200/50 dark:hover:bg-neutral-800/60"
                                        }`}
                                >
                                    <Icon className="w-6 h-6" />
                                </div>
                                <span
                                    className={`text-xs font-medium tracking-wide transition-colors
                  ${isActive
                                            ? "text-primary"
                                            : "text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-300"
                                        }`}
                                >
                                    {label}
                                </span>
                            </Link>
                        );
                    })}
                </div>

                {/* Footer */}
                <div className="text-xs text-neutral-400 dark:text-neutral-600 mb-4">
                    © 2025
                </div>
            </div>
        </>
    );
}
