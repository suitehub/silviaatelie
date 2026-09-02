import React from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  Package,
  Plus,
  ShoppingBag,
  Sparkles,
  Truck,
  UserPlus,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  formatCurrency,
  formatDate,
  getStatusInfo,
} from '../../utils/calculations';

export const Dashboard: React.FC = () => {
  const {
    orders,
    materials,
    setActiveTab,
    setIsNewOrderOpen,
    setIsNewClientOpen,
    setIsNewModelOpen,
    setIsRegisterPurchaseOpen,
    setSelectedOrder,
  } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];

  // Calculations for Silvia's 3 daily questions
  const ordersToday = orders.filter(
    (o) => o.deliveryDate === todayStr && o.status !== 'entregue'
  );

  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
  const weekStr = sevenDaysFromNow.toISOString().split('T')[0];

  const ordersThisWeek = orders.filter(
    (o) =>
      o.deliveryDate >= todayStr &&
      o.deliveryDate <= weekStr &&
      o.status !== 'entregue'
  );

  const ordersInProduction = orders.filter((o) => o.status === 'producao');

  const lowStockMaterials = materials.filter(
    (m) => m.currentStock <= m.minStock
  );

  // Upcoming non-delivered orders sorted by delivery date
  const upcomingOrders = [...orders]
    .filter((o) => o.status !== 'entregue')
    .sort((a, b) => a.deliveryDate.localeCompare(b.deliveryDate))
    .slice(0, 5);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="glass-card p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#A97891] block mb-1">
            Silvia Ateliê • Papelaria Personalizada
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#7A5268] tracking-tight">
            Olá, Silvia! 🌸
          </h1>
          <p className="text-sm text-[#777277] mt-1">
            Aqui está o que você tem para hoje e os próximos dias.
          </p>
        </div>

        {/* Primary Action Button */}
        <button
          type="button"
          onClick={() => setIsNewOrderOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-[#7A5268] hover:bg-[#634254] text-white text-sm font-bold rounded-2xl shadow-lg shadow-[#7A5268]/20 hover:shadow-xl hover:shadow-[#7A5268]/25 transition-all active:scale-[0.98] cursor-pointer"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>Novo pedido</span>
        </button>
      </div>

      {/* 4 Cards: O que responder rapidamente (Frosted Glass Metric Cards with accent left borders) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Entregar Hoje */}
        <div
          onClick={() => setActiveTab('pedidos')}
          className="glass-card-interactive p-4 sm:p-5 rounded-3xl border-l-4 border-l-[#5F8A72] cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#777277]">
              Entregar hoje
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#FAF8F9] text-[#5F8A72] flex items-center justify-center group-hover:bg-[#5F8A72] group-hover:text-white transition-colors">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-[#5F8A72]">
              {ordersToday.length}
            </span>
            <span className="text-xs text-[#777277]">
              {ordersToday.length === 1 ? 'pedido' : 'pedidos'}
            </span>
          </div>
          <p className="text-[11px] text-[#777277] mt-1">
            {ordersToday.length > 0
              ? 'Atenção para envio ou retirada hoje!'
              : 'Nenhum pedido vence hoje'}
          </p>
        </div>

        {/* Entregar esta semana */}
        <div
          onClick={() => setActiveTab('pedidos')}
          className="glass-card-interactive p-4 sm:p-5 rounded-3xl border-l-4 border-l-[#C89B4B] cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#777277]">
              Esta semana
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#FAF8F9] text-[#C89B4B] flex items-center justify-center group-hover:bg-[#C89B4B] group-hover:text-white transition-colors">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-[#292529]">
              {ordersThisWeek.length}
            </span>
            <span className="text-xs text-[#777277]">
              {ordersThisWeek.length === 1 ? 'pedido' : 'pedidos'}
            </span>
          </div>
          <p className="text-[11px] text-[#777277] mt-1">
            Para os próximos 7 dias
          </p>
        </div>

        {/* Em produção */}
        <div
          onClick={() => setActiveTab('pedidos')}
          className="glass-card-interactive p-4 sm:p-5 rounded-3xl border-l-4 border-l-[#7A5268] cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#777277]">
              Em produção
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#7A5268] flex items-center justify-center group-hover:bg-[#7A5268] group-hover:text-white transition-colors">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-[#7A5268]">
              {ordersInProduction.length}
            </span>
            <span className="text-xs text-[#777277]">
              na bancada
            </span>
          </div>
          <p className="text-[11px] text-[#777277] mt-1">
            Sendo confeccionados agora
          </p>
        </div>

        {/* Materiais acabando */}
        <div
          onClick={() => setActiveTab('estoque')}
          className="glass-card-interactive p-4 sm:p-5 rounded-3xl border-l-4 border-l-[#B86666] cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#777277]">
              Materiais acabando
            </span>
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                lowStockMaterials.length > 0
                  ? 'bg-red-100 text-[#B86666]'
                  : 'bg-emerald-50 text-[#5F8A72]'
              }`}
            >
              {lowStockMaterials.length > 0 ? (
                <AlertTriangle className="w-4 h-4" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span
              className={`text-2xl sm:text-3xl font-bold ${
                lowStockMaterials.length > 0 ? 'text-[#B86666]' : 'text-[#5F8A72]'
              }`}
            >
              {lowStockMaterials.length}
            </span>
            <span className="text-xs text-[#777277]">
              {lowStockMaterials.length === 1 ? 'item' : 'itens'}
            </span>
          </div>
          <p className="text-[11px] text-[#777277] mt-1">
            {lowStockMaterials.length > 0
              ? 'Precisa comprar para não faltar!'
              : 'Estoque de materiais em dia'}
          </p>
        </div>
      </div>

      {/* Ações Rápidas (Item 6) */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[#777277] mb-3">
          Ações rápidas
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            type="button"
            onClick={() => setIsNewOrderOpen(true)}
            className="glass-card-interactive p-3.5 rounded-2xl flex items-center gap-3 text-left cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#FAF8F9] text-[#7A5268] flex items-center justify-center group-hover:bg-[#7A5268] group-hover:text-white transition-colors shrink-0">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#292529] block">
                Novo pedido
              </span>
              <span className="text-[11px] text-[#777277]">
                Registrar encomenda
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setIsNewClientOpen(true)}
            className="glass-card-interactive p-3.5 rounded-2xl flex items-center gap-3 text-left cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#FAF8F9] text-[#7A5268] flex items-center justify-center group-hover:bg-[#7A5268] group-hover:text-white transition-colors shrink-0">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#292529] block">
                Novo cliente
              </span>
              <span className="text-[11px] text-[#777277]">
                Salvar contato
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setIsNewModelOpen(true)}
            className="glass-card-interactive p-3.5 rounded-2xl flex items-center gap-3 text-left cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#FAF8F9] text-[#7A5268] flex items-center justify-center group-hover:bg-[#7A5268] group-hover:text-white transition-colors shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#292529] block">
                Cadastrar modelo
              </span>
              <span className="text-[11px] text-[#777277]">
                Guardar na galeria
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setIsRegisterPurchaseOpen(true)}
            className="glass-card-interactive p-3.5 rounded-2xl flex items-center gap-3 text-left cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#FAF8F9] text-[#7A5268] flex items-center justify-center group-hover:bg-[#7A5268] group-hover:text-white transition-colors shrink-0">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#292529] block">
                Comprar material
              </span>
              <span className="text-[11px] text-[#777277]">
                Atualizar estoque
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Lista Rápida: "Próximas entregas" */}
      <div className="glass-card rounded-3xl p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-[#292529]">
              Próximas entregas
            </h2>
            <p className="text-xs text-[#777277]">
              Pedidos organizados pela data de entrega mais próxima
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('pedidos')}
            className="text-xs font-semibold text-[#7A5268] hover:underline flex items-center gap-1 cursor-pointer"
          >
            Ver todos os pedidos
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {upcomingOrders.length === 0 ? (
          <div className="text-center py-8 text-[#777277] text-sm">
            Nenhum pedido pendente de entrega. Parabéns! 🌸
          </div>
        ) : (
          <div className="space-y-2.5">
            {upcomingOrders.map((order) => {
              const status = getStatusInfo(order.status);
              return (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className="glass-card-subtle p-3.5 sm:p-4 rounded-2xl hover:bg-white/90 hover:border-[#E8D8DF] transition-all flex items-center justify-between gap-3 cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-white/80 text-[#7A5268] flex items-center justify-center font-bold text-xs border border-white/80 shadow-2xs shrink-0">
                      {order.orderNumber}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-[#292529] truncate">
                          {order.clientName}
                        </span>
                        {order.childName && (
                          <span className="text-xs text-[#7A5268] font-medium hidden sm:inline">
                            ({order.childName})
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#777277] truncate mt-0.5">
                        {order.productName} • Modelo: {order.modelName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right hidden sm:block">
                      <span className="text-xs font-semibold text-[#292529] block">
                        {formatDate(order.deliveryDate)}
                      </span>
                      <span className="text-[11px] text-[#777277]">
                        {formatCurrency(order.price)}
                      </span>
                    </div>

                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border backdrop-blur-xs ${status.badgeBg}`}
                    >
                      <span className="status-dot" style={{ backgroundColor: 'currentColor' }} />
                      {status.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Alerta de Estoque Baixo se houver */}
      {lowStockMaterials.length > 0 && (
        <div className="bg-red-50/75 backdrop-blur-md border border-red-200/70 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-red-100 text-[#B86666] flex items-center justify-center shrink-0 shadow-2xs">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#B86666]">
                {lowStockMaterials.length}{' '}
                {lowStockMaterials.length === 1
                  ? 'material está acabando'
                  : 'materiais estão acabando'}
              </h3>
              <p className="text-xs text-[#777277] mt-0.5">
                {lowStockMaterials.map((m) => m.name).join(', ')}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('estoque')}
            className="px-4 py-2 bg-[#B86666] hover:bg-[#a35555] text-white text-xs font-bold rounded-xl shadow-md shadow-[#B86666]/20 transition-all cursor-pointer shrink-0 text-center"
          >
            Ver estoque
          </button>
        </div>
      )}
    </div>
  );
};
