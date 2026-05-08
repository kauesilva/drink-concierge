const API_BASE = 'https://bartenderstore.com.br/servicos/api.php';

async function request<T>(action: string, options?: RequestInit & { params?: Record<string, string> }): Promise<T> {
  const { params, ...fetchOptions } = options ?? {};
  const url = new URL(API_BASE);
  url.searchParams.set('action', action);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }

  const res = await fetch(url.toString(), {
    headers: { 'Content-Type': 'text/plain;charset=UTF-8', Accept: 'application/json' },
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
  itens: string[];
  drinks: string[];
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
  // Dados do pacote (join no backend)
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
  }
): Promise<{ message: string }> {
  return request('update_profile', {
    method: 'POST',
    body: JSON.stringify({ parceiro_id: parceiroId, ...data }),
  });
}

export async function apiGetProfile(id: number): Promise<ApiParceiro> {
  return request('get_profile', { params: { id: String(id) } });
}

// =============================================
// PACOTES
// =============================================

export async function apiGetPackages(parceiroId: number): Promise<ApiPacote[]> {
  return request('get_packages', { params: { id: String(parceiroId) } });
}

export async function apiAddPackage(data: {
  parceiro_id: number;
  nome: string;
  descricao?: string;
  duracao_horas?: number;
  preco_por_pessoa: number;
  minimo_pessoas: number;
  itens?: string[];
  drinks?: string[];
}): Promise<{ id: number; message: string }> {
  return request('add_package', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function apiUpdatePackage(data: {
  pacote_id: number;
  nome?: string;
  descricao?: string;
  duracao_horas?: number;
  preco_por_pessoa?: number;
  minimo_pessoas?: number;
  itens?: string[];
  drinks?: string[];
}): Promise<{ message: string }> {
  return request('update_package', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function apiDeletePackage(pacoteId: number): Promise<{ message: string }> {
  return request('delete_package', {
    method: 'POST',
    body: JSON.stringify({ pacote_id: pacoteId }),
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
  return request('get_partner_leads', { params: { parceiro_id: String(parceiroId) } });
}

export async function apiUpdateLeadStatus(data: {
  lead_id: number;
  status: string;
  parceiro_id: number;
}): Promise<{ message: string }> {
  return request('update_lead_status', {
    method: 'POST',
    body: JSON.stringify(data),
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
  return request('admin_list_leads', {
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  });
}

// =============================================
// LISTAGEM PÚBLICA
// =============================================

export async function apiListCompanies(filters?: {
  cidade?: string;
  estado?: string;
}): Promise<(ApiParceiro & { preco_minimo: number })[]> {
  const params: Record<string, string> = {};
  if (filters?.cidade) params.cidade = filters.cidade;
  if (filters?.estado) params.estado = filters.estado;
  return request('list_companies', { params });
}

export async function apiGetCompanyDetail(id: number): Promise<ApiParceiro> {
  return request('get_profile', { params: { id: String(id) } });
}

export async function apiGetCompanyPackages(parceiroId: number): Promise<ApiPacote[]> {
  return request('get_packages', { params: { id: String(parceiroId) } });
}
