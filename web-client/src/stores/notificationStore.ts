import { create } from "zustand";

interface GlobalNotif {
    type: "success" | "error" | "info" | "warning";
    title?: string;
    message: string;
}

interface NotificationStore {
    notif: GlobalNotif | null;
    showNotif: (notif: GlobalNotif) => void;
    clearNotif: () => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
    notif: null,
    showNotif: (notif) => set({ notif }),
    clearNotif: () => set({ notif: null }),
}));
