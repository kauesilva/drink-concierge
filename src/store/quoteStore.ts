import { QuoteBriefing } from '@/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface QuoteStore {
  briefing: Partial<QuoteBriefing>;
  currentStep: number;
  selectedCompanyId: string | null;
  selectedMenuIds: string[];
  setBriefing: (data: Partial<QuoteBriefing>) => void;
  setCurrentStep: (step: number) => void;
  setSelectedCompany: (id: string | null) => void;
  /** Substitui completamente a seleção por um único pacote (compat). */
  setSelectedMenu: (id: string | null) => void;
  /** Adiciona pacote à seleção. Se a empresa for diferente, reseta a lista. */
  addMenuToSelection: (companyId: string, menuId: string) => void;
  removeMenuFromSelection: (menuId: string) => void;
  clearSelection: () => void;
  resetQuote: () => void;
}

export const useQuoteStore = create<QuoteStore>()(
  persist(
    (set) => ({
      briefing: {},
      currentStep: 1,
      selectedCompanyId: null,
      selectedMenuIds: [],
      setBriefing: (data) => set((state) => ({
        briefing: { ...state.briefing, ...data }
      })),
      setCurrentStep: (step) => set({ currentStep: step }),
      setSelectedCompany: (id) => set({ selectedCompanyId: id }),
      setSelectedMenu: (id) => set((state) => ({
        selectedMenuIds: id ? [id] : [],
        selectedCompanyId: id ? state.selectedCompanyId : null,
      })),
      addMenuToSelection: (companyId, menuId) => set((state) => {
        const sameCompany = state.selectedCompanyId === companyId;
        const list = sameCompany ? state.selectedMenuIds : [];
        if (list.includes(menuId)) {
          return { selectedCompanyId: companyId, selectedMenuIds: list };
        }
        return {
          selectedCompanyId: companyId,
          selectedMenuIds: [...list, menuId],
        };
      }),
      removeMenuFromSelection: (menuId) => set((state) => {
        const next = state.selectedMenuIds.filter((id) => id !== menuId);
        return {
          selectedMenuIds: next,
          selectedCompanyId: next.length === 0 ? null : state.selectedCompanyId,
        };
      }),
      clearSelection: () => set({ selectedCompanyId: null, selectedMenuIds: [] }),
      resetQuote: () => set({
        briefing: {},
        currentStep: 1,
        selectedCompanyId: null,
        selectedMenuIds: [],
      }),
    }),
    {
      name: 'bartender-store-quote',
      // Migra `selectedMenuId` (string) legado para `selectedMenuIds` (string[])
      migrate: (persisted: any) => {
        if (persisted && typeof persisted === 'object' && 'selectedMenuId' in persisted) {
          const { selectedMenuId, ...rest } = persisted;
          return {
            ...rest,
            selectedMenuIds: selectedMenuId ? [selectedMenuId] : [],
          };
        }
        return persisted;
      },
      version: 2,
    }
  )
);
