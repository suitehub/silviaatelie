import React from 'react';
import {
  Calendar,
  DollarSign,
  Heart,
  Plus,
  ShoppingBag,
  Tag,
  Trash2,
  User,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDate } from '../../utils/calculations';

export const ModelDetailModal: React.FC = () => {
  const {
    selectedModel,
    setSelectedModel,
    startNewOrderFromModel,
    setDeleteConfirmModal,
    deleteModel,
  } = useApp();

  if (!selectedModel) return null;

  const handleDelete = () => {
    setDeleteConfirmModal({
      isOpen: true,
      title: 'Excluir este modelo?',
      message: `Tem certeza que deseja remover o modelo "${selectedModel.title}" da galeria?`,
      onConfirm: () => deleteModel(selectedModel.id),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/30 backdrop-blur-md overflow-y-auto">
      <div className="glass-card rounded-3xl max-w-xl w-full shadow-2xl border border-white/80 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Large visual preview image */}
        <div className="relative h-72 sm:h-80 w-full bg-stone-100">
          <img
            src={selectedModel.imageUrl}
            alt={selectedModel.title}
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={() => setSelectedModel(null)}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-4">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold shadow-xs backdrop-blur-md ${
                selectedModel.type === 'meu_modelo'
                  ? 'bg-white/95 text-[#7A5268]'
                  : 'bg-amber-100/95 text-amber-900'
              }`}
            >
              {selectedModel.type === 'meu_modelo'
                ? '🌸 Feito para cliente'
                : '📁 Arquivo comprado'}
            </span>
          </div>
        </div>

        {/* Model Details */}
        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-[#292529]">
                {selectedModel.title}
              </h2>
              <p className="text-xs text-[#777277] mt-0.5">
                Categoria: {selectedModel.category}
                {selectedModel.productType && ` • ${selectedModel.productType}`}
              </p>
            </div>

            {selectedModel.pricePaid !== undefined && selectedModel.pricePaid > 0 && (
              <div className="text-right">
                <span className="text-[10px] text-[#777277] block">
                  Valor pago pelo arquivo
                </span>
                <span className="text-sm font-bold text-[#7A5268]">
                  {formatCurrency(selectedModel.pricePaid)}
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 p-3.5 glass-card-subtle rounded-2xl text-xs border border-white/60">
            {selectedModel.clientName && (
              <div>
                <span className="text-[#777277] block">Cliente:</span>
                <span className="font-semibold text-[#292529]">
                  {selectedModel.clientName}
                </span>
              </div>
            )}

            {selectedModel.supplier && (
              <div>
                <span className="text-[#777277] block">Fornecedor / Designer:</span>
                <span className="font-semibold text-[#292529]">
                  {selectedModel.supplier}
                </span>
              </div>
            )}

            <div>
              <span className="text-[#777277] block">Data de cadastro:</span>
              <span className="font-semibold text-[#292529]">
                {formatDate(selectedModel.date)}
              </span>
            </div>

            {selectedModel.color && (
              <div>
                <span className="text-[#777277] block">Cores principais:</span>
                <span className="font-semibold text-[#292529]">
                  {selectedModel.color}
                </span>
              </div>
            )}
          </div>

          {selectedModel.tags && selectedModel.tags.length > 0 && (
            <div>
              <span className="text-[11px] font-semibold text-[#777277] uppercase tracking-wider block mb-1.5">
                Tags para busca
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedModel.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-lg text-xs glass-card-subtle border border-white/60 text-stone-700 font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {selectedModel.notes && (
            <p className="text-xs text-[#777277] glass-card-subtle p-3 rounded-xl border border-white/60 leading-relaxed">
              {selectedModel.notes}
            </p>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-[#E8D8DF]/40 glass-card-subtle flex items-center justify-between">
          <button
            type="button"
            onClick={handleDelete}
            className="p-2 text-[#B86666] hover:bg-red-50/80 rounded-xl transition-colors cursor-pointer"
            title="Excluir modelo"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => startNewOrderFromModel(selectedModel)}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#7A5268] hover:bg-[#634254] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-[#7A5268]/20 hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Usar neste pedido</span>
          </button>
        </div>
      </div>
    </div>
  );
};
