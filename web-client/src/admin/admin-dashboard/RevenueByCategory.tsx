interface RevenueByCategoryProps {
    data: {
        categoryId: string;
        categoryName: string;
        totalRevenue: number;
    }[];
}

export default function RevenueByCategory({ data }: RevenueByCategoryProps) {
    const formatCurrency = (value: number) =>
        value.toLocaleString("fr-FR", { minimumFractionDigits: 2 }) + " €";

    return (
        <div className="bg-card p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">
            Chiffre d’affaires par catégorie
        </h2>

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

                <span className="font-bold text-green-600">
                {formatCurrency(c.totalRevenue)}
                </span>
            </li>
            ))}
        </ul>
        </div>
    );
}
