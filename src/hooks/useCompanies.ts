import { useQuery } from '@tanstack/react-query';
import { apiListCompanies, apiGetCompanyDetail, apiGetCompanyPackages, ApiParceiro, ApiPacote } from '@/services/api';
import { Company, Menu } from '@/types';

function mapCompany(p: ApiParceiro & { preco_minimo?: number }): Company {
  return {
    id: String(p.id),
    name: p.nome_empresa || p.nome,
    description: p.sobre || '',
    cityBase: p.cidade_base || '',
    areasServed: p.areas_atendidas || [],
    rating: Number(p.avaliacao) || 0,
    totalReviews: Number(p.total_avaliacoes) || 0,
    image: p.foto_capa || '/placeholder.svg',
    active: p.ativo === 1,
    minPrice: Number((p as any).preco_minimo) || 0,
  };
}

export function mapPackageToMenu(p: ApiPacote, companyId: string): Menu {
  return {
    id: String(p.id),
    companyId,
    name: p.nome,
    description: p.descricao || '',
    includes: p.itens || [],
    drinks: p.drinks || [],
    durationHours: Number(p.duracao_horas) || 0,
    pricePerPerson: Number(p.preco_por_pessoa) || 0,
    minPeople: Number(p.minimo_pessoas) || 0,
  };
}

export function useCompanies(filters?: { cidade?: string; estado?: string }) {
  return useQuery({
    queryKey: ['companies', filters],
    queryFn: async () => {
      const data = await apiListCompanies(filters);
      return data.map(mapCompany);
    },
  });
}

export function useCompanyDetail(companyId: string | undefined) {
  return useQuery({
    queryKey: ['company', companyId],
    queryFn: async () => {
      if (!companyId) throw new Error('No companyId');
      const data = await apiGetCompanyDetail(Number(companyId));
      return mapCompany(data);
    },
    enabled: !!companyId,
  });
}

export function useCompanyMenus(companyId: string | undefined) {
  return useQuery({
    queryKey: ['companyMenus', companyId],
    queryFn: async () => {
      if (!companyId) throw new Error('No companyId');
      const data = await apiGetCompanyPackages(Number(companyId));
      return data.map(p => mapPackageToMenu(p, companyId));
    },
    enabled: !!companyId,
  });
}
