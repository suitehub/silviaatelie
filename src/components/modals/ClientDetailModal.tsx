import React from 'react';
import {
  Calendar,
  DollarSign,
  MessageCircle,
  Package,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDate, getStatusInfo } from '../../utils/calculations';

export const ClientDetailModal: React.FC = () => {
  const {
    selectedClient,
    setSelectedClient,
    orders,
    setSelectedOrder,
    setIsNewOrderOpen,
    setNewOrderInitialData,
    setDeleteConfirmModal,
    deleteClient,
  } = useApp();

  if (!selectedClient) return null;

  // Find orders by this client
  const clientOrders = orders.filter((o) => o.clientId === selectedClient.id);
  const totalSpent = clientOrders.reduce((sum, o) => sum + o.price, 0);

  // WhatsApp Link
  const waClean = selectedClient.whatsapp.replace(/\D/g, '');
  const waNumber = waClean.startsWith('55') ? waClean : `55${waClean}`;
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    `Olá, ${selectedClient.name}! Tudo bem? Passando para te desejar um ótimo dia! 🌸 Silvia Ateliê`
  )}`;

  const handleStartOrderForClient = () => {
    setNewOrderInitialData({
      clientId: selectedClient.id,
      clientName: selectedClient.name,
      clientPhone: selectedClient.whatsapp,
    });
    setSelectedClient(null);
    setIsNewOrderOpen(true);
  };

  const handleDeleteClient = () => {
    setDeleteConfirmModal({
      isOpen: true,
      title: 'Excluir esta cliente?',
      message: `Tem certeza que deseja excluir ${selectedClient.name}? O histórico de pedidos continuará preservado.`,
      onConfirm: () => deleteClient(selectedClient.id),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/30 backdrop-blur-md overflow-y-auto">
      <div className="glass-card rounded-3xl max-w-2xl w-full shadow-2xl border border-white/80 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-[#E8D8DF]/40 flex items-start justify-between glass-card-subtle">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#7A5268] text-white flex items-center justify-center font-bold text-xl shadow-md shrink-0 overflow-hidden">
              {selectedClient.avatarUrl ? (
                <img
                  src={selectedClient.avatarUrl}
                  alt={selectedClient.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                selectedClient.name.charAt(0)
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#292529]">
                {selectedClient.name}
              </h2>
              <p className="text-xs text-[#777277] mt-0.5">
                Cliente desde {formatDate(selectedClient.createdAt)}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSelectedClient(null)}
            className="p-2 text-stone-400 hover:text-stone-600 rounded-xl hover:bg-white/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Contact and Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="glass-card-subtle p-3.5 rounded-2xl border border-white/60">
              <span className="text-[11px] text-[#777277] block font-medium">
                WhatsApp
              </span>
              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-semibold text-emerald-700 hover:underline flex items-center gap-1.5 mt-1"
              >
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span>{selectedClient.whatsapp}</span>
              </a>
            </div>

            <div className="glass-card-subtle p-3.5 rounded-2xl border border-white/60">
              <span className="text-[11px] text-[#777277] block font-medium">
                Total de pedidos
              </span>
              <span className="text-base font-bold text-[#292529] mt-0.5 block">
                {clientOrders.length} pedido{clientOrders.length === 1 ? '' : 's'}
              </span>
            </div>

            <div className="bg-emerald-50/75 backdrop-blur-xs p-3.5 rounded-2xl border border-emerald-200/60">
              <span className="text-[11px] text-emerald-800 block font-medium">
                Total investido
              </span>
              <span className="text-base font-bold text-emerald-700 mt-0.5 block">
                {formatCurrency(totalSpent)}
              </span>
            </div>
          </div>

          {/* Notes */}
          {selectedClient.notes && (
            <div className="glass-card-subtle p-4 rounded-2xl border border-white/60">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#777277] block mb-1">
                Observações sobre a cliente
              </span>
              <p className="text-sm text-[#292529] leading-relaxed">
                {selectedClient.notes}
              </p>
            </div>
          )}

          {/* Histórico de Pedidos */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#777277]">
                Histórico de pedidos ({clientOrders.length})
              </h3>
              <button
                type="button"
                onClick={handleStartOrderForClient}
                className="text-xs font-semibold text-[#7A5268] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Novo pedido para {selectedClient.name.split(' ')[0]}
              </button>
            </div>

            {clientOrders.length === 0 ? (
              <div className="py-6 text-center text-xs text-stone-400 glass-card-subtle rounded-2xl border border-white/40">
                Nenhum pedido registrado para esta cliente ainda.
              </div>
            ) : (
              <div className="space-y-2">
                {clientOrders.map((ord) => {
                  const status = getStatusInfo(ord.status);
                  return (
                    <div
                      key={ord.id}
                      onClick={() => {
                        setSelectedClient(null);
                        setSelectedOrder(ord);
                      }}
                      className="p-3.5 glass-card-interactive rounded-2xl transition-all flex items-center justify-between cursor-pointer group"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-[#7A5268]">
                            {ord.orderNumber}
                          </span>
                          <span className="font-medium text-sm text-[#292529]">
                            {ord.productName}
                          </span>
                        </div>
                        <p className="text-xs text-[#777277] mt-0.5">
                          Modelo: {ord.modelName} • Entrega:{' '}
                          {formatDate(ord.deliveryDate)}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-bold text-[#292529] block">
                          {formatCurrency(ord.price)}
                        </span>
                        <span
                          className={`inline-block text-[11px] px-2 py-0.5 rounded-full border ${status.badgeBg} mt-1 font-semibold`}
                        >
                          {status.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-[#E8D8DF]/40 glass-card-subtle flex items-center justify-between">
          <button
            type="button"
            onClick={handleDeleteClient}
            className="p-2 text-[#B86666] hover:bg-red-50/80 rounded-xl transition-colors cursor-pointer"
            title="Excluir cliente"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleStartOrderForClient}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#7A5268] hover:bg-[#634254] text-white text-xs font-bold rounded-xl shadow-md shadow-[#7A5268]/20 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Fazer novo pedido</span>
          </button>
        </div>
      </div>
    </div>
  );
};
