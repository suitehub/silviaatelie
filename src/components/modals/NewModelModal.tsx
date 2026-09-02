import React, { useState } from 'react';
import { Image as ImageIcon, Upload, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ModelItem } from '../../types';

export const NewModelModal: React.FC = () => {
  const { isNewModelOpen, setIsNewModelOpen, addModel, clients } = useApp();

  const [type, setType] = useState<'meu_modelo' | 'arquivo_comprado'>('meu_modelo');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Cadernetas');
  const [productType, setProductType] = useState('Caderneta de Saúde');
  const [clientName, setClientName] = useState('');
  const [supplier, setSupplier] = useState('');
  const [pricePaid, setPricePaid] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [theme, setTheme] = useState('');
  const [color, setColor] = useState('');
  const [notes, setNotes] = useState('');

  if (!isNewModelOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    addModel({
      type,
      title: title.trim(),
      category,
      productType,
      clientName: type === 'meu_modelo' ? clientName : undefined,
      supplier: type === 'arquivo_comprado' ? supplier : undefined,
      date: new Date().toISOString().split('T')[0],
      pricePaid: pricePaid ? parseFloat(pricePaid.replace(',', '.')) || 0 : undefined,
      imageUrl:
        imageUrl.trim() ||
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
      tags,
      theme,
      color,
      notes,
    });

    setIsNewModelOpen(false);
    // Reset
    setTitle('');
    setImageUrl('');
    setTagsInput('');
    setNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/30 backdrop-blur-md overflow-y-auto">
      <div className="glass-card rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-white/80 my-auto animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-[#E8D8DF]/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/80 text-[#7A5268] flex items-center justify-center border border-white/80 shadow-2xs">
              <ImageIcon className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-[#292529]">
              Guardar modelo na galeria
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setIsNewModelOpen(false)}
            className="p-1.5 text-stone-400 hover:text-stone-600 rounded-lg hover:bg-white/60 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          {/* Tipo de Modelo: Meus modelos vs Arquivos comprados */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-[#777277] block mb-1.5">
              Tipo de modelo
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType('meu_modelo')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  type === 'meu_modelo'
                    ? 'bg-white/90 border-[#7A5268] text-[#7A5268] shadow-2xs font-bold'
                    : 'bg-white/30 border-white/60 text-stone-600 hover:bg-white/50'
                }`}
              >
                🌸 Meu modelo feito
              </button>
              <button
                type="button"
                onClick={() => setType('arquivo_comprado')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  type === 'arquivo_comprado'
                    ? 'bg-white/90 border-[#7A5268] text-[#7A5268] shadow-2xs font-bold'
                    : 'bg-white/30 border-white/60 text-stone-600 hover:bg-white/50'
                }`}
              >
                📁 Arquivo comprado
              </button>
            </div>
          </div>

          {/* Nome */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-[#777277] block mb-1">
              Nome do modelo <span className="text-[#B86666]">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Caderneta Safari Aquarela / Agenda Floral 2026"
              required
              className="w-full px-3.5 py-2 text-sm glass-input rounded-xl"
            />
          </div>

          {/* Categoria */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#777277] block mb-1">
                Categoria
              </label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setProductType(e.target.value);
                }}
                className="w-full px-3.5 py-2 text-sm glass-input rounded-xl cursor-pointer font-medium"
              >
                <option className="bg-white">Cadernetas</option>
                <option className="bg-white">Cadernos</option>
                <option className="bg-white">Agendas</option>
                <option className="bg-white">Devocionais</option>
                <option className="bg-white">Reforma de Bíblia</option>
                <option className="bg-white">Kit Festa</option>
                <option className="bg-white">Outros</option>
              </select>
            </div>

            {type === 'meu_modelo' ? (
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#777277] block mb-1">
                  Cliente (opcional)
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Ex: Maria Silva"
                  className="w-full px-3.5 py-2 text-sm glass-input rounded-xl"
                />
              </div>
            ) : (
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#777277] block mb-1">
                  Fornecedor / Designer
                </label>
                <input
                  type="text"
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  placeholder="Ex: Estúdio Ilustrado"
                  className="w-full px-3.5 py-2 text-sm glass-input rounded-xl"
                />
              </div>
            )}
          </div>

          {type === 'arquivo_comprado' && (
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#777277] block mb-1">
                Valor pago pelo arquivo (R$)
              </label>
              <input
                type="text"
                value={pricePaid}
                onChange={(e) => setPricePaid(e.target.value)}
                placeholder="Ex: 25,00"
                className="w-full px-3.5 py-2 text-sm glass-input rounded-xl font-bold text-[#7A5268]"
              />
            </div>
          )}

          {/* Link da Foto */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-[#777277] block mb-1">
              Foto ou link da imagem
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://... (ou deixe vazio para foto ilustrativa)"
              className="w-full px-3.5 py-2 text-sm glass-input rounded-xl"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-[#777277] block mb-1">
              Tags (separadas por vírgula)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Ex: Floral, Rosa, Bebê, Aquarela"
              className="w-full px-3.5 py-2 text-sm glass-input rounded-xl"
            />
          </div>

          {/* Observações */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-[#777277] block mb-1">
              Observações
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Detalhes dos apliques, laminação ou gabaritos..."
              rows={2}
              className="w-full px-3.5 py-2 text-sm glass-input rounded-xl"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-[#E8D8DF]/40">
            <button
              type="button"
              onClick={() => setIsNewModelOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-[#777277] hover:bg-white/60 rounded-xl cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="px-5 py-2.5 bg-[#7A5268] hover:bg-[#634254] text-white text-xs font-bold rounded-xl shadow-md shadow-[#7A5268]/20 transition-all cursor-pointer disabled:opacity-50"
            >
              Salvar modelo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
