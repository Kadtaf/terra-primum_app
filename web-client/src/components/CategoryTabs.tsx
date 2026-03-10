interface CategoryTabsProps {
    categories: string[];
    selected: string;
    onSelect: (category: string) => void;
}

export default function CategoryTabs({
    categories,
    selected,
    onSelect,
    }: CategoryTabsProps) {
    return (
        <div className="flex gap-2 flex-wrap">
        <button
            onClick={() => onSelect("")}
            className={`px-4 py-2 rounded-lg transition ${
            selected === ""
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
        >
            Tous
        </button>

        {categories.map((cat) => (
            <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={`px-4 py-2 rounded-lg transition ${
                selected === cat
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
            >
            {cat}
            </button>
        ))}
        </div>
    );
}