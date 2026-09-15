// Types pour Rapid Pièces

export type UserRole = 'buyer' | 'seller' | 'admin';

export type PartQuality = 'OEM' | 'Genuine' | 'Premium Aftermarket' | 'Standard Aftermarket' | 'Used' | 'Reconditioned';

export type DeliveryType =
  | 'RAPID_NOW' | 'RAPID_CITY' | 'RAPID_NIGERIA' | 'RAPID_USA'
  | 'RAPID_CHINA' | 'RAPID_DUBAI' | 'RAPID_TURKEY' | 'RAPID_FRANCE' | 'RAPID_GERMANY' | 'RAPID_ENGLAND';

export type SellerBadge = 'New Seller' | 'Rapid Seller' | 'Verified Seller' | 'Premium Seller' | 'Top Seller';

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'in_transit' | 'delivered' | 'completed' | 'cancelled';

export interface Vehicle {
  brand: string;
  model: string;
  year: number;
  engine: string; // Type de moteur (cahier §7, item 6)
  vin?: string;
  cylinders?: number; // Nombre de cylindres (cahier §7, item 5)
}

export type FuelType = 'Essence' | 'Diesel' | 'Hybride' | 'Électrique' | 'GPL';
export const FUEL_TYPES: FuelType[] = ['Essence', 'Diesel', 'Hybride', 'Électrique', 'GPL'];

export interface PartRequest {
  id: string;
  vehicle: Vehicle;
  partName: string;
  oemReference?: string;
  photo?: string;
  description: string;
  quantity: number;
  quality?: PartQuality; // Qualité de la pièce (cahier §7, item 12)
  fuel?: FuelType; // Carburant (cahier §7, item 7)
  condition?: 'Nouveau' | 'Ancien'; // Condition de la pièce (cahier §7, item 8)
  note?: string; // Note (cahier §7, item 10)
  partPosition?: string; // Position de la pièce (cahier §7, item 11)
  location: string;
  budgetIndicative?: number;
  status: 'draft' | 'open' | 'matched' | 'ordered' | 'completed' | 'expired';
  createdAt: string;
  responsesCount: number;
  buyerId: string;
}

// Cahier §7 : le nom d'une demande est construit automatiquement à partir de 12
// informations séparées par « | ». Les 4 premières (pièce/marque/modèle/année)
// forment le titre principal ; le reste est un sous-titre secondaire. Centralisé
// ici pour que web et mobile affichent exactement la même chose partout.
export function requestTitleLine(r: Pick<PartRequest, 'partName' | 'vehicle'>): string {
  return [r.partName, r.vehicle.brand, r.vehicle.model, String(r.vehicle.year)].join(' | ');
}

export function requestSubtitleLine(r: PartRequest): string {
  return [
    r.vehicle.cylinders ? `${r.vehicle.cylinders} cylindres` : null,
    r.vehicle.engine || null,
    r.fuel || null,
    r.condition || null,
    r.vehicle.vin || null,
    r.note || null,
    r.partPosition || null,
    r.quality || null,
  ].filter(Boolean).join(' | ');
}

export interface Offer {
  id: string;
  requestId: string;
  sellerId: string;
  sellerName: string;
  sellerBadge: SellerBadge;
  sellerScore: number;
  partName: string;
  quality: PartQuality;
  price: number;
  currency: string;
  availability: 'immediate' | '24h' | '48h' | '3-5days' | '7-10days' | 'import';
  deliveryType: DeliveryType;
  deliveryTime: string;
  warranty?: string;
  rapidScore: number;
  description?: string;
  // Cahier §9 : offres et contre-offres.
  status: 'pending' | 'countered' | 'accepted' | 'rejected';
  round: number;
  lastActor: 'buyer' | 'seller';
}

// Cahier §9 : limite de négociation retenue (3 propositions max dans la chaîne).
export const MAX_NEGOTIATION_ROUNDS = 3;
// Cahier §9 : l'acheteur peut choisir au maximum 3 vendeurs avec lesquels échanger.
export const MAX_ACTIVE_SELLERS_PER_REQUEST = 3;

export interface Seller {
  id: string;
  name: string;
  location: string;
  phone: string;
  rating: number;
  totalTransactions: number;
  fulfillmentRate: number;
  responseRate: number;
  returnRate: number;
  badge: SellerBadge;
  isVerified: boolean;
  brands: string[];
  categories: string[];
  specialties: string[];
  joinDate: string;
  country?: string;
  address?: string;
  phoneSecondary?: string;
  conditionTypes?: string[];
  stockLevel?: 'Grand' | 'Moyen' | 'Petit';
  paymentMethods?: string[];
  deliveryAvailable?: boolean;
  openingHours?: string;
  note?: string;
}

export interface Buyer {
  id: string;
  name: string;
  type: 'individual' | 'mechanic' | 'garage' | 'fleet' | 'business';
  location: string;
  phone: string;
  rapidPoints: number;
  totalOrders: number;
  vehicles: Vehicle[];
}

export interface Order {
  id: string;
  requestId: string;
  offerId: string;
  buyerId: string;
  sellerId: string;
  sellerName: string;
  partName: string;
  vehicle: Vehicle;
  price: number;
  deliveryType: DeliveryType;
  status: OrderStatus;
  createdAt: string;
  estimatedDelivery: string;
  escrowStatus: 'held' | 'released' | 'refunded';
}

export interface DeliveryOption {
  type: DeliveryType;
  label: string;
  description: string;
  timeframe: string;
  icon: string;
}

export const DELIVERY_OPTIONS: DeliveryOption[] = [
  { type: 'RAPID_NOW', label: 'RAPID PIECES', description: 'Disponible chez un vendeur local', timeframe: '< 1 heure', icon: 'Zap' },
  { type: 'RAPID_CITY', label: 'RAPID CITY', description: 'Disponible à Cotonou ou principales villes', timeframe: '< 2 heures', icon: 'MapPin' },
  { type: 'RAPID_NIGERIA', label: 'RAPID NIGERIA', description: 'Sourcé au Nigeria', timeframe: '48 heures', icon: 'Globe' },
  { type: 'RAPID_USA', label: 'RAPID USA', description: 'Sourcé aux États-Unis', timeframe: '7 jours', icon: 'Globe' },
  { type: 'RAPID_CHINA', label: 'RAPID CHINA', description: 'Sourcé en Chine', timeframe: '10-14 jours', icon: 'Globe' },
  { type: 'RAPID_DUBAI', label: 'RAPID DUBAI', description: 'Sourcé à Dubaï', timeframe: '5-7 jours', icon: 'Globe' },
  { type: 'RAPID_TURKEY', label: 'RAPID TURQUIE', description: 'Sourcé en Turquie', timeframe: '7-10 jours', icon: 'Globe' },
  { type: 'RAPID_FRANCE', label: 'RAPID FRANCE', description: 'Sourcé en France', timeframe: '7-10 jours', icon: 'Globe' },
  { type: 'RAPID_GERMANY', label: 'RAPID ALLEMAGNE', description: 'Sourcé en Allemagne', timeframe: '7-10 jours', icon: 'Globe' },
  { type: 'RAPID_ENGLAND', label: 'RAPID ANGLETERRE', description: 'Sourcé en Angleterre', timeframe: '7-10 jours', icon: 'Globe' },
];

export const QUALITY_LEVELS: { value: PartQuality; label: string; description: string; color: string }[] = [
  { value: 'OEM', label: 'OEM', description: 'Original Equipment Manufacturer', color: '#E63946' },
  { value: 'Genuine', label: 'Genuine', description: 'Pièce distribuée sous la marque constructeur', color: '#1D3557' },
  { value: 'Premium Aftermarket', label: 'Premium', description: 'Fabricant reconnu', color: '#457B9D' },
  { value: 'Standard Aftermarket', label: 'Standard', description: 'Fabricant alternatif', color: '#6C757D' },
  { value: 'Used', label: 'Occasion', description: "Pièce d'occasion", color: '#F4A261' },
  { value: 'Reconditioned', label: 'Reconditionné', description: 'Pièce remise en état', color: '#2D6A4F' },
];

// Brandes populaires au Bénin
export const POPULAR_BRANDS = [
  'Toyota', 'Honda', 'Mercedes-Benz', 'BMW', 'Hyundai',
  'Nissan', 'Ford', 'Kia', 'Mazda',
  'Suzuki', 'Mitsubishi', 'Isuzu', 'Land Rover', 'Range Rover'
];

// Cahier des modifications, section 4 : attributs de la boutique vendeur.
export const CONDITION_TYPES = ['Nouveau', 'Ancien'] as const;
export const STOCK_LEVELS = ['Grand', 'Moyen', 'Petit'] as const;
export const PAYMENT_METHODS = ['Cash', 'Mobile', 'Banque'] as const;

// Cahier des modifications, section 8 : type de compte acheteur — seuls les
// particuliers peuvent enregistrer des véhicules (garages/mécaniciens/
// entreprises voient passer trop de véhicules différents pour que ce soit pertinent).
export const BUYER_TYPES: { value: 'individual' | 'mechanic' | 'garage' | 'business'; label: string }[] = [
  { value: 'individual', label: 'Particulier' },
  { value: 'mechanic', label: 'Mécanicien' },
  { value: 'garage', label: 'Garage' },
  { value: 'business', label: 'Entreprise' },
];

export const POPULAR_CATEGORIES = [
  'Moteur', 'Freins', 'Transmission', 'Suspension', 'Électrique',
  'Carrosserie', 'Climatisation', 'Échappement', 'Direction', 'Filtration',
  'Éclairage', 'Accessoires', 'Pneumatique', 'Système de refroidissement'
];

export const BENIN_LOCATIONS = [
  'Cotonou', 'Abomey-Calavi', 'Porto-Novo', 'Parakou', 'Bohicon',
  'Ouidah', 'Kandi', 'Natitingou', 'Abomey', 'Lokossa'
];

export interface CountryLocations {
  country: string;
  cities: string[];
  // Indicatif téléphonique international (cahier section 1 : affiché automatiquement à l'inscription).
  callingCode: string;
}

// Pays où Rapid Pièces opère localement (marketplace + réseau de vendeurs), d'après la brochure officielle.
export const OPERATING_COUNTRIES: CountryLocations[] = [
  { country: 'Bénin', cities: BENIN_LOCATIONS, callingCode: '+229' },
  { country: 'Nigeria', cities: ['Lagos', 'Abuja', 'Ibadan'], callingCode: '+234' },
  { country: 'Mali', cities: ['Bamako', 'Sikasso'], callingCode: '+223' },
  { country: 'Togo', cities: ['Lomé', 'Kara', 'Sokodé'], callingCode: '+228' },
  { country: 'Ghana', cities: ['Accra', 'Kumasi'], callingCode: '+233' },
  { country: 'Burkina Faso', cities: ['Ouagadougou', 'Bobo-Dioulasso'], callingCode: '+226' },
  { country: "Côte d'Ivoire", cities: ['Abidjan', 'Yamoussoukro', 'Bouaké'], callingCode: '+225' },
  { country: 'Sénégal', cities: ['Dakar', 'Thiès'], callingCode: '+221' },
  { country: 'Guinée', cities: ['Conakry'], callingCode: '+224' },
  { country: 'Niger', cities: ['Niamey'], callingCode: '+227' },
];

export function callingCodeForCountry(country: string): string | undefined {
  return OPERATING_COUNTRIES.find((c) => c.country === country)?.callingCode;
}
