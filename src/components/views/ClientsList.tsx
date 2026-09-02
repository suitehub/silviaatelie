import React, { useMemo, useState } from 'react';
import {
  Calendar,
  MessageCircle,
  Plus,
  Search,
  ShoppingBag,
  User,
  UserPlus,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDate } from '../../utils/calculations';

export const ClientsList: React.FC = () => {
  const { clients, orders, setSelectedClient, setIsNewClientOpen } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  // Client stats mapping
  const clientStats = useMemo(() => {
    const stats: Record<
      string,
      { orderCount: number; lastOrderDate: string; totalSpent: number }
    > = {};

    clients.forEach((c) => {
      const clientOrders = orders.filter((o) => o.clientId === c.id);
      const sorted = [...clientOrders].sort((a, b) =>
        b.deliveryDate.localeCompare(a.deliveryDate)
      );
      stats[c.id] = {
        orderCount: clientOrders.length,
        lastOrderDate: sorted[0]?.deliveryDate || '',
        totalSpent: clientOrders.reduce((sum, o) => sum + o.price, 0),
      };
    });

    return stats;
  }, [clients, orders]);

  const filteredClients = useMemo(() => {
    if (!searchQuery) return clients;
    const q = searchQuery.toLowerCase();
    return clients.filter(
      (c) => c.name.toLowerCase().includes(q) || c.whatsapp.includes(q)
    );
  }, [clients, searchQuery]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#7A5268] tracking-tight">
            Clientes
          </h1>
          <p className="text-xs sm:text-sm text-[#777277] mt-0.5">
            Cadastre e acompanhe o histórico de cada cliente.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsNewClientOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#7A5268] hover:bg-[#684357] text-white text-xs sm:text-sm font-semibold rounded-2xl shadow-xs hover:shadow transition-all active:scale-[0.98] cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Novo cliente</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#777277] absolute left-4 top-3.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar cliente por nome ou WhatsApp..."
          className="w-full pl-11 pr-4 py-2.5 glass-input rounded-2xl text-sm text-[#292529] placeholder-[#777277]/70 focus:outline-hidden focus:border-[#7A5268] shadow-2xs font-medium"
        />
      </div>

      {/* Clients Grid */}
      {filteredClients.length === 0 ? (
        <div className="glass-card rounded-3xl border border-white/80 p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-white/80 text-[#7A5268] mx-auto flex items-center justify-center mb-3 border border-white/60 shadow-2xs">
            <User className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#292529]">
            Nenhuma cliente encontrada
          </h3>
          <p className="text-xs text-[#777277] mt-1 max-w-sm mx-auto">
            {searchQuery
              ? 'Nenhum resultado com esse nome ou telefone.'
              : 'Você ainda não cadastrou nenhuma cliente.'}
          </p>
          <button
            type="button"
            onClick={() => setIsNewClientOpen(true)}
            className="mt-4 px-4 py-2 bg-[#7A5268] hover:bg-[#634254] text-white text-xs font-bold rounded-xl inline-flex items-center gap-1.5 shadow-md shadow-[#7A5268]/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Cadastrar cliente
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.map((client) => {
            const st = clientStats[client.id] || {
              orderCount: 0,
              lastOrderDate: '',
              totalSpent: 0,
            };

            const waClean = client.whatsapp.replace(/\D/g, '');
            const waNumber = waClean.startsWith('55') ? waClean : `55${waClean}`;
            const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(
              `Olá, ${client.name}! Tudo bem? 🌸 Silvia Ateliê`
            )}`;

            return (
              <div
                key={client.id}
                onClick={() => setSelectedClient(client)}
                className="glass-card-interactive rounded-3xl p-5 border border-white/80 hover:border-[#7A5268]/60 shadow-2xs hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-[#7A5268] text-white flex items-center justify-center font-bold text-base shadow-2xs shrink-0 overflow-hidden">
                        {client.avatarUrl ? (
                          <img
                            src={client.avatarUrl}
                            alt={client.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          client.name.charAt(0)
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-[#292529] group-hover:text-[#7A5268] transition-colors">
                          {client.name}
                        </h3>
                        <p className="text-xs text-[#777277]">{client.whatsapp}</p>
                      </div>
                    </div>
                  </div>

                  {/* Summary pills */}
                  <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                    <div className="glass-card-subtle p-2.5 rounded-xl border border-white/60">
                      <span className="text-[#777277] block text-[11px]">
                        Pedidos feitos
                      </span>
                      <strong className="text-[#292529] font-bold">
                        {st.orderCount} {st.orderCount === 1 ? 'pedido' : 'pedidos'}
                      </strong>
                    </div>

                    <div className="glass-card-subtle p-2.5 rounded-xl border border-white/60">
                      <span className="text-[#777277] block text-[11px]">
                        Total investido
                      </span>
                      <strong className="text-[#3E654E] font-bold">
                        {formatCurrency(st.totalSpent)}
                      </strong>
                    </div>
                  </div>

                  {st.lastOrderDate && (
                    <p className="text-[11px] text-[#777277] mt-3">
                      Último pedido em: {formatDate(st.lastOrderDate)}
                    </p>
                  )}
                </div>

                {/* WhatsApp Link Button */}
                <div className="mt-4 pt-3 border-t border-[#E8D8DF]/40 flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#7A5268] group-hover:underline">
                    Ver histórico completo
                  </span>

                  <a
                    href={waLink}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#5F8A72] hover:bg-[#4d735e] text-white text-xs font-medium rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
