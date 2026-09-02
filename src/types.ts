export type OrderStatus =
  | 'orcamento'
  | 'aguardando_aprovacao'
  | 'aprovado'
  | 'aguardando_pagamento'
  | 'producao'
  | 'pronto'
  | 'entregue';

export interface OrderMaterialUsage {
  materialId: string;
  name: string;
  quantity: number;
  unit: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. "#0245"
  clientId: string;
  clientName: string;
  clientPhone: string;
  productType:
    | 'Caderneta de Saúde'
    | 'Caderno'
    | 'Agenda'
    | 'Planner'
    | 'Devocional'
    | 'Reforma de Capa de Bíblia'
    | 'Kit Festa'
    | 'Outro';
  productName: string;
  modelName: string;
  
  // Customization fields (contextual based on productType)
  childName?: string;
  theme?: string;
  color?: string;
  coverType?: string;
  coreType?: string; // miolo
  extraPages?: string;
  size?: string;
  paperType?: string;
  sheetCount?: number;
  binding?: string; // Encadernação (Wire-o, Espiral, etc.)
  finish?: string; // Acabamento
  accessories?: string[]; // Elástico, Passante, Marca-página
  height?: string; // Reforma
  width?: string;
  spine?: string; // Lombada
  coverCondition?: string;
  kitItems?: Array<{ name: string; quantity: number }>; // Kit Festa items
  
  quantity: number;
  deliveryDate: string; // YYYY-MM-DD
  notes?: string;
  photoUrl?: string;
  price: number;
  cost: number;
  profit: number;
  status: OrderStatus;
  materialsUsed: OrderMaterialUsage[];
  materialsDeducted: boolean;
  createdAt: string;
}

export interface Client {
  id: string;
  name: string;
  whatsapp: string;
  notes?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface ProductMaterialRequirement {
  materialId: string;
  quantity: number;
}

export interface Product {
  id: string;
  name: string;
  category:
    | 'Agendas'
    | 'Cadernos'
    | 'Cadernetas'
    | 'Devocionais'
    | 'Reforma de Bíblia'
    | 'Kit Festa'
    | 'Outros';
  photoUrl: string;
  description: string;
  basePrice: number;
  productionTimeMinutes: number;
  colorPages: number;
  bwPages: number;
  materials: ProductMaterialRequirement[];
}

export interface ModelItem {
  id: string;
  type: 'meu_modelo' | 'arquivo_comprado';
  title: string;
  category: string;
  productType?: string;
  clientName?: string;
  supplier?: string;
  date: string;
  pricePaid?: number;
  imageUrl: string;
  fileUrl?: string;
  tags: string[];
  notes?: string;
  theme?: string;
  color?: string;
}

export type MaterialCategory =
  | 'Papéis'
  | 'Papelões'
  | 'Acabamentos'
  | 'Encadernação'
  | 'Fitas'
  | 'Elásticos'
  | 'Adesivos'
  | 'Outros';

export interface Material {
  id: string;
  name: string;
  category: MaterialCategory;
  color?: string;
  size?: string;
  unit: string; // folhas, unidades, metros, etc.
  currentStock: number;
  minStock: number;
  unitCost: number; // calculated cost per unit
  lastPurchasePrice?: number;
  lastPurchaseQty?: number;
  supplier?: string;
  notes?: string;
}

export interface AtelierSettings {
  atelierName: string;
  ownerName: string;
  phone: string;
  whatsapp: string;
  address: string;
  hourlyRate: number; // e.g. R$ 25.00 / hour
  desiredMonthlySalary?: number; // e.g. R$ 3.000,00
  hoursPerDay?: number; // e.g. 6
  daysPerWeek?: number; // e.g. 5
  monthlyFixedCosts?: number; // e.g. R$ 300,00 (luz, internet, lâmina)
  costPerPrintedPage?: number; // e.g. R$ 0.25
  colorPageCost: number; // e.g. R$ 0.30 per colored page
  bwPageCost: number; // e.g. R$ 0.10 per b&w page
  targetProfitMarginPercent: number; // e.g. 80%
}
