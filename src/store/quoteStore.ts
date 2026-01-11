import { QuoteBriefing } from '@/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface QuoteStore {
  briefing: Partial<QuoteBriefing>;
  currentStep: number;
  selectedCompanyId: string | null;
  selectedMenuId: string | null;
  setBriefing: (data: Partial<QuoteBriefing>) => void;
  setCurrentStep: (step: number) => void;
  setSelectedCompany: (id: string | null) => void;
  setSelectedMenu: (id: string | null) => void;
  resetQuote: () => void;
}

export const useQuoteStore = create<QuoteStore>()(
  persist(
    (set) => ({
      briefing: {},
      currentStep: 1,
      selectedCompanyId: null,
      selectedMenuId: null,
      setBriefing: (data) => set((state) => ({ 
        briefing: { ...state.briefing, ...data } 
      })),
      setCurrentStep: (step) => set({ currentStep: step }),
      setSelectedCompany: (id) => set({ selectedCompanyId: id }),
      setSelectedMenu: (id) => set({ selectedMenuId: id }),
      resetQuote: () => set({
        briefing: {},
        currentStep: 1,
        selectedCompanyId: null,
        selectedMenuId: null,
      }),
    }),
    {
      name: 'bartender-stones-quote',
    }
  )
);
