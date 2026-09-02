import React, { useState } from 'react';
import {
  AlertCircle,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  DollarSign,
  Edit2,
  ExternalLink,
  MessageCircle,
  Package,
  Sparkles,
  Trash2,
  Truck,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { OrderStatus } from '../../types';
import {
  formatCurrency,
  formatDate,
  getStatusInfo,
} from '../../utils/calculations';

export const OrderDetailModal: React.FC = () => {
  const {
    selectedOrder,
    setSelectedOrder,
    updateOrderStatus,
    copyOrder,
    setMaterialDeductionOrder,
    setDeleteConfirmModal,
    deleteOrder,
    setIsNewOrderOpen,
    setNewOrderInitialData,
  } = useApp();

  if (!selectedOrder) return null;

  const statusInfo = getStatusInfo(selectedOrder.status);

  const allStatuses: { id: OrderStatus; label: string }[] = [
    { id: 'orcamento', label: 'Orçamento' },
    { id: 'aguardando_aprovacao', label: 'Aguardando aprovação' },
    { id: 'aprovado', label: 'Aprovado' },
    { id: 'aguardando_pagamento', label: 'Aguardando pagamento' },
    { id: 'producao', label: 'Em produção' },
    { id: 'pronto', label: 'Pronto' },
    { id: 'entregue', label: 'Entregue' },
  ];

  const handleStatusChange = (newStatus: OrderStatus) => {
    updateOrderStatus(selectedOrder.id, newStatus);
  };

  const handleEdit = () => {
    setNewOrderInitialData(selectedOrder);
    setSelectedOrder(null);
    setIsNewOrderOpen(true);
  };

  const handleDelete = () => {
    setDeleteConfirmModal({
      isOpen: true,
      title: 'Excluir este pedido?',
      message: `Tem certeza que deseja excluir o pedido ${selectedOrder.orderNumber} de ${selectedOrder.clientName}? Esta ação não poderá ser desfeita.`,
      onConfirm: () => deleteOrder(selectedOrder.id),
    });
  };

  // WhatsApp quick message URL
  const waClean = selectedOrder.clientPhone.replace(/\D/g, '');
  const waNumber = waClean.startsWith('55') ? waClean : `55${waClean}`;
  const waMessage = encodeURIComponent(
    `Olá, ${selectedOrder.clientName}! Passando para te atualizar sobre o seu pedido ${selectedOrder.orderNumber} (${selectedOrder.productName}): está ${statusInfo.label.toLowerCase()}! 🌸 Silvia Ateliê`
  );
  const waLink = `https://wa.me/${waNumber}?text=${waMessage}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/30 backdrop-blur-md overflow-y-auto">
      <div className="glass-card rounded-3xl max-w-2xl w-full shadow-2xl border border-white/80 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header with Title and Close */}
        <div className="p-6 border-b border-[#E8D8DF]/40 flex items-start justify-between glass-card-subtle">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-xl sm:text-2xl font-bold text-[#7A5268] tracking-tight">
                Pedido {selectedOrder.orderNumber}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusInfo.badgeBg}`}
              >
                <span className={`w-2 h-2 rounded-full ${statusInfo.dotColor}`} />
                {statusInfo.label}
              </span>
            </div>
            <p className="text-base font-medium text-[#292529] mt-1">
              {selectedOrder.clientName}
            </p>
            <p className="text-sm text-[#777277]">
              {selectedOrder.productName}
            </p>
          </div>

          <button
            onClick={() => setSelectedOrder(null)}
            className="p-2 text-stone-400 hover:text-stone-600 rounded-xl hover:bg-white/60 transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Status Stepper / Quick Switcher */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#777277] mb-2">
              Situação do pedido
            </label>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
              {allStatuses.map((s, index) => {
                const isCurrent = selectedOrder.status === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => handleStatusChange(s.id)}
                    className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-[#7A5268] text-white shadow-xs font-semibold'
                        : 'bg-stone-100 text-stone-600 hover:bg-[#F2EBF0] hover:text-[#7A5268]'
                    }`}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Personalização */}
          <div className="glass-card-subtle rounded-2xl p-4.5 border border-white/60">
            <h3 className="text-xs font-semibold text-[#777277] uppercase tracking-wider mb-3">
              Personalização
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              {selectedOrder.childName && (
                <div>
                  <span className="text-[#777277] text-xs block">Nome:</span>
                  <strong className="text-[#292529] text-base font-semibold">
                    {selectedOrder.childName}
                  </strong>
                </div>
              )}

              {selectedOrder.modelName && (
                <div>
                  <span className="text-[#777277] text-xs block">Modelo:</span>
                  <strong className="text-[#292529] font-medium">
                    {selectedOrder.modelName}
                  </strong>
                </div>
              )}

              {selectedOrder.theme && (
                <div>
                  <span className="text-[#777277] text-xs block">Tema:</span>
                  <span className="text-[#292529] font-medium">{selectedOrder.theme}</span>
                </div>
              )}

              {selectedOrder.color && (
                <div>
                  <span className="text-[#777277] text-xs block">Cor:</span>
                  <span className="text-[#292529] font-medium">{selectedOrder.color}</span>
                </div>
              )}

              {selectedOrder.coverType && (
                <div>
                  <span className="text-[#777277] text-xs block">Tipo de capa:</span>
                  <span className="text-[#292529]">{selectedOrder.coverType}</span>
                </div>
              )}

              {selectedOrder.coreType && (
                <div>
                  <span className="text-[#777277] text-xs block">Versão do miolo:</span>
                  <span className="text-[#292529]">{selectedOrder.coreType}</span>
                </div>
              )}

              {selectedOrder.extraPages && (
                <div>
                  <span className="text-[#777277] text-xs block">Páginas extras:</span>
                  <span className="text-[#292529]">{selectedOrder.extraPages}</span>
                </div>
              )}

              {selectedOrder.size && (
                <div>
                  <span className="text-[#777277] text-xs block">Tamanho:</span>
                  <span className="text-[#292529]">{selectedOrder.size}</span>
                </div>
              )}

              {selectedOrder.paperType && (
                <div>
                  <span className="text-[#777277] text-xs block">Tipo de folha:</span>
                  <span className="text-[#292529]">{selectedOrder.paperType}</span>
                </div>
              )}

              {selectedOrder.binding && (
                <div>
                  <span className="text-[#777277] text-xs block">Encadernação:</span>
                  <span className="text-[#292529]">{selectedOrder.binding}</span>
                </div>
              )}

              {selectedOrder.finish && (
                <div>
                  <span className="text-[#777277] text-xs block">Acabamento:</span>
                  <span className="text-[#292529]">{selectedOrder.finish}</span>
                </div>
              )}

              {selectedOrder.accessories && selectedOrder.accessories.length > 0 && (
                <div>
                  <span className="text-[#777277] text-xs block">Acessórios:</span>
                  <span className="text-[#292529]">
                    {selectedOrder.accessories.join(', ')}
                  </span>
                </div>
              )}

              {selectedOrder.height && (
                <div>
                  <span className="text-[#777277] text-xs block">Medidas da Bíblia:</span>
                  <span className="text-[#292529]">
                    {selectedOrder.height} x {selectedOrder.width || '15cm'} (Lombada: {selectedOrder.spine || '3cm'})
                  </span>
                </div>
              )}

              {selectedOrder.kitItems && selectedOrder.kitItems.length > 0 && (
                <div className="sm:col-span-2">
                  <span className="text-[#777277] text-xs block mb-1">Itens do Kit:</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {selectedOrder.kitItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-white px-2.5 py-1.5 rounded-lg border border-stone-200/80 text-xs font-medium text-[#292529]"
                      >
                        {item.quantity}x {item.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <span className="text-[#777277] text-xs block">Quantidade:</span>
                <span className="text-[#292529] font-semibold">
                  {selectedOrder.quantity || 1} un
                </span>
              </div>
            </div>

            {selectedOrder.notes && (
              <div className="mt-3 pt-3 border-t border-stone-200/60">
                <span className="text-[#777277] text-xs block">Observações:</span>
                <p className="text-sm text-[#292529] mt-0.5 whitespace-pre-wrap">
                  {selectedOrder.notes}
                </p>
              </div>
            )}
          </div>

          {/* Valores: Preço, Custo, Lucro */}
          <div>
            <h3 className="text-xs font-semibold text-[#777277] uppercase tracking-wider mb-2.5">
              Valores
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[#FAF8F9] p-3.5 rounded-2xl border border-[#E8D8DF]/60 text-center">
                <span className="text-xs text-[#777277] block font-medium">Preço</span>
                <span className="text-base sm:text-lg font-bold text-[#7A5268]">
                  {formatCurrency(selectedOrder.price)}
                </span>
              </div>

              <div className="glass-card-subtle p-3.5 rounded-2xl border border-white/60 text-center">
                <span className="text-xs text-[#777277] block font-medium">Preço</span>
                <span className="text-base sm:text-lg font-bold text-[#7A5268]">
                  {formatCurrency(selectedOrder.price)}
                </span>
              </div>

              <div className="glass-card-subtle p-3.5 rounded-2xl border border-white/60 text-center">
                <span className="text-xs text-[#777277] block font-medium">Custo</span>
                <span className="text-base sm:text-lg font-semibold text-stone-700">
                  {formatCurrency(selectedOrder.cost)}
                </span>
              </div>

              <div className="bg-emerald-50/75 backdrop-blur-xs p-3.5 rounded-2xl border border-emerald-200/60 text-center">
                <span className="text-xs text-emerald-800 block font-medium">Lucro</span>
                <span className="text-base sm:text-lg font-bold text-emerald-700">
                  {formatCurrency(selectedOrder.profit)}
                </span>
              </div>
            </div>
          </div>

          {/* Entrega e Materiais */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 glass-card-subtle rounded-2xl border border-white/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/80 flex items-center justify-center text-[#7A5268] border border-white/80 shadow-2xs">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-[#777277] block font-medium">
                  Data de entrega
                </span>
                <span className="text-sm font-semibold text-[#292529]">
                  {formatDate(selectedOrder.deliveryDate)}
                </span>
              </div>
            </div>

            {/* WhatsApp do Cliente */}
            {selectedOrder.clientPhone && (
              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Conversar no WhatsApp</span>
              </a>
            )}
          </div>

          {/* Status dos Materiais no Estoque */}
          <div className="glass-card-subtle rounded-2xl p-4 border border-white/60">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#777277]">
                  Estoque de materiais
                </h4>
                <p className="text-xs text-[#292529] mt-0.5">
                  {selectedOrder.materialsDeducted
                    ? 'Materiais já foram descontados do estoque.'
                    : 'Materiais ainda não foram descontados do estoque.'}
                </p>
              </div>

              {!selectedOrder.materialsDeducted && (
                <button
                  type="button"
                  onClick={() => setMaterialDeductionOrder(selectedOrder)}
                  className="px-3.5 py-2 bg-[#7A5268] hover:bg-[#634254] text-white text-xs font-bold rounded-xl transition-all shadow-sm shadow-[#7A5268]/20 cursor-pointer"
                >
                  Baixar materiais
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-[#E8D8DF]/40 glass-card-subtle flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDelete}
              className="p-2 text-[#B86666] hover:bg-red-50/80 rounded-xl transition-colors cursor-pointer"
              title="Excluir pedido"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => copyOrder(selectedOrder)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#7A5268] bg-white/80 border border-white rounded-xl hover:bg-white transition-colors cursor-pointer shadow-2xs"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copiar pedido</span>
            </button>

            <button
              type="button"
              onClick={handleEdit}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#292529] bg-white/80 border border-white rounded-xl hover:bg-white transition-colors cursor-pointer shadow-2xs"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Editar</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {selectedOrder.status !== 'pronto' && selectedOrder.status !== 'entregue' && (
              <button
                type="button"
                onClick={() => handleStatusChange('pronto')}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Marcar como pronto</span>
              </button>
            )}

            {selectedOrder.status === 'pronto' && (
              <button
                type="button"
                onClick={() => handleStatusChange('entregue')}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#7A5268] hover:bg-[#634254] text-white text-xs font-bold rounded-xl shadow-md shadow-[#7A5268]/20 transition-colors cursor-pointer"
              >
                <Truck className="w-4 h-4" />
                <span>Marcar como entregue</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
