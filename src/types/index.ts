export interface Company {
  id: string;
  name: string;
  description: string;
  cityBase: string;
  areasServed: string[];
  rating: number;
  totalReviews: number;
  image: string;
  active: boolean;
  badge?: 'most-chosen' | 'best-value' | 'premium';
  minPrice: number;
}

export interface Menu {
  id: string;
  companyId: string;
  name: string;
  description: string;
  includes: string[];
  drinks: string[];
  durationHours: number;
  pricePerPerson: number;
  minPeople: number;
}

export interface Lead {
  id: string;
  eventType: string;
  people: number;
  city: string;
  state: string;
  neighborhood: string;
  address?: string;
  eventDate: string;
  clientName: string;
  whatsapp: string;
  email: string;
  observations?: string;
  companyId?: string;
  menuId?: string;
  estimatedTotal?: number;
  status: 'new' | 'in-contact' | 'quote-sent' | 'closed' | 'lost';
  createdAt: string;
}

export interface QuoteBriefing {
  eventType: string;
  people: number;
  city: string;
  state: string;
  neighborhood: string;
  address?: string;
  eventDate: string;
  clientName: string;
  whatsapp: string;
  email: string;
}
