import React, { useEffect, useMemo, useState } from 'react';
import {
  Calendar,
  Check,
  DollarSign,
  Info,
  Plus,
  Trash2,
  Upload,
  UserPlus,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order, OrderMaterialUsage, Product } from '../../types';
import {
  calculateProductCost,
  calculateSuggestedPrice,
  formatCurrency,
} from '../../utils/calculations';

export const NewOrderModal: React.FC = () => {
  const {
    isNewOrderOpen,
    setIsNewOrderOpen,
    newOrderInitialData,
    setNewOrderInitialData,
    clients,
    products,
    materials,
    settings,
    addOrder,
    updateOrder,
    addClient,
  } = useApp();

  // Form states
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [clientSearchQuery, setClientSearchQuery] = useState<string>('');
  const [isCreatingInlineClient, setIsCreatingInlineClient] = useState(false);
  const [inlineClientName, setInlineClientName] = useState('');
  const [inlineClientPhone, setInlineClientPhone] = useState('');

  const [selectedProductType, setSelectedProductType] = useState<
    Order['productType']
  >('Caderneta de Saúde');

  // Custom fields
  const [modelName, setModelName] = useState('Floral Rosa');
  const [childName, setChildName] = useState('');
  const [theme, setTheme] = useState('');
  const [color, setColor] = useState('');
  const [coverType, setCoverType] = useState('Capa Dura Laminada');
  const [coreType, setCoreType] = useState('Oficial Ministério da Saúde');
  const [extraPages, setExtraPages] = useState('');

  // Caderno
  const [size, setSize] = useState('A5 (15x21cm)');
  const [paperType, setPaperType] = useState('Offset 90g pautado');
  const [sheetCount, setSheetCount] = useState(80);
  const [binding, setBinding] = useState('Wire-o Branco');
  const [finish, setFinish] = useState('Fosco');

  // Agenda / Planner
  const [accessories, setAccessories] = useState<string[]>(['Elástico']);

  // Reforma de Bíblia
  const [height, setHeight] = useState('');
  const [width, setWidth] = useState('');
  const [spine, setSpine] = useState('');
  const [coverCondition, setCoverCondition] = useState('');

  // Kit Festa
  const [kitItems, setKitItems] = useState<Array<{ name: string; quantity: number }>>([
    { name: 'Caixas Milk', quantity: 10 },
    { name: 'Caixas Pirâmide', quantity: 10 },
    { name: 'Porta-bis', quantity: 20 },
    { name: 'Tags', quantity: 20 },
  ]);

  // Outros
  const [otherProductName, setOtherProductName] = useState('');

  // Common
  const [quantity, setQuantity] = useState(1);
  const [deliveryDate, setDeliveryDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [notes, setNotes] = useState('');
  const [customPrice, setCustomPrice] = useState<string>('');
  const [photoUrl, setPhotoUrl] = useState('');

  // Initialize data if editing or copying
  useEffect(() => {
    if (isNewOrderOpen) {
      if (newOrderInitialData) {
        if (newOrderInitialData.clientId) {
          setSelectedClientId(newOrderInitialData.clientId);
        }
        if (newOrderInitialData.productType) {
          setSelectedProductType(newOrderInitialData.productType);
        }
        setModelName(newOrderInitialData.modelName || '');
        setChildName(newOrderInitialData.childName || '');
        setTheme(newOrderInitialData.theme || '');
        setColor(newOrderInitialData.color || '');
        setCoverType(newOrderInitialData.coverType || 'Capa Dura Laminada');
        setCoreType(newOrderInitialData.coreType || 'Oficial Ministério da Saúde');
        setExtraPages(newOrderInitialData.extraPages || '');
        setSize(newOrderInitialData.size || 'A5 (15x21cm)');
        setPaperType(newOrderInitialData.paperType || 'Offset 90g pautado');
        setSheetCount(newOrderInitialData.sheetCount || 80);
        setBinding(newOrderInitialData.binding || 'Wire-o Branco');
        setFinish(newOrderInitialData.finish || 'Fosco');
        setAccessories(newOrderInitialData.accessories || ['Elástico']);
        setHeight(newOrderInitialData.height || '');
        setWidth(newOrderInitialData.width || '');
        setSpine(newOrderInitialData.spine || '');
        setCoverCondition(newOrderInitialData.coverCondition || '');
        if (newOrderInitialData.kitItems) {
          setKitItems(newOrderInitialData.kitItems);
        }
        setOtherProductName(newOrderInitialData.productName || '');
        setQuantity(newOrderInitialData.quantity || 1);
        if (newOrderInitialData.deliveryDate) {
          setDeliveryDate(newOrderInitialData.deliveryDate);
        }
        setNotes(newOrderInitialData.notes || '');
        if (newOrderInitialData.price) {
          setCustomPrice(String(newOrderInitialData.price));
        }
        setPhotoUrl(newOrderInitialData.photoUrl || '');
      } else {
        // Reset defaults
        setSelectedClientId(clients[0]?.id || '');
        setSelectedProductType('Caderneta de Saúde');
        setModelName('Floral Rosa');
        setChildName('');
        setTheme('Floral');
        setColor('Rosa');
        setNotes('');
        setCustomPrice('');
        setPhotoUrl('');
        setQuantity(1);
        const d = new Date();
        d.setDate(d.getDate() + 5);
        setDeliveryDate(d.toISOString().split('T')[0]);
      }
      setIsCreatingInlineClient(false);
      setClientSearchQuery('');
    }
  }, [isNewOrderOpen, newOrderInitialData, clients]);

  // Find matching product template for calculations
  const currentProductTemplate = useMemo(() => {
    switch (selectedProductType) {
      case 'Caderneta de Saúde':
        return products.find((p) => p.category === 'Cadernetas');
      case 'Caderno':
        return products.find((p) => p.category === 'Cadernos');
      case 'Agenda':
      case 'Planner':
        return products.find((p) => p.category === 'Agendas');
      case 'Devocional':
        return products.find((p) => p.category === 'Devocionais');
      case 'Reforma de Capa de Bíblia':
        return products.find((p) => p.category === 'Reforma de Bíblia');
      case 'Kit Festa':
        return products.find((p) => p.category === 'Kit Festa');
      default:
        return products[0];
    }
  }, [selectedProductType, products]);

  // Auto calculate cost and suggested price
  const calculation = useMemo(() => {
    if (!currentProductTemplate) {
      return { cost: 20, suggestedPrice: 40 };
    }
    const costResult = calculateProductCost(
      currentProductTemplate,
      materials,
      settings
    );
    const suggested = calculateSuggestedPrice(
      costResult.totalCost,
      settings.targetProfitMarginPercent
    );
    return {
      cost: costResult.totalCost * quantity,
      suggestedPrice: suggested * quantity,
      unitCost: costResult.totalCost,
    };
  }, [currentProductTemplate, materials, settings, quantity]);

  // Handle client selection / filtering
  const filteredClients = useMemo(() => {
    if (!clientSearchQuery) return clients;
    const q = clientSearchQuery.toLowerCase();
    return clients.filter(
      (c) => c.name.toLowerCase().includes(q) || c.whatsapp.includes(q)
    );
  }, [clients, clientSearchQuery]);

  const selectedClient = clients.find((c) => c.id === selectedClientId);

  const handleCreateInlineClient = () => {
    if (!inlineClientName.trim()) return;
    const newCli = addClient({
      name: inlineClientName.trim(),
      whatsapp: inlineClientPhone.trim() || '11999999999',
    });
    setSelectedClientId(newCli.id);
    setIsCreatingInlineClient(false);
    setInlineClientName('');
    setInlineClientPhone('');
  };

  const handleSaveOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedClient) {
      alert('Por favor, selecione ou cadastre uma cliente.');
      return;
    }

    const priceValue = customPrice
      ? parseFloat(customPrice.replace(',', '.'))
      : calculation.suggestedPrice;

    const finalPrice = isNaN(priceValue) ? calculation.suggestedPrice : priceValue;
    const finalCost = Number(calculation.cost.toFixed(2));
    const finalProfit = Number((finalPrice - finalCost).toFixed(2));

    // Prepare materials used list
    const materialsUsedList: OrderMaterialUsage[] =
      currentProductTemplate?.materials.map((req) => {
        const mat = materials.find((m) => m.id === req.materialId);
        return {
          materialId: req.materialId,
          name: mat ? mat.name : 'Material',
          quantity: req.quantity * quantity,
          unit: mat ? mat.unit : 'unidades',
        };
      }) || [];

    const orderData = {
      clientId: selectedClient.id,
      clientName: selectedClient.name,
      clientPhone: selectedClient.whatsapp,
      productType: selectedProductType,
      productName:
        selectedProductType === 'Outro'
          ? otherProductName || 'Produto Personalizado'
          : selectedProductType,
      modelName: modelName || 'Modelo Padrão',
      childName,
      theme,
      color,
      coverType,
      coreType,
      extraPages,
      size,
      paperType,
      sheetCount,
      binding,
      finish,
      accessories,
      height,
      width,
      spine,
      coverCondition,
      kitItems: selectedProductType === 'Kit Festa' ? kitItems : undefined,
      quantity,
      deliveryDate,
      notes,
      photoUrl: photoUrl || currentProductTemplate?.photoUrl,
      price: finalPrice,
      cost: finalCost,
      profit: finalProfit,
      status: 'aguardando_aprovacao' as const,
      materialsUsed: materialsUsedList,
      materialsDeducted: false,
    };

    if (newOrderInitialData && (newOrderInitialData as any).id) {
      updateOrder((newOrderInitialData as any).id, orderData);
    } else {
      addOrder(orderData);
    }

    setIsNewOrderOpen(false);
    setNewOrderInitialData(null);
  };

  if (!isNewOrderOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/30 backdrop-blur-md overflow-y-auto">
      <div className="glass-card rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden my-auto border border-white/80 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#E8D8DF]/40 flex items-center justify-between glass-card-subtle">
          <div>
            <h2 className="text-xl font-bold text-[#7A5268] tracking-tight">
              {newOrderInitialData && (newOrderInitialData as any).id
                ? 'Editar pedido'
                : 'Novo pedido'}
            </h2>
            <p className="text-xs sm:text-sm text-[#777277] mt-0.5">
              Preencha apenas o que realmente importa para a produção.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsNewOrderOpen(false);
              setNewOrderInitialData(null);
            }}
            className="p-2 text-stone-400 hover:text-stone-600 rounded-xl hover:bg-white/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSaveOrder} className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* 1. Cliente */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#777277]">
                Cliente <span className="text-[#B86666]">*</span>
              </label>
              {!isCreatingInlineClient && (
                <button
                  type="button"
                  onClick={() => setIsCreatingInlineClient(true)}
                  className="text-xs font-semibold text-[#7A5268] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Novo cliente
                </button>
              )}
            </div>

            {isCreatingInlineClient ? (
              <div className="p-3.5 bg-[#FAF8F9] rounded-2xl border border-[#E8D8DF] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#7A5268]">
                    Cadastrar cliente rápido
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsCreatingInlineClient(false)}
                    className="text-xs text-stone-400 hover:text-stone-600 cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={inlineClientName}
                    onChange={(e) => setInlineClientName(e.target.value)}
                    placeholder="Nome completo da cliente"
                    className="px-3 py-2 text-sm bg-white rounded-xl border border-stone-200 focus:border-[#7A5268] outline-hidden"
                    autoFocus
                  />
                  <input
                    type="text"
                    value={inlineClientPhone}
                    onChange={(e) => setInlineClientPhone(e.target.value)}
                    placeholder="WhatsApp (ex: 11988887777)"
                    className="px-3 py-2 text-sm bg-white rounded-xl border border-stone-200 focus:border-[#7A5268] outline-hidden"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleCreateInlineClient}
                  disabled={!inlineClientName.trim()}
                  className="w-full py-2 bg-[#7A5268] hover:bg-[#684357] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                >
                  Salvar e selecionar cliente
                </button>
              </div>
            ) : (
              <div>
                <select
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-200 text-sm font-medium text-[#292529] focus:border-[#7A5268] focus:bg-white outline-hidden cursor-pointer"
                  required
                >
                  <option value="" disabled>
                    Selecione a cliente...
                  </option>
                  {clients.map((cli) => (
                    <option key={cli.id} value={cli.id}>
                      {cli.name} ({cli.whatsapp})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* 2. Produto */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#777277] mb-2">
              Produto
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                'Caderneta de Saúde',
                'Caderno',
                'Agenda',
                'Planner',
                'Devocional',
                'Reforma de Capa de Bíblia',
                'Kit Festa',
                'Outro',
              ].map((prod) => (
                <button
                  key={prod}
                  type="button"
                  onClick={() => setSelectedProductType(prod as any)}
                  className={`p-2.5 rounded-xl text-xs font-medium text-left transition-all border cursor-pointer ${
                    selectedProductType === prod
                      ? 'bg-[#FAF8F9] border-[#7A5268] text-[#7A5268] font-semibold shadow-2xs'
                      : 'bg-stone-50 border-transparent text-[#292529] hover:bg-stone-100'
                  }`}
                >
                  {prod}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Campos Contextuais do Produto */}
          <div className="bg-[#FAF8F9] p-4.5 rounded-2xl border border-[#E8D8DF]/60 space-y-3.5">
            <h3 className="text-xs font-bold text-[#7A5268] uppercase tracking-wider flex items-center justify-between">
              <span>Detalhes de {selectedProductType}</span>
              <span className="text-[11px] font-normal text-[#777277]">
                Apenas o que precisa para fazer
              </span>
            </h3>

            {/* SE FOR CADERNETA DE SAÚDE */}
            {selectedProductType === 'Caderneta de Saúde' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-[#292529] block mb-1">
                    Nome da criança
                  </label>
                  <input
                    type="text"
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    placeholder="Ex: Helena"
                    className="w-full px-3 py-2 text-sm bg-white rounded-xl border border-stone-200 outline-hidden focus:border-[#7A5268]"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#292529] block mb-1">
                    Modelo da capa
                  </label>
                  <input
                    type="text"
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
                    placeholder="Ex: Floral Rosa"
                    className="w-full px-3 py-2 text-sm bg-white rounded-xl border border-stone-200 outline-hidden focus:border-[#7A5268]"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#292529] block mb-1">
                    Tema
                  </label>
                  <input
                    type="text"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    placeholder="Ex: Floral, Safari, Ursinho"
                    className="w-full px-3 py-2 text-sm bg-white rounded-xl border border-stone-200 outline-hidden focus:border-[#7A5268]"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#292529] block mb-1">
                    Cor principal
                  </label>
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    placeholder="Ex: Rosa bebê, Verde oliva"
                    className="w-full px-3 py-2 text-sm bg-white rounded-xl border border-stone-200 outline-hidden focus:border-[#7A5268]"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#292529] block mb-1">
                    Tipo de capa
                  </label>
                  <select
                    value={coverType}
                    onChange={(e) => setCoverType(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white rounded-xl border border-stone-200 outline-hidden focus:border-[#7A5268] cursor-pointer"
                  >
                    <option>Capa Dura com Laminação Fosca</option>
                    <option>Capa Dura com Laminação Brilho</option>
                    <option>Capa com Efeito Holográfico</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-[#292529] block mb-1">
                    Versão do miolo
                  </label>
                  <select
                    value={coreType}
                    onChange={(e) => setCoreType(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white rounded-xl border border-stone-200 outline-hidden focus:border-[#7A5268] cursor-pointer"
                  >
                    <option>Oficial Ministério da Saúde</option>
                    <option>Clean / Personalizado</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-[#292529] block mb-1">
                    Páginas extras
                  </label>
                  <input
                    type="text"
                    value={extraPages}
                    onChange={(e) => setExtraPages(e.target.value)}
                    placeholder="Ex: Consultas médicas, controle de mamadas, anotações"
                    className="w-full px-3 py-2 text-sm bg-white rounded-xl border border-stone-200 outline-hidden focus:border-[#7A5268]"
                  />
                </div>
              </div>
            )}

            {/* SE FOR CADERNO */}
            {selectedProductType === 'Caderno' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-[#292529] block mb-1">
                    Modelo / Nome na capa
                  </label>
                  <input
                    type="text"
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
                    placeholder="Ex: Ursinho Baloeiro / Ana Clara"
                    className="w-full px-3 py-2 text-sm bg-white rounded-xl border border-stone-200 outline-hidden focus:border-[#7A5268]"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#292529] block mb-1">
                    Tamanho
                  </label>
                  <select
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white rounded-xl border border-stone-200 outline-hidden focus:border-[#7A5268] cursor-pointer"
                  >
                    <option>A5 (15x21cm)</option>
                    <option>Colegial (18x24cm)</option>
                    <option>Universitário (20x27cm)</option>
                    <option>A6 / Bloquinho</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-[#292529] block mb-1">
                    Tipo de folha
                  </label>
                  <select
                    value={paperType}
                    onChange={(e) => setPaperType(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white rounded-xl border border-stone-200 outline-hidden focus:border-[#7A5268] cursor-pointer"
                  >
                    <option>Offset 90g pautado</option>
                    <option>Offset 90g pontilhado</option>
                    <option>Offset 90g liso / sem pauta</option>
                    <option>Offset 90g quadriculado</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-[#292529] block mb-1">
                    Quantidade de folhas
                  </label>
                  <input
                    type="number"
                    value={sheetCount}
                    onChange={(e) => setSheetCount(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-white rounded-xl border border-stone-200 outline-hidden focus:border-[#7A5268]"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#292529] block mb-1">
                    Encadernação
                  </label>
                  <select
                    value={binding}
                    onChange={(e) => setBinding(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white rounded-xl border border-stone-200 outline-hidden focus:border-[#7A5268] cursor-pointer"
                  >
                    <option>Wire-o Branco</option>
                    <option>Wire-o Bronze / Ouro</option>
                    <option>Espiral Plástico</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-[#292529] block mb-1">
                    Acabamento
                  </label>
                  <input
                    type="text"
                    value={finish}
                    onChange={(e) => setFinish(e.target.value)}
                    placeholder="Ex: Laminação fosca + elástico"
                    className="w-full px-3 py-2 text-sm bg-white rounded-xl border border-stone-200 outline-hidden focus:border-[#7A5268]"
                  />
                </div>
              </div>
            )}

            {/* SE FOR AGENDA / PLANNER / DEVOCIONAL */}
            {(selectedProductType === 'Agenda' ||
              selectedProductType === 'Planner' ||
              selectedProductType === 'Devocional') && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-[#292529] block mb-1">
                    Modelo / Arte da capa
                  </label>
                  <input
                    type="text"
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
                    placeholder="Ex: Jardim Encantado"
                    className="w-full px-3 py-2 text-sm bg-white rounded-xl border border-stone-200 outline-hidden focus:border-[#7A5268]"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#292529] block mb-1">
                    Tipo de miolo
                  </label>
                  <select
                    value={coreType}
                    onChange={(e) => setCoreType(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white rounded-xl border border-stone-200 outline-hidden focus:border-[#7A5268] cursor-pointer"
                  >
                    <option>Permanente</option>
                    <option>Datado 2026</option>
                    <option>1 dia por página</option>
                    <option>2 dias por página</option>
                    <option>Visão semanal</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-[#292529] block mb-1">
                    Encadernação
                  </label>
                  <select
                    value={binding}
                    onChange={(e) => setBinding(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white rounded-xl border border-stone-200 outline-hidden focus:border-[#7A5268] cursor-pointer"
                  >
                    <option>Wire-o</option>
                    <option>Espiral</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-[#292529] block mb-1">
                    Acessórios incluídos
                  </label>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {['Elástico', 'Passante', 'Marca-página', 'Bolso'].map(
                      (acc) => {
                        const isChecked = accessories.includes(acc);
                        return (
                          <button
                            key={acc}
                            type="button"
                            onClick={() => {
                              if (isChecked) {
                                setAccessories(
                                  accessories.filter((a) => a !== acc)
                                );
                              } else {
                                setAccessories([...accessories, acc]);
                              }
                            }}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer border ${
                              isChecked
                                ? 'bg-[#7A5268] text-white border-[#7A5268]'
                                : 'bg-white text-stone-700 border-stone-200'
                            }`}
                          >
                            {acc}
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* SE FOR REFORMA DE CAPA DE BÍBLIA */}
            {selectedProductType === 'Reforma de Capa de Bíblia' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-medium text-[#292529] block mb-1">
                    Altura
                  </label>
                  <input
                    type="text"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="Ex: 22 cm"
                    className="w-full px-3 py-2 text-sm bg-white rounded-xl border border-stone-200 outline-hidden focus:border-[#7A5268]"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#292529] block mb-1">
                    Largura
                  </label>
                  <input
                    type="text"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    placeholder="Ex: 15 cm"
                    className="w-full px-3 py-2 text-sm bg-white rounded-xl border border-stone-200 outline-hidden focus:border-[#7A5268]"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#292529] block mb-1">
                    Lombada
                  </label>
                  <input
                    type="text"
                    value={spine}
                    onChange={(e) => setSpine(e.target.value)}
                    placeholder="Ex: 4 cm"
                    className="w-full px-3 py-2 text-sm bg-white rounded-xl border border-stone-200 outline-hidden focus:border-[#7A5268]"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="text-xs font-medium text-[#292529] block mb-1">
                    Estado da capa e miolo
                  </label>
                  <input
                    type="text"
                    value={coverCondition}
                    onChange={(e) => setCoverCondition(e.target.value)}
                    placeholder="Ex: Capa solta, miolo intacto, precisa de novas guardas"
                    className="w-full px-3 py-2 text-sm bg-white rounded-xl border border-stone-200 outline-hidden focus:border-[#7A5268]"
                  />
                </div>
              </div>
            )}

            {/* SE FOR KIT FESTA */}
            {selectedProductType === 'Kit Festa' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-[#292529]">
                    Itens incluídos no kit
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setKitItems([
                        ...kitItems,
                        { name: 'Novo item', quantity: 10 },
                      ])
                    }
                    className="text-xs font-semibold text-[#7A5268] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Adicionar item
                  </button>
                </div>

                <div className="space-y-2">
                  {kitItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setKitItems(
                            kitItems.map((k, i) =>
                              i === idx ? { ...k, quantity: val } : k
                            )
                          );
                        }}
                        className="w-20 px-2.5 py-1.5 text-sm bg-white rounded-xl border border-stone-200 outline-hidden"
                      />
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => {
                          const val = e.target.value;
                          setKitItems(
                            kitItems.map((k, i) =>
                              i === idx ? { ...k, name: val } : k
                            )
                          );
                        }}
                        className="flex-1 px-3 py-1.5 text-sm bg-white rounded-xl border border-stone-200 outline-hidden"
                      />
                      {kitItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            setKitItems(kitItems.filter((_, i) => i !== idx))
                          }
                          className="p-1.5 text-stone-400 hover:text-[#B86666] cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SE FOR OUTRO */}
            {selectedProductType === 'Outro' && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-[#292529] block mb-1">
                    Nome do produto
                  </label>
                  <input
                    type="text"
                    value={otherProductName}
                    onChange={(e) => setOtherProductName(e.target.value)}
                    placeholder="Ex: Bloquinho de Mesa / Livro do Bebê"
                    className="w-full px-3 py-2 text-sm bg-white rounded-xl border border-stone-200 outline-hidden focus:border-[#7A5268]"
                    required
                  />
                </div>
              </div>
            )}
          </div>

          {/* 4. Quantidade e Data de Entrega */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#777277] block mb-1.5">
                Quantidade
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="w-full px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-200 text-sm font-semibold text-[#292529] outline-hidden focus:bg-white focus:border-[#7A5268]"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#777277] block mb-1.5">
                Data de entrega
              </label>
              <input
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-200 text-sm font-medium text-[#292529] outline-hidden focus:bg-white focus:border-[#7A5268] cursor-pointer"
                required
              />
            </div>
          </div>

          {/* 5. Preço & Custo Inteligente */}
          <div className="glass-card-subtle p-4.5 rounded-2xl border border-white/70">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#777277]">
                Preço para a cliente
              </label>
              <span className="text-xs text-[#7A5268] font-semibold">
                Custo estimado: {formatCurrency(calculation.cost)}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <span className="absolute left-3.5 top-2.5 text-sm font-semibold text-[#777277]">
                  R$
                </span>
                <input
                  type="text"
                  value={
                    customPrice !== ''
                      ? customPrice
                      : calculation.suggestedPrice.toFixed(2)
                  }
                  onChange={(e) => setCustomPrice(e.target.value)}
                  placeholder={calculation.suggestedPrice.toFixed(2)}
                  className="w-full pl-10 pr-4 py-2.5 glass-input rounded-xl text-base font-bold text-[#7A5268]"
                />
              </div>

              <div className="text-right shrink-0">
                <span className="text-[11px] text-[#777277] block font-medium">
                  Lucro previsto
                </span>
                <span className="text-sm font-bold text-emerald-700">
                  {formatCurrency(
                    (customPrice
                      ? parseFloat(customPrice.replace(',', '.')) || 0
                      : calculation.suggestedPrice) - calculation.cost
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* 6. Observações */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-[#777277] block mb-1.5">
              Observações ou recado da cliente
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Embalagem para presente, nome com laço rosa, etc."
              rows={2}
              className="w-full px-3.5 py-2 text-sm glass-input rounded-xl"
            />
          </div>

          {/* Submit */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#E8D8DF]/40">
            <button
              type="button"
              onClick={() => {
                setIsNewOrderOpen(false);
                setNewOrderInitialData(null);
              }}
              className="px-4 py-2.5 text-xs font-semibold text-[#777277] hover:bg-white/60 rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 bg-[#7A5268] hover:bg-[#634254] text-white text-xs font-bold rounded-xl shadow-lg shadow-[#7A5268]/20 hover:shadow-xl hover:shadow-[#7A5268]/25 transition-all active:scale-[0.98] cursor-pointer"
            >
              Salvar pedido
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
