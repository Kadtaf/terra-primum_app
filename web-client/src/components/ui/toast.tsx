import { cn } from "@/utils/utils";
import { CheckCircle, XCircle, Info } from "lucide-react";

type ToastProps = {
    title?: string;
    description?: string;
    variant?: "default" | "destructive" | "info";
};

export function Toast({ title, description, variant = "default" }: ToastProps) {
    return (
        <div
        className={cn(
            "p-4 rounded-lg shadow-lg border flex items-start gap-3 animate-slide-in",
            variant === "destructive"
            ? "toast-error border-red-400 bg-red-50"
            : variant === "info"
            ? "toast-info border-blue-400 bg-blue-50"
            : "toast-success border-green-400 bg-green-50"
        )}
        >
        {/* Icône */}
        <div className="mt-1">
            {variant === "destructive" && (
            <XCircle className="w-6 h-6 text-red-600" />
            )}
            {variant === "info" && (
            <Info className="w-6 h-6 text-blue-600" />
            )}
            {variant === "default" && (
            <CheckCircle className="w-6 h-6 text-green-600" />
            )}
        </div>

        {/* Texte */}
        <div>
            {title && <p className="font-semibold">{title}</p>}
            {description && (
            <p className="text-sm opacity-80">{description}</p>
            )}
        </div>
        </div>
    );
}