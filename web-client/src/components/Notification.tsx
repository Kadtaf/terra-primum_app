import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

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
  duration = 5000,
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
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: 'text-green-600',
      text: 'text-green-800',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: 'text-red-600',
      text: 'text-red-800',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: 'text-blue-600',
      text: 'text-blue-800',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: 'text-yellow-600',
      text: 'text-yellow-800',
    },
  };

  const style = styles[type];

  const icons = {
    success: <CheckCircle className={`w-5 h-5 ${style.icon}`} />,
    error: <AlertCircle className={`w-5 h-5 ${style.icon}`} />,
    info: <Info className={`w-5 h-5 ${style.icon}`} />,
    warning: <AlertCircle className={`w-5 h-5 ${style.icon}`} />,
  };

  return (
    <div className={`${style.bg} border ${style.border} rounded-lg p-4 flex gap-3 items-start`}>
      <div className="flex-shrink-0">{icons[type]}</div>

      <div className="flex-1">
        {title && <h3 className={`font-semibold ${style.text} mb-1`}>{title}</h3>}
        <p className={style.text}>{message}</p>
      </div>

      <button
        onClick={() => {
          setIsVisible(false);
          onClose?.();
        }}
        className={`flex-shrink-0 ${style.icon} hover:opacity-70`}
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}
