import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  apiRegister,
  apiUpdateProfile,
  apiGetProfile,
  apiGetPackages,
  apiAddPackage,
  apiUpdatePackage,
  apiDeletePackage,
  type ApiParceiro,
} from '@/services/api';

import type { CoverageArea, ServiceCategory } from '@/types';

export interface DrinkPackage {
  id: string;
  apiId?: number; // ID no banco MySQL
  name: string;
  description: string;
  includes: string[];
  drinks: string[];
  durationHours: number;
  pricePerPerson: number;
  minPeople: number;
  serviceCategory?: ServiceCategory;
  coverage?: CoverageArea[];
}

export interface PartnerProfile {
  apiId?: number; // ID no banco MySQL
  name: string;
  email: string;
  whatsapp: string;
  type: 'empresa' | 'autonomo';
  businessName: string;
  about: string;
  coverImage: string;
  cityBase: string;
  state: string;
  areasServed: string[];
  serviceCategories: ServiceCategory[];
  rating: number;
  totalReviews: number;
}

interface PartnerStore {
  isRegistered: boolean;
  profile: PartnerProfile;
  packages: DrinkPackage[];
  syncing: boolean;

  register: (data: Pick<PartnerProfile, 'name' | 'email' | 'whatsapp' | 'type'>) => Promise<void>;
  updateProfile: (data: Partial<PartnerProfile>) => void;
  syncProfile: () => Promise<void>;
  loadFromApi: (parceiroId: number) => Promise<void>;
  addPackage: (pkg: Omit<DrinkPackage, 'id'>) => Promise<boolean>;
  updatePackage: (id: string, pkg: Partial<DrinkPackage>) => void;
  deletePackage: (id: string) => void;
  syncPackages: () => Promise<void>;
  logout: () => void;
}

const defaultProfile: PartnerProfile = {
  name: '',
  email: '',
  whatsapp: '',
  type: 'empresa',
  businessName: '',
  about: '',
  coverImage: '',
  cityBase: '',
  state: '',
  areasServed: [],
  serviceCategories: [],
  rating: 0,
  totalReviews: 0,
};

export const usePartnerStore = create<PartnerStore>()(
  persist(
    (set, get) => ({
      isRegistered: false,
      profile: { ...defaultProfile },
      packages: [],
      syncing: false,

      register: async (data) => {
        // Salva localmente primeiro
        set({
          isRegistered: true,
          profile: { ...defaultProfile, ...data, businessName: data.name },
        });

        // Envia para a API
        try {
          const res = await apiRegister({
            nome: data.name,
            email: data.email,
            whatsapp: data.whatsapp,
            tipo: data.type,
          });
          set((s) => ({
            profile: { ...s.profile, apiId: res.id },
          }));
        } catch (err) {
          console.error('Erro ao registrar na API:', err);
          // Mantém dados locais mesmo se API falhar
        }
      },

      updateProfile: (data) =>
        set((s) => ({ profile: { ...s.profile, ...data } })),

      syncProfile: async () => {
        const { profile } = get();
        if (!profile.apiId) return;

        set({ syncing: true });
        try {
          await apiUpdateProfile(profile.apiId, {
            nome_empresa: profile.businessName,
            sobre: profile.about,
            foto_capa: profile.coverImage,
            cidade_base: profile.cityBase,
            estado: profile.state,
            whatsapp: profile.whatsapp,
            email: profile.email,
            areas_atendidas: profile.areasServed,
          });
        } catch (err) {
          console.error('Erro ao sincronizar perfil:', err);
          throw err;
        } finally {
          set({ syncing: false });
        }
      },

      addPackage: async (pkg) => {
        if (get().packages.length >= 4) return false;

        const localId = crypto.randomUUID();
        const newPkg: DrinkPackage = { ...pkg, id: localId };

        set((s) => ({ packages: [...s.packages, newPkg] }));

        // Envia para a API
        const { profile } = get();
        if (profile.apiId) {
          try {
            const res = await apiAddPackage({
              parceiro_id: profile.apiId,
              nome: pkg.name,
              descricao: pkg.description,
              duracao_horas: pkg.durationHours,
              preco_por_pessoa: pkg.pricePerPerson,
              minimo_pessoas: pkg.minPeople,
              itens: pkg.includes,
              drinks: pkg.drinks,
            });
            set((s) => ({
              packages: s.packages.map((p) =>
                p.id === localId ? { ...p, apiId: res.id } : p
              ),
            }));
          } catch (err) {
            console.error('Erro ao criar pacote na API:', err);
          }
        }
        return true;
      },

      updatePackage: (id, pkg) => {
        set((s) => ({
          packages: s.packages.map((p) =>
            p.id === id ? { ...p, ...pkg } : p
          ),
        }));

        // Sincroniza com a API
        const updated = get().packages.find((p) => p.id === id);
        if (updated?.apiId) {
          apiUpdatePackage({
            pacote_id: updated.apiId,
            nome: updated.name,
            descricao: updated.description,
            duracao_horas: updated.durationHours,
            preco_por_pessoa: updated.pricePerPerson,
            minimo_pessoas: updated.minPeople,
            itens: updated.includes,
            drinks: updated.drinks,
          }).catch((err) => console.error('Erro ao atualizar pacote na API:', err));
        }
      },

      deletePackage: (id) => {
        const pkg = get().packages.find((p) => p.id === id);
        set((s) => ({
          packages: s.packages.filter((p) => p.id !== id),
        }));

        if (pkg?.apiId) {
          apiDeletePackage(pkg.apiId).catch((err) =>
            console.error('Erro ao excluir pacote na API:', err)
          );
        }
      },

      syncPackages: async () => {
        const { profile } = get();
        if (!profile.apiId) return;

        try {
          const apiPkgs = await apiGetPackages(profile.apiId);
          const packages: DrinkPackage[] = apiPkgs.map((p) => ({
            id: crypto.randomUUID(),
            apiId: p.id,
            name: p.nome,
            description: p.descricao || '',
            includes: p.itens,
            drinks: p.drinks,
            durationHours: Number(p.duracao_horas),
            pricePerPerson: Number(p.preco_por_pessoa),
            minPeople: Number(p.minimo_pessoas),
          }));
          set({ packages });
        } catch (err) {
          console.error('Erro ao buscar pacotes da API:', err);
        }
      },

      loadFromApi: async (parceiroId: number) => {
        try {
          const p: ApiParceiro = await apiGetProfile(parceiroId);
          set((s) => ({
            isRegistered: true,
            profile: {
              ...s.profile,
              apiId: p.id,
              name: p.nome,
              email: p.email,
              whatsapp: p.whatsapp || '',
              type: p.tipo,
              businessName: p.nome_empresa || p.nome,
              about: p.sobre || '',
              coverImage: p.foto_capa || '',
              cityBase: p.cidade_base || '',
              state: p.estado || '',
              areasServed: p.areas_atendidas || [],
              rating: Number(p.avaliacao) || 0,
              totalReviews: Number(p.total_avaliacoes) || 0,
            },
          }));
          await get().syncPackages();
        } catch (err) {
          console.error('Erro ao carregar perfil da API:', err);
        }
      },

      logout: () =>
        set({ isRegistered: false, profile: { ...defaultProfile }, packages: [] }),
    }),
    { name: 'bartender-partner' }
  )
);
