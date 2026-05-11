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
    headers: { 'Content-Type': 'text/plain;charset=UTF-8', Accept: 'application/json' },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    // Log details only to console for developers; show generic message to user
    if (typeof console !== 'undefined') {
      console.error('[auth] resposta inválida', { status: res.status, action });
    }
    throw new Error('Erro de comunicação com o servidor. Tente novamente.');
  }

  if (!res.ok || (data && data.error)) {
    const serverMsg = data && data.error;
    // Allow short, user-safe messages from the server (e.g. "Senha inválida"),
    // but never echo long payloads or stack traces.
    const safe = typeof serverMsg === 'string' && serverMsg.length > 0 && serverMsg.length <= 120
      ? serverMsg
      : 'Não foi possível concluir a operação. Tente novamente.';
    throw new Error(safe);
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
