import { AtelierSettings, Material, OrderStatus, Product } from '../types';

export function calculateProductCost(
  product: Product,
  materials: Material[],
  settings: AtelierSettings
): {
  materialCost: number;
  materialsCost: number;
  printCost: number;
  printingCost: number;
  laborCost: number;
  fixedCostShare: number;
  totalCost: number;
} {
  // 1. Material cost
  let materialCost = 0;
  for (const req of product.materials) {
    const mat = materials.find((m) => m.id === req.materialId);
    if (mat) {
      materialCost += mat.unitCost * req.quantity;
    }
  }

  // 2. Printing cost
  const printCost =
    (product.colorPages || 0) * (settings.costPerPrintedPage || settings.colorPageCost || 0.25) +
    (product.bwPages || 0) * (settings.bwPageCost || 0.1);

  // 3. Labor cost (Mão de obra)
  const laborCost =
    ((product.productionTimeMinutes || 0) / 60) * settings.hourlyRate;

  // 4. Fixed atelier cost share (luz, internet, lâmina)
  const fixedCostShare = Math.max(
    1.5,
    (settings.monthlyFixedCosts || 300) / 100
  );

  const totalCost = materialCost + printCost + laborCost + fixedCostShare;

  return {
    materialCost: Number(materialCost.toFixed(2)),
    materialsCost: Number(materialCost.toFixed(2)),
    printCost: Number(printCost.toFixed(2)),
    printingCost: Number(printCost.toFixed(2)),
    laborCost: Number(laborCost.toFixed(2)),
    fixedCostShare: Number(fixedCostShare.toFixed(2)),
    totalCost: Number(totalCost.toFixed(2)),
  };
}

export function calculateSuggestedPrice(
  cost: number,
  targetMarginPercent: number
): number {
  if (cost <= 0) return 0;
  const price = cost * (1 + targetMarginPercent / 100);
  return Number(price.toFixed(2));
}

export function calculateMinimumPrice(cost: number): number {
  if (cost <= 0) return 0;
  // Margem mínima de segurança de 30%
  return Number((cost * 1.3).toFixed(2));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value || 0);
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  // handles YYYY-MM-DD
  const parts = dateString.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateString;
}

export function getStatusInfo(status: OrderStatus): {
  label: string;
  badgeBg: string;
  textColor: string;
  dotColor: string;
  description: string;
} {
  switch (status) {
    case 'orcamento':
      return {
        label: 'Orçamento',
        badgeBg: 'bg-stone-100 text-stone-700 border-stone-200',
        textColor: 'text-stone-700',
        dotColor: 'bg-stone-400',
        description: 'Aguardando cliente avaliar valor',
      };
    case 'aguardando_aprovacao':
      return {
        label: 'Aguardando aprovação',
        badgeBg: 'bg-[#FDF6E2] text-[#8C6B1B] border-[#EAD8A6]',
        textColor: 'text-[#8C6B1B]',
        dotColor: 'bg-[#C89B4B]',
        description: 'Arte ou proposta enviada para a cliente',
      };
    case 'aprovado':
      return {
        label: 'Aprovado',
        badgeBg: 'bg-[#EBF3ED] text-[#3E654E] border-[#C8DEC5]',
        textColor: 'text-[#3E654E]',
        dotColor: 'bg-[#5F8A72]',
        description: 'Cliente aprovou a arte',
      };
    case 'aguardando_pagamento':
      return {
        label: 'Aguardando pagamento',
        badgeBg: 'bg-[#FBEAEB] text-[#934545] border-[#E8C2C2]',
        textColor: 'text-[#934545]',
        dotColor: 'bg-[#B86666]',
        description: 'Aguardando sinal ou pagamento integral',
      };
    case 'producao':
      return {
        label: 'Em produção',
        badgeBg: 'bg-[#F2EBF0] text-[#7A5268] border-[#DDC6D3]',
        textColor: 'text-[#7A5268]',
        dotColor: 'bg-[#7A5268]',
        description: 'Na bancada sendo impresso e montado',
      };
    case 'pronto':
      return {
        label: 'Pronto',
        badgeBg: 'bg-[#EBF3ED] text-[#3E654E] border-[#C8DEC5]',
        textColor: 'text-[#3E654E]',
        dotColor: 'bg-[#5F8A72]',
        description: 'Finalizado, pronto para entrega ou envio',
      };
    case 'entregue':
      return {
        label: 'Entregue',
        badgeBg: 'bg-stone-100 text-stone-600 border-stone-200',
        textColor: 'text-stone-600',
        dotColor: 'bg-stone-400',
        description: 'Já entregue com sucesso à cliente',
      };
    default:
      return {
        label: status,
        badgeBg: 'bg-stone-100 text-stone-700 border-stone-200',
        textColor: 'text-stone-700',
        dotColor: 'bg-stone-400',
        description: '',
      };
  }
}

export function getMaterialStockStatus(
  currentStock: number,
  minStock: number
): {
  status: 'bom' | 'atencao' | 'urgente';
  label: string;
  badgeBg: string;
  dotColor: string;
} {
  if (currentStock <= minStock * 0.5) {
    return {
      status: 'urgente',
      label: 'Comprar urgente',
      badgeBg: 'bg-[#FFF0F0] text-[#B86666] border-[#F2C2C2]',
      dotColor: 'bg-[#B86666]',
    };
  }
  if (currentStock <= minStock) {
    return {
      status: 'atencao',
      label: 'Atenção',
      badgeBg: 'bg-[#FDF6E2] text-[#8C6B1B] border-[#EAD8A6]',
      dotColor: 'bg-[#C89B4B]',
    };
  }
  return {
    status: 'bom',
    label: 'Estoque bom',
    badgeBg: 'bg-[#F0F7F3] text-[#3E654E] border-[#C8DEC5]',
    dotColor: 'bg-[#5F8A72]',
  };
}

