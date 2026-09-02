import React from 'react';
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  DollarSign,
  Heart,
  Home,
  Image as ImageIcon,
  Menu,
  Package,
  Plus,
  Search,
  Settings,
  ShoppingBag,
  Tag,
  TrendingUp,
  Users,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Navbar: React.FC<{ onToggleMobileMenu: () => void }> = ({
  onToggleMobileMenu,
}) => {
  const {
    setIsNewOrderOpen,
    setNewOrderInitialData,
    setIsGlobalSearchOpen,
    settings,
    orders,
    materials,
  } = useApp();

  // Count items needing attention
  const pendingCount = orders.filter(
    (o) => o.status === 'aguardando_aprovacao' || o.status === 'orcamento'
  ).length;
  const lowStockCount = materials.filter(
    (m) => m.currentStock <= m.minStock
  ).length;

  return (
    <header className="sticky top-0 z-20 bg-white/70 backdrop-blur-xl border-b border-white/60 px-4 lg:px-8 py-3 transition-all shadow-xs">
      <div className="flex items-center justify-between gap-3 max-w-7xl mx-auto">
        {/* Left: Mobile menu button & Branding on small screens */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-xl text-[#7A5268] bg-white/70 hover:bg-white/90 border border-white/80 shadow-2xs transition-colors"
            aria-label="Abrir menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="lg:hidden flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#7A5268] text-white flex items-center justify-center font-bold text-sm shadow-md shadow-[#7A5268]/20">
              S
            </div>
            <span className="font-bold text-[#7A5268] tracking-tight">
              {settings.atelierName}
            </span>
          </div>
        </div>

        {/* Center: Quick global search trigger */}
        <div className="flex-1 max-w-md mx-2">
          <button
            onClick={() => setIsGlobalSearchOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-2 text-sm bg-white/60 hover:bg-white/90 text-[#777277] rounded-2xl border border-white/80 hover:border-[#E8D8DF] backdrop-blur-md transition-all text-left shadow-2xs cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-4 h-4 text-[#A97891]" />
              <span className="truncate">Buscar pedidos, clientes, modelos...</span>
            </div>
            <span className="hidden sm:inline-block text-[11px] font-medium bg-white/80 px-1.5 py-0.5 rounded border border-stone-200/60 text-stone-400">
              Ctrl+K
            </span>
          </button>
        </div>

        {/* Right: Notification pills & Action Button */}
        <div className="flex items-center gap-2.5">
          {lowStockCount > 0 && (
            <div
              title={`${lowStockCount} materiais estão acabando`}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-50/80 backdrop-blur-sm text-amber-800 border border-amber-200/80 shadow-2xs"
            >
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>{lowStockCount} estoque baixo</span>
            </div>
          )}

          <button
            onClick={() => {
              setNewOrderInitialData(null);
              setIsNewOrderOpen(true);
            }}
            id="btn-novo-pedido-topo"
            className="flex items-center gap-2 px-5 py-2.5 bg-[#7A5268] hover:bg-[#634254] text-white text-xs sm:text-sm font-bold rounded-2xl shadow-lg shadow-[#7A5268]/20 hover:shadow-xl hover:shadow-[#7A5268]/25 transition-all active:scale-[0.98] cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Novo pedido</span>
          </button>
        </div>
      </div>
    </header>
  );
};
