import React, { useState } from 'react';
import { PackagePlus, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/calculations';

export const RegisterPurchaseModal: React.FC = () => {
  const {
    isRegisterPurchaseOpen,
    setIsRegisterPurchaseOpen,
    materialForPurchase,
    materials,
    registerPurchase,
  } = useApp();

  const [selectedMaterialId, setSelectedMaterialId] = useState<string>(
    materialForPurchase?.id || materials[0]?.id || ''
  );
  const [quantity, setQuantity] = useState<number>(100);
  const [totalPrice, setTotalPrice] = useState<string>('50,00');
  const [purchaseDate, setPurchaseDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [supplier, setSupplier] = useState<string>('');

  if (!isRegisterPurchaseOpen) return null;

  const currentMat =
    materials.find((m) => m.id === selectedMaterialId) ||
    materialForPurchase ||
    materials[0];

  const priceNum = parseFloat(totalPrice.replace(',', '.')) || 0;
  const calculatedUnitCost = quantity > 0 ? priceNum / quantity : 0;
  const previousStock = currentMat ? currentMat.currentStock : 0;
  const newStock = previousStock + quantity;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMat || quantity <= 0) return;

    registerPurchase(
      currentMat.id,
      quantity,
      priceNum,
      supplier.trim() || currentMat.supplier
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/30 backdrop-blur-md">
      <div className="glass-card rounded-3xl max-w-md w-full p-6 shadow-2xl border border-white/80 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-[#E8D8DF]/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/80 text-[#7A5268] flex items-center justify-center border border-white/80 shadow-2xs">
              <PackagePlus className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-[#292529]">
              Registrar compra de material
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setIsRegisterPurchaseOpen(false)}
            className="p-1.5 text-stone-400 hover:text-stone-600 rounded-lg hover:bg-white/60 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-[#777277] block mb-1">
              Material comprado
            </label>
            <select
              value={selectedMaterialId}
              onChange={(e) => setSelectedMaterialId(e.target.value)}
              className="w-full px-3.5 py-2.5 glass-input rounded-xl text-sm font-semibold text-[#292529] cursor-pointer"
            >
              {materials.map((m) => (
                <option key={m.id} value={m.id} className="bg-white text-[#292529]">
                  {m.name} ({m.currentStock} {m.unit} em estoque)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#777277] block mb-1">
                Quantidade comprada
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3.5 py-2 text-sm glass-input rounded-xl font-semibold"
                  required
                />
                <span className="text-xs text-[#777277]">
                  {currentMat?.unit}
                </span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#777277] block mb-1">
                Valor total pago (R$)
              </label>
              <input
                type="text"
                value={totalPrice}
                onChange={(e) => setTotalPrice(e.target.value)}
                placeholder="Ex: 90,00"
                className="w-full px-3.5 py-2 text-sm glass-input rounded-xl font-bold text-[#7A5268]"
                required
              />
            </div>
          </div>

          {/* Smart Preview Box */}
          <div className="glass-card-subtle p-3.5 rounded-2xl border border-white/60 text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[#777277]">Custo unitário calculado:</span>
              <strong className="text-[#7A5268] font-bold">
                {formatCurrency(calculatedUnitCost)} por {currentMat?.unit.slice(0, -1) || 'un'}
              </strong>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-white/40">
              <span className="text-[#777277]">Atualização do estoque:</span>
              <span className="text-[#292529] font-medium">
                {previousStock} → <strong className="text-emerald-700">{newStock} {currentMat?.unit}</strong>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#777277] block mb-1">
                Data da compra
              </label>
              <input
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                className="w-full px-3 py-2 text-xs glass-input rounded-xl cursor-pointer"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#777277] block mb-1">
                Fornecedor / Loja
              </label>
              <input
                type="text"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                placeholder="Ex: Armarinho..."
                className="w-full px-3 py-2 text-xs glass-input rounded-xl"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsRegisterPurchaseOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-[#777277] hover:bg-white/60 rounded-xl cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#7A5268] hover:bg-[#634254] text-white text-xs font-bold rounded-xl shadow-md shadow-[#7A5268]/20 transition-all cursor-pointer"
            >
              Confirmar compra
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
