import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  Calculator,
  CheckCircle2,
  Clock,
  DollarSign,
  Info,
  Package,
  Plus,
  Printer,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  calculateProductCost,
  calculateSuggestedPrice,
  formatCurrency,
} from '../../utils/calculations';

export const PriceCalculator: React.FC = () => {
  const {
    products,
    materials,
    settings,
    setIsNewOrderOpen,
    setNewOrderInitialData,
  } = useApp();

  const [selectedProductId, setSelectedProductId] = useState<string>(
    products[0]?.id || ''
  );
  const [targetMarginPercent, setTargetMarginPercent] = useState<number>(
    settings.targetProfitMarginPercent || 50
  );
  const [customSellingPrice, setCustomSellingPrice] = useState<string>('');

  const currentProduct =
    products.find((p) => p.id === selectedProductId) || products[0];

  const costBreakdown = useMemo(() => {
    if (!currentProduct) {
      return {
        materialsCost: 0,
        laborCost: 0,
        fixedCostShare: 0,
        printingCost: 0,
        totalCost: 0,
      };
    }
    return calculateProductCost(currentProduct, materials, settings);
  }, [currentProduct, materials, settings]);

  const suggestedPrice = useMemo(() => {
    return calculateSuggestedPrice(costBreakdown.totalCost, targetMarginPercent);
  }, [costBreakdown.totalCost, targetMarginPercent]);

  // Rounded friendly suggestions (ex: R$ 49,90 or R$ 50,00)
  const roundedPrice90 = Math.floor(suggestedPrice) + 0.9;
  const roundedPriceZero = Math.ceil(suggestedPrice);

  // Active chosen price (custom or suggested)
  const activeSellingPrice = customSellingPrice !== ''
    ? parseFloat(customSellingPrice.replace(',', '.')) || 0
    : suggestedPrice;

  const actualProfit = Number(
    (activeSellingPrice - costBreakdown.totalCost).toFixed(2)
  );
  const actualProfitMarginPercent =
    activeSellingPrice > 0
      ? Math.round((actualProfit / activeSellingPrice) * 100)
      : 0;

  const handleStartOrderWithCalculatedPrice = () => {
    setNewOrderInitialData({
      productType: currentProduct.name as any,
      productName: currentProduct.name,
      price: activeSellingPrice,
      cost: costBreakdown.totalCost,
      profit: actualProfit,
    });
    setIsNewOrderOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#7A5268] tracking-tight">
            Calculadora de Preço
          </h1>
          <p className="text-xs sm:text-sm text-[#777277] mt-0.5">
            Descubra exatamente quanto custa produzir e quanto você vai lucrar em cada peça.
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Product Selection and Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-card rounded-3xl p-6 space-y-5">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#777277] block mb-2">
                Escolha o produto para calcular
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => {
                  setSelectedProductId(e.target.value);
                  setCustomSellingPrice('');
                }}
                className="w-full px-4 py-3 glass-input rounded-2xl text-sm font-semibold text-[#292529] cursor-pointer"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id} className="bg-white text-[#292529]">
                    {p.name} ({p.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Target Margin Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#777277]">
                  Margem de lucro desejada
                </label>
                <span className="text-sm font-bold text-[#7A5268]">
                  {targetMarginPercent}%
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="120"
                step="5"
                value={targetMarginPercent}
                onChange={(e) => {
                  setTargetMarginPercent(Number(e.target.value));
                  setCustomSellingPrice('');
                }}
                className="w-full accent-[#7A5268] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#777277] mt-1">
                <span>20% (mínima)</span>
                <span>50% (recomendada)</span>
                <span>100%+ (alta)</span>
              </div>
            </div>

            {/* Ou digite o preço que quer cobrar */}
            <div className="pt-2 border-t border-[#E8D8DF]/40">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#777277] block mb-1.5">
                Ou digite o preço que pretende cobrar
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-sm font-bold text-[#777277]">
                  R$
                </span>
                <input
                  type="text"
                  value={customSellingPrice}
                  onChange={(e) => setCustomSellingPrice(e.target.value)}
                  placeholder={suggestedPrice.toFixed(2)}
                  className="w-full pl-11 pr-4 py-2.5 glass-input rounded-2xl text-base font-bold text-[#7A5268]"
                />
              </div>
              <p className="text-[11px] text-[#777277] mt-1.5">
                Deixe em branco para usar o preço sugerido automaticamente.
              </p>
            </div>
          </div>

          {/* Quick Rounding Chips */}
          <div className="glass-card rounded-3xl p-5">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#777277] block mb-2.5">
              Sugestões de arredondamento comercial
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setCustomSellingPrice(roundedPrice90.toFixed(2))}
                className="p-3.5 glass-card-interactive rounded-2xl text-left transition-all cursor-pointer"
              >
                <span className="text-[10px] text-[#777277] block font-medium">Final ,90</span>
                <span className="text-base font-bold text-[#7A5268]">
                  {formatCurrency(roundedPrice90)}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setCustomSellingPrice(roundedPriceZero.toFixed(2))}
                className="p-3.5 glass-card-interactive rounded-2xl text-left transition-all cursor-pointer"
              >
                <span className="text-[10px] text-[#777277] block font-medium">Número redondo</span>
                <span className="text-base font-bold text-[#7A5268]">
                  {formatCurrency(roundedPriceZero)}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Breakdown and Result (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Clarity Statement Card (Item 32: "Frase explicativa simples") */}
          <div className="glass-card rounded-3xl p-6 space-y-5">
            <div className="p-4.5 bg-emerald-50/75 backdrop-blur-md rounded-2xl border border-emerald-200/70 shadow-xs">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1">
                Resultado para {currentProduct?.name}
              </span>
              <p className="text-base sm:text-lg font-bold text-[#292529] leading-snug">
                Você gasta <span className="text-stone-800">{formatCurrency(costBreakdown.totalCost)}</span> para fazer e ganha{' '}
                <span className="text-emerald-700 underline decoration-emerald-500 decoration-2">
                  {formatCurrency(actualProfit)} livre para você!
                </span>
              </p>
            </div>

            {/* 3 Metric Cards */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="glass-card-subtle p-3.5 rounded-2xl border border-white/60">
                <span className="text-xs text-[#777277] block font-medium">
                  Custo total
                </span>
                <span className="text-lg sm:text-xl font-bold text-stone-700 mt-0.5 block">
                  {formatCurrency(costBreakdown.totalCost)}
                </span>
              </div>

              <div className="glass-card-subtle p-3.5 rounded-2xl border border-white/60">
                <span className="text-xs text-[#777277] block font-medium">
                  Preço de venda
                </span>
                <span className="text-lg sm:text-xl font-bold text-[#7A5268] mt-0.5 block">
                  {formatCurrency(activeSellingPrice)}
                </span>
              </div>

              <div className="bg-emerald-50/70 backdrop-blur-xs p-3.5 rounded-2xl border border-emerald-200/60">
                <span className="text-xs text-emerald-800 block font-medium">
                  Seu lucro ({actualProfitMarginPercent}%)
                </span>
                <span className="text-lg sm:text-xl font-bold text-emerald-700 mt-0.5 block">
                  {formatCurrency(actualProfit)}
                </span>
              </div>
            </div>

            {/* Detailed Itemized Costs (Item 30) */}
            <div className="pt-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#777277] mb-3">
                Composição detalhada do custo:
              </h3>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between p-3 glass-card-subtle rounded-xl border border-white/50">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-[#7A5268]" />
                    <span className="text-[#292529] font-medium">
                      Materiais utilizados
                    </span>
                  </div>
                  <span className="font-bold text-[#292529]">
                    {formatCurrency(costBreakdown.materialsCost)}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 glass-card-subtle rounded-xl border border-white/50">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#A97891]" />
                    <span className="text-[#292529] font-medium">
                      Seu tempo ({currentProduct?.productionTimeMinutes} min de trabalho)
                    </span>
                  </div>
                  <span className="font-bold text-[#292529]">
                    {formatCurrency(costBreakdown.laborCost)}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 glass-card-subtle rounded-xl border border-white/50">
                  <div className="flex items-center gap-2">
                    <Printer className="w-4 h-4 text-[#A97891]" />
                    <span className="text-[#292529] font-medium">
                      Tinta e desgaste de impressão ({currentProduct?.colorPages} páginas)
                    </span>
                  </div>
                  <span className="font-bold text-[#292529]">
                    {formatCurrency(costBreakdown.printingCost)}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 glass-card-subtle rounded-xl border border-white/50">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#A97891]" />
                    <span className="text-[#292529] font-medium">
                      Rateio de custos fixos do ateliê (luz, lâmina, internet)
                    </span>
                  </div>
                  <span className="font-bold text-[#292529]">
                    {formatCurrency(costBreakdown.fixedCostShare)}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action to create order with this price */}
            <div className="pt-3 border-t border-[#E8D8DF]/40 flex items-center justify-end">
              <button
                type="button"
                onClick={handleStartOrderWithCalculatedPrice}
                className="flex items-center gap-2 px-6 py-3 bg-[#7A5268] hover:bg-[#634254] text-white text-xs sm:text-sm font-bold rounded-2xl shadow-lg shadow-[#7A5268]/20 hover:shadow-xl hover:shadow-[#7A5268]/25 transition-all active:scale-[0.98] cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Iniciar pedido com este preço ({formatCurrency(activeSellingPrice)})</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
