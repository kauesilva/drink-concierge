import type { PartnerProfile } from '@/store/partnerStore';

export interface PublishCheck {
  field: string;
  label: string;
  ok: boolean;
}

export function getPublishChecks(p: Partial<PartnerProfile>): PublishCheck[] {
  return [
    { field: 'name', label: 'Nome da empresa ou profissional', ok: !!(p.businessName || p.name)?.trim() },
    { field: 'category', label: 'Pelo menos um tipo de serviço', ok: !!p.serviceCategories?.length },
    { field: 'location', label: 'Estado e cidade base', ok: !!(p.state && p.cityBase) },
    { field: 'shortDescription', label: 'Descrição curta', ok: !!p.shortDescription?.trim() },
    { field: 'image', label: 'Pelo menos 1 imagem (capa, logo ou galeria)', ok: !!(p.coverImage || p.logo || p.gallery?.length) },
  ];
}

export function isPartnerPublishable(p: Partial<PartnerProfile>): boolean {
  return getPublishChecks(p).every((c) => c.ok);
}

export function getYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
  return m ? m[1] : null;
}

export function getVimeoId(url: string): string | null {
  const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return m ? m[1] : null;
}
