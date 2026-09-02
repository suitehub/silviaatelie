import React, { useMemo, useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Filter,
  Package,
  Plus,
  Search,
  Truck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';
import {
  formatCurrency,
  formatDate,
  getStatusInfo,
} from '../../utils/calculations';

type FilterType =
  | 'todos'
  | 'hoje'
  | 'esta_semana'
  | 'producao'
  | 'prontos'
  | 'aguardando';

export const OrdersList: React.FC = () => {
  const { orders, setSelectedOrder, setIsNewOrderOpen } = useApp();

  const [activeFilter, setActiveFilter] = useState<FilterType>('todos');
  const [searchQuery, setSearchQuery] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  const nextWeekStr = nextWeek.toISOString().split('T')[0];

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Search match
      const query = searchQuery.toLowerCase();
      const matchSearch =
        !searchQuery ||
        order.orderNumber.toLowerCase().includes(query) ||
        order.clientName.toLowerCase().includes(query) ||
        order.productName.toLowerCase().includes(query) ||
        order.modelName.toLowerCase().includes(query) ||
        (order.childName && order.childName.toLowerCase().includes(query));

      if (!matchSearch) return false;

      // Filter category
      switch (activeFilter) {
        case 'hoje':
          return order.deliveryDate === todayStr && order.status !== 'entregue';
        case 'esta_semana':
          return (
            order.deliveryDate >= todayStr &&
            order.deliveryDate <= nextWeekStr &&
            order.status !== 'entregue'
          );
        case 'producao':
          return order.status === 'producao';
        case 'prontos':
          return order.status === 'pronto';
        case 'aguardando':
          return (
            order.status === 'orcamento' ||
            order.status === 'aguardando_aprovacao' ||
            order.status === 'aguardando_pagamento'
          );
        default:
          return true;
      }
    });
  }, [orders, activeFilter, searchQuery, todayStr, nextWeekStr]);

  const counts = useMemo(() => {
    return {
      todos: orders.length,
      hoje: orders.filter(
        (o) => o.deliveryDate === todayStr && o.status !== 'entregue'
      ).length,
      esta_semana: orders.filter(
        (o) =>
          o.deliveryDate >= todayStr &&
          o.deliveryDate <= nextWeekStr &&
          o.status !== 'entregue'
      ).length,
      producao: orders.filter((o) => o.status === 'producao').length,
      prontos: orders.filter((o) => o.status === 'pronto').length,
    };
  }, [orders, todayStr, nextWeekStr]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#7A5268] tracking-tight">
            Pedidos
          </h1>
          <p className="text-xs sm:text-sm text-[#777277] mt-0.5">
            Acompanhe a produção e as entregas de cada cliente.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsNewOrderOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#7A5268] hover:bg-[#634254] text-white text-xs sm:text-sm font-bold rounded-2xl shadow-lg shadow-[#7A5268]/20 hover:shadow-xl hover:shadow-[#7A5268]/25 transition-all active:scale-[0.98] cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Novo pedido</span>
        </button>
      </div>

      {/* Search & Simple Filters (Item 15) */}
      <div className="space-y-3">
        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#A97891] absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por cliente, número (#0245), produto ou nome da criança..."
            className="w-full pl-11 pr-4 py-2.5 glass-input rounded-2xl text-sm text-[#292529] placeholder-stone-400 shadow-2xs"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'todos', label: 'Todos', count: counts.todos },
            { id: 'hoje', label: 'Para entregar hoje', count: counts.hoje },
            { id: 'esta_semana', label: 'Esta semana', count: counts.esta_semana },
            { id: 'producao', label: 'Em produção', count: counts.producao },
            { id: 'prontos', label: 'Prontos', count: counts.prontos },
          ].map((f) => {
            const isCurrent = activeFilter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setActiveFilter(f.id as FilterType)}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                  isCurrent
                    ? 'bg-[#7A5268] text-white border-[#7A5268] shadow-xs'
                    : 'bg-white/70 backdrop-blur-md text-stone-600 border-white/80 hover:bg-white hover:border-[#E8D8DF]'
                }`}
              >
                {f.label}
                <span
                  className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] ${
                    isCurrent
                      ? 'bg-white/20 text-white'
                      : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  {f.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders Grid / Cards */}
      {filteredOrders.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-white/80 text-[#7A5268] mx-auto flex items-center justify-center mb-3 shadow-2xs">
            <Package className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#292529]">
            Nenhum pedido encontrado
          </h3>
          <p className="text-xs text-[#777277] mt-1 max-w-sm mx-auto">
            {searchQuery
              ? 'Nenhum pedido corresponde à sua pesquisa. Tente buscar com outras palavras.'
              : 'Não há pedidos para este filtro no momento.'}
          </p>
          <button
            type="button"
            onClick={() => setIsNewOrderOpen(true)}
            className="mt-4 px-5 py-2.5 bg-[#7A5268] hover:bg-[#684357] text-white text-xs font-bold rounded-2xl inline-flex items-center gap-1.5 shadow-md shadow-[#7A5268]/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Criar novo pedido
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOrders.map((order) => {
            const status = getStatusInfo(order.status);
            const isToday = order.deliveryDate === todayStr;

            return (
              <div
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className={`glass-card-interactive rounded-3xl p-5 flex flex-col justify-between cursor-pointer group ${
                  isToday && order.status !== 'entregue'
                    ? 'border-l-4 border-l-[#C89B4B]'
                    : ''
                }`}
              >
                <div>
                  {/* Top Bar: Order number & Status badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-bold text-[#7A5268] tracking-wider">
                      {order.orderNumber}
                    </span>

                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border backdrop-blur-xs ${status.badgeBg}`}
                    >
                      <span className="status-dot" style={{ backgroundColor: 'currentColor' }} />
                      {status.label}
                    </span>
                  </div>

                  {/* Client name & Product */}
                  <h3 className="font-bold text-base text-[#292529] group-hover:text-[#7A5268] transition-colors">
                    {order.clientName}
                  </h3>

                  <p className="text-xs text-[#777277] mt-0.5 font-medium">
                    {order.productName}
                  </p>

                  {/* Personalization highlights */}
                  <div className="mt-3 p-3 glass-card-subtle rounded-2xl border border-white/60 space-y-1 text-xs">
                    {order.childName && (
                      <div className="flex items-center justify-between">
                        <span className="text-[#777277]">Nome:</span>
                        <span className="font-semibold text-[#292529]">
                          {order.childName}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-[#777277]">Modelo:</span>
                      <span className="text-[#292529] font-medium truncate max-w-[140px]">
                        {order.modelName}
                      </span>
                    </div>
                    {order.color && (
                      <div className="flex items-center justify-between">
                        <span className="text-[#777277]">Cor / Tema:</span>
                        <span className="text-[#292529]">{order.color}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Bar: Delivery date & Price */}
                <div className="mt-4 pt-3 border-t border-[#E8D8DF]/40 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-[#777277]">
                    <Calendar className="w-3.5 h-3.5 text-[#7A5268]" />
                    <span
                      className={`font-medium ${
                        isToday && order.status !== 'entregue'
                          ? 'text-[#C89B4B] font-bold'
                          : ''
                      }`}
                    >
                      {isToday ? 'Entrega hoje!' : formatDate(order.deliveryDate)}
                    </span>
                  </div>

                  <span className="text-sm font-bold text-[#7A5268]">
                    {formatCurrency(order.price)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
