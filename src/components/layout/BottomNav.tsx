import React from 'react';
import { Home, Image as ImageIcon, Menu, Package, Plus, ShoppingBag } from 'lucide-react';
import { NavigationTab, useApp } from '../../context/AppContext';

export const BottomNav: React.FC<{ onOpenMobileMenu: () => void }> = ({
  onOpenMobileMenu,
}) => {
  const {
    activeTab,
    setActiveTab,
    setIsNewOrderOpen,
    setNewOrderInitialData,
    orders,
    materials,
  } = useApp();

  const activeOrdersCount = orders.filter(
    (o) => o.status === 'aguardando_aprovacao' || o.status === 'producao'
  ).length;
  const lowStockCount = materials.filter((m) => m.currentStock <= m.minStock).length;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/80 backdrop-blur-xl border-t border-white/60 px-2 py-1.5 pb-safe shadow-lg">
      <div className="flex items-center justify-around">
        <button
          onClick={() => setActiveTab('inicio')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'inicio'
              ? 'text-[#7A5268] font-bold'
              : 'text-[#777277] hover:text-[#292529]'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">Início</span>
        </button>

        <button
          onClick={() => setActiveTab('pedidos')}
          className={`relative flex flex-col items-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'pedidos'
              ? 'text-[#7A5268] font-bold'
              : 'text-[#777277] hover:text-[#292529]'
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">Pedidos</span>
          {activeOrdersCount > 0 && (
            <span className="absolute top-0.5 right-2 w-2 h-2 rounded-full bg-[#7A5268]" />
          )}
        </button>

        {/* Center Prominent New Order Button */}
        <button
          onClick={() => {
            setNewOrderInitialData(null);
            setIsNewOrderOpen(true);
          }}
          className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[#7A5268] hover:bg-[#634254] text-white shadow-lg shadow-[#7A5268]/30 active:scale-95 transition-transform -translate-y-3 cursor-pointer"
          aria-label="Novo pedido"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>

        <button
          onClick={() => setActiveTab('modelos')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'modelos'
              ? 'text-[#7A5268] font-bold'
              : 'text-[#777277] hover:text-[#292529]'
          }`}
        >
          <ImageIcon className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">Modelos</span>
        </button>

        <button
          onClick={() => setActiveTab('estoque')}
          className={`relative flex flex-col items-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'estoque'
              ? 'text-[#7A5268] font-bold'
              : 'text-[#777277] hover:text-[#292529]'
          }`}
        >
          <Package className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">Estoque</span>
          {lowStockCount > 0 && (
            <span className="absolute top-0.5 right-2 w-2 h-2 rounded-full bg-amber-500" />
          )}
        </button>

        <button
          onClick={onOpenMobileMenu}
          className="flex flex-col items-center py-1 px-2.5 rounded-xl text-[#777277] hover:text-[#292529] transition-colors cursor-pointer"
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">Menu</span>
        </button>
      </div>
    </nav>
  );
};
