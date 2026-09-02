import React from 'react';
import {
  BookOpen,
  DollarSign,
  Heart,
  Home,
  Image as ImageIcon,
  Package,
  Settings,
  ShoppingBag,
  TrendingUp,
  Users,
  X,
  Sparkles,
} from 'lucide-react';
import { NavigationTab, useApp } from '../../context/AppContext';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  id: NavigationTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
  badgeType?: 'warning' | 'primary';
}

export const Sidebar: React.FC<SidebarProps> = ({
  mobileOpen,
  onCloseMobile,
}) => {
  const { activeTab, setActiveTab, orders, materials, settings } = useApp();

  // Low stock warning count
  const lowStockCount = materials.filter((m) => m.currentStock <= m.minStock).length;
  // Orders waiting for approval or in production
  const activeOrdersCount = orders.filter(
    (o) => o.status === 'aguardando_aprovacao' || o.status === 'producao'
  ).length;

  const navItems: NavItem[] = [
    { id: 'inicio', label: 'Início', icon: Home },
    {
      id: 'pedidos',
      label: 'Pedidos',
      icon: ShoppingBag,
      badge: activeOrdersCount > 0 ? activeOrdersCount : undefined,
      badgeType: 'primary',
    },
    { id: 'clientes', label: 'Clientes', icon: Users },
    { id: 'produtos', label: 'Produtos', icon: BookOpen },
    { id: 'modelos', label: 'Modelos', icon: ImageIcon },
    {
      id: 'estoque',
      label: 'Estoque',
      icon: Package,
      badge: lowStockCount > 0 ? lowStockCount : undefined,
      badgeType: 'warning',
    },
    { id: 'precos', label: 'Preços', icon: DollarSign },
    { id: 'financeiro', label: 'Financeiro', icon: TrendingUp },
    { id: 'configuracoes', label: 'Configurações', icon: Settings },
  ];

  const handleSelectTab = (tab: NavigationTab) => {
    setActiveTab(tab);
    onCloseMobile();
  };

  const navContent = (
    <div className="flex flex-col h-full bg-white/75 backdrop-blur-xl border-r border-white/60 shadow-2xs select-none">
      {/* Brand Header */}
      <div className="p-6 border-b border-[#E8D8DF]/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#7A5268] rounded-xl flex items-center justify-center text-white shadow-md shadow-[#7A5268]/20 font-bold text-lg">
            S
          </div>
          <div>
            <h1 className="font-bold text-lg text-[#7A5268] tracking-tight leading-tight">
              {settings.atelierName}
            </h1>
            <p className="text-xs text-[#777277] flex items-center gap-1 font-normal">
              Papelaria com carinho
            </p>
          </div>
        </div>

        {/* Mobile close button */}
        <button
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 rounded-xl text-[#777277] hover:bg-white/80 transition-colors cursor-pointer"
          aria-label="Fechar menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleSelectTab(item.id)}
              className={`sidebar-item w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-all cursor-pointer ${
                isActive
                  ? 'active font-bold text-[#7A5268] bg-[#E8D8DF] shadow-2xs'
                  : 'font-medium text-[#777277] hover:bg-white/60 hover:text-[#7A5268]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-transform ${
                    isActive ? 'text-[#7A5268]' : 'text-[#777277]'
                  }`}
                />
                <span>{item.label}</span>
              </div>

              {item.badge !== undefined && (
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-white/80 text-[#7A5268] shadow-2xs'
                      : item.badgeType === 'warning'
                      ? 'bg-amber-100/90 text-amber-800'
                      : 'bg-[#FAF8F9] text-[#7A5268] border border-[#E8D8DF]/60'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer / Atelier status */}
      <div className="p-4 border-t border-[#E8D8DF]/40 bg-white/40 backdrop-blur-xs">
        <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/60 border border-white/60 shadow-2xs">
          <div className="w-2.5 h-2.5 rounded-full bg-[#5F8A72] shadow-2xs shrink-0" />
          <div className="text-xs">
            <p className="font-semibold text-[#292529]">Ateliê Aberto</p>
            <p className="text-[#777277] truncate">{settings.ownerName}, tudo em ordem</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop static sidebar */}
      <aside className="hidden lg:block w-64 h-screen sticky top-0 shrink-0">
        {navContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 max-w-[85vw] bg-white/90 backdrop-blur-2xl transition-transform duration-300 ease-in-out lg:hidden shadow-2xl border-r border-white/60 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {navContent}
      </div>
    </>
  );
};
