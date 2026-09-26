import React, { useEffect, useState } from 'react';
import { Truck, CheckCircle2, ChevronRight, X, Award } from 'lucide-react';
import { UserNotification } from '../../types/koba';
import { TurtleIcon } from './TurtleIcon';

interface NotificationToastProps {
  notification: UserNotification | null;
  onDismiss: () => void;
  onViewReport: (reportId?: string) => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  notification,
  onDismiss,
  onViewReport,
}) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!notification) return;

    setProgress(100);
    const duration = 7000; // 7 seconds
    const intervalTime = 50;
    const step = (100 / (duration / intervalTime));

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          onDismiss();
          return 0;
        }
        return prev - step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [notification, onDismiss]);

  if (!notification) return null;

  return (
    <div className="absolute top-2.5 left-3 right-3 z-50 animate-in slide-in-from-top-3 fade-in duration-200">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-teal-900/95 via-[#0A2540]/95 to-slate-950/95 text-white p-3.5 shadow-xl border border-teal-500/40 backdrop-blur-md">
        {/* Top subtle progress line */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/10">
          <div
            className="h-full bg-gradient-to-r from-teal-400 to-emerald-400 transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-start justify-between gap-2.5">
          {/* Leading Icon Badge */}
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-500 text-slate-950 flex items-center justify-center shrink-0 shadow-md mt-0.5">
            {notification.type === 'collected' ? (
              <Truck className="w-5 h-5 text-slate-950" />
            ) : notification.type === 'nest_protected' ? (
              <TurtleIcon className="w-5 h-5 text-slate-950" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-slate-950" />
            )}
          </div>

          {/* Notification Content */}
          <div className="flex-1 min-w-0 pr-1">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-xs text-white truncate">
                {notification.title}
              </span>
              {notification.pointsEarned && (
                <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-md bg-amber-400 text-slate-950 border border-amber-300 shadow-2xs whitespace-nowrap">
                  +{notification.pointsEarned} pts
                </span>
              )}
            </div>

            <p className="text-[11px] text-teal-100 font-normal leading-snug mt-0.5 line-clamp-2">
              {notification.message}
            </p>

            {/* Quick Action Button */}
            <div className="flex items-center gap-3 mt-2">
              <button
                type="button"
                onClick={() => {
                  onViewReport(notification.reportId);
                  onDismiss();
                }}
                className="text-[11px] font-medium text-teal-300 hover:text-white flex items-center gap-1 active:scale-95 transition-all cursor-pointer underline underline-offset-2"
              >
                <span>Consulter mes signalements</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Dismiss 'x' Button */}
          <button
            type="button"
            onClick={onDismiss}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
            title="Fermer"
            aria-label="Fermer la notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
