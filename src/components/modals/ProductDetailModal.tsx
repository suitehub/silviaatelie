import React from 'react';
import {
  Clock,
  DollarSign,
  Package,
  Plus,
  Printer,
  Sparkles,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  calculateProductCost,
  calculateSuggestedPrice,
  formatCurrency,
} from '../../utils/calculations';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProduct,
    setSelectedProduct,
    materials,
    settings,
    setIsNewOrderOpen,
    setNewOrderInitialData,
  } = useApp();

  if (!selectedProduct) return null;

  const costBreakdown = calculateProductCost(
    selectedProduct,
    materials,
    settings
  );
  const suggestedPrice = calculateSuggestedPrice(
    costBreakdown.totalCost,
    settings.targetProfitMarginPercent
  );
  const currentProfit = selectedProduct.basePrice - costBreakdown.totalCost;

  const handleStartOrderWithProduct = () => {
    setNewOrderInitialData({
      productType: selectedProduct.name as any,
      productName: selectedProduct.name,
      price: selectedProduct.basePrice,
      cost: costBreakdown.totalCost,
      profit: currentProfit,
    });
    setSelectedProduct(null);
    setIsNewOrderOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/30 backdrop-blur-md overflow-y-auto">
      <div className="glass-card rounded-3xl max-w-xl w-full shadow-2xl border border-white/80 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Product photo & Header */}
        <div className="relative h-48 sm:h-56 w-full bg-stone-100">
          <img
            src={selectedProduct.photoUrl}
            alt={selectedProduct.name}
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={() => setSelectedProduct(null)}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-4 left-4">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/95 text-[#7A5268] shadow-xs backdrop-blur-md">
              {selectedProduct.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          <div>
            <h2 className="text-xl font-bold text-[#292529]">
              {selectedProduct.name}
            </h2>
            <p className="text-xs sm:text-sm text-[#777277] mt-1 leading-relaxed">
              {selectedProduct.description}
            </p>
          </div>

          {/* Pricing cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="glass-card-subtle p-3 rounded-2xl border border-white/60 text-center">
              <span className="text-[11px] text-[#777277] block font-medium">
                Preço Atual
              </span>
              <strong className="text-base sm:text-lg text-[#7A5268] font-bold">
                {formatCurrency(selectedProduct.basePrice)}
              </strong>
            </div>

            <div className="glass-card-subtle p-3 rounded-2xl border border-white/60 text-center">
              <span className="text-[11px] text-[#777277] block font-medium">
                Custo de Produção
              </span>
              <span className="text-base sm:text-lg font-semibold text-stone-700">
                {formatCurrency(costBreakdown.totalCost)}
              </span>
            </div>

            <div className="bg-emerald-50/75 backdrop-blur-xs p-3 rounded-2xl border border-emerald-200/60 text-center">
              <span className="text-[11px] text-emerald-800 block font-medium">
                Lucro Líquido
              </span>
              <span className="text-base sm:text-lg font-bold text-emerald-700">
                {formatCurrency(currentProfit)}
              </span>
            </div>
          </div>

          {/* "Como faço este produto" (Item 18) */}
          <div className="glass-card-subtle rounded-2xl p-4.5 border border-white/60">
            <h3 className="text-xs font-bold text-[#7A5268] uppercase tracking-wider mb-3">
              Como faço este produto
            </h3>

            {/* Materiais */}
            <div className="space-y-1.5 mb-4">
              <span className="text-xs font-semibold text-[#292529] block mb-1">
                Materiais necessários por unidade:
              </span>
              {selectedProduct.materials.map((req) => {
                const mat = materials.find((m) => m.id === req.materialId);
                return (
                  <div
                    key={req.materialId}
                    className="flex items-center justify-between text-xs py-1 border-b border-white/40 last:border-0"
                  >
                    <span className="text-[#292529]">
                      • {mat ? mat.name : 'Material'}
                    </span>
                    <span className="font-bold text-[#7A5268]">
                      {req.quantity} {mat ? mat.unit : 'un'}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Tempo e Impressão */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/60 text-xs">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#A97891]" />
                <div>
                  <span className="text-[#777277] block">Tempo para fazer:</span>
                  <strong className="text-[#292529]">
                    {selectedProduct.productionTimeMinutes} minutos
                  </strong>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Printer className="w-4 h-4 text-[#A97891]" />
                <div>
                  <span className="text-[#777277] block">Impressão:</span>
                  <strong className="text-[#292529]">
                    {selectedProduct.colorPages} págs coloridas
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-[#E8D8DF]/40 glass-card-subtle flex items-center justify-between">
          <div className="text-xs text-[#777277]">
            Preço sugerido com sua margem:{' '}
            <strong className="text-[#292529] font-bold">
              {formatCurrency(suggestedPrice)}
            </strong>
          </div>

          <button
            type="button"
            onClick={handleStartOrderWithProduct}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#7A5268] hover:bg-[#634254] text-white text-xs font-bold rounded-xl shadow-md shadow-[#7A5268]/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Fazer pedido deste produto</span>
          </button>
        </div>
      </div>
    </div>
  );
};
