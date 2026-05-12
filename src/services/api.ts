import { useAuthStore } from '@/store/authStore';
import { useAdminStore } from '@/store/adminStore';

const API_BASE = 'https://bartenderstore.com.br/servicos/api_v2.php';
const UPLOAD_ENDPOINT = 'https://bartenderstore.com.br/servicos/uploads.php';

/**
 * Faz upload de uma imagem e retorna a URL pública servida em
 * https://bartenderstore.com.br/servicos/uploads/<arquivo>
 */
export async function apiUploadImage(file: File): Promise<{ url: string; filename: string }> {
  const fd = new FormData();
  fd.append('file', file);
  const res = await fetch(UPLOAD_ENDPOINT, { method: 'POST', body: fd });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || `Falha no upload (${res.status})`);
  }
  return data;
}

function getAuthToken(): string | null {
  try {
    return useAuthStore.getState().token;
  } catch {
    return null;
  }
}

function getAdminToken(): string | null {
  try {
    return useAdminStore.getState().token;
  } catch {
    return null;
  }
}

async function request<T>(
  action: string,
  options?: RequestInit & { params?: Record<string, string>; token?: string | null }
): Promise<T> {
  const { params, token, headers, ...fetchOptions } = options ?? {};
  const url = new URL(API_BASE);
  url.searchParams.set('action', action);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }

  const finalHeaders: Record<string, string> = {
    'Content-Type': 'text/plain;charset=UTF-8',
    Accept: 'application/json',
    ...(headers as Record<string, string> | undefined),
  };
  if (token) {
    finalHeaders.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url.toString(), {
    headers: finalHeaders,
    ...fetchOptions,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || `Erro na API: ${res.status}`);
  }

  return data as T;
}

// =============================================
// TYPES
// =============================================

export interface ApiCoverage {
  state: string;
  cities: string[];
}

export interface ApiParceiro {
  id: number;
  nome: string;
  email: string;
  whatsapp: string;
  tipo: 'empresa' | 'autonomo';
  nome_empresa: string | null;
  sobre: string | null;
  foto_capa: string | null;
  cidade_base: string | null;
  estado: string | null;
  avaliacao: number;
  total_avaliacoes: number;
  ativo: number;
  areas_atendidas: string[];
  categorias_servico?: string[];
  criado_em: string;
  atualizado_em: string;
}

export interface ApiPacote {
  id: number;
  parceiro_id: number;
  nome: string;
  descricao: string | null;
  duracao_horas: number;
  preco_por_pessoa: number;
  minimo_pessoas: number;
  maximo_pessoas?: number | null;
  itens: string[];
  drinks: string[];
  categoria_servico?: string | null;
  cobertura?: ApiCoverage[];
  tipos_evento?: string[];
  criado_em: string;
  atualizado_em: string;
}

export interface ApiLead {
  id: number;
  parceiro_id: number | null;
  pacote_id: number | null;
  tipo_evento: string;
  quantidade_pessoas: number;
  cidade: string;
  estado: string;
  bairro: string | null;
  endereco: string | null;
  data_evento: string;
  nome_cliente: string;
  whatsapp: string;
  email: string;
  observacoes: string | null;
  valor_estimado: number | null;
  status: string;
  criado_em: string;
  pacote_nome?: string;
}

// =============================================
// PARCEIRO
// =============================================

export async function apiRegister(data: {
  nome: string;
  email: string;
  whatsapp: string;
  tipo: 'empresa' | 'autonomo';
}): Promise<{ id: number; message: string }> {
  return request('register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function apiUpdateProfile(
  parceiroId: number,
  data: {
    nome_empresa?: string;
    sobre?: string;
    foto_capa?: string;
    cidade_base?: string;
    estado?: string;
    whatsapp?: string;
    email?: string;
    areas_atendidas?: string[];
    categorias_servico?: string[];
    titulo_perfil?: string;
    descricao_curta?: string;
    
    logo?: string;
    galeria?: string[];
    video_url?: string;
    diferenciais?: string[];
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    site?: string;
    telefone_publico?: number;
  }
): Promise<{ message: string }> {
  return request('update_profile', {
    method: 'POST',
    body: JSON.stringify({ parceiro_id: parceiroId, ...data }),
    token: getAuthToken(),
  });
}

export async function apiListPublicPartners(filters?: {
  cidade?: string;
  estado?: string;
  categoria?: string;
}): Promise<ApiParceiro[]> {
  const params: Record<string, string> = {};
  if (filters?.cidade) params.cidade = filters.cidade;
  if (filters?.estado) params.estado = filters.estado;
  if (filters?.categoria) params.categoria = filters.categoria;
  return request('list_public_partners', { params });
}

export async function apiGetPublicPartner(id: number): Promise<ApiParceiro> {
  return request('get_public_partner', { params: { id: String(id) } });
}

export async function apiGetProfile(id: number): Promise<ApiParceiro> {
  // Public-readable basic profile is used in directory pages; forward token when available
  return request('get_profile', { params: { id: String(id) }, token: getAuthToken() });
}

// =============================================
// PACOTES
// =============================================

export async function apiGetPackages(parceiroId: number): Promise<ApiPacote[]> {
  return request('get_packages', { params: { id: String(parceiroId) }, token: getAuthToken() });
}

export async function apiAddPackage(data: {
  parceiro_id: number;
  nome: string;
  descricao?: string;
  duracao_horas?: number;
  preco_por_pessoa: number;
  minimo_pessoas: number;
  maximo_pessoas?: number;
  itens?: string[];
  drinks?: string[];
  categoria_servico?: string;
  cobertura?: ApiCoverage[];
  tipos_evento?: string[];
}): Promise<{ id: number; message: string }> {
  return request('add_package', {
    method: 'POST',
    body: JSON.stringify(data),
    token: getAuthToken(),
  });
}

export async function apiUpdatePackage(data: {
  pacote_id: number;
  nome?: string;
  descricao?: string;
  duracao_horas?: number;
  preco_por_pessoa?: number;
  minimo_pessoas?: number;
  maximo_pessoas?: number;
  itens?: string[];
  drinks?: string[];
  categoria_servico?: string;
  cobertura?: ApiCoverage[];
  tipos_evento?: string[];
}): Promise<{ message: string }> {
  return request('update_package', {
    method: 'POST',
    body: JSON.stringify(data),
    token: getAuthToken(),
  });
}

export async function apiDeletePackage(pacoteId: number): Promise<{ message: string }> {
  return request('delete_package', {
    method: 'POST',
    body: JSON.stringify({ pacote_id: pacoteId }),
    token: getAuthToken(),
  });
}

// =============================================
// LEADS
// =============================================

export async function apiCreateLead(data: {
  parceiro_id?: number;
  pacote_id?: number;
  tipo_evento: string;
  quantidade_pessoas: number;
  cidade: string;
  estado: string;
  bairro?: string;
  endereco?: string;
  data_evento: string;
  nome_cliente: string;
  whatsapp: string;
  email: string;
  observacoes?: string;
  valor_estimado?: number;
}): Promise<{ id: number; message: string }> {
  return request('create_lead', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function apiGetPartnerLeads(parceiroId: number): Promise<ApiLead[]> {
  return request('get_partner_leads', {
    params: { parceiro_id: String(parceiroId) },
    token: getAuthToken(),
  });
}

export async function apiUpdateLeadStatus(data: {
  lead_id: number;
  status: string;
  parceiro_id: number;
}): Promise<{ message: string }> {
  return request('update_lead_status', {
    method: 'POST',
    body: JSON.stringify(data),
    token: getAuthToken(),
  });
}

// =============================================
// ADMIN
// =============================================

export async function apiAdminLogin(email: string, senha: string): Promise<{ token: string }> {
  return request('admin_login', {
    method: 'POST',
    body: JSON.stringify({ email, senha }),
  });
}

export async function apiListLeads(token: string): Promise<ApiLead[]> {
  return request('admin_list_leads', { token: token || getAdminToken() });
}

// =============================================
// LISTAGEM PÚBLICA
// =============================================

export async function apiListCompanies(filters?: {
  cidade?: string;
  estado?: string;
  categoria?: string;
}): Promise<(ApiParceiro & { preco_minimo: number })[]> {
  const params: Record<string, string> = {};
  if (filters?.cidade) params.cidade = filters.cidade;
  if (filters?.estado) params.estado = filters.estado;
  if (filters?.categoria) params.categoria = filters.categoria;
  return request('list_companies', { params });
}

export async function apiGetCompanyDetail(id: number): Promise<ApiParceiro> {
  return request('get_profile', { params: { id: String(id) } });
}

export async function apiGetCompanyPackages(parceiroId: number): Promise<ApiPacote[]> {
  return request('get_packages', { params: { id: String(parceiroId) } });
}
