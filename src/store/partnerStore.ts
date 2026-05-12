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

import type { CoverageArea, ServiceCategory, PartnerSocials } from '@/types';

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
  maxPeople?: number;
  serviceCategory?: ServiceCategory;
  coverage?: CoverageArea[];
  eventTypes?: string[];
}

export interface PartnerProfile {
  apiId?: number;
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
  // novos campos da vitrine
  title: string;
  shortDescription: string;
  logo: string;
  gallery: string[];
  videoUrl: string;
  differentials: string[];
  socials: PartnerSocials;
  showContact: boolean;
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
  title: '',
  shortDescription: '',
  logo: '',
  gallery: [],
  videoUrl: '',
  differentials: [],
  socials: {},
  showContact: false,
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
            categorias_servico: profile.serviceCategories,
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
              maximo_pessoas: pkg.maxPeople,
              itens: pkg.includes,
              drinks: pkg.drinks,
              categoria_servico: pkg.serviceCategory,
              cobertura: pkg.coverage,
              tipos_evento: pkg.eventTypes,
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
            maximo_pessoas: updated.maxPeople,
            itens: updated.includes,
            drinks: updated.drinks,
            categoria_servico: updated.serviceCategory,
            cobertura: updated.coverage,
            tipos_evento: updated.eventTypes,
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
            maxPeople: p.maximo_pessoas ? Number(p.maximo_pessoas) : undefined,
            serviceCategory: (p.categoria_servico as any) || undefined,
            coverage: p.cobertura || [],
            eventTypes: p.tipos_evento || [],
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
              serviceCategories: (p.categorias_servico as any) || [],
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
    {
      name: 'bartender-partner',
      // Evita estourar a cota do localStorage quando a foto de capa é um
      // data URL grande (base64). A imagem é recarregada da API no login.
      partialize: (state) => ({
        isRegistered: state.isRegistered,
        profile: { ...state.profile, coverImage: '' },
        packages: state.packages,
      }),
    }
  )
);
