import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  initialClients,
  initialMaterials,
  initialModels,
  initialOrders,
  initialProducts,
  initialSettings,
} from '../data/initialData';
import {
  AtelierSettings,
  Client,
  Material,
  ModelItem,
  Order,
  OrderStatus,
  Product,
} from '../types';
import { calculateProductCost, calculateSuggestedPrice } from '../utils/calculations';

export type NavigationTab =
  | 'inicio'
  | 'pedidos'
  | 'clientes'
  | 'produtos'
  | 'modelos'
  | 'estoque'
  | 'precos'
  | 'financeiro'
  | 'configuracoes';

interface AppContextType {
  // Navigation
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;

  // Data
  orders: Order[];
  clients: Client[];
  products: Product[];
  models: ModelItem[];
  materials: Material[];
  settings: AtelierSettings;

  // Modals and dialog states
  selectedOrder: Order | null;
  setSelectedOrder: (order: Order | null) => void;
  isNewOrderOpen: boolean;
  setIsNewOrderOpen: (open: boolean) => void;
  newOrderInitialData: Partial<Order> | null;
  setNewOrderInitialData: (data: Partial<Order> | null) => void;

  selectedClient: Client | null;
  setSelectedClient: (client: Client | null) => void;
  isNewClientOpen: boolean;
  setIsNewClientOpen: (open: boolean) => void;

  selectedModel: ModelItem | null;
  setSelectedModel: (model: ModelItem | null) => void;
  isNewModelOpen: boolean;
  setIsNewModelOpen: (open: boolean) => void;

  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;

  isNewMaterialOpen: boolean;
  setIsNewMaterialOpen: (open: boolean) => void;
  isRegisterPurchaseOpen: boolean;
  setIsRegisterPurchaseOpen: (open: boolean) => void;
  materialForPurchase: Material | null;
  setMaterialForPurchase: (material: Material | null) => void;

  materialDeductionOrder: Order | null;
  setMaterialDeductionOrder: (order: Order | null) => void;

  deleteConfirmModal: {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  } | null;
  setDeleteConfirmModal: (modal: {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  } | null) => void;

  // Global Search
  isGlobalSearchOpen: boolean;
  setIsGlobalSearchOpen: (open: boolean) => void;

  // Toast
  toastMessage: string | null;
  showToast: (message: string) => void;

  // Operations
  addOrder: (order: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  updateOrderStatus: (id: string, newStatus: OrderStatus) => void;
  deleteOrder: (id: string) => void;
  copyOrder: (order: Order) => void;
  confirmDeductMaterials: (orderId: string) => void;

  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => Client;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;

  addMaterial: (material: Omit<Material, 'id'>) => void;
  updateMaterial: (id: string, updates: Partial<Material>) => void;
  registerPurchase: (
    materialId: string,
    quantity: number,
    totalPrice: number,
    supplier?: string
  ) => void;

  addModel: (model: Omit<ModelItem, 'id'>) => void;
  deleteModel: (id: string) => void;

  updateSettings: (newSettings: Partial<AtelierSettings>) => void;
  resetAllData: () => void;
  exportBackup: () => void;
  importBackup: (jsonData: string) => boolean;

  // Direct actions
  startNewOrderFromModel: (model: ModelItem) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'silvia_atelie_';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('inicio');

  // Load state with fallback
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'orders');
    return saved ? JSON.parse(saved) : initialOrders;
  });

  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'clients');
    return saved ? JSON.parse(saved) : initialClients;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [models, setModels] = useState<ModelItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'models');
    return saved ? JSON.parse(saved) : initialModels;
  });

  const [materials, setMaterials] = useState<Material[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'materials');
    return saved ? JSON.parse(saved) : initialMaterials;
  });

  const [settings, setSettings] = useState<AtelierSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'settings');
    return saved ? JSON.parse(saved) : initialSettings;
  });

  // Modal states
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);
  const [newOrderInitialData, setNewOrderInitialData] = useState<Partial<Order> | null>(null);

  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isNewClientOpen, setIsNewClientOpen] = useState(false);

  const [selectedModel, setSelectedModel] = useState<ModelItem | null>(null);
  const [isNewModelOpen, setIsNewModelOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [isNewMaterialOpen, setIsNewMaterialOpen] = useState(false);
  const [isRegisterPurchaseOpen, setIsRegisterPurchaseOpen] = useState(false);
  const [materialForPurchase, setMaterialForPurchase] = useState<Material | null>(null);

  const [materialDeductionOrder, setMaterialDeductionOrder] = useState<Order | null>(null);

  const [deleteConfirmModal, setDeleteConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((current) => (current === message ? null : current));
    }, 3200);
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'models', JSON.stringify(models));
  }, [models]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'materials', JSON.stringify(materials));
  }, [materials]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'settings', JSON.stringify(settings));
  }, [settings]);

  // Keep selectedOrder in sync when orders update
  useEffect(() => {
    if (selectedOrder) {
      const updated = orders.find((o) => o.id === selectedOrder.id);
      if (updated) {
        setSelectedOrder(updated);
      }
    }
  }, [orders]);

  // Orders operations
  const addOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>) => {
    // Generate next order number
    const maxNum = orders.reduce((max, ord) => {
      const num = parseInt(ord.orderNumber.replace('#', ''), 10);
      return !isNaN(num) && num > max ? num : max;
    }, 249);
    const nextNumber = `#${String(maxNum + 1).padStart(4, '0')}`;

    const newOrder: Order = {
      ...orderData,
      id: 'ord-' + Date.now(),
      orderNumber: nextNumber,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setOrders((prev) => [newOrder, ...prev]);
    showToast('Pedido salvo!');
  };

  const updateOrder = (id: string, updates: Partial<Order>) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === id ? { ...ord, ...updates } : ord))
    );
    showToast('Pedido atualizado!');
  };

  const updateOrderStatus = (id: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === id) {
          return { ...ord, status: newStatus };
        }
        return ord;
      })
    );
    showToast('Situação alterada!');
  };

  const deleteOrder = (id: string) => {
    setOrders((prev) => prev.filter((ord) => ord.id !== id));
    if (selectedOrder?.id === id) {
      setSelectedOrder(null);
    }
    showToast('Pedido excluído.');
  };

  const copyOrder = (sourceOrder: Order) => {
    // Clones configuration, product, materials, price, but allows changing client, name, notes
    setNewOrderInitialData({
      productType: sourceOrder.productType,
      productName: sourceOrder.productName,
      modelName: sourceOrder.modelName,
      childName: sourceOrder.childName,
      theme: sourceOrder.theme,
      color: sourceOrder.color,
      coverType: sourceOrder.coverType,
      coreType: sourceOrder.coreType,
      extraPages: sourceOrder.extraPages,
      size: sourceOrder.size,
      paperType: sourceOrder.paperType,
      sheetCount: sourceOrder.sheetCount,
      binding: sourceOrder.binding,
      finish: sourceOrder.finish,
      accessories: sourceOrder.accessories ? [...sourceOrder.accessories] : [],
      kitItems: sourceOrder.kitItems ? JSON.parse(JSON.stringify(sourceOrder.kitItems)) : undefined,
      quantity: sourceOrder.quantity,
      price: sourceOrder.price,
      cost: sourceOrder.cost,
      profit: sourceOrder.profit,
      materialsUsed: [...sourceOrder.materialsUsed],
      photoUrl: sourceOrder.photoUrl,
      notes: sourceOrder.notes,
      clientId: sourceOrder.clientId,
      clientName: sourceOrder.clientName,
      clientPhone: sourceOrder.clientPhone,
    });
    setSelectedOrder(null);
    setIsNewOrderOpen(true);
    showToast('Pedido copiado!');
  };

  const confirmDeductMaterials = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    // Deduct each material
    setMaterials((prevMaterials) => {
      return prevMaterials.map((mat) => {
        const usage = order.materialsUsed.find((u) => u.materialId === mat.id);
        if (usage) {
          const newStock = Math.max(0, mat.currentStock - usage.quantity * (order.quantity || 1));
          return { ...mat, currentStock: newStock };
        }
        return mat;
      });
    });

    // Mark order as deducted
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, materialsDeducted: true } : o))
    );

    setMaterialDeductionOrder(null);
    showToast('Materiais baixados do estoque!');
  };

  // Client operations
  const addClient = (clientData: Omit<Client, 'id' | 'createdAt'>): Client => {
    const newClient: Client = {
      ...clientData,
      id: 'cli-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setClients((prev) => [newClient, ...prev]);
    showToast('Cliente cadastrada!');
    return newClient;
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    setClients((prev) =>
      prev.map((cli) => (cli.id === id ? { ...cli, ...updates } : cli))
    );
    showToast('Dados da cliente salvos!');
  };

  const deleteClient = (id: string) => {
    setClients((prev) => prev.filter((cli) => cli.id !== id));
    if (selectedClient?.id === id) {
      setSelectedClient(null);
    }
    showToast('Cliente removida.');
  };

  // Material operations
  const addMaterial = (materialData: Omit<Material, 'id'>) => {
    const newMaterial: Material = {
      ...materialData,
      id: 'mat-' + Date.now(),
    };
    setMaterials((prev) => [...prev, newMaterial]);
    showToast('Material adicionado ao estoque!');
  };

  const updateMaterial = (id: string, updates: Partial<Material>) => {
    setMaterials((prev) =>
      prev.map((mat) => (mat.id === id ? { ...mat, ...updates } : mat))
    );
    showToast('Material atualizado!');
  };

  const registerPurchase = (
    materialId: string,
    quantity: number,
    totalPrice: number,
    supplier?: string
  ) => {
    setMaterials((prev) =>
      prev.map((mat) => {
        if (mat.id === materialId) {
          const newStock = mat.currentStock + quantity;
          const newUnitCost = quantity > 0 ? Number((totalPrice / quantity).toFixed(4)) : mat.unitCost;
          return {
            ...mat,
            currentStock: newStock,
            unitCost: newUnitCost,
            lastPurchasePrice: totalPrice,
            lastPurchaseQty: quantity,
            supplier: supplier || mat.supplier,
          };
        }
        return mat;
      })
    );
    setIsRegisterPurchaseOpen(false);
    setMaterialForPurchase(null);
    showToast('Compra registrada e estoque atualizado!');
  };

  // Models operations
  const addModel = (modelData: Omit<ModelItem, 'id'>) => {
    const newModel: ModelItem = {
      ...modelData,
      id: 'mod-' + Date.now(),
    };
    setModels((prev) => [newModel, ...prev]);
    showToast('Modelo adicionado!');
  };

  const deleteModel = (id: string) => {
    setModels((prev) => prev.filter((m) => m.id !== id));
    if (selectedModel?.id === id) {
      setSelectedModel(null);
    }
    showToast('Modelo removido.');
  };

  const startNewOrderFromModel = (model: ModelItem) => {
    setSelectedModel(null);
    setNewOrderInitialData({
      productType: (model.productType as any) || 'Caderneta de Saúde',
      productName: model.productType || model.title,
      modelName: model.title,
      theme: model.theme || model.title,
      color: model.color,
      photoUrl: model.imageUrl,
    });
    setIsNewOrderOpen(true);
    showToast(`Modelo "${model.title}" selecionado para o pedido!`);
  };

  // Settings
  const updateSettings = (newSettings: Partial<AtelierSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('Configurações salvas!');
  };

  const resetAllData = () => {
    setOrders(initialOrders);
    setClients(initialClients);
    setProducts(initialProducts);
    setModels(initialModels);
    setMaterials(initialMaterials);
    setSettings(initialSettings);
    localStorage.clear();
    showToast('Dados restaurados com sucesso!');
  };

  const exportBackup = () => {
    const backupData = {
      orders,
      clients,
      products,
      models,
      materials,
      settings,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `silvia_atelie_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Backup baixado com sucesso!');
  };

  const importBackup = (jsonData: string): boolean => {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed.orders && parsed.clients && parsed.materials) {
        setOrders(parsed.orders);
        setClients(parsed.clients);
        if (parsed.products) setProducts(parsed.products);
        if (parsed.models) setModels(parsed.models);
        setMaterials(parsed.materials);
        if (parsed.settings) setSettings(parsed.settings);
        showToast('Backup restaurado com sucesso!');
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        orders,
        clients,
        products,
        models,
        materials,
        settings,

        selectedOrder,
        setSelectedOrder,
        isNewOrderOpen,
        setIsNewOrderOpen,
        newOrderInitialData,
        setNewOrderInitialData,

        selectedClient,
        setSelectedClient,
        isNewClientOpen,
        setIsNewClientOpen,

        selectedModel,
        setSelectedModel,
        isNewModelOpen,
        setIsNewModelOpen,

        selectedProduct,
        setSelectedProduct,

        isNewMaterialOpen,
        setIsNewMaterialOpen,
        isRegisterPurchaseOpen,
        setIsRegisterPurchaseOpen,
        materialForPurchase,
        setMaterialForPurchase,

        materialDeductionOrder,
        setMaterialDeductionOrder,

        deleteConfirmModal,
        setDeleteConfirmModal,

        isGlobalSearchOpen,
        setIsGlobalSearchOpen,

        toastMessage,
        showToast,

        addOrder,
        updateOrder,
        updateOrderStatus,
        deleteOrder,
        copyOrder,
        confirmDeductMaterials,

        addClient,
        updateClient,
        deleteClient,

        addMaterial,
        updateMaterial,
        registerPurchase,

        addModel,
        deleteModel,

        updateSettings,
        resetAllData,
        exportBackup,
        importBackup,

        startNewOrderFromModel,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
