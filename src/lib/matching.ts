import type { Menu, QuoteBriefing, ServiceCategory } from '@/types';

export function normalize(s: string | undefined | null): string {
  if (!s) return '';
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function matchesCategory(pkg: Menu, category?: string): boolean {
  if (!category) return true;
  if (!pkg.serviceCategory) return true; // legacy: passa
  return pkg.serviceCategory === (category as ServiceCategory);
}

export function matchesCoverage(
  pkg: Menu,
  state?: string,
  city?: string,
): boolean {
  if (!pkg.coverage || pkg.coverage.length === 0) return true; // legacy
  if (!state || !city) return true;
  const uf = state.toUpperCase();
  const c = normalize(city);
  return pkg.coverage.some(
    (cov) =>
      cov.state.toUpperCase() === uf &&
      cov.cities.some((x) => normalize(x) === c),
  );
}

export function matchesCapacity(pkg: Menu, people?: number): boolean {
  if (!people || people <= 0) return true;
  if (pkg.minPeople && people < pkg.minPeople) return false;
  if (pkg.maxPeople && people > pkg.maxPeople) return false;
  return true;
}

export interface PackageMatch {
  matches: boolean;
  score: number;
  reasons: string[];
}

export function scorePackage(
  pkg: Menu,
  briefing: Partial<QuoteBriefing>,
): PackageMatch {
  const reasons: string[] = [];
  let score = 0;

  const okCat = matchesCategory(pkg, briefing.serviceCategory);
  const okCov = matchesCoverage(pkg, briefing.state, briefing.city);
  const okCap = matchesCapacity(pkg, briefing.people);

  const matches = okCat && okCov && okCap;

  if (okCat && pkg.serviceCategory) {
    score += 30;
    reasons.push('categoria compatível');
  }
  if (okCov && pkg.coverage && pkg.coverage.length > 0) {
    score += 25;
    reasons.push('atende sua cidade');
  }
  if (okCap && (pkg.minPeople || pkg.maxPeople)) {
    score += 20;
    reasons.push('faixa de pessoas compatível');
  }

  // Tipo de evento: bônus, não bloqueia
  if (briefing.eventType) {
    if (!pkg.eventTypes || pkg.eventTypes.length === 0) {
      score += 5; // pacote "geral"
    } else if (pkg.eventTypes.includes(briefing.eventType)) {
      score += 25;
      reasons.push('combina com seu tipo de evento');
    }
  }

  return { matches, score, reasons };
}
