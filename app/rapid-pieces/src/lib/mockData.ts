import { Seller, PartRequest, Offer, Order, PartQuality, SellerBadge, DeliveryType } from './types';

export const mockSellers: Seller[] = [
  {
    id: 's1', name: 'Auto Pièces Cotonou', location: 'Marché Dantokpa, Cotonou', phone: '+229 97 12 34 56',
    rating: 4.8, totalTransactions: 342, fulfillmentRate: 97, responseRate: 98, returnRate: 2,
    badge: 'Verified Seller', isVerified: true, isBanned: false, brands: ['Toyota', 'Honda', 'Mercedes-Benz'],
    categories: ['Moteur', 'Freins', 'Transmission', 'Filtration'], specialties: ['Moteurs diesels', 'Systèmes de freinage'],
    joinDate: '2024-06-15'
  },
  {
    id: 's2', name: 'Nigeria Auto Parts', location: 'Lagos, Nigeria', phone: '+234 803 456 7890',
    rating: 4.6, totalTransactions: 156, fulfillmentRate: 94, responseRate: 92, returnRate: 4,
    badge: 'Premium Seller', isVerified: true, isBanned: false, brands: ['Toyota', 'Nissan', 'Mitsubishi', 'Isuzu'],
    categories: ['Moteur', 'Transmission', 'Électrique'], specialties: ['Importation', 'Pièces OEM'],
    joinDate: '2024-03-20'
  },
  {
    id: 's3', name: 'Garage Mécanique Générale', location: 'Abomey-Calavi', phone: '+229 96 23 45 67',
    rating: 4.5, totalTransactions: 89, fulfillmentRate: 92, responseRate: 88, returnRate: 3,
    badge: 'Rapid Seller', isVerified: true, isBanned: false, brands: ['Peugeot', 'Renault', 'Volkswagen'],
    categories: ['Direction', 'Suspension', 'Échappement'], specialties: ['Véhicules européens'],
    joinDate: '2024-09-01'
  },
  {
    id: 's4', name: 'Parts Express USA', location: 'Houston, Texas, USA', phone: '+1 713 555 0123',
    rating: 4.9, totalTransactions: 67, fulfillmentRate: 99, responseRate: 95, returnRate: 1,
    badge: 'Top Seller', isVerified: true, isBanned: false, brands: ['Toyota', 'Honda', 'Ford', 'Chevrolet', 'BMW'],
    categories: ['Moteur', 'Électrique', 'Transmission', 'Climatisation'], specialties: ['Pièces OEM rares', 'Pièces électroniques'],
    joinDate: '2024-01-10'
  },
  {
    id: 's5', name: 'Sahel Auto', location: 'Parakou', phone: '+229 95 34 56 78',
    rating: 4.2, totalTransactions: 45, fulfillmentRate: 88, responseRate: 85, returnRate: 5,
    badge: 'Rapid Seller', isVerified: false, isBanned: false, brands: ['Toyota', 'Mercedes-Benz'],
    categories: ['Moteur', 'Filtration'], specialties: ['Véhicules utilitaires'],
    joinDate: '2024-11-15'
  },
];

export const mockRequests: PartRequest[] = [
  {
    id: 'r1', vehicle: { brand: 'Toyota', model: 'Corolla', year: 2018, engine: '1.8 essence' },
    partName: 'Plaquettes de frein avant', oemReference: '04465-02200',
    description: 'Je recherche des plaquettes de frein avant pour Toyota Corolla 2018. OEM de préférence.',
    quantity: 1, quality: 'OEM', location: 'Cotonou', budgetIndicative: 65000,
    status: 'open', createdAt: '2025-01-15T08:30:00', responsesCount: 3, buyerId: 'b1'
  },
  {
    id: 'r2', vehicle: { brand: 'Toyota', model: 'Hilux', year: 2018, engine: '2.4 Diesel' },
    partName: 'Alternateur', description: 'Alternateur neuf ou reconditionné pour Hilux 2018',
    quantity: 1, location: 'Abomey-Calavi', budgetIndicative: 180000,
    status: 'open', createdAt: '2025-01-14T14:00:00', responsesCount: 4, buyerId: 'b2'
  },
  {
    id: 'r3', vehicle: { brand: 'Mercedes-Benz', model: 'Classe C', year: 2015, engine: '220d' },
    partName: 'Kit d\'embrayage complet', description: 'Kit embrayage complet pour C220d W205',
    quantity: 1, quality: 'Premium Aftermarket', location: 'Cotonou',
    status: 'open', createdAt: '2025-01-13T10:15:00', responsesCount: 2, buyerId: 'b3'
  },
  {
    id: 'r4', vehicle: { brand: 'Honda', model: 'CR-V', year: 2019, engine: '1.5 Turbo' },
    partName: 'Filtre à huile', description: 'Filtre à huile pour Honda CR-V 2019 1.5T',
    quantity: 2, location: 'Porto-Novo',
    status: 'matched', createdAt: '2025-01-12T09:00:00', responsesCount: 5, buyerId: 'b1'
  },
];

// Cahier V2 - Point 49: Ajout des conditions de paiement
export const mockOffers: Offer[] = [
  // Offres pour la demande plaquettes de frein Corolla 2018
  { id: 'o1', requestId: 'r1', sellerId: 's1', sellerName: 'Auto Pièces Cotonou', sellerBadge: 'Verified Seller', sellerScore: 4.8, partName: 'Plaquettes de frein avant OEM', quality: 'OEM', price: 62000, currency: 'FCFA', availability: 'immediate', deliveryType: 'RAPID_NOW', deliveryTime: '1 heure', warranty: '3 mois', rapidScore: 92, paymentCondition: 'rapid_pieces', status: 'pending', round: 1, lastActor: 'seller' },
  { id: 'o2', requestId: 'r1', sellerId: 's3', sellerName: 'Garage Mécanique Générale', sellerBadge: 'Rapid Seller', sellerScore: 4.5, partName: 'Plaquettes frein avant premium', quality: 'Premium Aftermarket', price: 45000, currency: 'FCFA', availability: 'immediate', deliveryType: 'RAPID_NOW', deliveryTime: '2 heures', warranty: '6 mois', rapidScore: 78, paymentCondition: 'on_delivery', status: 'pending', round: 1, lastActor: 'seller' },
  { id: 'o3', requestId: 'r1', sellerId: 's2', sellerName: 'Nigeria Auto Parts', sellerBadge: 'Premium Seller', sellerScore: 4.6, partName: 'Plaquettes OEM Toyota', quality: 'OEM', price: 38000, currency: 'FCFA', availability: '48h', deliveryType: 'RAPID_NIGERIA', deliveryTime: '3-5 jours', rapidScore: 71, paymentCondition: 'rapid_pieces', status: 'pending', round: 1, lastActor: 'seller' },

  // Offres pour alternateur Hilux 2018
  { id: 'o4', requestId: 'r2', sellerId: 's1', sellerName: 'Auto Pièces Cotonou', sellerBadge: 'Verified Seller', sellerScore: 4.8, partName: 'Alternateur Toyota Hilux OEM', quality: 'Genuine', price: 180000, currency: 'FCFA', availability: 'immediate', deliveryType: 'RAPID_NOW', deliveryTime: '1 heure', warranty: '6 mois', rapidScore: 88, paymentCondition: 'rapid_pieces', status: 'pending', round: 1, lastActor: 'seller' },
  { id: 'o5', requestId: 'r2', sellerId: 's2', sellerName: 'Nigeria Auto Parts', sellerBadge: 'Premium Seller', sellerScore: 4.6, partName: 'Alternateur Toyota 2.4D', quality: 'Premium Aftermarket', price: 120000, currency: 'FCFA', availability: '48h', deliveryType: 'RAPID_NIGERIA', deliveryTime: '3 jours', warranty: '3 mois', rapidScore: 82, paymentCondition: 'on_delivery', status: 'pending', round: 1, lastActor: 'seller' },
  { id: 'o6', requestId: 'r2', sellerId: 's4', sellerName: 'Parts Express USA', sellerBadge: 'Top Seller', sellerScore: 4.9, partName: 'Alternator OEM Toyota Hilux', quality: 'OEM', price: 95000, currency: 'FCFA', availability: '7-10days', deliveryType: 'RAPID_USA', deliveryTime: '7-10 jours', warranty: '12 mois', rapidScore: 75, paymentCondition: 'rapid_pieces', status: 'pending', round: 1, lastActor: 'seller' },
  { id: 'o7', requestId: 'r2', sellerId: 's5', sellerName: 'Sahel Auto', sellerBadge: 'Rapid Seller', sellerScore: 4.2, partName: 'Alternateur Premium', quality: 'Premium Aftermarket', price: 85000, currency: 'FCFA', availability: '24h', deliveryType: 'RAPID_CITY', deliveryTime: '24 heures', warranty: '2 mois', rapidScore: 65, paymentCondition: 'on_delivery', status: 'pending', round: 1, lastActor: 'seller' },
];

// Cahier V2 - Point 51: Nouveaux statuts de commande
export const mockOrders: Order[] = [
  { id: 'ord1', requestId: 'r4', offerId: 'o8', buyerId: 'b1', sellerId: 's1', sellerName: 'Auto Pièces Cotonou', partName: 'Filtre à huile Honda CR-V', vehicle: { brand: 'Honda', model: 'CR-V', year: 2019, engine: '1.5 Turbo' }, price: 25000, currency: 'XOF', deliveryType: 'RAPID_NOW', status: 'delivered', createdAt: '2025-01-12T11:00:00', estimatedDelivery: '2025-01-12T13:00:00', escrowStatus: 'released' },
  { id: 'ord2', requestId: 'r1', offerId: 'o1', buyerId: 'b1', sellerId: 's1', sellerName: 'Auto Pièces Cotonou', partName: 'Plaquettes de frein avant OEM', vehicle: { brand: 'Toyota', model: 'Corolla', year: 2018, engine: '1.8 essence' }, price: 62000, currency: 'XOF', deliveryType: 'RAPID_NOW', status: 'shipping', createdAt: '2025-01-15T09:00:00', estimatedDelivery: '2025-01-15T10:00:00', escrowStatus: 'held' },
  { id: 'ord3', requestId: 'r2', offerId: 'o5', buyerId: 'b2', sellerId: 's2', sellerName: 'Nigeria Auto Parts', partName: 'Alternateur Toyota 2.4D', vehicle: { brand: 'Toyota', model: 'Hilux', year: 2018, engine: '2.4 Diesel' }, price: 120000, currency: 'NGN', deliveryType: 'RAPID_NIGERIA', status: 'paid', createdAt: '2025-01-14T15:30:00', estimatedDelivery: '2025-01-17T15:30:00', escrowStatus: 'held' },
];

// KPI Dashboard Data
export const dashboardKPIs = {
  totalSellers: 127,
  activeSellers: 89,
  totalBuyers: 342,
  activeBuyers: 156,
  requestsThisMonth: 234,
  avgOffersPerRequest: 3.2,
  conversionRate: 68,
  gmvThisMonth: 12500000,
  avgCommission: 5.5,
  avgTimeToFirstOffer: '23 min',
  avgTimeToDelivery: '4.2h',
  availabilityRate: 85,
  cancellationRate: 3,
  returnRate: 2,
  avgDeliveryDelay: '3.8h',
  nigerianOrders: 18,
  usaOrders: 5,
  avgBasket: 105000,
};

// Vehicle history for Rapid Garage
export const vehicleHistory = {
  vehicle: { brand: 'Toyota', model: 'Corolla', year: 2018, engine: '1.8 essence' },
  history: [
    { part: 'Huile moteur', date: '2024-11-15', price: 15000, seller: 'Auto Pièces Cotonou' },
    { part: 'Filtre à huile', date: '2024-11-15', price: 8000, seller: 'Auto Pièces Cotonou' },
    { part: 'Plaquettes frein avant', date: '2024-08-20', price: 55000, seller: 'Nigeria Auto Parts' },
    { part: 'Amortisseurs avant', date: '2024-05-10', price: 120000, seller: 'Parts Express USA' },
    { part: 'Batterie', date: '2024-02-28', price: 45000, seller: 'Sahel Auto' },
  ]
};
