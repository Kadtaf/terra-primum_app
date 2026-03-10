import { Link } from "react-router-dom";
import { Leaf } from "lucide-react";

export default function Logo() {
    return (
        <Link to="/" className="flex items-center gap-2">
        <Leaf className="w-6 h-6 text-[var(--color-primary)]" />
        <span className="text-xl font-bold text-[var(--color-primary)] hidden sm:inline">
            Le Terra - Délice
        </span>
        <span className="text-xl font-bold text-[var(--color-primary)] sm:hidden">
            Terra
        </span>
        </Link>
    );
}
