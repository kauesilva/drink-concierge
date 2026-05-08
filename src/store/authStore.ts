import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'parceiro' | 'lead';

export interface AuthUser {
  id: number;
  nome: string;
  email: string;
  role: UserRole;
  parceiro_id?: number; // se for parceiro, referencia o id na tabela parceiros
}

interface AuthStore {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;

  login: (email: string, senha: string) => Promise<void>;
  register: (data: {
    nome: string;
    email: string;
    senha: string;
    role: UserRole;
    whatsapp?: string;
    tipo?: 'empresa' | 'autonomo';
  }) => Promise<void>;
  logout: () => void;
  setLoading: (v: boolean) => void;
}

const API_BASE = 'https://bartenderstore.com.br/servicos/api.php';

async function authRequest<T>(action: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(`${API_BASE}?action=${action}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    throw new Error(
      `Resposta inválida do servidor (HTTP ${res.status}). ` +
      `Verifique se a action "${action}" existe no api.php. ` +
      `Conteúdo recebido: ${text.slice(0, 200) || '(vazio)'}`
    );
  }

  if (!res.ok || (data && data.error)) {
    throw new Error((data && data.error) || `Erro: ${res.status}`);
  }

  return data as T;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,

      login: async (email, senha) => {
        set({ loading: true });
        try {
          const res = await authRequest<{
            token: string;
            user: AuthUser;
          }>('auth_login', { email, senha });

          set({
            user: res.user,
            token: res.token,
            isAuthenticated: true,
          });
        } finally {
          set({ loading: false });
        }
      },

      register: async (data) => {
        set({ loading: true });
        try {
          const res = await authRequest<{
            token: string;
            user: AuthUser;
          }>('auth_register', data);

          set({
            user: res.user,
            token: res.token,
            isAuthenticated: true,
          });
        } finally {
          set({ loading: false });
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        // Limpar store do parceiro também
        localStorage.removeItem('bartender-partner');
      },

      setLoading: (v) => set({ loading: v }),
    }),
    { name: 'bartender-auth' }
  )
);
