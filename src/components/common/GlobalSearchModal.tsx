import React, { useEffect, useMemo, useState } from 'react';
import {
  BookOpen,
  Calendar,
  Image as ImageIcon,
  Package,
  Search,
  ShoppingBag,
  User,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDate } from '../../utils/calculations';

export const GlobalSearchModal: React.FC = () => {
  const {
    isGlobalSearchOpen,
    setIsGlobalSearchOpen,
    orders,
    clients,
    products,
    models,
    materials,
    setSelectedOrder,
    setSelectedClient,
    setSelectedModel,
    setSelectedProduct,
    setActiveTab,
  } = useApp();

  const [query, setQuery] = useState('');

  // Keyboard shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsGlobalSearchOpen(!isGlobalSearchOpen);
      } else if (e.key === 'Escape' && isGlobalSearchOpen) {
        setIsGlobalSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGlobalSearchOpen, setIsGlobalSearchOpen]);

  // Clean query
  const q = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (!q) return null;

    const matchedOrders = orders.filter(
      (o) =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.clientName.toLowerCase().includes(q) ||
        o.productName.toLowerCase().includes(q) ||
        o.modelName.toLowerCase().includes(q) ||
        (o.childName && o.childName.toLowerCase().includes(q)) ||
        (o.theme && o.theme.toLowerCase().includes(q))
    );

    const matchedClients = clients.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.whatsapp.includes(q) ||
        (c.notes && c.notes.toLowerCase().includes(q))
    );

    const matchedProducts = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );

    const matchedModels = models.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        (m.tags && m.tags.some((t) => t.toLowerCase().includes(q))) ||
        (m.theme && m.theme.toLowerCase().includes(q)) ||
        (m.clientName && m.clientName.toLowerCase().includes(q))
    );

    const matchedMaterials = materials.filter(
      (mat) =>
        mat.name.toLowerCase().includes(q) ||
        mat.category.toLowerCase().includes(q) ||
        (mat.color && mat.color.toLowerCase().includes(q))
    );

    const totalCount =
      matchedOrders.length +
      matchedClients.length +
      matchedProducts.length +
      matchedModels.length +
      matchedMaterials.length;

    return {
      orders: matchedOrders,
      clients: matchedClients,
      products: matchedProducts,
      models: matchedModels,
      materials: matchedMaterials,
      totalCount,
    };
  }, [q, orders, clients, products, models, materials]);

  if (!isGlobalSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 pb-4 bg-stone-900/30 backdrop-blur-md">
      <div className="glass-card rounded-3xl max-w-2xl w-full shadow-2xl border border-white/80 overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#E8D8DF]/40 glass-card-subtle flex items-center gap-3">
          <Search className="w-5 h-5 text-[#7A5268] shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Digite para buscar pedidos, clientes, produtos, modelos..."
            autoFocus
            className="flex-1 bg-transparent text-[#292529] placeholder-[#777277]/60 text-base focus:outline-hidden font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-stone-400 hover:text-stone-600 rounded-lg cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsGlobalSearchOpen(false)}
            className="text-xs text-[#777277] bg-white/80 border border-white/80 px-2.5 py-1 rounded-lg hover:bg-white cursor-pointer font-semibold shadow-2xs"
          >
            ESC
          </button>
        </div>

        {/* Results Area */}
        <div className="p-4 overflow-y-auto space-y-5 flex-1">
          {!q && (
            <div className="py-8 text-center text-stone-400 text-sm">
              Comece a digitar para encontrar qualquer informação no ateliê.
            </div>
          )}

          {q && results && results.totalCount === 0 && (
            <div className="py-8 text-center text-stone-400 text-sm">
              Nenhum resultado encontrado para "{query}".
            </div>
          )}

          {results && results.totalCount > 0 && (
            <>
              {/* Pedidos */}
              {results.orders.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-[#777277] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <ShoppingBag className="w-3.5 h-3.5 text-[#7A5268]" />
                    Pedidos ({results.orders.length})
                  </h4>
                  <div className="space-y-1.5">
                    {results.orders.map((ord) => (
                      <button
                        key={ord.id}
                        onClick={() => {
                          setSelectedOrder(ord);
                          setIsGlobalSearchOpen(false);
                        }}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-[#FAF8F9] border border-transparent hover:border-[#E8D8DF] transition-all flex items-center justify-between cursor-pointer"
                      >
                        <div>
                          <span className="font-semibold text-sm text-[#7A5268] mr-2">
                            {ord.orderNumber}
                          </span>
                          <span className="font-medium text-sm text-[#292529]">
                            {ord.clientName}
                          </span>
                          <span className="text-xs text-[#777277] ml-2">
                            • {ord.productName} ({ord.modelName})
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-semibold text-[#292529]">
                            {formatCurrency(ord.price)}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Clientes */}
              {results.clients.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-[#777277] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#7A5268]" />
                    Clientes ({results.clients.length})
                  </h4>
                  <div className="space-y-1.5">
                    {results.clients.map((cli) => (
                      <button
                        key={cli.id}
                        onClick={() => {
                          setSelectedClient(cli);
                          setIsGlobalSearchOpen(false);
                          setActiveTab('clientes');
                        }}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-[#FAF8F9] border border-transparent hover:border-[#E8D8DF] transition-all flex items-center justify-between cursor-pointer"
                      >
                        <span className="font-medium text-sm text-[#292529]">
                          {cli.name}
                        </span>
                        <span className="text-xs text-[#777277]">
                          WhatsApp: {cli.whatsapp}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Produtos */}
              {results.products.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-[#777277] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-[#7A5268]" />
                    Produtos ({results.products.length})
                  </h4>
                  <div className="space-y-1.5">
                    {results.products.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setSelectedProduct(p);
                          setIsGlobalSearchOpen(false);
                          setActiveTab('produtos');
                        }}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-[#FAF8F9] border border-transparent hover:border-[#E8D8DF] transition-all flex items-center justify-between cursor-pointer"
                      >
                        <div>
                          <span className="font-medium text-sm text-[#292529]">
                            {p.name}
                          </span>
                          <span className="text-xs text-[#777277] ml-2">
                            ({p.category})
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-[#292529]">
                          {formatCurrency(p.basePrice)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Modelos */}
              {results.models.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-[#777277] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-[#7A5268]" />
                    Modelos ({results.models.length})
                  </h4>
                  <div className="space-y-1.5">
                    {results.models.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => {
                          setSelectedModel(m);
                          setIsGlobalSearchOpen(false);
                          setActiveTab('modelos');
                        }}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-[#FAF8F9] border border-transparent hover:border-[#E8D8DF] transition-all flex items-center justify-between cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={m.imageUrl}
                            alt=""
                            className="w-8 h-8 rounded-lg object-cover"
                          />
                          <div>
                            <span className="font-medium text-sm text-[#292529]">
                              {m.title}
                            </span>
                            <span className="text-xs text-[#777277] ml-2">
                              {m.type === 'meu_modelo'
                                ? 'Meu modelo'
                                : 'Arquivo comprado'}
                            </span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Materiais */}
              {results.materials.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-[#777277] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-[#7A5268]" />
                    Estoque de Materiais ({results.materials.length})
                  </h4>
                  <div className="space-y-1.5">
                    {results.materials.map((mat) => (
                      <button
                        key={mat.id}
                        onClick={() => {
                          setIsGlobalSearchOpen(false);
                          setActiveTab('estoque');
                        }}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-[#FAF8F9] border border-transparent hover:border-[#E8D8DF] transition-all flex items-center justify-between cursor-pointer"
                      >
                        <span className="font-medium text-sm text-[#292529]">
                          {mat.name}
                        </span>
                        <span
                          className={`text-xs font-semibold ${
                            mat.currentStock <= mat.minStock
                              ? 'text-amber-600'
                              : 'text-[#5F8A72]'
                          }`}
                        >
                          {mat.currentStock} {mat.unit}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
