import { Link, useLocation } from "react-router-dom";

export default function Breadcrumb() {
    const location = useLocation();

    // Découpe l’URL en segments
    const segments = location.pathname
        .split("/")
        .filter((segment) => segment !== "");

    // Construit les chemins cumulés
    const paths = segments.map(
        (_, index) => "/" + segments.slice(0, index + 1).join("/"),
    );

    return (
        <nav className="text-sm text-muted-foreground flex items-center gap-2">
        <Link to="/" className="hover:text-primary transition">
            Accueil
        </Link>

        {segments.map((segment, index) => {
            const label = segment.charAt(0).toUpperCase() + segment.slice(1);

            return (
            <span key={index} className="flex items-center gap-2">
                <span>/</span>

                {index === segments.length - 1 ? (
                <span className="text-primary font-medium">{label}</span>
                ) : (
                <Link to={paths[index]} className="hover:text-primary transition">
                    {label}
                </Link>
                )}
            </span>
            );
        })}
        </nav>
    );
}
