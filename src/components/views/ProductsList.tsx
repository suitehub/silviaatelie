import React, { useState } from 'react';
import { Clock, DollarSign, Package, Plus, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  calculateProductCost,
  formatCurrency,
} from '../../utils/calculations';

export const ProductsList: React.FC = () => {
  const { products, materials, settings, setSelectedProduct, setIsNewOrderOpen, setNewOrderInitialData } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('Todos');

  const categories = [
    'Todos',
    'Cadernetas',
    'Cadernos',
    'Agendas',
    'Devocionais',
    'Reforma de Bíblia',
    'Kit Festa',
  ];

  const filteredProducts = products.filter(
    (p) => activeCategory === 'Todos' || p.category === activeCategory
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#7A5268] tracking-tight">
            Produtos do Ateliê
          </h1>
          <p className="text-xs sm:text-sm text-[#777277] mt-0.5">
            Ficha técnica, custos dos materiais e lucros estimados de cada item.
          </p>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
              activeCategory === cat
                ? 'bg-[#7A5268] text-white border-[#7A5268] shadow-xs'
                : 'bg-white/70 backdrop-blur-md text-stone-600 border-white/80 hover:bg-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProducts.map((product) => {
          const costData = calculateProductCost(product, materials, settings);
          const profit = product.basePrice - costData.totalCost;

          return (
            <div
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              className="glass-card-interactive rounded-3xl overflow-hidden cursor-pointer group flex flex-col justify-between"
            >
              <div>
                {/* Photo Banner */}
                <div className="relative h-44 w-full bg-stone-100/70 overflow-hidden">
                  <img
                    src={product.photoUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/85 text-[#7A5268] shadow-2xs backdrop-blur-md">
                      {product.category}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5">
                  <h3 className="font-bold text-base text-[#292529] group-hover:text-[#7A5268] transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-[#777277] mt-1 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>

                  <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                    <div className="glass-card-subtle p-2 rounded-xl border border-white/60">
                      <span className="text-[10px] text-[#777277] block font-medium">
                        Preço
                      </span>
                      <strong className="text-xs sm:text-sm font-bold text-[#7A5268]">
                        {formatCurrency(product.basePrice)}
                      </strong>
                    </div>

                    <div className="glass-card-subtle p-2 rounded-xl border border-white/60">
                      <span className="text-[10px] text-[#777277] block font-medium">
                        Custo
                      </span>
                      <strong className="text-xs sm:text-sm font-semibold text-stone-600">
                        {formatCurrency(costData.totalCost)}
                      </strong>
                    </div>

                    <div className="bg-emerald-50/70 backdrop-blur-xs p-2 rounded-xl border border-emerald-200/60">
                      <span className="text-[10px] text-emerald-800 block font-medium">
                        Lucro
                      </span>
                      <strong className="text-xs sm:text-sm font-bold text-emerald-700">
                        {formatCurrency(profit)}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom footer bar */}
              <div className="px-5 pb-4 pt-2 flex items-center justify-between text-xs text-[#777277] border-t border-[#E8D8DF]/40">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#A97891]" />
                  {product.productionTimeMinutes} min
                </span>

                <span className="text-xs font-bold text-[#7A5268] group-hover:underline">
                  Ver receita e ficha técnica →
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
