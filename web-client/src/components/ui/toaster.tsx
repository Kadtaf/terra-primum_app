import { useToast } from "./use-toast";
import { Toast } from "./toast";

export function Toaster() {
    const { toasts } = useToast();

    return (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
        {toasts.map((t) => (
            <Toast
            key={t.id}
            title={t.title}
            description={t.description}
            variant={t.variant}
            />
        ))}
        </div>
    );
}