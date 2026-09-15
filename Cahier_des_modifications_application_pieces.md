# Cahier_des_modifications_application_pieces

CAHIER DES MODIFICATIONS
Application de vente de pièces automobiles
Synthèse des améliorations demandées lors de la réunion client
1. Gestion des pays et des utilisateurs
Classement des vendeurs et acheteurs
• Les vendeurs et acheteurs d’un même pays doivent être regroupés dans une même table côté backend/base de
données.
• Permettre à l’administrateur de reconnaître rapidement le pays et de filtrer/classer les utilisateurs par pays.
Reconnaissance des numéros de téléphone
• Reconnaître le pays à partir de l’indicatif téléphonique.
• Lors de l’inscription, l’indicatif du pays doit pouvoir s’afficher automatiquement selon le pays sélectionné/localisation.
• Exemple : Bénin→+229.
2. Notifications
Côté vendeur
• La cloche ouvre une fenêtre regroupant : Comptes-offres, Offres, Messages et Demandes.
Côté acheteur
• La cloche regroupe : Offres et Messages.
3. Écran de démarrage
Nouveau parcours
• Supprimer le système de switch Acheteurs/Vendeurs présent à l’arrivée.
• Afficher deux grands blocs/cartes : Acheteur et Vendeur.
• Après le choix : afficher Inscription et Connexion.
4. Inscription vendeur
Espace vendeur
• Conserver le logo en haut.
• Remplacer le message par : « Enregistrer votre boutique et commencer à vendre ».
Téléphones
• Champ : « Numéro de téléphone principal ».
• En dessous : « Autre numéro ».
Adresse
• Ajouter un champ « Adresse » après Pays et Ville.
Marques
Page 1

• Retirer Volkswagen, Peugeot et Renault.
• Ajouter Range Rover.
Pièces
• Remplacer le titre « Catégorie » par « Pièces ».
Condition
• Ajouter « Condition » avec : Nouveau / Ancien.
Niveau du stock
• Ajouter : Grand / Moyen / Petit.
Conditions de paiement
• Ajouter : Cash / Mobile / Banque.
Livraison
• Ajouter « Service de livraison » : Oui / Non.
Horaires
• Ajouter « Horaires d’ouverture ».
Note
• Ajouter une section « Note » permettant une information complémentaire.
Après inscription
• Après l’enregistrement, rediriger vers la page de connexion.
5. Connexion vendeur
Message
• Remplacer le petit message par : « Connectez-vous et commencez à vendre dès aujourd’hui. »
6. Tableau de bord vendeur
Chiffre d’affaires
• Remplacer « Chiffre d’affaires » par « Chiffre d’affaires du mois ».
• Le mois doit être dynamique : janvier→« Chiffre d’affaires du mois de janvier », etc.
• Le chiffre d’affaires mensuel se réinitialise à chaque nouveau mois.
Réorganisation
• Déplacer les quatre sections actuellement placées après « Chiffre d’affaires du mois » en dessous de « Nouvelles
demandes ».
7. Construction automatique du nom d’une demande
Principe
• Le système construit automatiquement le nom à partir des informations saisies par l’acheteur.
• Les éléments sont séparés par une barre verticale « | ».
Ordre exact
Page 2

• 1. Nom de la pièce
• 2. Marque de la voiture
• 3. Modèle de la voiture
• 4. Année
• 5. Nombre de cylindres
• 6. Type de moteur
• 7. Carburant
• 8. Condition de la pièce
• 9. Numéro de châssis
• 10. Note
• 11. Position de la pièce
• 12. Qualité de la pièce
Hiérarchie visuelle
• Les quatre premiers éléments (Nom de la pièce, Marque, Modèle, Année) sont le titre principal : plus grands, visibles
et idéalement en gras.
• Tout le reste apparaît en dessous comme sous-titre : beaucoup plus petit, discret, éventuellement gris.
• Il ne s’agit pas nécessairement de mettre les informations en minuscules.
Ancien contenu
• Supprimer les anciens éléments affichés sous les demandes et les remplacer par cette nouvelle structure.
8. Espace acheteur
Profil
• Supprimer l’élément « Vendeur » situé dans le coin supérieur.
Identité
• Remplacer « Client démo » par le nom de la personne ou son activité.
• Exemples : nom d’une personne, « Garage Tan », « Mécanicien », etc.
Localisation
• Afficher la localisation juste sous le nom ou l’activité, comme information secondaire.
Véhicules enregistrés
• Permettre l’enregistrement de véhicules afin d’éviter de remplir à nouveau le formulaire lors de futures demandes.
• Fonctionnalité réservée exclusivement aux particuliers.
• Les garages, mécaniciens et entreprises ne peuvent pas enregistrer de véhicules, car ils voient passer de nombreux
véhicules appartenant à différents clients.
Panier
• Ajouter un panier côté acheteur.
• Le panier contient les demandes préparées mais pas encore envoyées.
Paiements en attente
Page 3

• Ajouter près du panier une icône/indicateur, éventuellement avec badge rouge.
• Il signale une offre acceptée mais pas encore payée.
Système de points
• Si un acheteur accepte une commande/offre et ne paie pas, ses points diminuent.
9. Offres et contre-offres
Réponses multiples
• Plusieurs vendeurs peuvent répondre à une même demande avec des offres/contre-offres.
• L’acheteur peut choisir au maximum trois vendeurs avec lesquels échanger.
Actions sur une contre-offre
• À réception d’une contre-offre, trois choix : Accepter / Faire une contre-offre / Refuser.
• Accepter : la proposition est validée.
• Faire une contre-offre : la proposition repart vers l’autre partie.
• Refuser : la négociation concernée se termine et disparaît de l’espace actif.
Limite de négociation
• Le système limite les allers-retours de contre-offres.
• La règle exprimée est de trois propositions maximum dans la chaîne de négociation.
• Au-delà, afficher un message indiquant que le nombre maximum de contre-offres est atteint.
Acceptation
• Quand une offre est acceptée, toutes les autres offres/contre-offres liées à la même demande sont gelées.
• Plus aucun autre vendeur ne peut répondre à cette demande.
Demande déjà satisfaite
• Si un autre vendeur tente de répondre après satisfaction, afficher un message indiquant que la demande a déjà été
satisfaite ou que l’acheteur a déjà trouvé ce qu’il recherchait.
10. Cycle de vie des demandes
Réinitialisation
• Les demandes actives doivent être réinitialisées toutes les 24 heures.
Historique
• Les demandes restent consultables dans l’historique.
• L’historique est conservé au maximum trois mois.
• Au-delà de trois mois, les anciennes données ne sont plus conservées.
Point à valider avec le client
La règle des contre-offres doit être confirmée précisément : la discussion mentionne « deux allers-retours maximum » et également «
au plus trois ». La synthèse retient provisoirement trois propositions maximum dans la chaîne, mais le mode exact de comptage doit
être validé avant développement.
Page 4
