import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

interface Props {
  mobile?: boolean;
}

export default function ThemeToggle({ mobile = false }: Props) {
    const { theme, setTheme } = useTheme();

    const toggle = () => {
        if (theme === "light") setTheme("dark");
        else if (theme === "dark") setTheme("system");
        else setTheme("light");
    };

    return (
        <button
        onClick={toggle}
        className={`
            flex items-center justify-center 
            ${mobile ? "gap-3 text-sm w-full py-2" : "w-8 h-8 rounded-lg"}
            hover:bg-[var(--color-border)] hover:text-[var(--color-primary)] transition
        `}
        >
        {theme === "dark" ? (
            <>
            <Moon className="w-5 h-5" />
            {mobile && "Mode sombre"}
            </>
        ) : theme === "light" ? (
            <>
            <Sun className="w-5 h-5" />
            {mobile && "Mode clair"}
            </>
        ) : (
            <>
            <span className="text-xs font-semibold">AUTO</span>
            {mobile && "Mode automatique"}
            </>
        )}
        </button>
    );
}
