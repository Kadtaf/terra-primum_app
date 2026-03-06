interface TopCategory {
    categoryId: string;
    categoryName: string;
    totalSold: number;
}

export default function TopCategories({ data }: { data: TopCategory[] }) {
    return (
        <div className="bg-card p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Catégories les plus vendues</h2>

            <ul className="space-y-3">
                {data.map((c, index) => (
                <li
                    key={c.categoryId}
                    className="flex justify-between items-center p-2 rounded hover:bg-muted transition"
                >
                    <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-muted-foreground w-6">
                        {index + 1}.
                    </span>

                    <span className="font-medium">{c.categoryName}</span>
                    </div>

                    <span className="font-bold text-blue-600">
                    {c.totalSold} ventes
                    </span>
                </li>
                ))}
            </ul>
        </div>
    );
}
