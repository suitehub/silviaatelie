import React, { useMemo, useState } from 'react';
import {
  Filter,
  Image as ImageIcon,
  Plus,
  Search,
  ShoppingBag,
  Sparkles,
  Tag,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ModelItem } from '../../types';

export const ModelsGallery: React.FC = () => {
  const {
    models,
    setSelectedModel,
    startNewOrderFromModel,
    setIsNewModelOpen,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'todos' | 'meus_modelos' | 'arquivos_comprados'>('todos');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [selectedTheme, setSelectedTheme] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    'Todas',
    'Cadernetas',
    'Cadernos',
    'Agendas',
    'Devocionais',
    'Reforma de Bíblia',
    'Kit Festa',
  ];

  const themes = ['Todos', 'Floral', 'Safari', 'Ursinho', 'Masculino', 'Feminino', 'Neutro'];

  const filteredModels = useMemo(() => {
    return models.filter((m) => {
      // Tab filter
      if (activeTab === 'meus_modelos' && m.type !== 'meu_modelo') return false;
      if (activeTab === 'arquivos_comprados' && m.type !== 'arquivo_comprado') return false;

      // Category filter
      if (selectedCategory !== 'Todas' && m.category !== selectedCategory) return false;

      // Theme filter
      if (selectedTheme !== 'Todos') {
        const themeMatch =
          m.theme?.toLowerCase() === selectedTheme.toLowerCase() ||
          m.tags?.some((t) => t.toLowerCase() === selectedTheme.toLowerCase());
        if (!themeMatch) return false;
      }

      // Search query
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchTitle = m.title.toLowerCase().includes(q);
        const matchTags = m.tags?.some((t) => t.toLowerCase().includes(q));
        const matchClient = m.clientName?.toLowerCase().includes(q);
        const matchSupplier = m.supplier?.toLowerCase().includes(q);
        if (!matchTitle && !matchTags && !matchClient && !matchSupplier) return false;
      }

      return true;
    });
  }, [models, activeTab, selectedCategory, selectedTheme, searchQuery]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#7A5268] tracking-tight">
            Catálogo de Modelos
          </h1>
          <p className="text-xs sm:text-sm text-[#777277] mt-0.5">
            Galeria visual de artes prontas e arquivos comprados para seus pedidos.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsNewModelOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#7A5268] hover:bg-[#634254] text-white text-xs sm:text-sm font-bold rounded-2xl shadow-lg shadow-[#7A5268]/20 hover:shadow-xl hover:shadow-[#7A5268]/25 transition-all active:scale-[0.98] cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Cadastrar modelo</span>
        </button>
      </div>

      {/* Main Tabs (Meus Modelos vs Arquivos Comprados) */}
      <div className="glass-card-subtle p-1.5 rounded-2xl border border-white/60 flex items-center gap-1.5 overflow-x-auto">
        {[
          { id: 'todos', label: 'Todos os modelos' },
          { id: 'meus_modelos', label: '🌸 Meus modelos feitos' },
          { id: 'arquivos_comprados', label: '📁 Arquivos comprados' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-[#7A5268] text-white shadow-xs'
                : 'text-stone-600 hover:text-[#7A5268] hover:bg-white/60'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search & Theme Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-[#A97891] absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar modelo por nome, tag (#floral, #safari) ou tema..."
            className="w-full pl-11 pr-4 py-2.5 glass-input rounded-2xl text-sm text-[#292529] placeholder-stone-400 shadow-2xs"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-semibold text-[#777277] mr-1 shrink-0">
            Categoria:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                selectedCategory === cat
                  ? 'bg-[#7A5268] text-white border-[#7A5268]'
                  : 'bg-white/70 backdrop-blur-md text-stone-600 border-white/80 hover:bg-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Theme Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-semibold text-[#777277] mr-1 shrink-0">
            Tema:
          </span>
          {themes.map((th) => (
            <button
              key={th}
              type="button"
              onClick={() => setSelectedTheme(th)}
              className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                selectedTheme === th
                  ? 'bg-[#A97891] text-white border-[#A97891]'
                  : 'bg-white/70 backdrop-blur-md text-stone-600 border-white/80 hover:bg-white'
              }`}
            >
              {th}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Gallery Grid */}
      {filteredModels.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-white/80 text-[#7A5268] mx-auto flex items-center justify-center mb-3 shadow-2xs">
            <ImageIcon className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#292529]">
            Nenhum modelo encontrado
          </h3>
          <p className="text-xs text-[#777277] mt-1 max-w-sm mx-auto">
            Tente mudar o filtro de categoria, tema ou cadastrar um novo modelo.
          </p>
          <button
            type="button"
            onClick={() => setIsNewModelOpen(true)}
            className="mt-4 px-5 py-2.5 bg-[#7A5268] hover:bg-[#684357] text-white text-xs font-bold rounded-2xl inline-flex items-center gap-1.5 shadow-md shadow-[#7A5268]/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Cadastrar modelo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredModels.map((model) => (
            <div
              key={model.id}
              onClick={() => setSelectedModel(model)}
              className="glass-card-interactive rounded-3xl overflow-hidden cursor-pointer group flex flex-col justify-between"
            >
              <div>
                {/* Large Visual Image */}
                <div className="relative h-48 w-full bg-stone-100/70 overflow-hidden">
                  <img
                    src={model.imageUrl}
                    alt={model.title}
                    className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold backdrop-blur-md ${
                        model.type === 'meu_modelo'
                          ? 'bg-white/85 text-[#7A5268] shadow-2xs'
                          : 'bg-amber-100/90 text-amber-800'
                      }`}
                    >
                      {model.type === 'meu_modelo' ? 'Feito no Ateliê' : 'Comprado'}
                    </span>
                  </div>
                  <div className="absolute top-2.5 right-2.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-black/45 text-white backdrop-blur-xs">
                      {model.category}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4">
                  <h3 className="font-bold text-sm text-[#292529] group-hover:text-[#7A5268] transition-colors line-clamp-1">
                    {model.title}
                  </h3>

                  {model.clientName && (
                    <p className="text-xs text-[#777277] mt-0.5">
                      Feito para: <span className="font-medium text-stone-700">{model.clientName}</span>
                    </p>
                  )}

                  {model.supplier && (
                    <p className="text-xs text-[#777277] mt-0.5">
                      Designer: <span className="font-medium text-stone-700">{model.supplier}</span>
                    </p>
                  )}

                  {/* Tags */}
                  {model.tags && model.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2.5">
                      {model.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-md text-[10px] bg-white/70 text-stone-600 font-medium border border-white/80"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Botão: Usar neste pedido (Item 20 & 47) */}
              <div className="p-4 pt-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    startNewOrderFromModel(model);
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 bg-white/70 hover:bg-[#7A5268] text-[#7A5268] hover:text-white border border-white/80 hover:border-transparent rounded-xl text-xs font-bold transition-all shadow-2xs active:scale-[0.98] cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Usar neste pedido</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
