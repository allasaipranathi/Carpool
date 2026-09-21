import React from 'react';
import { AlertTriangle, Check, X, Loader2 } from 'lucide-react';

export const ConfirmationModal = ({
  isOpen,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger',
  loading = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  const typeConfig = {
    danger: {
      icon: AlertTriangle,
      iconColor: 'text-red-600 bg-red-50 border-red-100',
      btnColor: 'bg-red-600 hover:bg-red-700 text-white shadow-red-500/20',
    },
    warning: {
      icon: AlertTriangle,
      iconColor: 'text-amber-600 bg-amber-50 border-amber-100',
      btnColor: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-500/20',
    },
    success: {
      icon: Check,
      iconColor: 'text-emerald-600 bg-emerald-50 border-emerald-100',
      btnColor: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20',
    },
  };

  const current = typeConfig[type] || typeConfig.danger;
  const IconComponent = current.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white max-w-md w-full rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-4 animate-in zoom-in-95 duration-150">
        <div className="flex items-start space-x-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border flex-shrink-0 ${current.iconColor}`}>
            <IconComponent className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 leading-tight">{title}</h3>
            <p className="text-sm text-slate-600 mt-1 leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            disabled={loading}
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md transition-all flex items-center space-x-2 disabled:opacity-50 ${current.btnColor}`}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
