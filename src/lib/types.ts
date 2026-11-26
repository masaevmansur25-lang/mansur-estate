export type PropertyStatus = 'published' | 'draft' | 'sold';

export interface Property {
  id: string;
  title: string;
  description: string | null;
  price: number | null;
  currency: string | null;
  city: string;
  district: string | null;
  address: string | null;
  property_type: string;
  deal_type: string;
  status: PropertyStatus;
  area: number | null;
  rooms: number | null;
  floor: number | null;
  floors_total: number | null;
  image_urls: string[];
  featured: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface PropertyInput {
  title: string;
  description: string;
  price: number | null;
  city: string;
  district: string;
  address: string;
  property_type: string;
  deal_type: string;
  status: PropertyStatus;
  area: number | null;
  rooms: number | null;
  floor: number | null;
  floors_total: number | null;
  image_urls: string[];
  featured: boolean;
}

export const PROPERTY_TYPES = ['Квартира', 'Дом', 'Участок', 'Коммерческая'] as const;
export const DEAL_TYPES = ['Продажа', 'Аренда'] as const;
export const STATUS_LABELS: Record<PropertyStatus, string> = {
  published: 'Опубликовано',
  draft: 'Черновик',
  sold: 'Продано',
};
