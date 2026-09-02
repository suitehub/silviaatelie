import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Minus,
  Package,
  PackagePlus,
  Plus,
  Search,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Material, MaterialCategory } from '../../types';
import {
  formatCurrency,
  getMaterialStockStatus,
} from '../../utils/calculations';

export const StockList: React.FC = () => {
  const {
    materials,
    setIsNewMaterialOpen,
    setIsRegisterPurchaseOpen,
    setMaterialForPurchase,
    updateMaterialStock,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [stockStatusFilter, setStockStatusFilter] = useState<'todos' | 'criticos'>('todos');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'Todas',
    'Papéis',
    'Papelões',
    'Acabamentos',
    'Encadernação',
    'Fitas',
    'Elásticos',
    'Adesivos',
    'Outros',
  ];

  const filteredMaterials = useMemo(() => {
    return materials.filter((m) => {
      if (selectedCategory !== 'Todas' && m.category !== selectedCategory) {
        return false;
      }
      if (stockStatusFilter === 'criticos' && m.currentStock > m.minStock) {
        return false;
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          m.name.toLowerCase().includes(q) ||
          m.category.toLowerCase().includes(q) ||
          (m.supplier && m.supplier.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [materials, selectedCategory, stockStatusFilter, searchQuery]);

  const criticalCount = materials.filter((m) => m.currentStock <= m.minStock).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#7A5268] tracking-tight">
            Estoque de Materiais
          </h1>
          <p className="text-xs sm:text-sm text-[#777277] mt-0.5">
            Controle de folhas, papelões, wire-o e acabamentos para nunca faltar nada.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              setMaterialForPurchase(null);
              setIsRegisterPurchaseOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 glass-card-interactive text-[#7A5268] text-xs sm:text-sm font-semibold rounded-2xl transition-all cursor-pointer shadow-2xs"
          >
            <PackagePlus className="w-4 h-4" />
            <span>Registrar compra</span>
          </button>

          <button
            type="button"
            onClick={() => setIsNewMaterialOpen(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#7A5268] hover:bg-[#634254] text-white text-xs sm:text-sm font-bold rounded-2xl shadow-lg shadow-[#7A5268]/20 hover:shadow-xl hover:shadow-[#7A5268]/25 transition-all active:scale-[0.98] cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Novo material</span>
          </button>
        </div>
      </div>

      {/* Alert banner if materials are low */}
      {criticalCount > 0 && (
        <div className="p-4 rounded-3xl bg-red-50/75 backdrop-blur-md border border-red-200/70 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-[#B86666] shrink-0" />
            <p className="text-xs sm:text-sm text-[#292529]">
              Você tem <strong>{criticalCount} {criticalCount === 1 ? 'material' : 'materiais'}</strong> atingindo o nível mínimo de segurança.
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              setStockStatusFilter(stockStatusFilter === 'criticos' ? 'todos' : 'criticos')
            }
            className="text-xs font-bold text-[#B86666] hover:underline cursor-pointer shrink-0"
          >
            {stockStatusFilter === 'criticos' ? 'Ver todos' : 'Filtrar acabando'}
          </button>
        </div>
      )}

      {/* Search and Category Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-[#A97891] absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar material por nome, fornecedor..."
            className="w-full pl-11 pr-4 py-2.5 glass-input rounded-2xl text-sm text-[#292529] placeholder-stone-400 shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                selectedCategory === cat
                  ? 'bg-[#7A5268] text-white border-[#7A5268] shadow-xs'
                  : 'bg-white/70 backdrop-blur-md text-stone-600 border-white/80 hover:bg-white hover:border-[#E8D8DF]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Materials List / Cards (Item 22) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMaterials.map((material) => {
          const status = getMaterialStockStatus(
            material.currentStock,
            material.minStock
          );
          const isLow = material.currentStock <= material.minStock;

          return (
            <div
              key={material.id}
              className={`glass-card-interactive rounded-3xl p-5 flex flex-col justify-between ${
                isLow ? 'border-l-4 border-l-[#B86666]' : ''
              }`}
            >
              <div>
                {/* Header: Name and Status Badge */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[11px] font-semibold text-[#A97891] uppercase tracking-wider block">
                      {material.category}
                    </span>
                    <h3 className="text-base font-bold text-[#292529] mt-0.5">
                      {material.name}
                    </h3>
                  </div>

                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border backdrop-blur-xs ${status.badgeBg}`}
                  >
                    <span className="status-dot" style={{ backgroundColor: 'currentColor' }} />
                    {status.label}
                  </span>
                </div>

                {/* Dimensions / Color */}
                {(material.size || material.color) && (
                  <p className="text-xs text-[#777277] mb-3">
                    {material.size} {material.color ? `• Cor: ${material.color}` : ''}
                  </p>
                )}

                {/* Stock Stats */}
                <div className="grid grid-cols-2 gap-2 p-3 glass-card-subtle rounded-2xl border border-white/60 mt-2">
                  <div>
                    <span className="text-[10px] text-[#777277] block font-medium">
                      Estoque Atual
                    </span>
                    <span className="text-lg font-bold text-[#292529]">
                      {material.currentStock}{' '}
                      <span className="text-xs font-normal text-[#777277]">
                        {material.unit}
                      </span>
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-[#777277] block font-medium">
                      Custo Unitário
                    </span>
                    <span className="text-sm font-bold text-[#7A5268]">
                      {formatCurrency(material.unitCost)}
                    </span>
                    <span className="text-[10px] text-[#777277] block">
                      por {material.unit.slice(0, -1) || 'un'}
                    </span>
                  </div>
                </div>

                {material.minStock && (
                  <p className="text-[11px] text-[#777277] mt-2">
                    Mínimo recomendado: {material.minStock} {material.unit}
                  </p>
                )}
              </div>

              {/* Quick Adjust Buttons (+ and -) & Register Purchase */}
              <div className="mt-4 pt-3 border-t border-[#E8D8DF]/40 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      updateMaterialStock(
                        material.id,
                        Math.max(0, material.currentStock - 1)
                      )
                    }
                    className="w-8 h-8 rounded-xl bg-white/80 hover:bg-white text-[#777277] hover:text-[#292529] border border-white/80 flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                    title="Diminuir 1"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      updateMaterialStock(
                        material.id,
                        material.currentStock + 1
                      )
                    }
                    className="w-8 h-8 rounded-xl bg-white/80 hover:bg-white text-[#777277] hover:text-[#292529] border border-white/80 flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                    title="Aumentar 1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setMaterialForPurchase(material);
                    setIsRegisterPurchaseOpen(true);
                  }}
                  className="px-3.5 py-1.5 bg-white/70 hover:bg-white text-[#7A5268] border border-white/80 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-2xs"
                >
                  Registrar compra
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
