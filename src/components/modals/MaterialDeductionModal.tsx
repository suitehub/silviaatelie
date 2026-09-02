import React from 'react';
import { AlertCircle, Check, Package, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MaterialDeductionModal: React.FC = () => {
  const {
    materialDeductionOrder,
    setMaterialDeductionOrder,
    confirmDeductMaterials,
    materials,
  } = useApp();

  if (!materialDeductionOrder) return null;

  const order = materialDeductionOrder;
  const qty = order.quantity || 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/30 backdrop-blur-md">
      <div className="glass-card rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-white/80 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/80 text-[#7A5268] flex items-center justify-center border border-white/80 shadow-2xs">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#292529]">
                Baixar materiais do estoque
              </h3>
              <p className="text-xs text-[#777277]">
                Pedido {order.orderNumber} ({order.productName})
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMaterialDeductionOrder(null)}
            className="p-1.5 text-stone-400 hover:text-stone-600 rounded-xl hover:bg-white/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5">
          <p className="text-sm font-semibold text-[#292529] mb-3">
            Este pedido vai usar:
          </p>

          <div className="glass-card-subtle rounded-2xl p-4 border border-white/60 space-y-2.5">
            {order.materialsUsed.map((mat) => {
              const currentMat = materials.find((m) => m.id === mat.materialId);
              const needed = mat.quantity * qty;
              const hasEnough = currentMat ? currentMat.currentStock >= needed : true;

              return (
                <div
                  key={mat.materialId}
                  className="flex items-center justify-between text-sm py-1 border-b border-white/40 last:border-0"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#7A5268]" />
                    <span className="text-[#292529] font-medium">
                      {mat.name}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="font-bold text-[#7A5268]">
                      {needed} {mat.unit}
                    </span>
                    {currentMat && !hasEnough && (
                      <span className="block text-[11px] text-[#B86666] font-semibold">
                        (Estoque atual: {currentMat.currentStock})
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-[#777277] mt-3 leading-relaxed">
            Ao confirmar, as quantidades acima serão descontadas automaticamente
            do seu estoque.
          </p>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={() => setMaterialDeductionOrder(null)}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#777277] hover:bg-white/60 transition-colors cursor-pointer"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={() => confirmDeductMaterials(order.id)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#7A5268] hover:bg-[#634254] text-white text-xs font-bold rounded-xl shadow-md shadow-[#7A5268]/20 hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Confirmar uso dos materiais</span>
          </button>
        </div>
      </div>
    </div>
  );
};
