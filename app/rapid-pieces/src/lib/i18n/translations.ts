export type Language = 'fr' | 'en';

export interface Translations {
  common: {
    welcome: string;
    login: string;
    logout: string;
    register: string;
    back: string;
    next: string;
    previous: string;
    submit: string;
    cancel: string;
    save: string;
    delete: string;
    edit: string;
    search: string;
    filter: string;
    loading: string;
    error: string;
    success: string;
    confirm: string;
    yes: string;
    no: string;
    or: string;
    and: string;
    currency: string;
    betaOpen: string;
    mobileAppNo1: string;
    allParts: string;
    deliveredFast: string;
    scanPlate: string;
    compatible: string;
    certifiedOrigin: string;
    compatibility: string;
    guaranteed100: string;
    delivery: string;
    expressDelivery: string;
    bigBrands: string;
    factoryPrice: string;
    accessApp: string;
    howItWorksTitle: string;
    howItWorksSubtitle: string;
    howItWorksBadge: string;
    step1Title: string;
    step1Desc: string;
    step1Badge: string;
    step2Title: string;
    step2Desc: string;
    step2Badge: string;
    step3Title: string;
    step3Desc: string;
    step3Badge: string;
    stepVerified: string;
    zeroRiskTitle: string;
    zeroRiskDesc: string;
    downloadApp: string;
    inStock: string;
    onOrder: string;
    lightMode: string;
    darkMode: string;
    reqInProgress: string;
    reqFound: string;
    reqUrgent: string;
    offersCount: string;
    respond: string;
    legalTitle: string;
    legalUpdate: string;
    legalEditor: string;
    legalIRead: string;
    offerPageTitle: string;
    offerLoading: string;
    offerNotFound: string;
    offerExpiredNotice: string;
    offerRenewLink: string;
    offerFilterAll: string;
    offerFilterLocal: string;
    offerFilterIntl: string;
    offerSortBestScore: string;
    offerSortPrice: string;
    offerSortRating: string;
    offerScoreFormula: string;
    offerNoOffers: string;
    offerAcceptError: string;
    offerRejectError: string;
    offerCounterError: string;
    offerAcceptedToast: string;
    offerRejectedToast: string;
    offerCounterSentToast: string;
    orderStatusPaymentPending: string;
    orderStatusPaid: string;
    orderStatusShipping: string;
    orderStatusDelivered: string;
    orderStatusCompleted: string;
    orderStatusCancelled: string;
    myOrders: string;
    ordersInProgress: string;
    ordersDelivered: string;
    ordersPoints: string;
    ordersAll: string;
    howItWorks: string;
    fee: string;
    loginIncorrect: string;
    adminRegisterDisabled: string;
    fillRequiredFields: string;
    verifyPhone: string;
    passwordsMismatch: string;
    acceptTermsRequired: string;
    paymentNumberRequired: string;
  };
  nav: {
    home: string;
    requests: string;
    catalogue: string;
    orders: string;
    profile: string;
    notifications: string;
    settings: string;
    help: string;
    sellerSpace: string;
    buyerSpace: string;
    adminSpace: string;
    brandName: string;
  };
  auth: {
    email: string;
    password: string;
    name: string;
    phone: string;
    location: string;
    role: string;
    buyer: string;
    seller: string;
    loginTitle: string;
    registerTitle: string;
    loginSubtitle: string;
    registerSubtitle: string;
    forgotPassword: string;
    noAccount: string;
    hasAccount: string;
    whoAreYou: string;
    buyerDescription: string;
    sellerDescription: string;
    chooseProfile: string;
    connect: string;
    register: string;
    phoneNumber: string;
    otherPhone: string;
    emailOptional: string;
    passwordRequired: string;
    storeName: string;
    fullName: string;
    youAre: string;
    country: string;
    city: string;
    select: string;
    address: string;
    openingHours: string;
    note: string;
    brands: string;
    categories: string;
    conditionTypes: string;
    stockLevel: string;
    paymentMethods: string;
    paymentConditions: string;
    deliveryService: string;
    deliveryAvailable: string;
    loginInProgress: string;
    accountCreated: string;
    registrationFailed: string;
    parts: string;
    condition: string;
    yes: string;
    sellerRegister: string;
    buyerRegister: string;
    no: string;
    registerButton: string;
    adminAccountRequired: string;
    createAccount: string;
    adminLoginSubtitle: string;
    buyerLoginSubtitle: string;
    buyerRegisterSubtitle: string;
    sellerLoginSubtitle: string;
    confirmPassword: string;
    placeholderEmail: string;
    placeholderName: string;
    placeholderStore: string;
    buyerIndividual: string;
    buyerMechanic: string;
    buyerGarage: string;
    buyerBusiness: string;
    specifyCity: string;
    specifyBrand: string;
    specifyCategory: string;
    acceptTerms: string;
    termsLink: string;
    alreadyHaveAccount: string;
    loginLink: string;
    paymentNumberRequired: string;
    pendingVerification: string;
    placeholderNote: string;
    placeholderPaymentNumber: string;
  };
  seller: {
    dashboard: string;
    newRequests: string;
    recentSales: string;
    monthlyRevenue: string;
    salesThisMonth: string;
    responses: string;
    responseTime: string;
    performance: string;
    transactions: string;
    compliance: string;
    returns: string;
    stock: string;
    rapidSellerScore: string;
    basedOnTransactions: string;
    badgeProgression: string;
    currentBadge: string;
    specialties: string;
    brands: string;
    store: string;
    notifications: string;
    alerts: string;
    statistics: string;
    support: string;
    guide: string;
    account: string;
    myProfile: string;
    location: string;
    since: string;
    totalRevenue: string;
    counterOffers: string;
    pendingOffers: string;
    waitingResponse: string;
    buyerProposed: string;
    requests: string;
    messages: string;
    whatsappSupport: string;
  };
  buyer: {
    myRequests: string;
    newRequest: string;
    myOrders: string;
    findParts: string;
    requestPart: string;
    vehicleInfo: string;
    partDetails: string;
    quality: string;
    condition: string;
    quantity: string;
    budget: string;
    submitRequest: string;
    offers: string;
    negotiations: string;
    orderHistory: string;
  };
  request: {
    title: string;
    subtitle: string;
    status: string;
    draft: string;
    open: string;
    matched: string;
    ordered: string;
    completed: string;
    expired: string;
    noOffers: string;
    makeOffer: string;
    counterOffer: string;
    acceptOffer: string;
    rejectOffer: string;
    negotiate: string;
  };
  offer: {
    price: string;
    quality: string;
    availability: string;
    delivery: string;
    warranty: string;
    seller: string;
    rapidScore: string;
    description: string;
    propose: string;
    counter: string;
    accept: string;
    reject: string;
  };
  order: {
    status: string;
    pending: string;
    confirmed: string;
    shipped: string;
    inTransit: string;
    delivered: string;
    completed: string;
    cancelled: string;
    estimatedDelivery: string;
    escrowStatus: string;
    tracking: string;
  };
  quality: {
    oem: string;
    genuine: string;
    premium: string;
    standard: string;
    used: string;
    reconditioned: string;
  };
  delivery: {
    rapidNow: string;
    rapidCity: string;
    rapidNigeria: string;
    rapidUsa: string;
    rapidChina: string;
    rapidDubai: string;
    rapidTurkey: string;
    rapidFrance: string;
    rapidGermany: string;
    rapidEngland: string;
  };
  fuel: {
    essence: string;
    diesel: string;
    hybrid: string;
    electric: string;
    lpg: string;
  };
  condition: {
    new: string;
    old: string;
  };
  badge: {
    newSeller: string;
    rapidSeller: string;
    verifiedSeller: string;
    premiumSeller: string;
    topSeller: string;
  };
  admin: {
    dashboard: string;
    sellers: string;
    transactions: string;
    requests: string;
    config: string;
    platformActive: string;
    operational: string;
    settings: string;
    uptime: string;
    performance: string;
    internationalSourcing: string;
    recentActivity: string;
    commissionPayment: string;
    delivery: string;
    trust: string;
    dangerZone: string;
    suspendPlatform: string;
    exportData: string;
  };
  groupBuy: {
    title: string;
    subtitle: string;
    step1: string;
    step2: string;
    step3: string;
    step4: string;
  };
  parts: {
    brakePadsFront: string;
    oilFilter: string;
    rearShockAbsorber: string;
    battery60Ah: string;
  };
  sourcing: {
    title: string;
    heroSubtitle: string;
    requestButton: string;
    formTitle: string;
  };
  supplier: {
    spaceTitle: string;
    ordersWon: string;
    successRate: string;
    shipments: string;
  };
  vehicleHistory: {
    title: string;
    subtitle: string;
  };
  whatsappContact: {
    title: string;
    subtitle: string;
    protectedLabel: string;
    protectedNotice: string;
  };
  legal: {
    art1_title: string; art1_p1: string; art1_p2: string;
    art2_title: string; art2_l1_title: string; art2_l1_text: string;
    art2_l2_title: string; art2_l2_buyer: string; art2_l2_seller: string;
    art2_l3_title: string; art2_l3_text: string;
    art3_title: string; art3_l1_title: string; art3_l1_text: string;
    art3_l2_title: string; art3_l2_text: string; art3_l3_title: string; art3_l3_text: string;
    art4_title: string; art4_l1_title: string; art4_l1_text: string;
    art4_l2_title: string; art4_l2_text: string; art4_l3_title: string; art4_l3_text: string;
    art4_l4_title: string; art4_l4_text: string;
    art5_title: string; art5_intro: string; art5_l1_title: string; art5_l1_text: string;
    art5_l2_title: string; art5_l2_text: string; art5_l3_title: string; art5_l3_text: string;
    art6_title: string; art6_l1_title: string; art6_l1_text: string;
    art6_l2_title: string; art6_l2_text: string; art6_l3_title: string; art6_l3_text: string;
    art6_l4_title: string; art6_l4_text: string;
    art7_title: string; art7_l1_title: string; art7_l1_text: string;
    art7_l2_title: string; art7_l2_text: string; art7_l3_title: string; art7_l3_text: string;
    art8_title: string; art8_p: string;
    art9_title: string; art9_p: string;
    art10_title: string; art10_p: string;
  };
}

export const translations: Record<Language, Translations> = {
  fr: {
    common: {
      welcome: 'Bienvenue',
      login: 'Connexion',
      logout: 'Déconnexion',
      register: 'Inscription',
      back: 'Retour',
      next: 'Suivant',
      previous: 'Précédent',
      submit: 'Soumettre',
      cancel: 'Annuler',
      save: 'Enregistrer',
      delete: 'Supprimer',
      edit: 'Modifier',
      search: 'Rechercher',
      filter: 'Filtrer',
      loading: 'Chargement...',
      error: 'Erreur',
      success: 'Succès',
      confirm: 'Confirmer',
      yes: 'Oui',
      no: 'Non',
      or: 'ou',
      and: 'et',
      currency: 'FCFA',
      betaOpen: 'Bêta Ouverte',
      mobileAppNo1: 'L\'application mobile n°1 des pièces auto en France',
      allParts: 'Toutes vos pièces auto.',
      deliveredFast: 'Livrées rapidement.',
      scanPlate: 'Scannez votre plaque d’immatriculation, trouvez instantanément la pièce',
      compatible: '100% compatible',
      certifiedOrigin: 'certifiées origine constructeur et recevez-la chez vous ou chez votre garagiste en 24h.',
      compatibility: 'Compatibilité',
      guaranteed100: '100% Garantie',
      delivery: 'Livraison',
      expressDelivery: 'Express 24h/48h',
      bigBrands: 'Grandes Marques',
      factoryPrice: 'Prix direct usine',
      accessApp: "Accéder à l'application",
      howItWorksTitle: "Comment fonctionne l'application en 3 étapes ?",
      howItWorksSubtitle: "Commander une pièce auto n'a jamais été aussi rapide et sécurisé.",
      howItWorksBadge: "Simple, Rapide, Sans Erreur",
      step1Title: "Scannez votre plaque ou carte grise",
      step1Desc: "L'application identifie instantanément votre modèle exact, sa motorisation, son année et son équipement d'origine. Aucun jargon mécanique requis.",
      step1Badge: "1 Seconde",
      step2Title: "Sélectionnez vos pièces garanties",
      step2Desc: "Accédez aux fiches détaillées, avis clients, vues éclatées et guides de montage. Toutes les pièces affichées sont certifiées 100% compatibles.",
      step2Badge: "Prix Direct",
      step3Title: "Recevez en 24h & suivez le livreur",
      step3Desc: "Vos pièces sont expédiées le jour même. Suivez l'arrivée de votre colis en temps réel sur la carte interactive jusqu'à votre porte ou atelier.",
      step3Badge: "Livraison Express",
      stepVerified: "Étape vérifiée par nos experts",
      zeroRiskTitle: "Engagement Zéro Risque Rapid Pièces",
      zeroRiskDesc: "Si la pièce sélectionnée ne convient pas, nous prenons en charge le retour gratuitement sous 30 jours.",
      downloadApp: "Télécharger l'App",
      inStock: 'En stock',
      onOrder: 'Sur commande',
      lightMode: 'Passer en mode clair',
      darkMode: 'Passer en mode sombre',
      reqInProgress: 'En cours',
      reqFound: 'Pièce trouvée',
      reqUrgent: 'Urgent',
      offersCount: '{count} offres',
      respond: 'Répondre',
      legalTitle: "Conditions Générales d'Utilisation et de Vente",
      legalUpdate: 'Rapid Pièces — Dernière mise à jour : Septembre 2026',
      legalEditor: 'Éditeur de l\'application :',
      legalIRead: "J'ai lu et compris",
      offerPageTitle: 'Offres reçues',
      offerLoading: 'Chargement...',
      offerNotFound: 'Demande introuvable',
      offerExpiredNotice: 'Cette demande a expiré.',
      offerRenewLink: 'La renouveler',
      offerFilterAll: 'Toutes',
      offerFilterLocal: 'Locales',
      offerFilterIntl: 'Internationales',
      offerSortBestScore: 'Meilleur score',
      offerSortPrice: 'Prix',
      offerSortRating: 'Note',
      offerScoreFormula: 'Rapid Score = Prix (30%) + Qualité (25%) + Disponibilité (20%) + Réputation (15%) + Délai (10%)',
      offerNoOffers: 'Aucune offre pour le moment.',
      offerAcceptError: 'Action impossible',
      offerRejectError: 'Action impossible',
      offerCounterError: 'Action impossible',
      offerAcceptedToast: 'Offre acceptée.',
      offerRejectedToast: 'Offre refusée.',
      offerCounterSentToast: 'Contre-offre envoyée.',
      orderStatusPaymentPending: 'Paiement en cours',
      orderStatusPaid: 'Payé',
      orderStatusShipping: 'Livraison en cours',
      orderStatusDelivered: 'Livré',
      orderStatusCompleted: 'Terminé',
      orderStatusCancelled: 'Annulé',
      myOrders: 'Mes commandes',
      ordersInProgress: 'En cours',
      ordersDelivered: 'Livrées',
      ordersPoints: 'Points Rapid',
      ordersAll: 'Toutes',
      howItWorks: 'Comment ça marche ?',
      fee: 'Frais',
      loginIncorrect: 'Identifiant ou mot de passe incorrect',
      adminRegisterDisabled: 'La création de compte admin est désactivée.',
      fillRequiredFields: 'Veuillez remplir tous les champs obligatoires',
      verifyPhone: 'Veuillez vérifier votre numéro de téléphone (code reçu par SMS).',
      passwordsMismatch: 'Les mots de passe ne correspondent pas',
      acceptTermsRequired: 'Veuillez accepter les conditions générales de vente',
      paymentNumberRequired: 'Veuillez renseigner votre numéro de réception des paiements',
    },
    nav: {
      home: 'Accueil',
      requests: 'Demandes',
      catalogue: 'Catalogue',
      orders: 'Ventes',
      profile: 'Profil',
      notifications: 'Notifications',
      settings: 'Paramètres',
      help: 'Aide',
      sellerSpace: 'Espace Vendeur',
      buyerSpace: 'Espace Acheteur',
      adminSpace: 'Espace Admin',
      brandName: 'RAPID PIÈCES',
    },
    auth: {
      email: 'Email',
      password: 'Mot de passe',
      name: 'Nom',
      phone: 'Téléphone',
      location: 'Localisation',
      role: 'Rôle',
      buyer: 'Acheteur',
      seller: 'Vendeur',
      loginTitle: 'Connexion',
      registerTitle: 'Inscription',
      loginSubtitle: 'Connectez-vous à votre compte',
      registerSubtitle: 'Créez votre compte',
      forgotPassword: 'Mot de passe oublié ?',
      noAccount: 'Pas de compte ?',
      hasAccount: 'Déjà un compte ?',
      whoAreYou: 'Qui êtes-vous ?',
      buyerDescription: 'Trouvez la pièce qu\'il vous faut',
      sellerDescription: 'Enregistrez votre boutique et vendez',
      chooseProfile: 'Choisir un profil',
      connect: 'Se connecter',
      register: 'Inscription',
      createAccount: 'Ouvrir un compte',
      sellerRegister: 'Inscription Vendeur',
      buyerRegister: 'Inscription Acheteur',
      storeName: 'Nom du magasin',
      fullName: 'Nom complet',
      youAre: 'Vous êtes',
      country: 'Pays',
      city: 'Ville',
      select: 'Sélectionner',
      address: 'Adresse',
      openingHours: 'Horaires d\'ouverture',
      note: 'Note',
      brands: 'Marques',
      categories: 'Catégories',
      conditionTypes: 'Types de condition',
      stockLevel: 'Niveau de stock',
      paymentMethods: 'Méthodes de paiement',
      paymentConditions: 'Conditions de paiement',
      deliveryService: 'Service de livraison',
      deliveryAvailable: 'Livraison disponible',
      loginInProgress: 'Connexion...',
      accountCreated: 'Compte créé avec succès ! Vous pouvez maintenant vous connecter directement à chaque visite.',
      registrationFailed: 'Inscription impossible',
      phoneNumber: 'Numéro de téléphone',
      otherPhone: 'Autre numéro',
      emailOptional: 'Email (optionnel)',
      passwordRequired: 'Mot de passe',
      parts: 'Type de pièces',
      condition: 'État de la pièce',
      yes: 'Oui',
      no: 'Non',
      registerButton: 'S\'inscrire',
      adminAccountRequired: 'Compte admin requis.',
      adminLoginSubtitle: 'Connectez-vous pour administrer Rapid Pièces.',
      buyerLoginSubtitle: 'Connectez-vous pour commencer à commander des pièces',
      buyerRegisterSubtitle: 'Enregistrez-vous pour commencer à commander des pièces',
      sellerLoginSubtitle: 'Connectez-vous et commencez à vendre dès aujourd\'hui.',
      confirmPassword: 'Confirmer le mot de passe',
      placeholderEmail: 'votre@email.com (facultatif)',
      placeholderName: 'Ex: Jean Kakpassi',
      placeholderStore: 'Ex: BigMoteurs',
      buyerIndividual: 'Particulier',
      buyerMechanic: 'Mécanicien',
      buyerGarage: 'Garage',
      buyerBusiness: 'Entreprise',
      specifyCity: 'Saisissez votre ville',
      specifyBrand: 'Précisez la marque',
      specifyCategory: 'Précisez la catégorie',
      acceptTerms: "J'accepte les",
      termsLink: 'conditions générales de vente',
      alreadyHaveAccount: 'Déjà un compte ?',
      loginLink: 'Se connecter',
      paymentNumberRequired: 'Numéro de réception des paiements',
      pendingVerification: 'Votre compte sera en attente de vérification avant activation.',
      placeholderNote: 'Informations complémentaires (optionnel)',
      placeholderPaymentNumber: 'Votre numéro pour recevoir les paiements',
    },
    seller: {
      dashboard: 'Tableau de bord',
      newRequests: 'Nouvelles demandes',
      recentSales: 'Ventes récentes',
      monthlyRevenue: 'Chiffre d\'affaires du mois',
      salesThisMonth: 'vente(s) ce mois-ci',
      responses: 'Réponses',
      responseTime: 'Temps rép.',
      performance: 'Performance du mois',
      transactions: 'Transactions',
      compliance: 'Satisfaction client',
      returns: 'Retour de pièce',
      stock: 'Stock',
      rapidSellerScore: 'Rapid Seller Score',
      basedOnTransactions: 'Basé sur {count} transaction(s)',
      badgeProgression: 'Progression des badges',
      currentBadge: 'Badge',
      specialties: 'Spécialités',
      brands: 'Marques',
      store: 'Magasin',
      notifications: 'Notifications',
      alerts: 'Alertes nouvelles demandes',
      statistics: 'Statistiques',
      support: 'Support vendeur',
      guide: 'Guide vendeur',
      account: 'Compte et préférences',
      myProfile: 'Mon profil',
      location: 'Localisation',
      since: 'Depuis',
      totalRevenue: 'CA Total',
      counterOffers: 'Contre-offres',
      pendingOffers: 'Offres en attente',
      waitingResponse: 'en attente de réponse',
      buyerProposed: 'proposés par l\'acheteur',
      requests: 'Demandes',
      messages: 'Messages',
      whatsappSupport: 'Support vendeur WhatsApp',
    },
    buyer: {
      myRequests: 'Mes demandes',
      newRequest: 'Nouvelle demande',
      myOrders: 'Mes commandes',
      findParts: 'Trouver des pièces',
      requestPart: 'Demander une pièce',
      vehicleInfo: 'Informations véhicule',
      partDetails: 'Détails de la pièce',
      quality: 'Qualité',
      condition: 'État de la pièce',
      quantity: 'Quantité',
      budget: 'Offre acheteur',
      submitRequest: 'Soumettre la demande',
      offers: 'Offres',
      negotiations: 'Négociations',
      orderHistory: 'Historique des commandes',
    },
    request: {
      title: 'Demande',
      subtitle: 'Sous-titre',
      status: 'Statut',
      draft: 'Brouillon',
      open: 'Ouvert',
      matched: 'Matché',
      ordered: 'Commandé',
      completed: 'Effectué',
      expired: 'Expiré',
      noOffers: 'Pas d\'offre',
      makeOffer: 'Faire une offre',
      counterOffer: 'Contre-offre',
      acceptOffer: 'Accepter l\'offre',
      rejectOffer: 'Rejeter l\'offre',
      negotiate: 'Négocier',
    },
    offer: {
      price: 'Prix',
      quality: 'Qualité',
      availability: 'Disponibilité',
      delivery: 'Livraison',
      warranty: 'Garantie',
      seller: 'Vendeur',
      rapidScore: 'Rapid Score',
      description: 'Description',
      propose: 'Proposer',
      counter: 'Contre-offrir',
      accept: 'Accepter',
      reject: 'Rejeter',
    },
    order: {
      status: 'Statut',
      pending: 'En attente',
      confirmed: 'Confirmé',
      shipped: 'Expédié',
      inTransit: 'En transit',
      delivered: 'Livré',
      completed: 'Effectué',
      cancelled: 'Annulé',
      estimatedDelivery: 'Livraison estimée',
      escrowStatus: 'Statut séquestre',
      tracking: 'Suivi',
    },
    quality: {
      oem: 'OEM',
      genuine: 'Genuine',
      premium: 'Premium',
      standard: 'Standard',
      used: 'Occasion',
      reconditioned: 'Reconditionné',
    },
    delivery: {
      rapidNow: 'RAPID PIECES',
      rapidCity: 'RAPID CITY',
      rapidNigeria: 'RAPID NIGERIA',
      rapidUsa: 'RAPID USA',
      rapidChina: 'RAPID CHINA',
      rapidDubai: 'RAPID DUBAI',
      rapidTurkey: 'RAPID TURQUIE',
      rapidFrance: 'RAPID FRANCE',
      rapidGermany: 'RAPID ALLEMAGNE',
      rapidEngland: 'RAPID ANGLETERRE',
    },
    fuel: {
      essence: 'Essence',
      diesel: 'Diesel',
      hybrid: 'Hybride',
      electric: 'Électrique',
      lpg: 'GPL',
    },
    condition: {
      new: 'Nouveau',
      old: 'Ancien',
    },
    badge: {
      newSeller: 'New Seller',
      rapidSeller: 'Rapid Seller',
      verifiedSeller: 'Verified Seller',
      premiumSeller: 'Premium Seller',
      topSeller: 'Top Seller',
    },
    admin: {
      dashboard: 'Tableau de bord',
      sellers: 'Vendeurs',
      transactions: 'Transactions',
      requests: 'Demandes',
      config: 'Configuration',
      platformActive: 'Plateforme active',
      operational: 'Opérationnel',
      settings: 'Paramètres',
      uptime: 'Disponibilité',
      performance: 'Performance',
      internationalSourcing: 'Sourcing international',
      recentActivity: 'Activité récente',
      commissionPayment: 'Commission & Paiement',
      delivery: 'Livraison',
      trust: 'Confiance',
      dangerZone: 'Zone dangereuse',
      suspendPlatform: 'Suspendre la plateforme',
      exportData: 'Exporter toutes les données',
    },
    groupBuy: {
      title: 'Achats groupés',
      subtitle: 'Économisez en achetant ensemble',
      step1: 'Rapid Pièces détecte 35+ demandes identiques',
      step2: 'Négociation collective avec le fournisseur (Nigeria/USA)',
      step3: 'Prix réduit garanti pour tous les participants',
      step4: 'Livraison groupée, vous recevez votre pièce',
    },
    parts: {
      brakePadsFront: 'Plaquettes de frein avant',
      oilFilter: 'Filtre à huile',
      rearShockAbsorber: 'Amortisseur arrière',
      battery60Ah: 'Batterie 60Ah',
    },
    sourcing: {
      title: 'Sourcing International',
      heroSubtitle: 'Accédez à des pièces du monde entier',
      requestButton: "Demander une pièce à l'international",
      formTitle: 'Formulaire de sourcing',
    },
    supplier: {
      spaceTitle: 'Espace Fournisseur',
      ordersWon: 'Commandes gagnées',
      successRate: 'Taux succès',
      shipments: 'Expéditions',
    },
    vehicleHistory: {
      title: 'Historique véhicule',
      subtitle: 'Suivi complet des pièces',
    },
    whatsappContact: {
      title: 'Messages sécurisés',
      subtitle: 'Communication protégée par Rapid Pièces',
      protectedLabel: 'Communication protégée',
      protectedNotice: 'Tous les échanges passent par Rapid Pièces pour votre sécurité.',
    },
    legal: {
      art1_title: 'Objet et présentation du service',
      art1_p1: "La plateforme Rapid Pièces (accessible via application mobile et site web) est une place de marché digitale spécialisée dans la mise en relation d'acheteurs de pièces automobiles (particuliers, mécaniciens, flottes d'entreprises) avec des vendeurs professionnels, des fournisseurs internationaux et des prestataires logistiques partenaires.",
      art1_p2: "Rapid Pièces agit en qualité de courtier technologique et d'intermédiaire de mise en relation via un système d'appel d'offres (Request-to-Market).",
      art2_title: 'Accès au service et création de compte',
      art2_l1_title: 'Éligibilité :',
      art2_l1_text: "l'utilisation de l'application est réservée aux personnes physiques majeures et aux personnes morales régulièrement enregistrées.",
      art2_l2_title: 'Types de comptes :',
      art2_l2_buyer: 'Acheteur : Particulier, Garage/Mécanicien, Gestionnaire de flotte B2B.',
      art2_l2_seller: 'Vendeur : Magasin de pièces détachées, grossiste, importateur (soumis à validation KYC par Rapid Pièces).',
      art2_l3_title: 'Exactitude des informations :',
      art2_l3_text: "l'utilisateur s'engage à fournir des informations exactes lors de l'inscription et lors du dépôt des demandes de pièces (marque, modèle, année, numéro VIN, photos).",
      art3_title: 'Fonctionnement des commandes et demandes de devis (Request-to-Market)',
      art3_l1_title: 'Dépôt de demande :',
      art3_l1_text: "l'Acheteur publie gratuitement une demande de pièce en indiquant les caractéristiques du véhicule et le niveau de qualité recherché (OEM, Genuine, Premium Aftermarket, Standard, Occasion, Reconditionné).",
      art3_l2_title: 'Émission des offres :',
      art3_l2_text: 'les Vendeurs qualifiés transmettent leurs offres (Prix, Qualité, Disponibilité, Garantie).',
      art3_l3_title: 'Classement des offres (Rapid Score) :',
      art3_l3_text: "les offres présentées à l'Acheteur sont classées dynamiquement selon un algorithme multi-critères (Prix, Qualité, Disponibilité, Score du Vendeur, Délai de livraison). L'Acheteur conserve la liberté de choisir l'offre de son choix.",
      art4_title: 'Paiement et sécurisation des transactions (séquestre)',
      art4_l1_title: 'Paiement sécurisé :',
      art4_l1_text: "le règlement des commandes s'effectue directement sur l'application via les moyens de paiement autorisés (Mobile Money, Carte bancaire, Espèces).",
      art4_l2_title: 'Système de séquestre (Escrow) :',
      art4_l2_text: "à la validation de la commande par l'Acheteur, les fonds sont encaissés et conservés de manière sécurisée par Rapid Pièces ou son partenaire de paiement agréé.",
      art4_l3_title: 'Libération des fonds :',
      art4_l3_text: "les fonds ne sont reversés au Vendeur qu'après confirmation par l'Acheteur (ou confirmation logistique) de la réception et de la conformité de la pièce livrée.",
      art4_l4_title: 'Pour les ventes internationales :',
      art4_l4_text: 'les fonds sont reversés au Vendeur par le Représentant après vérification de la pièce par ce dernier.',
      art5_title: 'Modalités de livraison et délais',
      art5_intro: 'Les prestations de livraison sont exécutées par Rapid Pièces et ses partenaires logistiques selon les formules choisies lors de la commande :',
      art5_l1_title: 'Rapid Pièces :',
      art5_l1_text: 'pièce disponible localement, livraison express dans la journée (cible < 2h à 6h selon zone).',
      art5_l2_title: 'Rapid City :',
      art5_l2_text: 'pièce disponible en zone urbaine/périurbaine.',
      art5_l3_title: 'Rapid Nigeria / Rapid USA (Sourcing International) :',
      art5_l3_text: "pièces sourcées à l'étranger. Les délais indicatifs de transit et les frais de douane/fret applicables sont précisés lors de l'émission du devis de sourcing.",
      art6_title: 'Règles de conduite et interdiction de contournement',
      art6_l1_title: 'Modération des échanges :',
      art6_l1_text: "pour garantir la sécurité des transactions et la prise en charge des garanties, les échanges d'informations s'effectuent via l'interface de messagerie sécurisée de l'application.",
      art6_l2_title: 'Confidentialité des coordonnées :',
      art6_l2_text: "il est strictement interdit aux utilisateurs (Acheteurs et Vendeurs) d'échanger directement des numéros de téléphone, adresses e-mails, liens WhatsApp, coordonnées bancaires ou adresses physiques en dehors du tunnel de commande de la plateforme.",
      art6_l3_title: 'Système automatique de filtrage :',
      art6_l3_text: 'Rapid Pièces utilise des outils de modération automatique masquant toute tentative de communication directe de coordonnées.',
      art6_l4_title: 'Sanctions :',
      art6_l4_text: "tout contournement délibéré du système de paiement ou de commande de la plateforme entraînera la suspension immédiate du compte et l'annulation des garanties associées.",
      art7_title: 'Conformité, retours et garanties',
      art7_l1_title: 'Obligation de conformité du Vendeur :',
      art7_l1_text: "le Vendeur est seul responsable de l'exactitude de la catégorie de qualité déclarée et de la conformité de la pièce avec la demande de l'Acheteur.",
      art7_l2_title: 'Délai de réclamation :',
      art7_l2_text: "l'Acheteur dispose d'un délai d'évaluation à compter de la réception de la pièce (24h à 72h selon le type de pièce) pour signaler toute non-conformité ou défectuosité sur l'application.",
      art7_l3_title: 'Procédure de retour :',
      art7_l3_text: "en cas de pièce non conforme ou incompatible (sous réserve que les informations du véhicule fournies par l'Acheteur soient exactes), la pièce sera retournée au vendeur et pourra être remboursée ou échangée par ce dernier.",
      art8_title: 'Propriété intellectuelle',
      art8_p: "Tous les éléments graphiques, codes sources, marques, logos et algorithmes (notamment le Rapid Score et les outils de recommandation) sont la propriété exclusive de RAPID PIÈCES / Next Africa Automotive. Toute reproduction non autorisée est strictement interdite.",
      art9_title: 'Protection des données personnelles',
      art9_p: "Les données à caractère personnel collectées (numéro de téléphone, localisation, données de véhicules) sont traitées conformément aux réglementations en vigueur pour la gestion des commandes, l'amélioration des services et l'envoi de notifications relatives au fonctionnement de l'application.",
      art10_title: 'Droit applicable et règlement des litiges',
      art10_p: "Les présentes CGU/CGV sont soumises au droit en vigueur. Tout litige relatif à leur interprétation ou leur exécution fera l'objet d'une tentative de résolution amiable via le service client de Rapid Pièces. À défaut d'accord amiable, le litige sera porté devant les juridictions compétentes.",
    },
  },
  en: {
    common: {
      welcome: 'Welcome',
      login: 'Login',
      logout: 'Logout',
      register: 'Register',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      submit: 'Submit',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      search: 'Search',
      filter: 'Filter',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      confirm: 'Confirm',
      yes: 'Yes',
      no: 'No',
      or: 'or',
      and: 'and',
      currency: 'FCFA',
      betaOpen: 'Open Beta',
      mobileAppNo1: 'The #1 mobile app for auto parts in France',
      allParts: 'All your auto parts.',
      deliveredFast: 'Delivered fast.',
      scanPlate: 'Scan your license plate, instantly find the part',
      compatible: '100% compatible',
      certifiedOrigin: 'certified origin manufacturer and receive it at home or at your garage in 24h.',
      compatibility: 'Compatibility',
      guaranteed100: '100% Guaranteed',
      delivery: 'Delivery',
      expressDelivery: 'Express 24h/48h',
      bigBrands: 'Big Brands',
      factoryPrice: 'Factory direct price',
      accessApp: 'Access the app',
      howItWorksTitle: "How the app works in 3 steps?",
      howItWorksSubtitle: "Ordering an auto part has never been faster and more secure.",
      howItWorksBadge: "Simple, Fast, Error-Free",
      step1Title: "Scan your license plate or registration",
      step1Desc: "The app instantly identifies your exact model, engine, year, and original equipment. No mechanical jargon required.",
      step1Badge: "1 Second",
      step2Title: "Select your guaranteed parts",
      step2Desc: "Access detailed sheets, customer reviews, exploded views and mounting guides. All parts displayed are 100% certified compatible.",
      step2Badge: "Direct Price",
      step3Title: "Receive in 24h & track the driver",
      step3Desc: "Your parts are shipped the same day. Track your package arrival in real-time on the interactive map to your door or workshop.",
      step3Badge: "Express Delivery",
      stepVerified: "Step verified by our experts",
      zeroRiskTitle: "Rapid Pièces Zero Risk Commitment",
      zeroRiskDesc: "If the selected part does not fit, we handle the return free of charge within 30 days.",
      downloadApp: "Download App",
      inStock: 'In stock',
      onOrder: 'On order',
      lightMode: 'Switch to light mode',
      darkMode: 'Switch to dark mode',
      reqInProgress: 'In progress',
      reqFound: 'Part found',
      reqUrgent: 'Urgent',
      offersCount: '{count} offers',
      respond: 'Respond',
      legalTitle: 'General Terms of Use and Sale',
      legalUpdate: 'Rapid Pièces — Last updated: September 2026',
      legalEditor: 'App Publisher:',
      legalIRead: 'I have read and understood',
      offerPageTitle: 'Offers received',
      offerLoading: 'Loading...',
      offerNotFound: 'Request not found',
      offerExpiredNotice: 'This request has expired.',
      offerRenewLink: 'Renew it',
      offerFilterAll: 'All',
      offerFilterLocal: 'Local',
      offerFilterIntl: 'International',
      offerSortBestScore: 'Best score',
      offerSortPrice: 'Price',
      offerSortRating: 'Rating',
      offerScoreFormula: 'Rapid Score = Price (30%) + Quality (25%) + Availability (20%) + Reputation (15%) + Lead time (10%)',
      offerNoOffers: 'No offers yet.',
      offerAcceptError: 'Action failed',
      offerRejectError: 'Action failed',
      offerCounterError: 'Action failed',
      offerAcceptedToast: 'Offer accepted.',
      offerRejectedToast: 'Offer rejected.',
      offerCounterSentToast: 'Counter-offer sent.',
      orderStatusPaymentPending: 'Payment pending',
      orderStatusPaid: 'Paid',
      orderStatusShipping: 'Shipping',
      orderStatusDelivered: 'Delivered',
      orderStatusCompleted: 'Completed',
      orderStatusCancelled: 'Cancelled',
      myOrders: 'My orders',
      ordersInProgress: 'In progress',
      ordersDelivered: 'Delivered',
      ordersPoints: 'Rapid Points',
      ordersAll: 'All',
      howItWorks: 'How does it work?',
      fee: 'Fee',
      loginIncorrect: 'Incorrect username or password',
      adminRegisterDisabled: 'Admin account creation is disabled.',
      fillRequiredFields: 'Please fill in all required fields',
      verifyPhone: 'Please verify your phone number (code received by SMS).',
      passwordsMismatch: 'Passwords do not match',
      acceptTermsRequired: 'Please accept the terms of sale',
      paymentNumberRequired: 'Please provide your payment receiving number',
    },
    nav: {
      home: 'Home',
      requests: 'Requests',
      catalogue: 'Catalogue',
      orders: 'Orders',
      profile: 'Profile',
      notifications: 'Notifications',
      settings: 'Settings',
      help: 'Help',
      sellerSpace: 'Seller Space',
      buyerSpace: 'Buyer Space',
      adminSpace: 'Admin Space',
      brandName: 'RAPID PIÈCES',
    },
    auth: {
      email: 'Email',
      password: 'Password',
      name: 'Name',
      phone: 'Phone',
      location: 'Location',
      role: 'Role',
      buyer: 'Buyer',
      seller: 'Seller',
      loginTitle: 'Login',
      registerTitle: 'Register',
      loginSubtitle: 'Sign in to your account',
      registerSubtitle: 'Create your account',
      forgotPassword: 'Forgot password?',
      noAccount: 'No account?',
      hasAccount: 'Already have an account?',
      whoAreYou: 'Who are you?',
      buyerDescription: 'Find the part you need',
      sellerDescription: 'Register your shop and sell',
      chooseProfile: 'Choose a profile',
      connect: 'Sign in',
      register: 'Register',
      createAccount: 'Create account',
      sellerRegister: 'Seller Registration',
      buyerRegister: 'Buyer Registration',
      storeName: 'Store name',
      fullName: 'Full name',
      youAre: 'You are',
      country: 'Country',
      city: 'City',
      select: 'Select',
      address: 'Address',
      openingHours: 'Opening hours',
      note: 'Note',
      brands: 'Brands',
      categories: 'Categories',
      conditionTypes: 'Condition types',
      stockLevel: 'Stock level',
      paymentMethods: 'Payment methods',
      paymentConditions: 'Payment conditions',
      deliveryService: 'Delivery service',
      deliveryAvailable: 'Delivery available',
      loginInProgress: 'Signing in...',
      accountCreated: 'Account created successfully! You can now sign in directly every time you visit.',
      registrationFailed: 'Registration failed',
      phoneNumber: 'Phone number',
      otherPhone: 'Other phone',
      emailOptional: 'Email (optional)',
      passwordRequired: 'Password',
      parts: 'Parts',
      condition: 'Part Condition',
      yes: 'Yes',
      no: 'No',
      registerButton: 'Register',
      adminAccountRequired: 'Admin account required.',
      adminLoginSubtitle: 'Sign in to administer Rapid Pièces.',
      buyerLoginSubtitle: 'Sign in to start ordering parts',
      buyerRegisterSubtitle: 'Register to start ordering parts',
      sellerLoginSubtitle: 'Sign in and start selling today.',
      confirmPassword: 'Confirm password',
      placeholderEmail: 'your@email.com (optional)',
      placeholderName: 'e.g. Jean Kakpassi',
      placeholderStore: 'e.g. BigMoteurs',
      buyerIndividual: 'Individual',
      buyerMechanic: 'Mechanic',
      buyerGarage: 'Garage',
      buyerBusiness: 'Business',
      specifyCity: 'Enter your city',
      specifyBrand: 'Specify the brand',
      specifyCategory: 'Specify the category',
      acceptTerms: 'I accept the',
      termsLink: 'terms of sale',
      alreadyHaveAccount: 'Already have an account?',
      loginLink: 'Sign in',
      paymentNumberRequired: 'Payment receiving number',
      pendingVerification: 'Your account will be pending verification before activation.',
      placeholderNote: 'Additional information (optional)',
      placeholderPaymentNumber: 'Your number to receive payments',
    },
    seller: {
      dashboard: 'Dashboard',
      newRequests: 'New Requests',
      recentSales: 'Recent Sales',
      monthlyRevenue: 'Monthly Revenue',
      salesThisMonth: 'sale(s) this month',
      responses: 'Responses',
      responseTime: 'Response Time',
      performance: 'Monthly Performance',
      transactions: 'Transactions',
      compliance: 'Customer Satisfaction',
      returns: 'Part Returns',
      stock: 'Stock',
      rapidSellerScore: 'Rapid Seller Score',
      basedOnTransactions: 'Based on {count} transaction(s)',
      badgeProgression: 'Badge Progression',
      currentBadge: 'Badge',
      specialties: 'Specialties',
      brands: 'Brands',
      store: 'Store',
      notifications: 'Notifications',
      alerts: 'New request alerts',
      statistics: 'Statistics',
      support: 'Seller Support',
      guide: 'Seller Guide',
      account: 'Account and preferences',
      myProfile: 'My Profile',
      location: 'Location',
      since: 'Since',
      totalRevenue: 'Total Revenue',
      counterOffers: 'Counter-offers',
      pendingOffers: 'Pending Offers',
      waitingResponse: 'waiting for response',
      buyerProposed: 'proposed by buyer',
      requests: 'Requests',
      messages: 'Messages',
      whatsappSupport: 'WhatsApp Seller Support',
    },
    buyer: {
      myRequests: 'My Requests',
      newRequest: 'New Request',
      myOrders: 'My Orders',
      findParts: 'Find Parts',
      requestPart: 'Request Part',
      vehicleInfo: 'Vehicle Information',
      partDetails: 'Part Details',
      quality: 'Quality',
      condition: 'Part Condition',
      quantity: 'Quantity',
      budget: 'Offre acheteur',
      submitRequest: 'Submit Request',
      offers: 'Offers',
      negotiations: 'Negotiations',
      orderHistory: 'Order History',
    },
    request: {
      title: 'Request',
      subtitle: 'Subtitle',
      status: 'Status',
      draft: 'Draft',
      open: 'Open',
      matched: 'Matched',
      ordered: 'Ordered',
      completed: 'Completed',
      expired: 'Expired',
      noOffers: 'No offers',
      makeOffer: 'Make Offer',
      counterOffer: 'Counter-offer',
      acceptOffer: 'Accept Offer',
      rejectOffer: 'Reject Offer',
      negotiate: 'Negotiate',
    },
    offer: {
      price: 'Price',
      quality: 'Quality',
      availability: 'Availability',
      delivery: 'Delivery',
      warranty: 'Warranty',
      seller: 'Seller',
      rapidScore: 'Rapid Score',
      description: 'Description',
      propose: 'Propose',
      counter: 'Counter',
      accept: 'Accept',
      reject: 'Reject',
    },
    order: {
      status: 'Status',
      pending: 'Pending',
      confirmed: 'Confirmed',
      shipped: 'Shipped',
      inTransit: 'In Transit',
      delivered: 'Delivered',
      completed: 'Completed',
      cancelled: 'Cancelled',
      estimatedDelivery: 'Estimated Delivery',
      escrowStatus: 'Escrow Status',
      tracking: 'Tracking',
    },
    quality: {
      oem: 'OEM',
      genuine: 'Genuine',
      premium: 'Premium',
      standard: 'Standard',
      used: 'Used',
      reconditioned: 'Reconditioned',
    },
    delivery: {
      rapidNow: 'RAPID PIECES',
      rapidCity: 'RAPID CITY',
      rapidNigeria: 'RAPID NIGERIA',
      rapidUsa: 'RAPID USA',
      rapidChina: 'RAPID CHINA',
      rapidDubai: 'RAPID DUBAI',
      rapidTurkey: 'RAPID TURKEY',
      rapidFrance: 'RAPID FRANCE',
      rapidGermany: 'RAPID GERMANY',
      rapidEngland: 'RAPID ENGLAND',
    },
    fuel: {
      essence: 'Petrol',
      diesel: 'Diesel',
      hybrid: 'Hybrid',
      electric: 'Electric',
      lpg: 'LPG',
    },
    condition: {
      new: 'New',
      old: 'Old',
    },
    badge: {
      newSeller: 'New Seller',
      rapidSeller: 'Rapid Seller',
      verifiedSeller: 'Verified Seller',
      premiumSeller: 'Premium Seller',
      topSeller: 'Top Seller',
    },
    admin: {
      dashboard: 'Dashboard',
      sellers: 'Sellers',
      transactions: 'Transactions',
      requests: 'Requests',
      config: 'Config',
      platformActive: 'Platform active',
      operational: 'Operational',
      settings: 'Settings',
      uptime: 'Uptime',
      performance: 'Performance',
      internationalSourcing: 'International Sourcing',
      recentActivity: 'Recent activity',
      commissionPayment: 'Commission & Payment',
      delivery: 'Delivery',
      trust: 'Trust',
      dangerZone: 'Danger Zone',
      suspendPlatform: 'Suspend platform',
      exportData: 'Export all data',
    },
    groupBuy: {
      title: 'Group Buying',
      subtitle: 'Save by buying together',
      step1: 'Rapid Pièces detects 35+ identical requests',
      step2: 'Collective negotiation with the supplier (Nigeria/USA)',
      step3: 'Guaranteed reduced price for all participants',
      step4: 'Group delivery, you receive your part',
    },
    parts: {
      brakePadsFront: 'Front brake pads',
      oilFilter: 'Oil filter',
      rearShockAbsorber: 'Rear shock absorber',
      battery60Ah: '60Ah battery',
    },
    sourcing: {
      title: 'International Sourcing',
      heroSubtitle: 'Access parts from around the world',
      requestButton: 'Request an international part',
      formTitle: 'Sourcing form',
    },
    supplier: {
      spaceTitle: 'Supplier Space',
      ordersWon: 'Orders won',
      successRate: 'Success rate',
      shipments: 'Shipments',
    },
    vehicleHistory: {
      title: 'Vehicle History',
      subtitle: 'Full parts tracking',
    },
    whatsappContact: {
      title: 'Secure Messages',
      subtitle: 'Communication protected by Rapid Pièces',
      protectedLabel: 'Protected communication',
      protectedNotice: 'All exchanges go through Rapid Pièces for your security.',
    },
    legal: {
      art1_title: 'Purpose and presentation of the service',
      art1_p1: 'The Rapid Pièces platform (accessible via mobile app and website) is a digital marketplace specialized in connecting buyers of auto parts (individuals, mechanics, corporate fleets) with professional sellers, international suppliers, and partner logistics providers.',
      art1_p2: 'Rapid Pièces acts as a technology broker and matchmaking intermediary through a bidding system (Request-to-Market).',
      art2_title: 'Access to the service and account creation',
      art2_l1_title: 'Eligibility:',
      art2_l1_text: 'use of the application is reserved for adult individuals and duly registered legal entities.',
      art2_l2_title: 'Account types:',
      art2_l2_buyer: 'Buyer: Individual, Garage/Mechanic, B2B fleet manager.',
      art2_l2_seller: 'Seller: Auto parts store, wholesaler, importer (subject to KYC validation by Rapid Pièces).',
      art2_l3_title: 'Accuracy of information:',
      art2_l3_text: 'the user agrees to provide accurate information when registering and when submitting part requests (make, model, year, VIN number, photos).',
      art3_title: 'How orders and quote requests work (Request-to-Market)',
      art3_l1_title: 'Submitting a request:',
      art3_l1_text: 'the Buyer freely posts a part request specifying the vehicle characteristics and the desired quality level (OEM, Genuine, Premium Aftermarket, Standard, Used, Reconditioned).',
      art3_l2_title: 'Submitting offers:',
      art3_l2_text: 'qualified Sellers submit their offers (Price, Quality, Availability, Warranty).',
      art3_l3_title: 'Ranking of offers (Rapid Score):',
      art3_l3_text: "offers presented to the Buyer are dynamically ranked using a multi-criteria algorithm (Price, Quality, Availability, Seller Score, Delivery time). The Buyer remains free to choose the offer of their choice.",
      art4_title: 'Payment and transaction security (escrow)',
      art4_l1_title: 'Secure payment:',
      art4_l1_text: 'orders are settled directly on the application via the authorized payment methods (Mobile Money, Card, Cash).',
      art4_l2_title: 'Escrow system:',
      art4_l2_text: "when the Buyer confirms the order, funds are collected and held securely by Rapid Pièces or its approved payment partner.",
      art4_l3_title: 'Release of funds:',
      art4_l3_text: "funds are only released to the Seller after the Buyer (or logistics) confirms receipt and conformity of the delivered part.",
      art4_l4_title: 'For international sales:',
      art4_l4_text: 'funds are released to the Seller by the Representative after the part has been verified by the latter.',
      art5_title: 'Delivery terms and timeframes',
      art5_intro: 'Delivery is carried out by Rapid Pièces and its logistics partners according to the option chosen at checkout:',
      art5_l1_title: 'Rapid Pièces:',
      art5_l1_text: 'part available locally, same-day express delivery (target < 2h to 6h depending on area).',
      art5_l2_title: 'Rapid City:',
      art5_l2_text: 'part available in the urban/suburban area.',
      art5_l3_title: 'Rapid Nigeria / Rapid USA (International Sourcing):',
      art5_l3_text: 'parts sourced abroad. Indicative transit times and applicable customs/freight fees are specified when the sourcing quote is issued.',
      art6_title: 'Rules of conduct and prohibition of circumvention',
      art6_l1_title: 'Moderation of exchanges:',
      art6_l1_text: "to ensure transaction security and warranty coverage, information exchanges take place via the application's secure messaging interface.",
      art6_l2_title: 'Confidentiality of contact details:',
      art6_l2_text: 'users (Buyers and Sellers) are strictly prohibited from directly exchanging phone numbers, email addresses, WhatsApp links, banking details, or physical addresses outside the platform\'s order flow.',
      art6_l3_title: 'Automatic filtering system:',
      art6_l3_text: 'Rapid Pièces uses automatic moderation tools that mask any attempt at direct exchange of contact details.',
      art6_l4_title: 'Sanctions:',
      art6_l4_text: "any deliberate circumvention of the platform's payment or order system will result in immediate account suspension and cancellation of associated warranties.",
      art7_title: 'Compliance, returns, and warranties',
      art7_l1_title: "Seller's compliance obligation:",
      art7_l1_text: "the Seller is solely responsible for the accuracy of the declared quality category and the conformity of the part with the Buyer's request.",
      art7_l2_title: 'Claim period:',
      art7_l2_text: 'the Buyer has an evaluation period from receipt of the part (24h to 72h depending on the part type) to report any non-conformity or defect on the application.',
      art7_l3_title: 'Return procedure:',
      art7_l3_text: "in the event of a non-conforming or incompatible part (provided the vehicle information supplied by the Buyer is accurate), the part will be returned to the seller and may be refunded or exchanged by the latter.",
      art8_title: 'Intellectual property',
      art8_p: 'All graphic elements, source code, trademarks, logos, and algorithms (including the Rapid Score and recommendation tools) are the exclusive property of RAPID PIÈCES / Next Africa Automotive. Any unauthorized reproduction is strictly prohibited.',
      art9_title: 'Protection of personal data',
      art9_p: 'Personal data collected (phone number, location, vehicle data) is processed in accordance with applicable regulations for order management, service improvement, and sending notifications related to the operation of the application.',
      art10_title: 'Applicable law and dispute resolution',
      art10_p: "These Terms of Use/Sale are governed by applicable law. Any dispute relating to their interpretation or execution will first be subject to an attempt at amicable resolution via Rapid Pièces' customer service. Failing an amicable agreement, the dispute will be brought before the competent courts.",
    },
  },
};

export function getTranslation(lang: Language, path: string): string {
  const keys = path.split('.');
  let value: any = translations[lang];
  
  for (const key of keys) {
    value = value?.[key];
  }
  
  return value || path;
}
