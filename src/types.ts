export interface CarCategory {
  id: string;
  name: string;
  shortDesc: string;
  iconName: string;
  itemCount: string;
  popularParts: string[];
  imagePlaceholderColor: string;
}

export interface CompatiblePart {
  id: string;
  name: string;
  brand: string;
  brandLogo?: string;
  reference: string;
  category: string;
  price: number;
  originalPrice?: number;
  inStock: boolean;
  deliveryTime: string;
  rating: number;
  reviewsCount: number;
  image: string;
  specifications: string[];
}

export interface DemoVehicle {
  plate: string;
  brand: string;
  model: string;
  version: string;
  year: number;
  fuel: string;
  power: string;
  compatibleParts: CompatiblePart[];
}

export interface AppFeature {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  icon: string;
  badge: string;
  screenType: 'home' | 'scanner' | 'catalog' | 'tracking';
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  vehicle: string;
  rating: number;
  text: string;
  verified: boolean;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'app' | 'compatibilite' | 'livraison' | 'paiement';
}

export interface BrandPartner {
  name: string;
  category: string;
  country: string;
}
