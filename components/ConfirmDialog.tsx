import React from "react";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info";
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Bestätigen",
  cancelText = "Abbrechen",
  type = "danger",
}) => {
  if (!isOpen) return null;

  const typeColors = {
    danger: {
      bg: "bg-red-50",
      icon: "text-red-500",
      border: "border-red-200",
      button: "bg-red-600 hover:bg-red-700",
    },
    warning: {
      bg: "bg-orange-50",
      icon: "text-orange-500",
      border: "border-orange-200",
      button: "bg-orange-600 hover:bg-orange-700",
    },
    info: {
      bg: "bg-blue-50",
      icon: "text-blue-500",
      border: "border-blue-200",
      button: "bg-blue-600 hover:bg-blue-700",
    },
  };

  const colors = typeColors[type];

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all animate-scale-in">
        {/* Header */}
        <div
          className={`${colors.bg} border-b-2 ${colors.border} p-6 flex items-center justify-between rounded-t-2xl`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`p-3 ${colors.bg} rounded-xl border-2 ${colors.border}`}
            >
              <AlertTriangle size={32} className={colors.icon} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/50 rounded-xl transition-colors"
          >
            <X size={24} className="text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          <p className="text-base text-slate-700 leading-relaxed">{message}</p>
        </div>

        {/* Actions */}
        <div className="p-6 bg-slate-50 rounded-b-2xl flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-4 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-all font-bold text-base"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`flex-1 px-6 py-4 ${colors.button} text-white rounded-xl transition-all font-bold text-base shadow-lg`}
          >
            {confirmText}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ConfirmDialog;
