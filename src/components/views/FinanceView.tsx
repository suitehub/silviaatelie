import React, { useMemo, useState } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  Package,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDate } from '../../utils/calculations';

export const FinanceView: React.FC = () => {
  const { orders, materials, settings, setSelectedOrder } = useApp();

  const [selectedMonth, setSelectedMonth] = useState<string>('all');

  // Compute financial totals
  const financialSummary = useMemo(() => {
    let relevantOrders = orders;
    if (selectedMonth !== 'all') {
      relevantOrders = orders.filter((o) =>
        o.deliveryDate.startsWith(selectedMonth)
      );
    }

    const totalRevenue = relevantOrders.reduce((sum, o) => sum + o.price, 0);
    const totalMaterialCost = relevantOrders.reduce(
      (sum, o) => sum + o.cost,
      0
    );
    const atelierFixed = settings.monthlyFixedCosts || 300;
    const netProfit = Math.max(0, totalRevenue - totalMaterialCost - atelierFixed);

    const paidOrders = relevantOrders.filter(
      (o) =>
        o.status === 'aprovado' ||
        o.status === 'producao' ||
        o.status === 'pronto' ||
        o.status === 'entregue'
    );
    const pendingPaymentOrders = relevantOrders.filter(
      (o) =>
        o.status === 'aguardando_pagamento' || o.status === 'aguardando_aprovacao'
    );

    const totalPaid = paidOrders.reduce((sum, o) => sum + o.price, 0);
    const totalPending = pendingPaymentOrders.reduce(
      (sum, o) => sum + o.price,
      0
    );

    return {
      totalRevenue,
      totalMaterialCost,
      atelierFixed,
      netProfit,
      paidOrdersCount: paidOrders.length,
      totalPaid,
      pendingCount: pendingPaymentOrders.length,
      totalPending,
      ordersList: relevantOrders,
    };
  }, [orders, settings, selectedMonth]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#7A5268] tracking-tight">
            Financeiro do Ateliê
          </h1>
          <p className="text-xs sm:text-sm text-[#777277] mt-0.5">
            Apenas o que interessa: quanto entrou, quanto gastou e quanto sobrou para você.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-4 py-2.5 glass-input rounded-2xl text-xs font-semibold text-[#292529] shadow-2xs cursor-pointer"
          >
            <option value="all" className="bg-white">Todo o período</option>
            <option value="2026-09" className="bg-white">Setembro 2026</option>
            <option value="2026-08" className="bg-white">Agosto 2026</option>
          </select>
        </div>
      </div>

      {/* 4 Main Plain-Language Metric Cards (Item 33) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Entrou */}
        <div className="glass-card p-5 rounded-3xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#777277]">
              Quanto entrou
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50/80 text-[#3E654E] flex items-center justify-center border border-emerald-100">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-bold text-[#292529] block">
            {formatCurrency(financialSummary.totalRevenue)}
          </span>
          <p className="text-[11px] text-[#777277] mt-1">
            Total bruto dos pedidos no período
          </p>
        </div>

        {/* Materiais */}
        <div className="glass-card p-5 rounded-3xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#777277]">
              Materiais usados
            </span>
            <div className="w-8 h-8 rounded-xl bg-stone-100/80 text-stone-600 flex items-center justify-center border border-stone-200/50">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-bold text-stone-700 block">
            {formatCurrency(financialSummary.totalMaterialCost)}
          </span>
          <p className="text-[11px] text-[#777277] mt-1">
            Papéis, wire-o, laminação, cola
          </p>
        </div>

        {/* Custos Fixos */}
        <div className="glass-card p-5 rounded-3xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#777277]">
              Custos do ateliê
            </span>
            <div className="w-8 h-8 rounded-xl bg-stone-100/80 text-stone-600 flex items-center justify-center border border-stone-200/50">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-bold text-stone-700 block">
            {formatCurrency(financialSummary.atelierFixed)}
          </span>
          <p className="text-[11px] text-[#777277] mt-1">
            Luz, internet, desgaste de lâmina
          </p>
        </div>

        {/* Sobrou para você! */}
        <div className="bg-emerald-50/75 backdrop-blur-md p-5 rounded-3xl border border-emerald-200/70 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-emerald-800">
              Sobrou para você 🌸
            </span>
            <div className="w-8 h-8 rounded-xl bg-white/90 text-emerald-700 flex items-center justify-center shadow-2xs">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-bold text-emerald-700 block">
            {formatCurrency(financialSummary.netProfit)}
          </span>
          <p className="text-[11px] text-emerald-800 mt-1 font-semibold">
            Dinheiro limpo no seu bolso
          </p>
        </div>
      </div>

      {/* Pagamentos: Recebidos vs Aguardando Pagamento */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="glass-card p-5 rounded-3xl flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#5F8A72] flex items-center justify-center shrink-0 border border-emerald-100">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-[#777277] block font-medium">
                Pedidos pagos ou em produção
              </span>
              <span className="text-lg font-bold text-[#292529]">
                {formatCurrency(financialSummary.totalPaid)}
              </span>
            </div>
          </div>
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50/80 px-3 py-1 rounded-full border border-emerald-200/60">
            {financialSummary.paidOrdersCount} pedidos
          </span>
        </div>

        <div className="glass-card p-5 rounded-3xl flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-[#C89B4B] flex items-center justify-center shrink-0 border border-amber-100">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-[#777277] block font-medium">
                Aguardando pagamento / aprovação
              </span>
              <span className="text-lg font-bold text-[#292529]">
                {formatCurrency(financialSummary.totalPending)}
              </span>
            </div>
          </div>
          <span className="text-xs font-semibold text-[#9C6F2A] bg-amber-50/80 px-3 py-1 rounded-full border border-amber-200/60">
            {financialSummary.pendingCount} pedidos
          </span>
        </div>
      </div>

      {/* Demonstrativo simples de lucros por pedido */}
      <div className="glass-card rounded-3xl p-6">
        <h2 className="text-base font-bold text-[#292529] mb-4">
          Ganhos detalhados por pedido
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-[#E8D8DF]/40 text-[#777277] font-semibold">
                <th className="pb-3">Pedido</th>
                <th className="pb-3">Cliente</th>
                <th className="pb-3">Produto</th>
                <th className="pb-3 text-right">Preço</th>
                <th className="pb-3 text-right">Custo</th>
                <th className="pb-3 text-right">Seu Lucro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8D8DF]/30">
              {financialSummary.ordersList.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className="hover:bg-white/60 cursor-pointer transition-colors"
                >
                  <td className="py-3 font-bold text-[#7A5268]">
                    {order.orderNumber}
                  </td>
                  <td className="py-3 font-medium text-[#292529]">
                    {order.clientName}
                  </td>
                  <td className="py-3 text-[#777277]">{order.productName}</td>
                  <td className="py-3 text-right font-semibold text-[#292529]">
                    {formatCurrency(order.price)}
                  </td>
                  <td className="py-3 text-right text-stone-500">
                    {formatCurrency(order.cost)}
                  </td>
                  <td className="py-3 text-right font-bold text-emerald-700">
                    {formatCurrency(order.profit)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
