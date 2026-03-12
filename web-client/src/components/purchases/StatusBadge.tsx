interface StatusBadgeProps {
    status: string;
    className?: string;
}

const STATUS_LABELS: Record<string, string> = {
    uploaded: "Fichier importé",
    ocr_done: "OCR terminé",
    validated: "Validée",
    applied_to_stock: "Stock mis à jour",
};

const STATUS_COLORS: Record<string, string> = {
    uploaded: "bg-gray-200 text-gray-800",
    ocr_done: "bg-blue-200 text-blue-800",
    validated: "bg-green-200 text-green-800",
    applied_to_stock: "bg-purple-200 text-purple-900",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
    const label = STATUS_LABELS[status] ?? status;
    const color = STATUS_COLORS[status] ?? "bg-gray-200 text-gray-800";

    return (
        <span
        className={`px-2 py-1 rounded text-xs font-medium ${color} ${className ?? ""}`}
        >
        {label}
        </span>
    );
}
