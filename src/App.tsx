import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { BottomNav } from './components/layout/BottomNav';

// Views
import { Dashboard } from './components/views/Dashboard';
import { OrdersList } from './components/views/OrdersList';
import { ClientsList } from './components/views/ClientsList';
import { ProductsList } from './components/views/ProductsList';
import { ModelsGallery } from './components/views/ModelsGallery';
import { StockList } from './components/views/StockList';
import { PriceCalculator } from './components/views/PriceCalculator';
import { FinanceView } from './components/views/FinanceView';
import { SettingsView } from './components/views/SettingsView';

// Modals and Common
import { Toast } from './components/common/Toast';
import { DeleteConfirmModal } from './components/common/DeleteConfirmModal';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { NewOrderModal } from './components/modals/NewOrderModal';
import { OrderDetailModal } from './components/modals/OrderDetailModal';
import { MaterialDeductionModal } from './components/modals/MaterialDeductionModal';
import { ClientDetailModal } from './components/modals/ClientDetailModal';
import { NewClientModal } from './components/modals/NewClientModal';
import { ModelDetailModal } from './components/modals/ModelDetailModal';
import { NewModelModal } from './components/modals/NewModelModal';
import { ProductDetailModal } from './components/modals/ProductDetailModal';
import { RegisterPurchaseModal } from './components/modals/RegisterPurchaseModal';
import { NewMaterialModal } from './components/modals/NewMaterialModal';

const AppContent: React.FC = () => {
  const { activeTab } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="relative min-h-screen bg-[#F8F7F5] flex flex-col antialiased text-[#292529] overflow-x-hidden">
      {/* Frosted Glass Ambient Lighting Blobs */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#E8D8DF]/40 blur-3xl" />
        <div className="absolute top-1/4 -right-24 w-80 h-80 rounded-full bg-[#FAF0F4]/60 blur-3xl" />
        <div className="absolute bottom-12 left-1/3 w-[30rem] h-[30rem] rounded-full bg-[#F3EBF0]/50 blur-3xl" />
        <div className="absolute top-2/3 -right-20 w-72 h-72 rounded-full bg-[#E4ECE7]/40 blur-3xl" />
      </div>

      {/* Top Navbar with Frosted Glass */}
      <Navbar onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)} />

      <div className="relative z-10 flex-1 flex max-w-7xl w-full mx-auto pb-24 md:pb-8">
        {/* Desktop and Mobile Sidebar with Frosted Glass */}
        <Sidebar
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        {/* Main Content View Switcher */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          {(activeTab === 'inicio' || (activeTab as any) === 'dashboard') && <Dashboard />}
          {(activeTab === 'pedidos' || (activeTab as any) === 'orders') && <OrdersList />}
          {activeTab === 'clientes' && <ClientsList />}
          {activeTab === 'produtos' && <ProductsList />}
          {activeTab === 'modelos' && <ModelsGallery />}
          {activeTab === 'estoque' && <StockList />}
          {(activeTab === 'precos' || (activeTab as any) === 'prices') && <PriceCalculator />}
          {(activeTab === 'financeiro' || (activeTab as any) === 'finance') && <FinanceView />}
          {(activeTab === 'configuracoes' || (activeTab as any) === 'settings') && <SettingsView />}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav onOpenMobileMenu={() => setMobileMenuOpen(true)} />

      {/* Application Modals */}
      <NewOrderModal />
      <OrderDetailModal />
      <MaterialDeductionModal />
      <ClientDetailModal />
      <NewClientModal />
      <ModelDetailModal />
      <NewModelModal />
      <ProductDetailModal />
      <RegisterPurchaseModal />
      <NewMaterialModal />

      {/* Utilities */}
      <GlobalSearchModal />
      <DeleteConfirmModal />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
