import { useEffect, useState } from "react";

export function useTheme() {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem("theme") || "system";
    });

    useEffect(() => {
        const root = document.documentElement;

        if (theme === "dark") {
        root.classList.add("dark");
        localStorage.setItem("theme", "dark");
        } else if (theme === "light") {
        root.classList.remove("dark");
        localStorage.setItem("theme", "light");
        } else {
        // mode système
        localStorage.setItem("theme", "system");
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
        }
    }, [theme]);

    return { theme, setTheme };
}