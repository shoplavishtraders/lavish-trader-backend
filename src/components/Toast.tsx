import React from 'react';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { cn } from '../lib/utils';

export function ToastContainer() {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={cn(
            'flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border min-w-[280px] max-w-[360px] animate-in slide-in-from-right-4 duration-300',
            toast.type === 'success' && 'bg-emerald-900/90 border-emerald-500/30 text-emerald-100',
            toast.type === 'error' && 'bg-red-900/90 border-red-500/30 text-red-100',
            toast.type === 'info' && 'bg-brand-900/90 border-white/10 text-brand-200',
          )}
        >
          {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
          {toast.type === 'error' && <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />}
          {toast.type === 'info' && <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />}
          <p className="text-sm font-medium flex-1">{toast.message}</p>
          <button
            onClick={() => dismissToast(toast.id)}
            className="p-1 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  );
}
