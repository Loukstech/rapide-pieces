
import { useEffect, useState, useCallback } from 'react';
import { createClient } from './supabase/client';
import {
  PartRequest, Offer, Order, Seller, Vehicle, PartQuality, DeliveryType, DELIVERY_OPTIONS,
} from './types';

const supabase = createClient();

// ============================================================
// Mappers : lignes Postgres (snake_case) <-> types de l'app (camelCase)
// ============================================================

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
    brands: row.brands ?? [],
    categories: row.categories ?? [],
    specialties: row.specialties ?? [],
    joinDate: row.join_date,
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
    status: row.status ?? 'pending',
    round: row.round ?? 1,
    lastActor: row.last_actor ?? 'seller',
  };
}

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
    deliveryType: row.delivery_type,
    status: row.status,
    createdAt: row.created_at,
    estimatedDelivery: row.estimated_delivery,
    escrowStatus: row.escrow_status,
  };
}

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
  const { data, error } = await supabase.from('sellers').select('*, profiles(name, phone, phone_secondary, location, country, address)');
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
  Reconditioned: 10,
  Used: 8,
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
  // Cahier §8 : panier — enregistre la demande en brouillon au lieu de la diffuser.
  asDraft?: boolean;
}

export async function uploadRequestPhoto(buyerId: string, uri: string): Promise<string | undefined> {
  const ext = (uri.split('.').pop()?.split('?')[0] ?? 'jpg').toLowerCase();
  const path = `${buyerId}/${Date.now()}.${ext}`;
  const response = await fetch(uri);
  const arrayBuffer = await response.arrayBuffer();
  const { error } = await supabase.storage.from('request-photos').upload(path, arrayBuffer, {
    contentType: `image/${ext === 'jpg' ? 'jpeg' : ext}`,
  });
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
    })
    .select()
    .single();
  if (error || !data) {
    console.error('addOffer failed', error);
    return null;
  }
  // La demande liée compte une offre de plus.
  const { data: reqRow } = await supabase.from('part_requests').select('responses_count').eq('id', input.requestId).maybeSingle();
  if (reqRow) {
    await supabase.from('part_requests').update({ responses_count: reqRow.responses_count + 1 }).eq('id', input.requestId);
  }
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
export async function acceptOffer(offerId: string, requestId: string): Promise<NegotiationResult> {
  const { error } = await supabase.from('offers').update({ status: 'accepted' }).eq('id', offerId);
  if (error) return { success: false, error: error.message };
  await supabase
    .from('offers')
    .update({ status: 'rejected' })
    .eq('request_id', requestId)
    .neq('id', offerId)
    .in('status', ['pending', 'countered']);
  await supabase.from('part_requests').update({ status: 'matched' }).eq('id', requestId);
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
      delivery_type: input.deliveryType,
      status: 'confirmed',
      escrow_status: 'held',
      estimated_delivery: eta.toISOString(),
    })
    .select()
    .single();
  if (error || !data) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

export function useOrders() {
  return useSupabaseQuery(getOrders, [], [] as Order[]);
}

export function useSellers() {
  return useSupabaseQuery(getSellers, [], [] as Seller[]);
}

export function useVehicles(buyerId: string | undefined) {
  return useSupabaseQuery(() => (buyerId ? getVehicles(buyerId) : Promise.resolve([])), [buyerId], [] as Vehicle[]);
}

export function useRapidPoints(buyerId: string | undefined) {
  return useSupabaseQuery(() => (buyerId ? getRapidPoints(buyerId) : Promise.resolve(0)), [buyerId], 0);
}
