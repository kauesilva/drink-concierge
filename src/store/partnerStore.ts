import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface DrinkPackage {
  id: string;
  name: string;
  description: string;
  includes: string[];
  drinks: string[];
  durationHours: number;
  pricePerPerson: number;
  minPeople: number;
}

export interface PartnerProfile {
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
  rating: number;
  totalReviews: number;
}

interface PartnerStore {
  isRegistered: boolean;
  profile: PartnerProfile;
  packages: DrinkPackage[];
  register: (data: Pick<PartnerProfile, 'name' | 'email' | 'whatsapp' | 'type'>) => void;
  updateProfile: (data: Partial<PartnerProfile>) => void;
  addPackage: (pkg: Omit<DrinkPackage, 'id'>) => boolean;
  updatePackage: (id: string, pkg: Partial<DrinkPackage>) => void;
  deletePackage: (id: string) => void;
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
  rating: 0,
  totalReviews: 0,
};

export const usePartnerStore = create<PartnerStore>()(
  persist(
    (set, get) => ({
      isRegistered: false,
      profile: { ...defaultProfile },
      packages: [],
      register: (data) =>
        set({
          isRegistered: true,
          profile: { ...defaultProfile, ...data, businessName: data.name },
        }),
      updateProfile: (data) =>
        set((s) => ({ profile: { ...s.profile, ...data } })),
      addPackage: (pkg) => {
        if (get().packages.length >= 4) return false;
        set((s) => ({
          packages: [
            ...s.packages,
            { ...pkg, id: crypto.randomUUID() },
          ],
        }));
        return true;
      },
      updatePackage: (id, pkg) =>
        set((s) => ({
          packages: s.packages.map((p) =>
            p.id === id ? { ...p, ...pkg } : p
          ),
        })),
      deletePackage: (id) =>
        set((s) => ({
          packages: s.packages.filter((p) => p.id !== id),
        })),
      logout: () =>
        set({ isRegistered: false, profile: { ...defaultProfile }, packages: [] }),
    }),
    { name: 'bartender-partner' }
  )
);
