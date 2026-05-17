import { QuoteBriefing } from '@/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface QuoteStore {
  briefing: Partial<QuoteBriefing>;
  currentStep: number;
  selectedCompanyId: string | null;
  selectedMenuIds: string[];
  negotiationRequested: boolean;
  setNegotiationRequested: (value: boolean) => void;
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
      negotiationRequested: false,
      setNegotiationRequested: (value) => set({ negotiationRequested: value }),
      setBriefing: (data) => set((state) => ({
        briefing: { ...state.briefing, ...data }
      })),
      setCurrentStep: (step) => set({ currentStep: step }),
      setSelectedCompany: (id) => set({ selectedCompanyId: id }),
      setSelectedMenu: (id) => set((state) => ({
        selectedMenuIds: id ? [id] : [],
        selectedCompanyId: id ? state.selectedCompanyId : null,
        negotiationRequested: false,
      })),
      addMenuToSelection: (companyId, menuId) => set((state) => {
        const sameCompany = state.selectedCompanyId === companyId;
        const list = sameCompany ? state.selectedMenuIds : [];
        if (list.includes(menuId)) {
          return { selectedCompanyId: companyId, selectedMenuIds: list, negotiationRequested: sameCompany ? state.negotiationRequested : false };
        }
        return {
          selectedCompanyId: companyId,
          selectedMenuIds: [...list, menuId],
          negotiationRequested: sameCompany ? state.negotiationRequested : false,
        };
      }),
      removeMenuFromSelection: (menuId) => set((state) => {
        const next = state.selectedMenuIds.filter((id) => id !== menuId);
        return {
          selectedMenuIds: next,
          selectedCompanyId: next.length === 0 ? null : state.selectedCompanyId,
          negotiationRequested: next.length < 2 ? false : state.negotiationRequested,
        };
      }),
      clearSelection: () => set({ selectedCompanyId: null, selectedMenuIds: [], negotiationRequested: false }),
      resetQuote: () => set({
        briefing: {},
        currentStep: 1,
        selectedCompanyId: null,
        selectedMenuIds: [],
        negotiationRequested: false,
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
