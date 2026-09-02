import React from 'react';
import { CheckCircle, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Toast: React.FC = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-1/2 translate-x-1/2 lg:translate-x-0 lg:right-6 z-50 animate-in fade-in slide-in-from-bottom-3 duration-300">
      <div className="bg-[#292529]/90 backdrop-blur-md text-white px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2.5 text-sm font-medium border border-white/20">
        <div className="w-5 h-5 rounded-full bg-[#5F8A72] flex items-center justify-center text-white shrink-0">
          <CheckCircle className="w-3.5 h-3.5" />
        </div>
        <span>{toastMessage}</span>
      </div>
    </div>
  );
};
