import React, { useState } from 'react';
import {
  Check,
  Clock,
  DollarSign,
  Download,
  Info,
  RefreshCw,
  Save,
  Sliders,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AtelierSettings } from '../../types';
import { formatCurrency } from '../../utils/calculations';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, resetAllData, setDeleteConfirmModal } =
    useApp();

  const [formState, setFormState] = useState<AtelierSettings>({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Calculate hourly and minute rates on the fly
  const monthlyWorkHours =
    formState.hoursPerDay * formState.daysPerWeek * 4.33;
  const calculatedHourlyRate =
    monthlyWorkHours > 0 ? formState.desiredMonthlySalary / monthlyWorkHours : 0;
  const calculatedMinuteRate = calculatedHourlyRate / 60;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      ...formState,
      hourlyRate: Number(calculatedHourlyRate.toFixed(2)),
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetData = () => {
    setDeleteConfirmModal({
      isOpen: true,
      title: 'Restaurar dados iniciais?',
      message:
        'Isso voltará todos os pedidos, clientes e estoque para o padrão de demonstração. Deseja continuar?',
      onConfirm: () => resetAllData(),
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#7A5268] tracking-tight">
          Configurações do Ateliê
        </h1>
        <p className="text-xs sm:text-sm text-[#777277] mt-0.5">
          Defina seu salário dos sonhos, suas horas de trabalho e o custo da sua hora será calculado sozinho.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Card: Salário e Horas de Trabalho (Item 34) */}
        <div className="glass-card rounded-3xl p-6 space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#E8D8DF]/40">
            <div className="w-8 h-8 rounded-xl bg-white/80 text-[#7A5268] flex items-center justify-center border border-white/80 shadow-2xs">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#292529]">
                Seu Salário e Tempo de Trabalho
              </h2>
              <p className="text-xs text-[#777277]">
                Quanto você quer retirar por mês pelo seu trabalho
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#777277] block mb-1.5">
                Salário desejado (R$ / mês)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-sm font-bold text-[#777277]">
                  R$
                </span>
                <input
                  type="number"
                  min="500"
                  step="100"
                  value={formState.desiredMonthlySalary}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      desiredMonthlySalary: Number(e.target.value),
                    })
                  }
                  className="w-full pl-10 pr-3.5 py-2.5 glass-input rounded-xl text-sm font-bold text-[#7A5268]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#777277] block mb-1.5">
                Horas por dia no ateliê
              </label>
              <input
                type="number"
                min="1"
                max="16"
                value={formState.hoursPerDay}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    hoursPerDay: Number(e.target.value),
                  })
                }
                className="w-full px-3.5 py-2.5 glass-input rounded-xl text-sm font-semibold text-[#292529]"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#777277] block mb-1.5">
                Dias por semana
              </label>
              <input
                type="number"
                min="1"
                max="7"
                value={formState.daysPerWeek}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    daysPerWeek: Number(e.target.value),
                  })
                }
                className="w-full px-3.5 py-2.5 glass-input rounded-xl text-sm font-semibold text-[#292529]"
                required
              />
            </div>
          </div>

          {/* Resultado do Valor da Hora de Silvia */}
          <div className="p-4 glass-card-subtle rounded-2xl border border-white/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-[#7A5268] block">
                Valor da sua hora de trabalho calculada:
              </span>
              <p className="text-xs text-[#777277] mt-0.5">
                Baseado em {monthlyWorkHours.toFixed(0)} horas trabalhadas por mês
              </p>
            </div>

            <div className="text-right">
              <span className="text-xl font-bold text-[#7A5268]">
                {formatCurrency(calculatedHourlyRate)} / hora
              </span>
              <span className="text-xs text-[#777277] block">
                ({formatCurrency(calculatedMinuteRate)} por minuto de produção)
              </span>
            </div>
          </div>
        </div>

        {/* Card: Custos Fixos e Impressão */}
        <div className="glass-card rounded-3xl p-6 space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#E8D8DF]/40">
            <div className="w-8 h-8 rounded-xl bg-white/80 text-[#7A5268] flex items-center justify-center border border-white/80 shadow-2xs">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#292529]">
                Custos Fixos e Margem Padrão
              </h2>
              <p className="text-xs text-[#777277]">
                Despesas gerais do ateliê distribuídas na produção
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#777277] block mb-1.5">
                Custos fixos mensais (R$)
              </label>
              <input
                type="number"
                min="0"
                step="50"
                value={formState.monthlyFixedCosts}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    monthlyFixedCosts: Number(e.target.value),
                  })
                }
                placeholder="Ex: 300"
                className="w-full px-3.5 py-2.5 glass-input rounded-xl text-sm font-semibold text-[#292529]"
              />
              <span className="text-[10px] text-[#777277] block mt-1">
                Luz, internet, troca de lâmina da Silhouette
              </span>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#777277] block mb-1.5">
                Custo da página colorida (R$)
              </label>
              <input
                type="number"
                min="0.05"
                max="5"
                step="0.01"
                value={formState.costPerPrintedPage}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    costPerPrintedPage: Number(e.target.value),
                  })
                }
                className="w-full px-3.5 py-2.5 glass-input rounded-xl text-sm font-semibold text-[#292529]"
              />
              <span className="text-[10px] text-[#777277] block mt-1">
                Tinta e desgaste da impressora
              </span>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#777277] block mb-1.5">
                Margem de lucro sugerida (%)
              </label>
              <input
                type="number"
                min="10"
                max="200"
                value={formState.targetProfitMarginPercent}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    targetProfitMarginPercent: Number(e.target.value),
                  })
                }
                className="w-full px-3.5 py-2.5 glass-input rounded-xl text-sm font-semibold text-[#292529]"
              />
              <span className="text-[10px] text-[#777277] block mt-1">
                Usada para sugerir o preço inicial
              </span>
            </div>
          </div>
        </div>

        {/* Action Save Button */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleResetData}
            className="flex items-center gap-1.5 text-xs text-[#B86666] hover:underline cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Restaurar dados de exemplo do ateliê
          </button>

          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 bg-[#7A5268] hover:bg-[#634254] text-white text-xs sm:text-sm font-bold rounded-2xl shadow-lg shadow-[#7A5268]/20 hover:shadow-xl hover:shadow-[#7A5268]/25 transition-all active:scale-[0.98] cursor-pointer"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Configurações salvas!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Salvar configurações</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
