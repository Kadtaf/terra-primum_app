import { useEffect, useState } from "react";
import { AlertCircle, Backpack, CheckCircle, Info, X } from "lucide-react";
import { bg } from "date-fns/locale";

export type NotificationType = "success" | "error" | "info" | "warning";

interface NotificationProps {
  type: NotificationType;
  message: string;
  title?: string;
  duration?: number;
  onClose?: () => void;
}

export default function Notification({
  type,
  message,
  title,
  duration = 4000,
  onClose,
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!isVisible) return null;

  const styles = {
    success: {
      icon: "text-green-500",
      border: "border-green-300/40",
      glow: "shadow-[0_0_20px_rgba(34,197,94,0.25)]",
    },
    error: {
      icon: "text-red-500",
      border: "border-red-300/40",
      glow: "shadow-[0_0_20px_rgba(239,68,68,0.25)]",
    },
    info: {
      icon: "text-blue-500",
      border: "border-blue-300/40",
      glow: "shadow-[0_0_20px_rgba(59,130,246,0.25)]",
    },
    warning: {
      icon: "text-yellow-500",
      border: "border-yellow-300/40",
      glow: "shadow-[0_0_20px_rgba(234,179,8,0.25)]",
    },
  };

  const icons = {
    success: <CheckCircle className={`w-5 h-5 ${styles[type].icon}`} />,
    error: <AlertCircle className={`w-5 h-5 ${styles[type].icon}`} />,
    info: <Info className={`w-5 h-5 ${styles[type].icon}`} />,
    warning: <AlertCircle className={`w-5 h-5 ${styles[type].icon}`} />,
  };

  return (
    <div
      className={`
        fixed top-6 right-6 z-[9999]
        w-[360px] p-4 rounded-2xl
        backdrop-blur-xl bg-white/60
        border ${styles[type].border}
        ${styles[type].glow}
        animate-[notifSlide_0.35s_ease-out]
      `}
    >
      <div className="flex items-start gap-3">
        <div className="mt-1">{icons[type]}</div>

        <div className="flex-1">
          {title && (
            <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
          )}
          <p className="text-gray-800">{message}</p>
        </div>

        <button
          onClick={() => {
            setIsVisible(false);
            onClose?.();
          }}
          className="text-gray-500 hover:text-gray-700 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
