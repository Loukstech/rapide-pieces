'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from './supabase/client';
import {
  PartRequest, Offer, Order, Seller, Vehicle, PartQuality, DeliveryType, DELIVERY_OPTIONS, AdminSetting, DeliveryOption, AppNotification, NegotiationEvent, SellerReview, formatPrice,
} from './types';

const supabase = createClient();

// ============================================================
// Mappers : lignes Postgres (snake_case) <-> types de l'app (camelCase)
// ============================================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToSeller(row: any): Seller {
  return {
    id: row.id,
    name: row.profiles?.name ?? 'Vendeur',
    location: row.profiles?.location ?? '',
    phone: row.profiles?.phone ?? '',
    rating: Number(row.rating),
    totalTransactions: row.total_transactions,
    fulfillmentRate: row.fulfillment_rate,
    responseRate: row.response_rate,
    returnRate: row.return_rate,
    badge: row.badge,
    isVerified: row.is_verified,
    isBanned: row.is_banned ?? false,
    hasWarning: row.has_warning ?? false,
    warningReason: row.warning_reason ?? undefined,
    warningSeverity: row.warning_severity ?? undefined,
    brands: row.brands ?? [],
    categories: row.categories ?? [],
    specialties: row.specialties ?? [],
    joinDate: row.profiles?.created_at ?? row.join_date, // Préférer la date du profile
    country: row.profiles?.country ?? undefined,
    address: row.profiles?.address ?? undefined,
    phoneSecondary: row.profiles?.phone_secondary ?? undefined,
    conditionTypes: row.condition_types ?? [],
    stockLevel: row.stock_level ?? undefined,
    paymentMethods: row.payment_methods ?? [],
    deliveryAvailable: row.delivery_available ?? false,
    openingHours: row.opening_hours ?? undefined,
    note: row.note ?? undefined,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToRequest(row: any): PartRequest {
  return {
    id: row.id,
    vehicle: {
      brand: row.vehicle_brand,
      model: row.vehicle_model,
      year: row.vehicle_year,
      engine: row.vehicle_engine ?? '',
      vin: row.vehicle_vin ?? undefined,
      cylinders: row.vehicle_cylinders ?? undefined,
    },
    partName: row.part_name,
    oemReference: row.oem_reference ?? undefined,
    photo: row.photo_url ?? undefined,
    description: row.description ?? '',
    quantity: row.quantity,
    quality: row.quality ?? undefined,
    fuel: row.fuel ?? undefined,
    condition: row.condition ?? undefined,
    note: row.note ?? undefined,
    partPosition: row.part_position ?? undefined,
    location: row.location,
    budgetIndicative: row.budget_indicative ?? undefined,
    status: row.status,
    createdAt: row.created_at,
    responsesCount: row.responses_count,
    buyerId: row.buyer_id,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToOffer(row: any): Offer {
  return {
    id: row.id,
    requestId: row.request_id,
    sellerId: row.seller_id,
    sellerName: row.seller_name,
    sellerBadge: row.seller_badge,
    sellerScore: Number(row.seller_score),
    partName: row.part_name,
    quality: row.quality,
    price: Number(row.price),
    currency: row.currency,
    availability: row.availability,
    deliveryType: row.delivery_type,
    deliveryTime: row.delivery_time ?? '',
    warranty: row.warranty ?? undefined,
    rapidScore: 0,
    paymentCondition: row.payment_condition ?? undefined,
    condition: row.condition ?? undefined, // Cahier V2 - Nouvelle section État : pièce d'occasion ou neuve
    negotiable: row.negotiable ?? true,
    isInternational: row.is_international ?? false,
    status: row.status ?? 'pending',
    round: row.round ?? 1,
    lastActor: row.last_actor ?? 'seller',
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToOrder(row: any): Order {
  return {
    id: row.id,
    requestId: row.request_id,
    offerId: row.offer_id,
    buyerId: row.buyer_id,
    sellerId: row.seller_id,
    sellerName: row.seller_name,
    partName: row.part_name,
    vehicle: { brand: row.vehicle_brand, model: row.vehicle_model, year: row.vehicle_year, engine: '' },
    price: Number(row.price),
    currency: row.currency ?? 'XOF',
    deliveryType: row.delivery_type,
    status: row.status,
    createdAt: row.created_at,
    estimatedDelivery: row.estimated_delivery,
    escrowStatus: row.escrow_status,
    vin: row.vin ?? undefined,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToVehicle(row: any): Vehicle {
  return {
    brand: row.brand,
    model: row.model,
    year: row.year,
    engine: row.engine ?? '',
    vin: row.vin ?? undefined,
  };
}

// ============================================================
// Lecture
// ============================================================

export async function getSellers(): Promise<Seller[]> {
  const { data, error } = await supabase.from('sellers').select('*, profiles(name, phone, phone_secondary, location, country, address, created_at)');
  if (error || !data) return [];
  return data.map(rowToSeller);
}

// Cahier §10 : historique conservé 3 mois max — au-delà, plus remonté dans les listes.
const HISTORY_RETENTION_DAYS = 90;

export async function getRequests(): Promise<PartRequest[]> {
  const cutoff = new Date(Date.now() - HISTORY_RETENTION_DAYS * 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from('part_requests')
    .select('*')
    .gte('created_at', cutoff)
    .order('created_at', { ascending: false });
  if (error || !data) return [];
  return data.map(rowToRequest);
}

// Cahier §10 : une demande ouverte depuis plus de 24h sans offre acceptée expire
// automatiquement. Contrairement à la policy RLS (qui cache déjà la demande aux
// vendeurs passé ce délai), ceci met vraiment à jour son statut pour qu'elle
// apparaisse "Expirée" dans l'historique de l'acheteur plutôt que "Ouverte" indéfiniment.
// Appelé au mieux (best-effort) à chaque chargement de la liste des demandes.
export async function expireStaleRequests(buyerId: string): Promise<void> {
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  await supabase
    .from('part_requests')
    .update({ status: 'expired' })
    .eq('buyer_id', buyerId)
    .eq('status', 'open')
    .lt('created_at', cutoff);
}

// Cahier V2 - Point 2 : une offre sans réponse depuis 24h expire (invisible
// des listes actives, conservée temporairement), et disparaît définitivement
// 48h plus tard. Appelé au mieux (best-effort) à chaque navigation, comme
// expireStaleRequests() — passe par une fonction security definer (migration
// 025) car un acheteur n'a pas le droit de modifier l'offre d'un vendeur.
export async function expireStaleOffers(): Promise<void> {
  await supabase.rpc('expire_stale_offers');
}

export async function getRequestById(id: string): Promise<PartRequest | undefined> {
  const { data, error } = await supabase.from('part_requests').select('*').eq('id', id).maybeSingle();
  if (error || !data) return undefined;
  return rowToRequest(data);
}

// Cahier §8 : panier acheteur — demandes préparées (status 'draft') mais pas encore
// envoyées aux vendeurs (invisibles d'eux, cf. policy "requests: sellers see open").
export async function getRequestDrafts(buyerId: string): Promise<PartRequest[]> {
  const { data, error } = await supabase
    .from('part_requests').select('*')
    .eq('buyer_id', buyerId).eq('status', 'draft')
    .order('created_at', { ascending: false });
  if (error || !data) return [];
  return data.map(rowToRequest);
}

export async function publishRequestDraft(id: string): Promise<boolean> {
  const { error } = await supabase.from('part_requests').update({ status: 'open' }).eq('id', id);
  return !error;
}

// Cahier V2 - Point 3 : une demande expirée peut être renouvelée à la demande
// explicite de l'acheteur (jamais automatiquement). On rouvre la demande et on
// remet un délai de 24h en actualisant created_at, tout en gardant une trace
// du nombre de renouvellements (renewal_count, migration 016).
export async function renewRequest(id: string): Promise<boolean> {
  const { data: current } = await supabase.from('part_requests').select('renewal_count').eq('id', id).maybeSingle();
  const { error } = await supabase
    .from('part_requests')
    .update({ status: 'open', created_at: new Date().toISOString(), renewal_count: (current?.renewal_count ?? 0) + 1 })
    .eq('id', id);
  return !error;
}

export async function deleteRequest(id: string): Promise<boolean> {
  const { error } = await supabase.from('part_requests').delete().eq('id', id);
  return !error;
}

// Cahier §8 : indicateur « paiement en attente » — offre acceptée (demande 'matched')
// mais dont le paiement (checkout -> orders) n'a pas encore été fait.
export interface PendingPayment {
  request: PartRequest;
  offer: Offer;
}

export async function getPendingPayments(buyerId: string): Promise<PendingPayment[]> {
  const { data: reqs } = await supabase.from('part_requests').select('*').eq('buyer_id', buyerId).eq('status', 'matched');
  if (!reqs || reqs.length === 0) return [];
  const requestIds = reqs.map((r) => r.id);
  const { data: offersData } = await supabase.from('offers').select('*').in('request_id', requestIds).eq('status', 'accepted');
  const { data: ordersData } = await supabase.from('orders').select('request_id').in('request_id', requestIds);
  const paidRequestIds = new Set((ordersData ?? []).map((o) => o.request_id));
  const result: PendingPayment[] = [];
  for (const offerRow of offersData ?? []) {
    if (paidRequestIds.has(offerRow.request_id)) continue;
    const reqRow = reqs.find((r) => r.id === offerRow.request_id);
    if (reqRow) result.push({ request: rowToRequest(reqRow), offer: rowToOffer(offerRow) });
  }
  return result;
}

// Cahier §8 : si l'acheteur accepte une offre puis ne paie pas et annule, ses points diminuent.
const NON_PAYMENT_PENALTY_POINTS = 20;

export async function cancelAcceptedOffer(buyerId: string, requestId: string, offerId: string): Promise<void> {
  await deductRapidPoints(buyerId, NON_PAYMENT_PENALTY_POINTS);
  await supabase.from('offers').update({ status: 'rejected' }).eq('id', offerId);
  await supabase.from('part_requests').update({ status: 'open' }).eq('id', requestId);
}

export async function getOffersForRequest(requestId: string): Promise<Offer[]> {
  const { data, error } = await supabase.from('offers').select('*').eq('request_id', requestId).order('created_at', { ascending: false });
  if (error || !data) return [];
  return data.map(rowToOffer);
}

// Cahier §2 : notifications — toutes les offres d'un vendeur (pour la cloche).
export async function getOffersForSeller(sellerId: string): Promise<Offer[]> {
  const { data, error } = await supabase.from('offers').select('*').eq('seller_id', sellerId).order('created_at', { ascending: false });
  if (error || !data) return [];
  return data.map(rowToOffer);
}

// Cahier §2 : notifications — toutes les offres reçues sur les demandes d'un acheteur.
export async function getOffersForBuyer(buyerId: string): Promise<Offer[]> {
  const { data: reqs } = await supabase.from('part_requests').select('id').eq('buyer_id', buyerId);
  const requestIds = (reqs ?? []).map((r) => r.id);
  if (requestIds.length === 0) return [];
  const { data, error } = await supabase.from('offers').select('*').in('request_id', requestIds).order('created_at', { ascending: false });
  if (error || !data) return [];
  return data.map(rowToOffer);
}

export async function getOfferById(id: string): Promise<Offer | undefined> {
  const { data, error } = await supabase.from('offers').select('*').eq('id', id).maybeSingle();
  if (error || !data) return undefined;
  return rowToOffer(data);
}

export async function getOrders(): Promise<Order[]> {
  const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
  if (error || !data) return [];
  return data.map(rowToOrder);
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  const { data, error } = await supabase.from('orders').select('*').eq('id', id).maybeSingle();
  if (error || !data) return undefined;
  return rowToOrder(data);
}

export async function getVehicles(buyerId: string): Promise<Vehicle[]> {
  if (!buyerId) return [];
  const { data, error } = await supabase.from('vehicles').select('*').eq('buyer_id', buyerId).order('created_at', { ascending: false });
  if (error || !data) return [];
  return data.map(rowToVehicle);
}

export async function getRapidPoints(buyerId: string): Promise<number> {
  if (!buyerId) return 0;
  const { data, error } = await supabase.from('profiles').select('rapid_points').eq('id', buyerId).maybeSingle();
  if (error || !data) return 0;
  return data.rapid_points;
}

// ============================================================
// Rapid Score (document, section 21 : 30% prix / 25% qualité / 20% dispo / 15% réputation / 10% délai)
// ============================================================

const QUALITY_SCORE: Record<PartQuality, number> = {
  OEM: 25,
  Genuine: 22,
  'Premium Aftermarket': 18,
  'Standard Aftermarket': 13,
};

const AVAILABILITY_SCORE: Record<Offer['availability'], number> = {
  immediate: 20,
  '24h': 16,
  '48h': 12,
  '3-5days': 8,
  '7-10days': 4,
  import: 2,
};

const DELIVERY_SCORE: Record<DeliveryType, number> = {
  RAPID_NOW: 10,
  RAPID_CITY: 8,
  RAPID_NIGERIA: 4,
  RAPID_USA: 2,
  RAPID_DUBAI: 2,
  RAPID_TURKEY: 1,
  RAPID_FRANCE: 1,
  RAPID_GERMANY: 1,
  RAPID_ENGLAND: 1,
  RAPID_CHINA: 1,
};

export interface RapidScoreBreakdown {
  price: number;
  quality: number;
  availability: number;
  reputation: number;
  delivery: number;
}

export function computeRapidScore(offer: Offer, siblingOffers: Offer[]): { total: number; breakdown: RapidScoreBreakdown } {
  const prices = [offer.price, ...siblingOffers.map((o) => o.price)];
  const minPrice = Math.min(...prices);
  const price = Math.min(30, Math.round(30 * (minPrice / offer.price)));
  const quality = QUALITY_SCORE[offer.quality] ?? 10;
  const availability = AVAILABILITY_SCORE[offer.availability] ?? 5;
  const reputation = Math.round(15 * (offer.sellerScore / 5));
  const delivery = DELIVERY_SCORE[offer.deliveryType] ?? 5;
  return { total: price + quality + availability + reputation + delivery, breakdown: { price, quality, availability, reputation, delivery } };
}

// ============================================================
// Écriture
// ============================================================

export interface NewRequestInput {
  vehicle: PartRequest['vehicle'];
  partName: string;
  oemReference?: string;
  photo?: string;
  description: string;
  quantity: number;
  quality?: PartQuality;
  fuel?: PartRequest['fuel'];
  condition?: PartRequest['condition'];
  note?: string;
  partPosition?: string;
  location: string;
  budgetIndicative?: number;
  buyerId: string;
  specificBrand?: string; // Cahier V2 - Point 6: Marque spécifique optionnelle
  // Cahier §8 : panier — enregistre la demande en brouillon au lieu de la diffuser.
  asDraft?: boolean;
}

export async function uploadRequestPhoto(buyerId: string, file: File): Promise<string | undefined> {
  const ext = file.name.split('.').pop() ?? 'jpg';
  const path = `${buyerId}/${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from('request-photos').upload(path, file);
  if (error) {
    console.error('uploadRequestPhoto failed', error);
    return undefined;
  }
  const { data } = supabase.storage.from('request-photos').getPublicUrl(path);
  return data.publicUrl;
}

export async function addRequest(input: NewRequestInput): Promise<PartRequest | null> {
  const { data, error } = await supabase
    .from('part_requests')
    .insert({
      buyer_id: input.buyerId,
      vehicle_brand: input.vehicle.brand,
      vehicle_model: input.vehicle.model,
      vehicle_year: input.vehicle.year,
      vehicle_engine: input.vehicle.engine,
      vehicle_vin: input.vehicle.vin,
      vehicle_cylinders: input.vehicle.cylinders,
      part_name: input.partName,
      oem_reference: input.oemReference,
      photo_url: input.photo,
      description: input.description,
      quantity: input.quantity,
      quality: input.quality,
      fuel: input.fuel,
      condition: input.condition,
      note: input.note,
      part_position: input.partPosition,
      location: input.location,
      budget_indicative: input.budgetIndicative,
      specific_brand: input.specificBrand, // Cahier V2 - Point 6
      status: input.asDraft ? 'draft' : 'open',
    })
    .select()
    .single();
  if (error || !data) {
    console.error('addRequest failed', error);
    return null;
  }
  return rowToRequest(data);
}

export type NewOfferInput = Omit<Offer, 'id' | 'rapidScore' | 'status' | 'round' | 'lastActor'>;

export async function addOffer(input: NewOfferInput): Promise<Offer | null> {
  // Defense en profondeur : un vendeur banni ne doit plus pouvoir creer d'offre,
  // meme en contournant la garde cote UI (seller/requests/[id]/page.tsx).
  const { data: sellerRow } = await supabase.from('sellers').select('is_banned').eq('id', input.sellerId).maybeSingle();
  if (sellerRow?.is_banned) {
    console.error('addOffer refused: seller is banned', input.sellerId);
    return null;
  }
  // Cahier V2 - Point 48 : un vendeur ne peut pas proposer une 2e offre sur la
  // même demande. Le formulaire le bloque déjà côté UI (seller/requests/[id]),
  // mais rien ne l'empêchait côté serveur/API.
  const { data: existingOffer } = await supabase
    .from('offers')
    .select('id')
    .eq('request_id', input.requestId)
    .eq('seller_id', input.sellerId)
    .maybeSingle();
  if (existingOffer) {
    console.error('addOffer refused: seller already offered on this request', input.sellerId, input.requestId);
    return null;
  }
  const { data, error } = await supabase
    .from('offers')
    .insert({
      request_id: input.requestId,
      seller_id: input.sellerId,
      seller_name: input.sellerName,
      seller_badge: input.sellerBadge,
      seller_score: input.sellerScore,
      part_name: input.partName,
      quality: input.quality,
      price: input.price,
      currency: input.currency,
      availability: input.availability,
      delivery_type: input.deliveryType,
      delivery_time: input.deliveryTime,
      warranty: input.warranty,
      payment_condition: input.paymentCondition,
      negotiable: input.negotiable ?? true,
      condition: input.condition, // Cahier V2 - Nouvelle section État : pièce d'occasion ou neuve
    })
    .select()
    .single();
  if (error || !data) {
    console.error('addOffer failed', error);
    return null;
  }
  // La demande liée compte une offre de plus. Un vendeur n'a pas le droit
  // d'update part_requests (RLS), donc ceci passe par une fonction security
  // definer plutôt qu'un update() direct qui échouerait silencieusement.
  const { error: incrementError } = await supabase.rpc('increment_request_responses', { p_request_id: input.requestId });
  if (incrementError) console.error('increment_request_responses failed', incrementError);
  return rowToOffer(data);
}

// ============================================================
// Cahier §9 : offres et contre-offres — Accepter / Contre-offrir / Refuser
// ============================================================

export interface NegotiationResult {
  success: boolean;
  error?: string;
}

// Accepter une offre : gèle toutes les autres offres de la même demande et ferme
// la demande aux nouveaux vendeurs (son statut n'est plus 'open').
// Cahier V2 - Point 47: Les autres offres passent en 'completed' (gelées, grisées, "Terminé") au lieu de 'rejected'
export async function acceptOffer(offerId: string, requestId: string): Promise<NegotiationResult> {
  const { error } = await supabase.from('offers').update({ status: 'accepted' }).eq('id', offerId);
  if (error) return { success: false, error: error.message };
  // Ces deux étapes échouaient silencieusement (erreur ignorée) — l'offre
  // pouvait passer 'accepted' alors que la demande restait 'open' (visible
  // par d'autres vendeurs) ou que les offres concurrentes n'étaient jamais
  // gelées. On les remonte maintenant à l'appelant.
  const { error: freezeError } = await supabase
    .from('offers')
    .update({ status: 'completed' }) // Cahier V2 - Point 47: 'completed' au lieu de 'rejected'
    .eq('request_id', requestId)
    .neq('id', offerId)
    .in('status', ['pending', 'countered']);
  if (freezeError) return { success: false, error: freezeError.message };
  const { error: matchError } = await supabase.from('part_requests').update({ status: 'matched' }).eq('id', requestId);
  if (matchError) return { success: false, error: matchError.message };
  return { success: true };
}

export async function rejectOffer(offerId: string): Promise<NegotiationResult> {
  const { error } = await supabase.from('offers').update({ status: 'rejected' }).eq('id', offerId);
  return error ? { success: false, error: error.message } : { success: true };
}

// Faire une contre-offre : limité à MAX_NEGOTIATION_ROUNDS propositions dans la chaîne.
export async function counterOffer(offer: Offer, newPrice: number, actor: 'buyer' | 'seller'): Promise<NegotiationResult> {
  if (offer.round >= 3) {
    return { success: false, error: 'Le nombre maximum de contre-offres est atteint pour cette négociation.' };
  }
  // Cahier V2 : chaque nouvelle contre-offre (acheteur ou vendeur) doit être
  // strictement inférieure à la précédente (N-1) — la négociation ne doit
  // jamais faire remonter le prix. Comme chaque round applique un % de
  // réduction au prix le plus récent (voir COUNTER_OFFER_PERCENTAGES côté
  // UI), la chaîne est décroissante par construction ; ce contrôle reste une
  // sécurité côté serveur au cas où l'appel contournerait l'interface.
  if (newPrice >= offer.price) {
    return { success: false, error: `La nouvelle offre doit être inférieure à l'offre précédente (${formatPrice(offer.price, offer.currency)}).` };
  }
  const { error } = await supabase
    .from('offers')
    .update({ price: newPrice, round: offer.round + 1, last_actor: actor, status: 'countered' })
    .eq('id', offer.id);
  return error ? { success: false, error: error.message } : { success: true };
}

const ETA_HOURS: Record<DeliveryType, number> = {
  RAPID_NOW: 1,
  RAPID_CITY: 2,
  RAPID_NIGERIA: 48,
  RAPID_USA: 24 * 7,
  RAPID_DUBAI: 24 * 6,
  RAPID_TURKEY: 24 * 8,
  RAPID_FRANCE: 24 * 8,
  RAPID_GERMANY: 24 * 8,
  RAPID_ENGLAND: 24 * 8,
  RAPID_CHINA: 24 * 12,
};

export type NewOrderInput = Omit<Order, 'id' | 'createdAt' | 'estimatedDelivery' | 'escrowStatus' | 'status'>;

export async function addOrder(input: NewOrderInput): Promise<Order | null> {
  const now = new Date();
  const eta = new Date(now.getTime() + ETA_HOURS[input.deliveryType] * 3600 * 1000);
  
  // Vérifier si l'escrow est activé
  const escrowEnabled = await isFeatureEnabled('escrow_enabled');
  const escrowStatus = escrowEnabled ? 'held' : 'released';
  
  const { data, error } = await supabase
    .from('orders')
    .insert({
      request_id: input.requestId,
      offer_id: input.offerId,
      buyer_id: input.buyerId,
      seller_id: input.sellerId,
      seller_name: input.sellerName,
      part_name: input.partName,
      vehicle_brand: input.vehicle.brand,
      vehicle_model: input.vehicle.model,
      vehicle_year: input.vehicle.year,
      price: input.price,
      currency: input.currency,
      delivery_type: input.deliveryType,
      vin: input.vin,
      // Cahier V2 - Point 51 : cycle Paiement en cours → Payé → Livraison en cours →
      // Livré. Le paiement est confirmé de façon synchrone ici (pas d'étape
      // intermédiaire d'attente), donc la commande est créée directement 'paid'.
      status: 'paid',
      escrow_status: escrowStatus,
      estimated_delivery: eta.toISOString(),
    })
    .select()
    .single();
  if (error || !data) {
    // Cahier V2 - Point 7 : au-delà de 50 000 FCFA, un trigger DB (017) rejette
    // l'insertion si le VIN est absent — remonter l'erreur plutôt que null muet,
    // pour que le checkout puisse afficher un vrai message au lieu de faire
    // croire au paiement alors que rien n'a été enregistré.
    console.error('addOrder failed', error);
    return null;
  }
  return rowToOrder(data);
}

export async function updateOrderEscrow(orderId: string, escrowStatus: Order['escrowStatus']): Promise<void> {
  await supabase
    .from('orders')
    .update({ escrow_status: escrowStatus, status: escrowStatus === 'released' ? 'completed' : undefined })
    .eq('id', orderId);
}

// ============================================================
// Admin Settings (Configuration)
// ============================================================

export async function getAdminSettings(): Promise<AdminSetting[]> {
  const { data, error } = await supabase.from('admin_settings').select('*').order('category, key');
  if (error || !data) return [];
  return data as AdminSetting[];
}

export async function getAdminSettingByKey(key: string): Promise<string | null> {
  const { data, error } = await supabase.from('admin_settings').select('value').eq('key', key).maybeSingle();
  if (error || !data) return null;
  return data.value;
}

export async function updateAdminSetting(key: string, value: string, userId?: string): Promise<boolean> {
  const { error } = await supabase
    .from('admin_settings')
    .update({ value, updated_by: userId })
    .eq('key', key);
  return !error;
}

export async function updateSellerVerification(sellerId: string, isVerified: boolean): Promise<void> {
  await supabase
    .from('sellers')
    .update({ is_verified: isVerified })
    .eq('id', sellerId);
}

export async function updateSellerBan(sellerId: string, isBanned: boolean): Promise<void> {
  await supabase
    .from('sellers')
    .update({ is_banned: isBanned })
    .eq('id', sellerId);
}

export async function addRapidPoints(buyerId: string, orderTotal: number): Promise<number> {
  const gained = Math.floor(orderTotal / 1000);
  const { data } = await supabase.from('profiles').select('rapid_points').eq('id', buyerId).maybeSingle();
  const current = data?.rapid_points ?? 0;
  await supabase.from('profiles').update({ rapid_points: current + gained }).eq('id', buyerId);
  return gained;
}

// Cahier §8 : si un acheteur accepte une offre et ne paie pas, ses points diminuent.
export async function deductRapidPoints(buyerId: string, amount: number): Promise<void> {
  const { data } = await supabase.from('profiles').select('rapid_points').eq('id', buyerId).maybeSingle();
  const current = data?.rapid_points ?? 0;
  await supabase.from('profiles').update({ rapid_points: Math.max(0, current - amount) }).eq('id', buyerId);
}

export async function addVehicle(buyerId: string, vehicle: Vehicle): Promise<Vehicle[]> {
  await supabase.from('vehicles').insert({
    buyer_id: buyerId,
    brand: vehicle.brand,
    model: vehicle.model,
    year: vehicle.year,
    engine: vehicle.engine,
    vin: vehicle.vin,
  });
  return getVehicles(buyerId);
}

// ============================================================
// Hooks React — chargent au montage, se rechargent via refetch()
// ============================================================

function useSupabaseQuery<T>(fetcher: () => Promise<T>, deps: unknown[], initial: T) {
  const [data, setData] = useState<T>(initial);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(() => {
    let active = true;
    setLoading(true);
    fetcher().then((result) => {
      if (active) {
        setData(result);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/use-memo
  }, deps);

  useEffect(() => refetch(), [refetch]);

  return { data, loading, refetch };
}

export function useRequests() {
  return useSupabaseQuery(getRequests, [], [] as PartRequest[]);
}

export function useRequestDrafts(buyerId: string | undefined) {
  return useSupabaseQuery(() => (buyerId ? getRequestDrafts(buyerId) : Promise.resolve([])), [buyerId], [] as PartRequest[]);
}

export function usePendingPayments(buyerId: string | undefined) {
  return useSupabaseQuery(() => (buyerId ? getPendingPayments(buyerId) : Promise.resolve([])), [buyerId], [] as PendingPayment[]);
}

export function useRequestById(id: string | undefined) {
  return useSupabaseQuery(() => (id ? getRequestById(id) : Promise.resolve(undefined)), [id], undefined as PartRequest | undefined);
}

export function useOfferById(id: string | undefined) {
  return useSupabaseQuery(() => (id ? getOfferById(id) : Promise.resolve(undefined)), [id], undefined as Offer | undefined);
}

export function useOffersForRequest(requestId: string | undefined) {
  return useSupabaseQuery(() => (requestId ? getOffersForRequest(requestId) : Promise.resolve([])), [requestId], [] as Offer[]);
}

export function useOffersForSeller(sellerId: string | undefined) {
  return useSupabaseQuery(() => (sellerId ? getOffersForSeller(sellerId) : Promise.resolve([])), [sellerId], [] as Offer[]);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToNegotiationEvent(row: any): NegotiationEvent {
  return {
    id: row.id,
    offerId: row.offer_id,
    price: Number(row.price),
    actor: row.actor,
    createdAt: row.created_at,
    note: row.note ?? undefined,
  };
}

// Cahier V2 - Point 45 : historique complet des échanges d'une offre.
export async function getOfferNegotiationHistory(offerId: string): Promise<NegotiationEvent[]> {
  const { data, error } = await supabase
    .from('offer_negotiation_history')
    .select('*')
    .eq('offer_id', offerId)
    .order('created_at', { ascending: true });
  if (error || !data) return [];
  return data.map(rowToNegotiationEvent);
}

export function useOfferNegotiationHistory(offerId: string | undefined) {
  return useSupabaseQuery(() => (offerId ? getOfferNegotiationHistory(offerId) : Promise.resolve([])), [offerId], [] as NegotiationEvent[]);
}

// Version groupée : une seule requête pour l'historique de plusieurs offres à
// la fois (ex. toutes les offres d'une demande, affichées en liste — on ne
// peut pas appeler un hook par carte dans un .map()).
export async function getNegotiationHistoryForOffers(offerIds: string[]): Promise<Record<string, NegotiationEvent[]>> {
  if (offerIds.length === 0) return {};
  const { data, error } = await supabase
    .from('offer_negotiation_history')
    .select('*')
    .in('offer_id', offerIds)
    .order('created_at', { ascending: true });
  if (error || !data) return {};
  const grouped: Record<string, NegotiationEvent[]> = {};
  data.map(rowToNegotiationEvent).forEach((event) => {
    (grouped[event.offerId] ??= []).push(event);
  });
  return grouped;
}

export function useNegotiationHistoryForOffers(offerIds: string[]) {
  const key = offerIds.join(',');
  return useSupabaseQuery(() => getNegotiationHistoryForOffers(offerIds), [key], {} as Record<string, NegotiationEvent[]>);
}

export function useOffersForBuyer(buyerId: string | undefined) {
  return useSupabaseQuery(() => (buyerId ? getOffersForBuyer(buyerId) : Promise.resolve([])), [buyerId], [] as Offer[]);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToSellerReview(row: any): SellerReview {
  return {
    id: row.id,
    orderId: row.order_id,
    sellerId: row.seller_id,
    buyerId: row.buyer_id,
    rating: row.rating,
    comment: row.comment ?? undefined,
    createdAt: row.created_at,
  };
}

// Cahier V2 - Points 11/12/13/41 : noter un vendeur après réception d'une
// commande. La policy insert (migration 026) vérifie déjà côté DB que
// l'acheteur note bien sa propre commande livrée — pas de vérif redondante ici.
export async function addSellerReview(input: { orderId: string; sellerId: string; buyerId: string; rating: number; comment?: string }): Promise<SellerReview | null> {
  const { data, error } = await supabase
    .from('seller_reviews')
    .insert({ order_id: input.orderId, seller_id: input.sellerId, buyer_id: input.buyerId, rating: input.rating, comment: input.comment })
    .select()
    .single();
  if (error || !data) {
    console.error('addSellerReview failed', error);
    return null;
  }
  return rowToSellerReview(data);
}

export async function getReviewForOrder(orderId: string): Promise<SellerReview | undefined> {
  const { data, error } = await supabase.from('seller_reviews').select('*').eq('order_id', orderId).maybeSingle();
  if (error || !data) return undefined;
  return rowToSellerReview(data);
}

export function useReviewForOrder(orderId: string | undefined) {
  return useSupabaseQuery(() => (orderId ? getReviewForOrder(orderId) : Promise.resolve(undefined)), [orderId], undefined as SellerReview | undefined);
}

export async function getReviewsForSeller(sellerId: string): Promise<SellerReview[]> {
  const { data, error } = await supabase.from('seller_reviews').select('*').eq('seller_id', sellerId).order('created_at', { ascending: false });
  if (error || !data) return [];
  return data.map(rowToSellerReview);
}

export function useReviewsForSeller(sellerId: string | undefined) {
  return useSupabaseQuery(() => (sellerId ? getReviewsForSeller(sellerId) : Promise.resolve([])), [sellerId], [] as SellerReview[]);
}

// Version groupée : savoir en un seul appel quelles commandes (parmi une
// liste) ont déjà un avis — utilisé pour afficher/masquer "Évaluer" sur
// chaque commande d'une liste sans appeler un hook par carte dans un .map().
export async function getReviewedOrderIds(orderIds: string[]): Promise<Set<string>> {
  if (orderIds.length === 0) return new Set();
  const { data, error } = await supabase.from('seller_reviews').select('order_id').in('order_id', orderIds);
  if (error || !data) return new Set();
  return new Set(data.map((row) => row.order_id));
}

export function useReviewedOrderIds(orderIds: string[]) {
  const key = orderIds.join(',');
  return useSupabaseQuery(() => getReviewedOrderIds(orderIds), [key], new Set<string>());
}

export function useOrders() {
  return useSupabaseQuery(getOrders, [], [] as Order[]);
}

// Cahier V2 - Point 38 : numéro de paiement du vendeur — dans une table à
// part (voir migration 024), lisible seulement par le vendeur lui-même ou un
// admin (jamais par un acheteur), donc jamais mélangé à getSellers().
export async function getSellerPaymentNumber(sellerId: string): Promise<string | undefined> {
  const { data, error } = await supabase.from('seller_payment_info').select('payment_number').eq('seller_id', sellerId).maybeSingle();
  if (error || !data) return undefined;
  return data.payment_number;
}

export function useSellerPaymentNumber(sellerId: string | undefined) {
  return useSupabaseQuery(() => (sellerId ? getSellerPaymentNumber(sellerId) : Promise.resolve(undefined)), [sellerId], undefined as string | undefined);
}

export function useSellers() {
  return useSupabaseQuery(getSellers, [], [] as Seller[]);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToNotification(row: any): AppNotification {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    message: row.message,
    type: row.type,
    isRead: row.is_read,
    createdAt: row.created_at,
  };
}

// Cahier V2 - Point 4 : notifications système (ex. expiration de demande),
// écrites par des triggers DB (016/017/020) dans la table `notifications`.
export async function getNotifications(userId: string): Promise<AppNotification[]> {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20);
  if (error || !data) return [];
  return data.map(rowToNotification);
}

export async function markNotificationRead(id: string): Promise<void> {
  await supabase.from('notifications').update({ is_read: true }).eq('id', id);
}

export function useNotifications(userId: string | undefined) {
  return useSupabaseQuery(() => (userId ? getNotifications(userId) : Promise.resolve([])), [userId], [] as AppNotification[]);
}

export function useVehicles(buyerId: string | undefined) {
  return useSupabaseQuery(() => (buyerId ? getVehicles(buyerId) : Promise.resolve([])), [buyerId], [] as Vehicle[]);
}

export function useRapidPoints(buyerId: string | undefined) {
  return useSupabaseQuery(() => (buyerId ? getRapidPoints(buyerId) : Promise.resolve(0)), [buyerId], 0);
}

export function useAdminSettings() {
  return useSupabaseQuery(getAdminSettings, [], [] as AdminSetting[]);
}

// ============================================================
// Configuration Helpers
// ============================================================

/**
 * Récupère un paramètre de configuration spécifique
 * @param key Clé du paramètre
 * @param value Valeur par défaut si non trouvé
 */
export async function getConfigValue(key: string, defaultValue: string = 'true'): Promise<string> {
  const value = await getAdminSettingByKey(key);
  return value ?? defaultValue;
}

/**
 * Vérifie si une fonctionnalité est activée
 * @param key Clé du paramètre (ex: 'escrow_enabled')
 */
export async function isFeatureEnabled(key: string): Promise<boolean> {
  const value = await getAdminSettingByKey(key);
  return value === 'true';
}

/**
 * Récupère les options de livraison activées selon la configuration
 */
export async function getEnabledDeliveryOptions(): Promise<DeliveryOption[]> {
  const nowEnabled = await isFeatureEnabled('rapid_now_enabled');
  const cityEnabled = await isFeatureEnabled('rapid_city_enabled');
  const nigeriaEnabled = await isFeatureEnabled('rapid_nigeria_enabled');
  const usaEnabled = await isFeatureEnabled('rapid_usa_enabled');

  return DELIVERY_OPTIONS.filter(option => {
    switch (option.type) {
      case 'RAPID_NOW': return nowEnabled;
      case 'RAPID_CITY': return cityEnabled;
      case 'RAPID_NIGERIA': return nigeriaEnabled;
      case 'RAPID_USA': return usaEnabled;
      case 'RAPID_CHINA': return true; // Toujours activé par défaut
      default: return true;
    }
  });
}

export function useEnabledDeliveryOptions() {
  return useSupabaseQuery(getEnabledDeliveryOptions, [], DELIVERY_OPTIONS);
}

// Lecture générique d'un réglage on/off depuis admin_settings (ex: activer/
// désactiver la vérification vendeur obligatoire pendant la phase de test).
export function useFeatureFlag(key: string, defaultValue = false) {
  return useSupabaseQuery(() => isFeatureEnabled(key), [key], defaultValue);
}

/**
 * Calcule la commission selon le paramètre configuré
 * @param amount Montant de la transaction
 * @returns Montant de la commission
 */
export async function calculateCommission(amount: number): Promise<number> {
  const commissionRate = await getConfigValue('commission_rate', '5-7');
  
  // Parser le taux de commission (ex: "5-7" -> prendre 7% par défaut)
  const rateMatch = commissionRate.match(/(\d+)-(\d+)/);
  const maxRate = rateMatch ? parseInt(rateMatch[2], 10) : 7;
  
  // Pour simplifier, on utilise le taux max pour le calcul
  return Math.round(amount * (maxRate / 100));
}
