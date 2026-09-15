// Types pour Rapid Pièces

export type UserRole = 'buyer' | 'seller' | 'admin';

export type PartQuality = 'OEM' | 'Genuine' | 'Premium Aftermarket' | 'Standard Aftermarket';

// Cahier V2 - Nouvelle section État : pièce d'occasion ou neuve
export type PartCondition = 'used' | 'new';

export type DeliveryType =
  | 'RAPID_NOW' | 'RAPID_CITY' | 'RAPID_NIGERIA' | 'RAPID_USA'
  | 'RAPID_CHINA' | 'RAPID_DUBAI' | 'RAPID_TURKEY' | 'RAPID_FRANCE' | 'RAPID_GERMANY' | 'RAPID_ENGLAND';

export type SellerBadge = 'New Seller' | 'Rapid Seller' | 'Verified Seller' | 'Premium Seller' | 'Top Seller';

// Cahier V2 - Point 51: Statut complet d'une commande
export type OrderStatus = 'payment_pending' | 'paid' | 'shipping' | 'delivered' | 'completed' | 'cancelled';

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
  partCondition?: 'used' | 'new'; // Cahier V2 - Nouvelle section État : pièce d'occasion ou neuve
  partPosition?: string; // Position de la pièce (cahier §7, item 11)
  location: string;
  budgetIndicative?: number;
  specificBrand?: string; // Cahier V2 - Point 6: Marque spécifique optionnelle
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

export function requestSubtitleLine(r: PartRequest, { showMissing = false }: { showMissing?: boolean } = {}): string {
  // Un champ non rempli n'affiche plus "Non renseigné" — il est simplement omis.
  void showMissing;
  const missing = null;
  return [
    r.vehicle.cylinders ? `${r.vehicle.cylinders} cylindres` : missing,
    r.vehicle.engine || missing,
    r.fuel || missing,
    r.condition || missing,
    r.vehicle.vin || missing,
    r.note || missing,
    r.partPosition || missing,
    r.quality || missing,
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
  paymentCondition?: 'rapid_pieces' | 'in_store' | 'on_delivery'; // Cahier V2 - Point 49
  negotiable?: boolean; // Cahier V2 - Point 32 : offre ouverte (true, défaut) ou fermée (false) à la négociation
  condition?: 'used' | 'new'; // Cahier V2 - Nouvelle section État : pièce d'occasion ou neuve
  // Cahier V2 - Point 1 : offres locales / internationales. Calculé côté DB par un
  // trigger à partir de deliveryType (016_corrections_v2_db.sql) — optionnel ici
  // car jamais fourni à la création, seulement relu depuis la base.
  isInternational?: boolean;
  // Cahier §9 : offres et contre-offres.
  status: 'pending' | 'countered' | 'accepted' | 'rejected' | 'completed' | 'expired'; // Cahier V2 - Points 2/47
  round: number;
  lastActor: 'buyer' | 'seller';
}

// Cahier §9 : limite de négociation retenue (3 propositions max dans la chaîne).
export const MAX_NEGOTIATION_ROUNDS = 3;

// Cahier V2 : plus de saisie libre du montant en contre-offre — l'acheteur et
// le vendeur choisissent un % de réduction (5 à 35, par pas de 5) appliqué au
// prix le plus récent de la négociation. Garantit par construction que
// chaque round est strictement inférieur au précédent.
export const COUNTER_OFFER_PERCENTAGES = [5, 10, 15, 20, 25, 30, 35];

export function applyCounterOfferPercentage(currentPrice: number, percentage: number): number {
  return Math.round(currentPrice * (1 - percentage / 100));
}
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
  isBanned: boolean;
  // Cahier V2 - Point 13 (assoupli) : avertissement automatique (rating ≤ 3
  // avec assez d'avis) — distinct d'une suspension, laissée à la décision de
  // l'admin plutôt qu'automatique.
  hasWarning?: boolean;
  warningReason?: string;
  warningSeverity?: 'warning' | 'critical';
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
  paymentNumber?: string;
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
  // Cahier V2 - Point 26 : devise du vendeur au moment de la commande, copiée
  // depuis l'offre acceptée (voir Offer.currency) plutôt que "FCFA" fixe.
  currency: string;
  deliveryType: DeliveryType;
  status: OrderStatus;
  createdAt: string;
  estimatedDelivery: string;
  escrowStatus: 'held' | 'released' | 'refunded';
  // Cahier V2 - Point 7 : le VIN/numéro de châssis est obligatoire au paiement
  // au-delà de 50 000 FCFA (imposé aussi côté DB par un trigger sur `orders`).
  vin?: string;
}

export interface DeliveryOption {
  type: DeliveryType;
  label: string;
  description: string;
  timeframe: string;
  icon: string;
}

export const DELIVERY_OPTIONS: DeliveryOption[] = [
  { type: 'RAPID_NOW', label: 'RAPID PIECES', description: 'Disponible chez un vendeur local', timeframe: 'Immédiat', icon: 'Zap' },
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

// Cahier V2 - Point 33 : "Rapid Now" renommé "Rapid Pièces" — plusieurs écrans
// affichaient encore `deliveryType.replace('_',' ')`, qui montre la valeur
// brute de l'enum ('RAPID NOW') plutôt que le vrai libellé.
export function deliveryLabel(type: DeliveryType): string {
  return DELIVERY_OPTIONS.find((d) => d.type === type)?.label ?? type.replace('_', ' ');
}

export const QUALITY_LEVELS: { value: PartQuality; label: string; description: string; color: string }[] = [
  { value: 'OEM', label: 'FEO', description: 'Fabricant d\'équipement d\'origine', color: '#E63946' },
  { value: 'Genuine', label: 'Authentique', description: 'Pièce distribuée sous la marque constructeur', color: '#1D3557' },
  { value: 'Premium Aftermarket', label: 'Premium', description: 'Pièce de rechange de qualité supérieure', color: '#457B9D' },
  { value: 'Standard Aftermarket', label: 'Standard', description: 'Pièce de rechange standard', color: '#6C757D' },
];

// Brandes populaires au Bénin
export const POPULAR_BRANDS = [
  'Toutes les marques',
  'Toyota', 'Honda', 'Mercedes-Benz', 'BMW', 'Hyundai',
  'Nissan', 'Ford', 'Kia', 'Mazda',
  'Suzuki', 'Mitsubishi', 'Isuzu', 'Land Rover', 'Range Rover',
  'Autre'
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
  'Toutes les pièces',
  'Moteur', 'Freins', 'Transmission', 'Suspension', 'Électrique',
  'Carrosserie', 'Climatisation', 'Échappement', 'Direction', 'Filtration',
  'Éclairage', 'Accessoires', 'Pneumatique', 'Système de refroidissement',
  'Autre'
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
  // Cahier V2 - Point 26 : devise locale (code ISO 4217), pour afficher le
  // bon libellé de prix selon le pays du vendeur/acheteur au lieu de
  // toujours afficher "FCFA".
  currency: string;
}

// Pays où Rapid Pièces opère localement (marketplace + réseau de vendeurs), d'après la brochure officielle.
export const OPERATING_COUNTRIES: CountryLocations[] = [
  { country: 'Bénin', cities: BENIN_LOCATIONS, callingCode: '+229', currency: 'XOF' },
  { country: 'Nigeria', cities: ['Lagos', 'Abuja', 'Ibadan'], callingCode: '+234', currency: 'NGN' },
  { country: 'Mali', cities: ['Bamako', 'Sikasso'], callingCode: '+223', currency: 'XOF' },
  { country: 'Togo', cities: ['Lomé', 'Kara', 'Sokodé'], callingCode: '+228', currency: 'XOF' },
  { country: 'Ghana', cities: ['Accra', 'Kumasi'], callingCode: '+233', currency: 'GHS' },
  { country: 'Burkina Faso', cities: ['Ouagadougou', 'Bobo-Dioulasso'], callingCode: '+226', currency: 'XOF' },
  { country: "Côte d'Ivoire", cities: ['Abidjan', 'Yamoussoukro', 'Bouaké'], callingCode: '+225', currency: 'XOF' },
  { country: 'Sénégal', cities: ['Dakar', 'Thiès'], callingCode: '+221', currency: 'XOF' },
  { country: 'Guinée', cities: ['Conakry'], callingCode: '+224', currency: 'GNF' },
  { country: 'Niger', cities: ['Niamey'], callingCode: '+227', currency: 'XOF' },
];

export function callingCodeForCountry(country: string): string | undefined {
  return OPERATING_COUNTRIES.find((c) => c.country === country)?.callingCode;
}

export function currencyForCountry(country: string | undefined): string {
  return OPERATING_COUNTRIES.find((c) => c.country === country)?.currency ?? 'XOF';
}

// Cahier V2 - Point 26 : devise par pays (FCFA pour la zone XOF, Naira pour
// le Nigeria, Cedi pour le Ghana...) au lieu d'afficher "FCFA" partout.
// Libellé affiché après le montant, gardant "FCFA" pour XOF car c'est le
// nom d'usage courant (le code ISO seul ne parlerait pas aux utilisateurs).
const CURRENCY_LABELS: Record<string, string> = {
  XOF: 'FCFA',
  NGN: 'Naira',
  GHS: 'Cedi',
  GNF: 'FG',
};

export function currencyLabel(currency = 'XOF'): string {
  return CURRENCY_LABELS[currency] ?? currency;
}

export function formatPrice(amount: number, currency = 'XOF'): string {
  return `${amount.toLocaleString('fr-FR')} ${currencyLabel(currency)}`;
}

// Cahier V2 - Point 28 : statut de compte affiché à l'identique chez l'admin
// et chez le vendeur — un seul mapping pour éviter que les deux écrans
// divergent (ex: l'admin gérait déjà isBanned, mais pas la page vendeur).
export function sellerAccountStatus(seller: Pick<Seller, 'isVerified' | 'isBanned'> | undefined): {
  label: string;
  colorClass: string;
} {
  if (seller?.isBanned) return { label: 'Compte désactivé', colorClass: 'text-red-600' };
  if (!seller?.isVerified) return { label: 'Compte en attente de validation', colorClass: 'text-amber-600' };
  return { label: 'Compte actif', colorClass: 'text-emerald-600' };
}

// Cahier V2 - Points 11/12/13/41 : avis acheteur sur un vendeur, après
// livraison d'une commande. Alimente sellers.rating (moyenne réelle).
export interface SellerReview {
  id: string;
  orderId: string;
  sellerId: string;
  buyerId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

// Cahier V2 - Point 45 : historique complet d'une négociation (table
// `offer_negotiation_history`, migration 018 — alimentée automatiquement par
// un trigger à chaque changement de prix sur `offers`).
export interface NegotiationEvent {
  id: string;
  offerId: string;
  price: number;
  actor: 'buyer' | 'seller';
  createdAt: string;
  note?: string;
}

// Cahier V2 - Point 4 : notifications système (ex. expiration de demande),
// table `notifications` (migration 016), distinctes des offres/demandes déjà
// utilisées ailleurs pour construire la cloche.
export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'request_expired' | 'offer_received' | 'order_update' | 'system';
  isRead: boolean;
  createdAt: string;
}

// Admin Settings types
export interface AdminSetting {
  id: string;
  key: string;
  value: string;
  description: string;
  category: string;
  updated_at: string;
  updated_by?: string;
}
