import React, { useState } from 'react';
import { Package, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MaterialCategory } from '../../types';
import { formatCurrency } from '../../utils/calculations';

export const NewMaterialModal: React.FC = () => {
  const { isNewMaterialOpen, setIsNewMaterialOpen, addMaterial } = useApp();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<MaterialCategory>('Papéis');
  const [color, setColor] = useState('');
  const [size, setSize] = useState('A4');
  const [unit, setUnit] = useState('folhas');
  const [currentStock, setCurrentStock] = useState<number>(100);
  const [minStock, setMinStock] = useState<number>(20);
  const [purchasePrice, setPurchasePrice] = useState('50,00');
  const [purchaseQty, setPurchaseQty] = useState(100);
  const [supplier, setSupplier] = useState('');
  const [notes, setNotes] = useState('');

  if (!isNewMaterialOpen) return null;

  const priceNum = parseFloat(purchasePrice.replace(',', '.')) || 0;
  const calculatedUnitCost = purchaseQty > 0 ? priceNum / purchaseQty : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addMaterial({
      name: name.trim(),
      category,
      color,
      size,
      unit,
      currentStock,
      minStock,
      unitCost: Number(calculatedUnitCost.toFixed(4)),
      lastPurchasePrice: priceNum,
      lastPurchaseQty: purchaseQty,
      supplier,
      notes,
    });

    setIsNewMaterialOpen(false);
    setName('');
    setColor('');
    setSupplier('');
    setNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/30 backdrop-blur-md overflow-y-auto">
      <div className="glass-card rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-white/80 my-auto animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-[#E8D8DF]/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/80 text-[#7A5268] flex items-center justify-center border border-white/80 shadow-2xs">
              <Package className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-[#292529]">
              Cadastrar material
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setIsNewMaterialOpen(false)}
            className="p-1.5 text-stone-400 hover:text-stone-600 rounded-lg hover:bg-white/60 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-[#777277] block mb-1">
              Nome do material <span className="text-[#B86666]">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Papel Offset 90g / Wire-o Branco 5/8"
              required
              className="w-full px-3.5 py-2 text-sm glass-input rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#777277] block mb-1">
                Categoria
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as MaterialCategory)}
                className="w-full px-3 py-2 text-sm bg-stone-50 rounded-xl border border-stone-200 focus:bg-white focus:border-[#7A5268] outline-hidden cursor-pointer"
              >
                <option>Papéis</option>
                <option>Papelões</option>
                <option>Acabamentos</option>
                <option>Encadernação</option>
                <option>Fitas</option>
                <option>Elásticos</option>
                <option>Adesivos</option>
                <option>Outros</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#777277] block mb-1">
                Unidade de medida
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-stone-50 rounded-xl border border-stone-200 focus:bg-white focus:border-[#7A5268] outline-hidden cursor-pointer"
              >
                <option value="folhas">folhas</option>
                <option value="unidades">unidades</option>
                <option value="metros">metros</option>
                <option value="rolos">rolos</option>
                <option value="pacotes">pacotes</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#777277] block mb-1">
                Cor (opcional)
              </label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="Ex: Rosa bebê, Branco"
                className="w-full px-3 py-2 text-sm bg-stone-50 rounded-xl border border-stone-200 focus:bg-white focus:border-[#7A5268] outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#777277] block mb-1">
                Tamanho / Gramatura
              </label>
              <input
                type="text"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                placeholder="Ex: A4, 90g, 5/8"
                className="w-full px-3 py-2 text-sm bg-stone-50 rounded-xl border border-stone-200 focus:bg-white focus:border-[#7A5268] outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#777277] block mb-1">
                Quantidade atual em estoque
              </label>
              <input
                type="number"
                min="0"
                value={currentStock}
                onChange={(e) => setCurrentStock(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 text-sm bg-stone-50 rounded-xl border border-stone-200 font-semibold focus:bg-white focus:border-[#7A5268] outline-hidden"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#777277] block mb-1">
                Avisar quando restar menos de
              </label>
              <input
                type="number"
                min="1"
                value={minStock}
                onChange={(e) => setMinStock(Math.max(1, Number(e.target.value)))}
                className="w-full px-3 py-2 text-sm bg-stone-50 rounded-xl border border-stone-200 focus:bg-white focus:border-[#7A5268] outline-hidden"
                required
              />
            </div>
          </div>

          {/* Cálculo do Custo Unitário */}
          <div className="p-3.5 bg-[#FAF8F9] rounded-2xl border border-[#E8D8DF]/60 space-y-2">
            <span className="text-xs font-bold text-[#7A5268] block">
              Preço de compra e custo unitário
            </span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[11px] text-[#777277] block">Valor pago no pacote</span>
                <input
                  type="text"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(e.target.value)}
                  placeholder="Ex: 90,00"
                  className="w-full px-2.5 py-1.5 text-xs bg-white rounded-lg border border-stone-200 font-medium"
                />
              </div>
              <div>
                <span className="text-[11px] text-[#777277] block">Quantidade no pacote</span>
                <input
                  type="number"
                  min="1"
                  value={purchaseQty}
                  onChange={(e) => setPurchaseQty(Math.max(1, Number(e.target.value)))}
                  className="w-full px-2.5 py-1.5 text-xs bg-white rounded-lg border border-stone-200 font-medium"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-stone-200/50 flex items-center justify-between text-xs">
              <span className="text-[#777277]">Custo calculado:</span>
              <strong className="text-[#7A5268] font-bold">
                {formatCurrency(calculatedUnitCost)} por {unit.slice(0, -1) || 'un'}
              </strong>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-[#777277] block mb-1">
              Fornecedor (opcional)
            </label>
            <input
              type="text"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              placeholder="Ex: Chamex, Armarinho São José..."
              className="w-full px-3 py-2 text-sm bg-stone-50 rounded-xl border border-stone-200 focus:bg-white focus:border-[#7A5268] outline-hidden"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-stone-100">
            <button
              type="button"
              onClick={() => setIsNewMaterialOpen(false)}
              className="px-4 py-2 text-xs font-medium text-[#777277] hover:bg-stone-100 rounded-xl cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-5 py-2 bg-[#7A5268] hover:bg-[#684357] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              Salvar material
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
