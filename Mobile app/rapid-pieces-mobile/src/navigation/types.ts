import { NavigatorScreenParams } from '@react-navigation/native';

export type BuyerTabParamList = {
  Home: undefined;
  Cart: undefined;
  Orders: undefined;
  Profile: undefined;
};

export type BuyerStackParamList = {
  BuyerTabs: NavigatorScreenParams<BuyerTabParamList>;
  RequestNew: undefined;
  Offers: { requestId: string };
  Checkout: { offerId: string; requestId: string };
};

export type SellerTabParamList = {
  SellerRequests: undefined;
  SellerOrders: undefined;
  Profile: undefined;
};

export type AdminTabParamList = {
  AdminOrders: undefined;
  AdminRequests: undefined;
  Profile: undefined;
};

export type AuthStackParamList = {
  Welcome: undefined;
  Login: { role?: 'buyer' | 'seller' } | undefined;
};
