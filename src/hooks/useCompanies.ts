import { useQuery, useQueries } from '@tanstack/react-query';
import { apiListCompanies, apiGetCompanyDetail, apiGetCompanyPackages, ApiParceiro, ApiPacote } from '@/services/api';
import { Company, Menu, ServiceCategory, QuoteBriefing } from '@/types';
import { scorePackage, PackageMatch } from '@/lib/matching';

function mapCompany(p: ApiParceiro & { preco_minimo?: number }): Company {
  return {
    id: String(p.id),
    name: p.nome_empresa || p.nome,
    description: p.sobre || '',
    cityBase: p.cidade_base || '',
    areasServed: p.areas_atendidas || [],
    serviceCategories: (p.categorias_servico as ServiceCategory[]) || [],
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
    maxPeople: p.maximo_pessoas ? Number(p.maximo_pessoas) : undefined,
    serviceCategory: (p.categoria_servico as ServiceCategory) || undefined,
    coverage: p.cobertura || [],
    eventTypes: p.tipos_evento || [],
    coverImage: p.foto_capa || undefined,
    gallery: p.galeria || [],
  };
}

interface CompanyFilters {
  cidade?: string;
  estado?: string;
  categoria?: string;
}

export function useCompanies(filters?: CompanyFilters) {
  return useQuery({
    queryKey: ['companies', filters],
    queryFn: async () => {
      const data = await apiListCompanies(filters);
      let companies = data.map(mapCompany);
      if (filters?.categoria) {
        companies = companies.filter(
          (c) =>
            !c.serviceCategories ||
            c.serviceCategories.length === 0 ||
            c.serviceCategories.includes(filters.categoria as ServiceCategory),
        );
      }
      return companies;
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

export function useCompanyMenus(
  companyId: string | undefined,
  filters?: { categoria?: string; cidade?: string },
) {
  return useQuery({
    queryKey: ['companyMenus', companyId, filters],
    queryFn: async () => {
      if (!companyId) throw new Error('No companyId');
      const data = await apiGetCompanyPackages(Number(companyId));
      let menus = data.map((p) => mapPackageToMenu(p, companyId));

      if (filters?.categoria) {
        const matching = menus.filter((m) => m.serviceCategory === filters.categoria);
        if (matching.length > 0) menus = matching;
      }

      if (filters?.cidade) {
        const city = filters.cidade.toLowerCase();
        const matching = menus.filter((m) => {
          if (!m.coverage || m.coverage.length === 0) return true;
          return m.coverage.some((c) =>
            c.cities.some((cc) => cc.toLowerCase() === city),
          );
        });
        if (matching.length > 0) menus = matching;
      }

      return menus;
    },
    enabled: !!companyId,
  });
}

export interface CompanyMatch {
  company: Company;
  matchedPackages: Array<Menu & { match: PackageMatch }>;
  bestScore: number;
}

export function useMatchingPackages(briefing: Partial<QuoteBriefing>) {
  // Busca todas as empresas (sem filtro server-side rígido)
  const companiesQ = useQuery({
    queryKey: ['companies', 'all-for-matching'],
    queryFn: async () => {
      const data = await apiListCompanies();
      return data.map(mapCompany);
    },
  });

  const companies = companiesQ.data ?? [];

  const packagesQs = useQueries({
    queries: companies.map((c) => ({
      queryKey: ['companyMenus', c.id],
      queryFn: async () => {
        const data = await apiGetCompanyPackages(Number(c.id));
        return data.map((p) => mapPackageToMenu(p, c.id));
      },
      enabled: !!companies.length,
    })),
  });

  const isLoading = companiesQ.isLoading || packagesQs.some((q) => q.isLoading);

  const results: CompanyMatch[] = companies
    .map((c, idx) => {
      const pkgs = packagesQs[idx]?.data ?? [];
      const scored = pkgs
        .map((p) => ({ ...p, match: scorePackage(p, briefing) }))
        .filter((p) => p.match.matches)
        .sort((a, b) => b.match.score - a.match.score);
      const bestScore = scored[0]?.match.score ?? 0;
      return { company: c, matchedPackages: scored, bestScore };
    })
    .filter((r) => r.matchedPackages.length > 0)
    .sort((a, b) => b.bestScore - a.bestScore);

  return { data: results, isLoading };
}
