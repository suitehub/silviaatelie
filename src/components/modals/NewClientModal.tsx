import React, { useState } from 'react';
import { User, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NewClientModal: React.FC = () => {
  const { isNewClientOpen, setIsNewClientOpen, addClient } = useApp();

  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [notes, setNotes] = useState('');

  if (!isNewClientOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addClient({
      name: name.trim(),
      whatsapp: whatsapp.trim() || '(11) 99999-9999',
      notes: notes.trim(),
    });

    setIsNewClientOpen(false);
    setName('');
    setWhatsapp('');
    setNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/30 backdrop-blur-md">
      <div className="glass-card rounded-3xl max-w-md w-full p-6 shadow-2xl border border-white/80 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-[#E8D8DF]/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/80 text-[#7A5268] flex items-center justify-center border border-white/80 shadow-2xs">
              <User className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-[#292529]">
              Nova cliente
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setIsNewClientOpen(false)}
            className="p-1.5 text-stone-400 hover:text-stone-600 rounded-lg hover:bg-white/60 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-[#777277] block mb-1">
              Nome da cliente <span className="text-[#B86666]">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Maria Silva"
              required
              autoFocus
              className="w-full px-3.5 py-2.5 glass-input rounded-xl text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-[#777277] block mb-1">
              WhatsApp
            </label>
            <input
              type="text"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="Ex: (11) 98888-7777"
              className="w-full px-3.5 py-2.5 glass-input rounded-xl text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-[#777277] block mb-1">
              Observações
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Prefere tons pastéis, mãe de dois bebês..."
              rows={3}
              className="w-full px-3.5 py-2 text-sm glass-input rounded-xl"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsNewClientOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-[#777277] hover:bg-white/60 rounded-xl cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-5 py-2.5 bg-[#7A5268] hover:bg-[#634254] text-white text-xs font-bold rounded-xl shadow-md shadow-[#7A5268]/20 transition-all cursor-pointer disabled:opacity-50"
            >
              Salvar cliente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
