import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DeleteConfirmModal: React.FC = () => {
  const { deleteConfirmModal, setDeleteConfirmModal } = useApp();

  if (!deleteConfirmModal || !deleteConfirmModal.isOpen) return null;

  const { title, message, onConfirm } = deleteConfirmModal;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/30 backdrop-blur-md">
      <div className="glass-card rounded-3xl max-w-md w-full p-6 shadow-2xl border border-white/80 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-red-50/80 text-[#B86666] flex items-center justify-center shrink-0 border border-red-200/60 shadow-2xs">
            <AlertTriangle className="w-5 h-5" />
          </div>

          <div className="flex-1">
            <h3 className="text-base font-bold text-[#292529]">
              {title}
            </h3>
            <p className="text-sm text-[#777277] mt-1.5 leading-relaxed">
              {message || 'Esta ação não poderá ser desfeita.'}
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={() => setDeleteConfirmModal(null)}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#777277] hover:bg-white/60 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              setDeleteConfirmModal(null);
            }}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#B86666] hover:bg-[#a35252] text-white shadow-md shadow-red-500/20 transition-all cursor-pointer"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
};
