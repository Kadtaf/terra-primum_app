import * as React from "react";

export type ToastOptions = {
    id?: number;
    title?: string;
    description?: string;
    variant?: "default" | "destructive";
};

const ToastContext = React.createContext<{
    toasts: ToastOptions[];
    addToast: (toast: ToastOptions) => void;
    removeToast: (id: number) => void;
} | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = React.useState<ToastOptions[]>([]);

    function addToast(toast: ToastOptions) {
        const id = Date.now();
        setToasts((prev) => [...prev, { ...toast, id }]);

        setTimeout(() => removeToast(id), 3000);
    }

    function removeToast(id: number) {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
        {children}
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = React.useContext(ToastContext);
    if (!context) throw new Error("useToast must be used inside ToastProvider");
    return {
        toast: context.addToast,
        toasts: context.toasts,
    };
}