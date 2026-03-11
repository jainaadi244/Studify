import { LucideIcon } from 'lucide-react';

export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  price: number;
  image: string;
  ticketsSold?: number;
  views?: number;
  description?: string;
  category?: string;
  capacity?: number;
}

export interface PurchasedTicket {
  id: string;
  event: Event;
  purchaseDate: string;
  qrCode: string;
  status?: 'valid' | 'used';
}

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  isFeature: boolean;
}
