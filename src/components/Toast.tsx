import React, { useEffect } from 'react';
import { CheckCircle2, Sparkles, X, Award } from 'lucide-react';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'xp' | 'achievement';
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div className="pointer-events-auto flex items-start gap-3 p-4 rounded-2xl bg-slate-900/95 border border-cyan-500/40 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-4 duration-300 min-w-[280px] max-w-sm">
      <div className="p-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 mt-0.5">
        {toast.type === 'achievement' ? (
          <Award className="w-4 h-4 text-amber-400" />
        ) : toast.type === 'xp' ? (
          <Sparkles className="w-4 h-4 text-cyan-400" />
        ) : (
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        )}
      </div>

      <div className="flex-1 space-y-0.5">
        <h5 className="text-xs font-bold text-white">{toast.title}</h5>
        {toast.description && <p className="text-[11px] text-slate-400">{toast.description}</p>}
      </div>

      <button
        onClick={() => onDismiss(toast.id)}
        className="text-slate-500 hover:text-white p-1"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
