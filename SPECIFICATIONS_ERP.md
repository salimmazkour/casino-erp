# SPÉCIFICATIONS ERP - COMPLEXE HÔTEL CASINO RESTAURATION

## DESCRIPTION GÉNÉRALE
ERP complet pour un complexe comprenant : Hôtel (43 chambres), Restaurants, Bars, Casino et Boîte de nuit.

---

## POINTS DE VENTE

### 1. HÔTEL (24h/24)
- **43 Chambres** dont :
  - Chambres Simples
  - Chambres Supérieures
  - Suites
  - 4 Suites
  - 1 Suite Parentale (pour parents avec enfants)
- Types possiblement amenés à évoluer
- **Point de vente à la réception** (pas de caisse tactile, uniquement hôtel)

### 2. RESTAURANT LE JARDIN
- **Horaires** : 6h - 1h du matin
- Restaurant avec bar intégré
- Caisse tactile

### 3. BAR SALLE DE JEUX TRADITIONNELS (JT)
- **Horaires** : 16h - 5h du matin
- Bar avec jeux traditionnels
- Caisse tactile

### 4. BAR MACHINES À SOUS
- **Horaires** : 10h - 5h du matin
- Bar aux machines à sous
- Caisse tactile

### 5. RESTAURANT SEVEN SEVEN
- **Horaires** : 12h - 2h du matin
- Restaurant avec bar intégré
- Caisse tactile
- **Tablettes serveurs** pour prise de commande uniquement

### 6. BOÎTE DE NUIT SEVEN
- **Horaires** : 21h - 6h du matin
- Bar uniquement
- Caisse tactile

---

## MOYENS DE PAIEMENT

1. **Espèces**
2. **Cartes Bancaires**
3. **Compte Client** (crédit client)
4. **Orange Money**
5. **Wave**
6. **Virement bancaire**
7. **Offert Personnel** (selon droits configurés)
8. **Offert Client** (geste commercial)
9. **Offert Échange Points MAS** (système de points casino)
10. **Chèque** (si applicable)

---

## GESTION HÔTELIÈRE

### Réservations
- **Intégration SiteMinder** (synchronisation automatique)
- Plateformes : **Booking** et **Expedia**
- Réservations en ligne + réception

### Types de séjour
- **Nuitées classiques**
- **Day Use** :
  - Disponible à n'importe quelle heure
  - Tarif fixe (paramétrable)

### Check-in / Check-out
- **Check-in par défaut** : 15h
- **Check-out par défaut** : 12h
- **Flexibilité totale** : pas de blocage système, horaires modifiables

### Chambres
- Tarification par type de chambre
- Possibilité de tarifs différents selon saisons/périodes
- Gestion statuts : Libre / Occupée / Réservée / Sale / Maintenance

### Magnétiseur
- Génération et encodage des cartes d'accès chambres lors du check-in

### Transfert de consommations
- Possibilité de facturer les consommations des autres points de vente sur la chambre
- Exemple : acheter un coca au Restaurant Le Jardin et le faire facturer sur la chambre

---

## GESTION DES PRODUITS

### Types de produits
Le système permet de gérer différents types de produits :
1. **Produits Vente** : Produits destinés à la vente directe aux clients
2. **Matières Premières** : Ingrédients utilisés dans les recettes (non vendables directement)
3. **Consommables** : Produits consommables non destinés à la vente
4. **Services** : Services vendus (hébergement, prestations)

**Configuration** :
- Chaque type de produit définit s'il peut être vendu directement (`can_be_sold`)
- Les matières premières n'apparaissent pas dans les points de vente
- Seuls les produits de type "vente" peuvent être dupliqués dans les points de vente

**Interface conditionnelle** :
Le type de produit sélectionné détermine les sections disponibles dans le formulaire :
- **Produits Vente** : accès aux sections "Composition/Recette", "Points de vente", et "Configuration recettes par point de vente"
- **Matières Premières** : accès uniquement à la section "Dépôts de stockage" (pas de points de vente)
- **Consommables** : accès uniquement à la section "Dépôts de stockage" (pas de points de vente)
- **Services** : accès uniquement à la section "Points de vente" (pas de gestion de stock/dépôts)

#### Matières Premières - Exemples créés
**20 ingrédients de base** ont été créés et sont stockés dans **l'Economat Général** :

**Produits de base** :
- Farine de blé (50 kg en stock) - Alerte: 10 kg
- Sucre blanc (40 kg) - Alerte: 10 kg
- Huile végétale (20 L) - Alerte: 5 L
- Sel fin (10 kg) - Alerte: 5 kg
- Poivre noir (3 kg) - Alerte: 2 kg

**Produits laitiers** :
- Lait entier (30 L) - Alerte: 10 L
- Œufs frais (180 unités) - Alerte: 50 unités
- Beurre (15 kg) - Alerte: 5 kg
- Crème fraîche (12 L) - Alerte: 5 L
- Fromage râpé (8 kg) - Alerte: 3 kg

**Viandes** :
- Viande de bœuf (25 kg) - Alerte: 10 kg
- Poulet entier (20 kg) - Alerte: 8 kg

**Légumes** :
- Tomates fraîches (15 kg) - Alerte: 5 kg
- Oignons (12 kg) - Alerte: 5 kg
- Pommes de terre (60 kg) - Alerte: 20 kg
- Ail (5 kg) - Alerte: 2 kg

**Autres** :
- Pain de mie (24 unités) - Alerte: 10 unités
- Riz blanc (35 kg) - Alerte: 15 kg
- Pâtes sèches (25 kg) - Alerte: 10 kg
- Sauce tomate (20 kg) - Alerte: 10 kg

**Règles appliquées** :
- Type: Matières Premières (`can_be_sold = false`)
- Dépôt de stockage: Economat Général (assignation automatique)
- Prix coût configuré (HT)
- TVA: 18%
- Alertes de stock minimum configurées
- Stocks initiaux créés

### Caractéristiques produits
- **Nom, description, référence**
- **Type de produit** (obligatoire)
- **Catégorie / Famille de produits**
- **Prix de vente** (possiblement différent par point de vente)
- **Coût d'achat** (pour calcul de marge)
- **TVA**
- **Produits composés** : liste des ingrédients/composants
- **Unité de mesure**
- **Code-barres / QR code** (si applicable)

### Duplication par point de vente
**Pour les produits vendables uniquement** :
- Possibilité de dupliquer un produit dans plusieurs points de vente
- Configuration par point de vente :
  - **Prix de vente spécifique** (optionnel, sinon prix de base)
  - **Dépôt de stockage** associé

**Pour les produits composés vendus dans plusieurs points de vente** :
- Configuration du **dépôt de stockage des ingrédients** par point de vente
- Système de recettes multiples : chaque point de vente peut prélever ses ingrédients dans un dépôt différent
- Enregistrement dans la table `product_recipes_by_sales_point`

### Configuration impression par produit
- **Imprimante de fabrication** : choix de l'imprimante destination
  - Exemple : Coca Cola → Imprimante Bar Jardin
  - Burger → Imprimante Cuisine Jardin
- Possibilité d'associer plusieurs imprimantes si nécessaire

### Gestion des stocks
- **Stock initial** par point de vente / économat
- **Déduction automatique** lors de chaque vente (produits composés)
- **Alertes de stock minimum** paramétrables
- **Inventaire** :
  - Bars : quotidien (par les barmans)
  - Économat général : mensuel
- **Calcul des consommations** automatique
- **Module d'aide au réapprovisionnement** basé sur l'historique

### Gestion des pertes
- Déduction du stock avec motif (casse, péremption, etc.)
- **Validation manager obligatoire**
- **Rapports de pertes** par période

---

## SYSTÈME DE CAISSE

### Interface
- **Tactile** pour tous les points de vente (sauf réception hôtel)
- **Boutons produits personnalisables**
- **Raccourcis / Favoris**
- Organisation par catégories

### Gestion des tables (Restaurants)
- **Plan de salle personnalisable** par restaurant :
  - Configuration du nombre de tables
  - Numérotation personnalisée (T1, Table 1, VIP1, etc.)
  - Capacité (nombre de places) par table
  - Organisation par zones/sections (Terrasse, Intérieur, VIP, etc.)

- **Double vue** :
  - **Mode graphique** :
    - Représentation visuelle 2D du plan de salle
    - Positionnement libre des tables (coordonnées X, Y)
    - Couleurs selon statut :
      - Vert : Disponible
      - Rouge : Occupée
      - Orange : Réservée
      - Bleu : Fusionnée
    - Affichage du numéro de table et du nombre de convives
    - Clic sur une table pour ouvrir/consulter la commande
  - **Mode liste** :
    - Liste textuelle : Table 1, Table 2, Table 3...
    - Filtrage par zone et par statut
    - Recherche rapide par numéro de table

- **Statuts des tables** :
  - **Disponible** (`available`) : Table libre, prête à accueillir des clients
  - **Occupée** (`occupied`) : Table avec commande en cours
  - **Réservée** (`reserved`) : Table réservée pour une heure précise
  - **Fusionnée** (`merged`) : Table combinée avec d'autres tables

- **Fonctions avancées** :
  - **Fusion de tables** :
    - Combiner plusieurs tables pour un grand groupe
    - Les commandes des tables fusionnées sont regroupées
    - Statut "fusionnée" avec indication des tables combinées
  - **Transfert inter-tables** :
    - Déplacer une commande d'une table vers une autre
    - Historique des transferts (date, heure, utilisateur, raison)
    - Motif obligatoire pour traçabilité
  - **Séparation de tables** :
    - Séparer une table fusionnée en tables individuelles
    - Répartition des articles de commande entre les tables
  - **Assignation serveur** :
    - Attribution d'un serveur à une table
    - Suivi des tables par serveur
    - Calcul des ventes par serveur
  - **Gestion des convives** :
    - Nombre de personnes à la table
    - Utile pour statistiques (ticket moyen par personne)

### Gestion des tickets
- **Tickets en attente** :
  - Mise en attente d'une commande pour paiement ultérieur
  - Chaque ticket en attente affiche : numéro, date/heure, table, client, articles, montant, statut
  - Visualisation en temps réel de tous les tickets en attente
  - Automatiquement retiré de la liste après paiement

- **Division de tickets** (Split) :
  - Possibilité de diviser une commande en plusieurs tickets de paiement
  - Répartition des articles entre différents convives
  - Chaque nouveau ticket généré est indépendant
  - Conservation de la traçabilité (lien avec le ticket original)

### Réservations restaurant
- Créer une réservation (nom, téléphone, nb personnes, date/heure)
- Assigner tables
- Statuts : En attente / Confirmée / Arrivée / Annulée
- Notes spéciales (allergies, préférences)
- Historique client

### Ouverture / Clôture de caisse
**Ouverture** :
- Saisie du fond de caisse
- Identification caissier

**Clôture obligatoire** :
- Comptage physique de tous les moyens de paiement
- Calcul automatique des écarts
- Justification si écart détecté
- **Validation manager obligatoire** si écart > seuil paramétrable
- Génération rapport X (intermédiaire) ou Z (final)
- **Blocage de la fermeture** (X) avant clôture complète

---

## SYSTÈME D'IMPRESSION

### Types d'imprimantes
- **Thermiques** (tickets de caisse, bons cuisine/bar)
- **All-in-one** (hôtel)

### Configuration
- Table des imprimantes disponibles :
  - Nom (ex: "Bar Jardin", "Cuisine Seven")
  - Type
  - Adresse IP / réseau
  - Point de vente associé
  - Statut

### Fonctions d'impression
- **Ticket de caisse**
- **Facture**
- **Bon de fabrication Bar**
- **Bon de fabrication Cuisine**
- **Rapport X / Z**
- **Autres** (selon besoins)

### Modèles personnalisables
- **Identification de la provenance** sur chaque impression
  - Exemple : "Caisse JT" vs "Caisse JARDIN" sur les bons cuisine
- Format adapté (58mm ou 80mm)
- Logo, coordonnées, mentions légales

### Routage automatique
- Lors de la validation d'une commande :
  - Coca → imprimante configurée (Bar Jardin)
  - Burger → imprimante Cuisine Jardin
  - Ticket de caisse → imprimante caisse du point de vente

---

## KDS - KITCHEN DISPLAY SYSTEM

### Fonctionnalités
- **Affichage temps réel** des commandes par station
- **Code couleur** selon ancienneté :
  - Vert : récent
  - Orange : attention
  - Rouge : urgent
- **Organisation** : par table, par priorité, par heure
- **Actions** : "En cours" → "Prêt" → "Servi"
- **Notifications** au serveur/caisse
- **Son/notification** à l'arrivée d'une commande
- **Historique** de la journée
- **Mode hybride** : impression papier + KDS (transition douce)
- **Multi-écrans** : plusieurs KDS par cuisine si besoin

---

## GESTION DES OFFERTS

### Types d'offerts
1. **Offert Personnel** (selon droits configurés par employé)
2. **Offert Client** (geste commercial libre avec validation manager si > seuil)
3. **Offert Échange Points MAS** (automatique selon points casino disponibles)

### Configuration Offerts Personnel
**Par profil/rôle** :
- Directeur : accès à toutes familles, quantité illimitée
- Manager : familles spécifiques, X items/jour
- Serveur : boissons non-alcoolisées uniquement, Y items/jour
- Barman : familles définies, Z items/jour

**Paramètres** :
- **Familles de produits autorisées**
- **Quantités autorisées par jour**
- **Montant maximum** (optionnel)
- **Points de vente autorisés**

**Contrôles** :
- Compteur temps réel des offerts consommés
- Alerte si limite atteinte
- **Validation manager obligatoire** si dépassement
- Historique par employé
- Rapport mensuel des offerts personnel

**En caisse** :
- Sélection "Offert Personnel"
- Badge ou code employé
- Vérification automatique des droits
- Blocage si quota dépassé

---

## GESTION DU PERSONNEL

### Fiches employés
- Informations personnelles
- **Rôle** :
  - Direction
  - Caissier
  - Responsable Économat
  - Économat
  - Comptable
  - Serveur
  - Réceptionniste
  - Responsable Hôtellerie
  - Barman
  - Cuisinier
- **Point(s) de vente assigné(s)**
- Horaires de travail
- Taux horaire
- Droits d'accès système (permissions paramétrables)
- Droits d'offerts personnel

### Permissions (à paramétrer)
- Accès aux modules (caisse, stocks, rapports, etc.)
- Visualisation rapports financiers
- Modification prix / remises
- Validation écarts
- Gestion utilisateurs
- Etc.

### Calcul de paie (à développer)
- Suivi des heures travaillées
- Heures supplémentaires
- Calcul automatique selon taux horaire

---

## GESTION FOURNISSEURS & ACHATS

### Fiches fournisseurs
- Nom, coordonnées
- Catégories de produits fournis
- Conditions de paiement
- Délais de livraison
- Historique commandes

### Bons de commande
- Création manuelle ou automatique (aide au réapprovisionnement)
- Validation responsable
- Suivi statut : Brouillon / Envoyée / En cours / Livrée
- Relances automatiques

### Réception marchandises
- **Bon de réception** avec :
  - Quantités reçues vs commandées
  - Contrôle qualité
  - **Prix réels facturés** (peuvent différer de la commande)
- **Mise à jour automatique** :
  - Stocks (ajout quantités)
  - Coûts d'achat produits (prix facture finale)
- **Saisie manuelle possible** pour achats directs sans commande

### Aide au réapprovisionnement
- Analyse automatique des consommations
- Calcul des besoins par période
- Suggestions de commande
- Alertes produits critiques

---

## PROMOTIONS & RÉDUCTIONS

### Types de promotions
- **Happy Hour** : réduction % ou montant fixe sur période horaire
- **Menu du jour** : tarif spécial
- **3 pour 2, 2+1 offert**, etc.
- **Réduction % ou montant fixe** sur produit/catégorie
- **Offres spéciales événements**

### Configuration
- Période de validité (dates, heures)
- Produits / catégories concernés
- Points de vente applicables
- Conditions d'application
- Validation manager si besoin

---

## RAPPORTS & STATISTIQUES

### Rapports de ventes
**Filtres flexibles** :
- Par point de vente
- Par shift (matin, après-midi, soir)
- Par jour / semaine / mois
- Par période personnalisée (date début → date fin)
- Par serveur/employé

**Détails** :
- Chiffre d'affaires total
- Détail par moyen de paiement :
  - Espèces
  - Carte bancaire
  - Orange Money
  - Wave
  - Compte client
  - Offert Personnel
  - Offert Client
  - Offert Échange Points MAS
  - Autres
- Nombre de transactions
- Ticket moyen
- Produits les plus vendus

### Rapport X (intermédiaire)
- Sans clôture de caisse
- Consultation en cours de service
- CA en temps réel

### Rapport Z (final)
- Clôture définitive
- Détail complet
- Écarts de caisse
- Signature électronique

### Rapport consommation produits
- **Par point de vente**
- Produits vendus (quantités)
- Coût d'achat unitaire
- **Coût total consommé**
- Prix de vente vs coût → **marge**
- Par catégorie / famille
- Analyse de rentabilité

### Rapport de pertes
- Pertes par motif (casse, périmé, vol, etc.)
- Quantités et valeur
- Par période et point de vente
- Validation manager

### Tableau de bord
**Vue synthétique** :
- **CA du jour** (temps réel)
- **Stocks critiques** (alertes)
- **Commandes en attente** (cuisine/bar)
- **Meilleures ventes** (top produits)
- Taux d'occupation chambres
- Statistiques clés

---

## COMPTABILITÉ

### Export comptable
- Format : **CSV**
- Destination : **Logiciel Thalia**
- Données exportables :
  - Journal des ventes
  - Achats fournisseurs
  - Mouvements de caisse
  - TVA collectée/déductible
  - Paiements clients/fournisseurs

### Gestion TVA
- Taux multiples configurables
- Calcul automatique
- États de TVA

---

## SÉCURITÉ & TRAÇABILITÉ

### Logs système
- **Traçabilité complète** de toutes les actions sensibles :
  - Modifications de prix
  - Suppressions de données
  - Remises importantes
  - Annulations de commandes
  - Modifications de stock
  - Accès aux rapports financiers
  - Clôtures de caisse
  - Validations manager

**Informations enregistrées** :
- Date et heure
- Utilisateur
- Action effectuée
- Anciennes et nouvelles valeurs
- IP / Terminal

### Sauvegardes
- **Automatiques quotidiennes**
- Rétention configurable
- Restauration possible

### Permissions
- Système de rôles et permissions granulaires
- Restriction par module
- Restriction par point de vente
- Validation multi-niveaux (manager) pour actions critiques

---

## MATÉRIEL

### Points de vente (POS)
- **Ordinateurs avec écrans tactiles**
- **Machines POS tactiles dédiées**
- Interface optimisée pour tactile

### Imprimantes
- **Thermiques** : tickets, bons (58mm ou 80mm)
- **All-in-one** : hôtel

### Terminaux de Paiement (TPE)
- **Plusieurs TPE par point de vente** (gestion multi-TPE)
- Sélection du TPE lors du paiement

### Tablettes
- **Restaurant Seven Seven uniquement** (pour serveurs)
- Interface légère pour prise de commande rapide
- Synchronisation temps réel avec caisse

### Magnétiseur
- Encodage cartes d'accès chambres
- Intégration driver/API selon modèle

---

## SPÉCIFICATIONS TECHNIQUES

### Base de données
- **PostgreSQL** via **Supabase**
- Performances optimales pour flux importants
- Sécurité RLS (Row Level Security)
- Temps réel pour synchronisation caisse/cuisine/bar
- Logs et audit trail natifs
- Scalabilité prouvée

### Interface
- **Langue** : Français uniquement
- **Design responsive** : prévu pour évolution mobile future
- Interface tactile optimisée
- Navigation intuitive

### Architecture
- Multi-établissements / multi-points de vente
- Gestion centralisée
- Synchronisation temps réel
- Mode en ligne (connexion internet permanente recommandée)

---

## MODULES PRINCIPAUX À DÉVELOPPER

1. **Gestion Hôtelière**
   - Réservations (intégration SiteMinder)
   - Planning chambres
   - Check-in / Check-out
   - Magnétiseur cartes

2. **Gestion Produits & Stocks**
   - Catalogue produits
   - **Types de produits** (Vente, Matières premières, Consommables, Services)
   - Produits composés
   - **Duplication multi-points de vente** avec configuration spécifique
   - **Recettes par point de vente** pour produits composés
   - Stocks multi-niveaux
   - Alertes et réapprovisionnement

3. **Système de Caisse (POS)**
   - Interface tactile
   - Gestion tables
   - Multi moyens de paiement
   - Ouverture/clôture

4. **Impression**
   - Configuration imprimantes
   - Modèles personnalisables
   - Routage automatique

5. **KDS (Kitchen Display System)**
   - Affichage temps réel
   - Gestion priorités
   - Notifications

6. **Gestion Personnel**
   - Fiches employés
   - Permissions
   - Offerts personnel
   - Calcul paie (futur)

7. **Gestion Fournisseurs & Achats**
   - Fiches fournisseurs
   - Bons de commande
   - Réception marchandises
   - Aide au réapprovisionnement

8. **Réservations Restaurant**
   - Planning tables
   - Plan de salle

9. **Promotions & Réductions**
   - Configuration promotions
   - Application automatique

10. **Rapports & Statistiques**
    - Rapports de ventes (X et Z)
    - Consommations
    - Pertes
    - Tableau de bord

11. **Comptabilité**
    - Export CSV (Thalia)
    - Gestion TVA

12. **Administration**
    - Gestion utilisateurs
    - Permissions
    - Configuration système
    - Logs et traçabilité

---

## ÉVOLUTIONS FUTURES

- Application mobile (responsive prévu)
- Calcul automatique de paie
- Intégration badges/pointage
- Gestion congés/absences
- Planning automatique
- Programme fidélité clients étendu
- Statistiques avancées IA
- Intégration comptable avancée

---

## NOTES IMPORTANTES

- **Flexibilité** : le système doit permettre des ajustements sans blocages
- **Scalabilité** : prévoir l'ajout de nouveaux points de vente
- **Performance** : flux importants à gérer sans ralentissements
- **Traçabilité** : toutes les actions sensibles doivent être loguées
- **Sécurité** : permissions granulaires et validations multi-niveaux
- **Évolutivité** : architecture modulaire pour ajouts futurs

---

**Document créé le : 2025-10-16**
**Dernière mise à jour : 2025-10-20**
**Version : 2.3**
**Statut : En développement**

---

## HISTORIQUE DES MODIFICATIONS

### Version 2.3 (2025-10-20)
- **Système d'achats et réceptions complet** :
  - **Module Commandes d'Achat** :
    - Création et gestion des bons de commande fournisseurs
    - Sélection du fournisseur et du dépôt de destination
    - Ajout de lignes de commande (produit, quantité, prix unitaire)
    - Calcul automatique des totaux (HT, TVA, TTC)
    - Statuts : Brouillon → Validée → Partiellement reçue → Réceptionnée → Annulée
    - Interface intuitive avec recherche de produits
  - **Module Réceptions de Marchandises** :
    - Création de réceptions à partir d'une commande
    - Enregistrement des quantités reçues vs commandées
    - Gestion des écarts (quantité acceptée vs refusée)
    - Prix réels facturés (peuvent différer de la commande)
    - Contrôle qualité avec notes par ligne
    - **Mise à jour automatique des stocks** dans le dépôt de réception
    - Statuts : Brouillon → Validée
  - **Module Historique des Achats** :
    - Consultation de l'historique par produit
    - Filtrage par période
    - Affichage : date, commande, fournisseur, quantités, prix
    - Statistiques : quantité totale, prix moyen d'achat
    - **Filtre automatique sur Matières Premières uniquement**
  - **Système de mouvements de stock automatisé** :
    - Création automatique de mouvements lors des réceptions
    - **Mise à jour automatique de `product_stocks`** via triggers
    - Types de mouvements étendus : purchase, sale, transfer_in/out, adjustment_in/out, breakage, expired, restock
    - Trigger INSERT : calcul et mise à jour automatique du stock
    - Trigger DELETE : recalcul automatique du stock après suppression
    - Cohérence totale entre `stock_movements` et `product_stocks`
  - **Tables créées** :
    - `suppliers` : Fournisseurs
    - `purchase_orders` : Commandes d'achat
    - `purchase_order_lines` : Lignes de commande
    - `purchase_receptions` : Réceptions de marchandises
    - `purchase_reception_lines` : Lignes de réception
  - **Triggers automatiques** :
    - `trigger_create_stock_movement_on_reception` : Crée un mouvement de stock lors d'une réception
    - `trigger_update_po_received_quantity` : Met à jour les quantités reçues sur la commande
    - `trigger_update_product_stocks` : Met à jour les stocks produits lors d'un mouvement
    - `trigger_update_product_stocks_on_delete` : Recalcule les stocks lors de suppression d'un mouvement
  - **Liaison complète des dépôts** :
    - `purchase_orders.destination_location_id` : Dépôt de destination de la commande
    - `purchase_receptions.storage_location_id` : Dépôt où arrive la marchandise
    - `stock_movements.storage_location_id` : Dépôt du mouvement de stock
    - `product_stocks.storage_location_id` : Dépôt du stock produit
  - **Flux complet vérifié et fonctionnel** :
    1. Création commande → dépôt de destination défini
    2. Création réception → dépôt de stockage obligatoire
    3. Validation réception → mouvement de stock automatique
    4. Mouvement de stock → mise à jour automatique de product_stocks
    5. Stock toujours cohérent avec les réceptions

### Version 2.2 (2025-10-19)
- **Système d'annulation complet avec traçabilité** :
  - **Table `void_logs`** créée pour enregistrer toutes les annulations :
    - Type d'annulation : ligne individuelle ou ticket complet
    - Référence à la commande et à l'article (si ligne)
    - Employé ayant effectué l'annulation
    - Raison optionnelle de l'annulation
    - Détails complets des produits annulés (snapshot JSON)
    - Montant total annulé
    - Point de vente et horodatage
  - **Permissions d'annulation granulaires** :
    - `void_line` : Permission d'annuler une ligne de commande
    - `void_ticket` : Permission d'annuler un ticket complet
    - Attribution par rôle :
      - Administrateur et Manager : void_line + void_ticket
      - Caissier, Serveur, Barman : void_line uniquement
      - Autres rôles : aucune permission d'annulation
  - **Interface POS améliorée** :
    - Bouton 🚫 sur chaque ligne du panier pour annulation (si permission)
    - Bouton "🚫 Annuler le ticket" pour annuler tout le panier (si permission)
    - Demande de confirmation avec raison optionnelle
    - Enregistrement automatique dans les logs
    - Alertes claires en cas de permission insuffisante
  - **Page "Historique des Annulations"** :
    - Accès via le menu principal (visible si permission pos.view)
    - Filtres : Type (ligne/ticket), dates, point de vente
    - Statistiques : Total annulations, lignes vs tickets, montant total annulé
    - Tableau détaillé : Date/heure, type, point de vente, produits, montant, employé, raison
    - Design moderne avec badges de couleur par type
    - Exportable pour audit
  - **Sécurité et traçabilité** :
    - Toutes les annulations sont enregistrées de manière indélébile
    - Impossible de supprimer un log d'annulation
    - Snapshot des produits préservé même si les produits changent
    - Identité de l'employé systématiquement enregistrée
    - RLS activé pour sécuriser l'accès
  - **Impact sur la gestion** :
    - Traçabilité complète de toutes les erreurs de saisie et corrections
    - Détection des patterns d'annulation (formation, problèmes récurrents)
    - Calcul précis du CA réel (ventes - annulations)
    - Audit trail complet pour comptabilité et contrôle

- **Base de données de test complète** :
  - **100 produits créés** :
    - 30 ingrédients (viandes, légumes, épices, produits de base)
    - 20 boissons non-alcoolisées (sodas, jus, cafés, eaux)
    - 20 boissons alcoolisées (bières, vins, spiritueux, cocktails)
    - 10 desserts (tartes, glaces, pâtisseries)
    - 20 plats (10 composés + 10 simples)
  - **10 plats composés avec recettes complètes** (46 lignes de recettes) :
    1. Poulet Yassa (5 ingrédients)
    2. Thiéboudienne (5 ingrédients)
    3. Mafé (5 ingrédients)
    4. Poulet grillé frites (3 ingrédients)
    5. Steak frites (4 ingrédients)
    6. Salade César (5 ingrédients)
    7. Pizza Margherita (4 ingrédients)
    8. Burger Classic (6 ingrédients)
    9. Pasta Carbonara (4 ingrédients)
    10. Poisson braisé (5 ingrédients)
  - **Prix configurés** :
    - 20 produits ont des prix dans "Economat Général"
    - Plats composés : 3200 - 6500 FCFA
    - Boissons : 400 - 4000 FCFA
  - **Stocks initialisés** :
    - 12 produits avec stock initial dans "Economat Général"
    - Ingrédients : 20-300 unités selon type
    - Boissons : 80-150 unités
  - **Système prêt pour tests complets** :
    - Commandes en caisse avec déduction automatique
    - Gestion des mouvements de stock
    - Inventaires
    - Tests multi-points de vente

### Version 2.1 (2025-10-18)
- **Amélioration majeure du système de gestion des recettes et versioning** :
  - **Système de versioning des recettes** :
    - Création de la table `product_recipe_history` pour historiser toutes les modifications de recettes
    - Enregistrement automatique de chaque version avec snapshot complet de la recette
    - Traçabilité complète : date, utilisateur, ancienne et nouvelle recette, raison de modification
    - Consultation de l'historique avec affichage détaillé des changements
  - **Calcul différentiel des ajustements de stock** :
    - Nouvelle logique pour éviter les doubles déductions lors de modifications de recettes
    - Comparaison intelligente entre ancienne et nouvelle recette
    - Ajustement uniquement de la différence (ingrédients ajoutés/supprimés/modifiés)
    - Élimination du mode "Depuis le début" qui causait des doubles déductions
  - **Détection et réparation des incohérences** :
    - Outil de réparation automatique des ajustements rétroactifs incorrects
    - Analyse des mouvements de stock incorrects
    - Recalcul et correction automatique des stocks
    - Rapport détaillé des corrections appliquées
  - **Corrections de bugs critiques** :
    - Correction de la logique d'ajustement rétroactif qui dédoublait les déductions
    - Réparation manuelle des stocks Citron vert (-31 au lieu de -63) et Coca Cola (57 au lieu de -5) dans Bar Jardin
    - Nettoyage des mouvements incorrects dans l'historique
  - **Améliorations de l'interface** :
    - Bouton "Historique des modifications" dans le formulaire produit
    - Modal d'historique avec affichage détaillé des versions
    - Visualisation claire de chaque recette historique
    - Comparaison facile entre versions
  - **Impact sur la gestion des stocks** :
    - Plus de doubles déductions lors de modifications de recettes
    - Stocks toujours cohérents avec l'historique réel des ventes
    - Traçabilité complète de toutes les modifications de recettes
    - Possibilité d'audit et de correction en cas d'anomalie

### Version 2.1 (2025-10-20)
- **Ajout de matières premières de base** :
  - Création de **20 ingrédients essentiels** pour les restaurants et bars :
    - 5 produits de base (farine, sucre, huile, sel, poivre)
    - 5 produits laitiers (lait, œufs, beurre, crème, fromage)
    - 2 viandes (bœuf, poulet)
    - 4 légumes (tomates, oignons, pommes de terre, ail)
    - 4 autres produits (pain, riz, pâtes, sauce tomate)
  - **Configuration automatique** :
    - Type: Matières Premières (non vendables directement)
    - Dépôt: Economat Général (assignation automatique)
    - Prix coût HT configuré pour chaque ingrédient
    - TVA: 18%
    - Alertes de stock minimum paramétrées par produit
  - **Stocks initiaux** créés dans l'Economat Général :
    - Quantités réalistes par produit
    - Exemple: 50kg farine, 40kg sucre, 180 œufs, etc.
  - **Sauvegarde SQL** créée : `backup_matieres_premieres_20251020_212619.sql`
  - **Documentation** : Liste détaillée ajoutée au cahier des charges
- **Optimisation page Fournisseurs** :
  - Passage en format **tableau** (comme page Clients)
  - Calcul du **Total dû** par fournisseur (commandes en cours)
  - Calcul du **Montant échu** basé sur :
    - Date de réception de la marchandise (facture)
    - Conditions de paiement du fournisseur (ex: "30 jours fin de mois")
  - Résumé global en en-tête (Total dû et Échu pour tous les fournisseurs)
  - Affichage en rouge des montants échus
  - Colonnes optimisées: Code, Nom, Contact, Téléphone, Email, Conditions paiement, Total dû, Échu, Statut, Actions

### Version 2.0 (2025-10-18)
- **Amélioration du système de gestion des stocks et mouvements** :
  - **Corrections de bugs critiques** :
    - Correction du nom du dépôt "Economat Général" (sans accent sur le E) dans toutes les fonctions de transfert de stock
    - Résolution des erreurs de requêtes SQL liées aux UUID vides lors du chargement des produits disponibles
    - Cohérence des noms de dépôts dans tout le code (Economat Général, Casse / Périmés)
  - **Logique de transfert de stock optimisée** :
    - Depuis "Economat Général" : possibilité de transférer vers n'importe quel dépôt (champ destination vide et activé)
    - Depuis tout autre dépôt : transfert uniquement vers "Casse / Périmés" (destination pré-remplie et verrouillée)
    - Désactivation et grisage visuel du champ destination lorsque verrouillé
  - **Création automatique de dépôts par défaut pour ingrédients** :
    - Lors de la création d'un produit de type "Matières Premières", deux dépôts sont automatiquement assignés :
      - **Economat Général** (dépôt principal)
      - **Casse / Périmés** (pour gestion des pertes)
    - Insertion automatique dans la table `product_prices` sans intervention manuelle
    - Logique d'insertion intelligente : ajout uniquement des dépôts non déjà présents
  - **Amélioration de l'expérience utilisateur** :
    - Interface claire et intuitive pour les mouvements de stock
    - Messages d'erreur explicites en cas de problème
    - Affichage cohérent des noms de dépôts partout
  - **Impact sur la gestion des stocks** :
    - Facilite la création de nouveaux ingrédients (dépôts pré-configurés)
    - Simplifie le workflow de gestion des pertes (casse, périmés)
    - Améliore la traçabilité des mouvements de stock entre dépôts

### Version 1.9 (2025-10-18)
- **Amélioration de l'expérience utilisateur et responsive design** :
  - **Interface responsive complète** :
    - Adaptation automatique à toutes les résolutions d'écran
    - Tailles de police adaptatives (16px → 14px → 13px → 12px selon résolution)
    - Design optimisé pour PC portables, tablettes et mobiles
    - Prévention du débordement horizontal sur tous les écrans
  - **Menu latéral adaptatif** :
    - Menu fixe sur grands écrans (>768px)
    - Menu tiroir (drawer) sur mobile avec bouton hamburger
    - Largeur adaptative selon la résolution (280px → 240px → 220px)
    - Fermeture automatique lors de la sélection d'un module sur mobile
  - **Tableaux responsive** :
    - Défilement horizontal sur petits écrans
    - Taille de police et padding adaptés
    - Largeur minimale pour préserver la lisibilité
  - **Cartes et grilles responsive** :
    - Grilles adaptatives (3 colonnes → 2 colonnes → 1 colonne)
    - Espacement et padding optimisés par résolution
  - **Formulaires et boutons responsive** :
    - Taille de police et padding adaptés
    - Largeur 100% sur mobile pour faciliter l'interaction tactile
  - **Modals responsive** :
    - Largeur adaptative (90% → 95% sur mobile)
    - Marges réduites sur petits écrans
  - **En-têtes et filtres adaptatifs** :
    - Passage en colonne sur petits écrans
    - Boutons et selects en pleine largeur
  - **Système de caisse responsive** :
    - Grille de produits adaptative (5 colonnes → 3 colonnes → 2 colonnes)
    - Panier en overlay fixe sur tablette/mobile
    - Actions de caisse optimisées pour tactile
- **Système de tri amélioré** :
  - **Tri par colonnes sur tous les tableaux** :
    - Clic sur les en-têtes pour trier
    - Indicateurs visuels de tri (↑ ↓)
    - Tri ascendant/descendant alterné
    - Tri intelligent par type de données (texte, nombres, dates)
  - **Pages concernées** :
    - Produits (nom, référence, catégorie, dépôt, prix, coût, stock)
    - Catégories (nom, description)
    - Types de produits (nom, code)
    - Dépôts (nom, code, description, statut)
    - Points de vente (nom, type)
    - Stocks (produit, référence, point de vente, dépôt, quantité, date)
    - Clients (numéro, nom, type, contact, ville, crédit, solde)
    - Tables (numéro, zone, capacité, statut)
  - **Tri numérique intelligent des tables** :
    - Extraction du numéro dans le nom de la table (ex: T5 → 5)
    - Tri numérique correct (T1, T2, T10 au lieu de T1, T10, T2)
    - Fonctionne avec tous les formats (T1, Table 1, VIP1, etc.)
- **Renommage complet des tables restaurants** :
  - Migration de toutes les tables vers format T1-T100
  - Exclusion automatique du numéro 13 (superstition)
  - 99 tables par point de vente (T1 à T100 sans T13)
  - Répartition en zones (Terrasse: T1-T33, Salle principale: T34-T66, VIP: T67-T100)
  - Capacités variées (2, 4 ou 6 personnes selon modulo)
- **Fichiers CSS responsive créés** :
  - `responsive-globals.css` : Styles globaux réutilisables
  - Améliorations dans tous les fichiers CSS existants
  - Media queries pour 1366px, 1024px et 768px
- **Tests et validation** :
  - Application compilée et fonctionnelle
  - Toutes les fonctionnalités préservées
  - Performance optimale maintenue

### Version 1.8 (2025-10-18)
- **Amélioration complète du système de fusion et séparation de tables** :
  - **Fusion intelligente avec gestion des commandes** :
    - Fusion de tables disponibles ET occupées
    - Transfert automatique de tous les articles des commandes vers la table principale
    - Cumul automatique du nombre de convives
    - Recalcul des totaux (HT, TVA, TTC) après fusion
    - Création automatique d'une commande sur la table principale si nécessaire
    - Marquage des anciennes commandes avec statut "merged"
    - Message de confirmation indiquant le nombre de commandes fusionnées
  - **Séparation avancée avec redistribution des articles** :
    - Interface de séparation avec assignation manuelle des articles
    - Chaque article peut être assigné à n'importe quelle table du groupe
    - Résumé en temps réel par table (nombre d'articles et montant)
    - Création automatique de nouvelles commandes pour chaque table
    - Recalcul correct des totaux pour chaque nouvelle commande
    - Tables sans articles sont automatiquement libérées (statut "available")
    - Tables avec articles deviennent "occupied" avec leur propre commande
  - **Interface utilisateur améliorée** :
    - Modal de fusion affichant le statut des tables (disponible/occupée)
    - Modal de séparation avec liste interactive des articles
    - Sélecteurs dropdown pour assigner chaque article à une table
    - Résumé visuel des tables concernées avec badges colorés
    - Affichage du détail de chaque article (quantité, prix unitaire, total)
  - **Intégrité des données** :
    - Gestion correcte des relations entre tables, commandes et articles
    - Mise à jour cohérente des statuts de toutes les tables impliquées
    - Conservation de l'historique des commandes fusionnées

### Version 1.7 (2025-10-18)
- **Ajout du système complet de gestion des tables pour restaurants** :
  - Création de la table `restaurant_tables` avec gestion complète des tables
  - Configuration par point de vente restaurant
  - Numérotation personnalisée et capacité par table
  - Organisation en zones/sections (Terrasse, Intérieur, VIP)
  - Positionnement graphique (coordonnées X, Y) pour plan de salle visuel
  - **Statuts de table** : Disponible, Occupée, Réservée, Fusionnée
  - **Système de fusion de tables** : combinaison de plusieurs tables pour grands groupes
  - **Transfert de tables** : déplacement de commandes entre tables avec traçabilité
  - Historique complet des transferts (table `table_transfers`)
  - Assignation de serveur par table
  - Gestion du nombre de convives
  - Lien direct avec les commandes (`orders.table_id`)
  - **Nouvelles colonnes dans `orders`** :
    - `table_id` : Table associée à la commande
    - `order_type` : Type de commande (sur place, à emporter, livraison, room service)
    - `guest_count` : Nombre de convives
- **Données d'exemple** :
  - 17 tables configurées pour Restaurant Le Jardin (Intérieur, Terrasse, VIP)
  - 20 tables configurées pour Restaurant Seven Seven (Principale, VIP)
- **Spécifications détaillées** dans le cahier des charges :
  - Double vue (graphique + liste)
  - Codes couleur par statut
  - Fonctions de fusion, transfert, séparation
  - Interface de gestion complète

### Version 1.6 (2025-10-18)
- **Amélioration du module Clients** :
  - **Traçabilité caisse des paiements clients** :
    - Ajout du champ `sales_point_id` dans `client_payments` pour identifier la caisse d'encaissement
    - Sélection obligatoire de la caisse lors de l'enregistrement d'un paiement client
    - Création automatique d'une entrée dans la table `payments` pour intégrer les paiements clients dans le journal de caisse
    - Affichage de la caisse dans l'historique des paiements
  - **Affichage optimisé du solde client** :
    - Distinction visuelle "Dette actuelle" (rouge) vs "Solde créditeur" (vert)
    - Affichage clair du signe + pour soldes créditeurs et - pour dettes
  - **Impact sur le système de caisse** :
    - Les paiements clients apparaissent maintenant dans les encaissements de la caisse sélectionnée
    - Traçabilité complète : qui a payé, combien, dans quelle caisse, par quel moyen
    - Les clôtures de caisse incluent les encaissements clients

### Version 1.5 (2025-10-18)
- Ajout du **module de gestion des Clients** complet :
  - Création et gestion de fiches clients (individuel et entreprise)
  - Système de compte client avec limite de crédit configurable
  - Gestion des dettes clients
  - Historique des commandes par client
  - **Système de règlement avancé** :
    - Choix du type de règlement : paiement de facture(s) ou dépôt libre (arrhes)
    - Sélection multiple de factures à régler
    - **Paiements partiels** : possibilité d'allouer un montant spécifique à chaque facture
    - Allocation intelligente avec validation automatique
    - Mise à jour automatique du statut des factures (Pending → Partial → Paid)
    - Suivi des montants payés et restants par facture
  - **Historique détaillé des paiements** :
    - Type de paiement (règlement de facture ou arrhes)
    - Liste des factures réglées avec montants alloués
    - Mode de paiement utilisé (espèces, carte, virement, chèque, mobile money)
    - Référence et notes de paiement
  - Intégration au POS pour vente en compte client
  - Blocage automatique si limite de crédit dépassée
- Tables créées :
  - `clients` : Fiches clients avec gestion du crédit
  - `client_payments` : Historique des paiements avec type et allocations
  - `payment_invoice_allocations` : Table de liaison paiements-factures avec montants alloués
- Colonnes ajoutées à `orders` :
  - `paid_amount` : Montant déjà payé sur la facture
  - `remaining_amount` : Montant restant à payer
  - Statuts de paiement étendus : `pending`, `partial`, `paid`

### Version 1.4 (2025-10-18)
- Ajout de la **gestion de la TVA paramétrable** :
  - Champ `vat_rate` dans la table `sales_points` (taux de TVA par point de vente)
  - Configuration par défaut à **10% pour le Sénégal** (Hôtellerie-Restauration)
  - Distinction HT et TTC dans l'interface produits
  - Calcul automatique du HT à partir du TTC (prix saisis en TTC)
  - Affichage HT et TTC dans le panier
  - Calcul correct de la TVA dans le module caisse
- Modification de la devise : **FCFA** (Franc CFA) partout dans l'application

### Version 1.3 (2025-10-18)
- Ajout du **module Caisse (POS)** complet :
  - Sélection du point de vente
  - Gestion des sessions de caisse (ouverture avec fond de caisse)
  - Interface tactile optimisée
  - Catalogue produits avec filtres par catégorie
  - Panier avec ajout/modification/suppression d'articles
  - Calcul automatique des totaux et TVA
  - Paiement multi-méthodes (Espèces, Carte, Orange Money, Wave)
  - **Déduction automatique des stocks** lors de la vente
  - Gestion des produits composés (déduction des ingrédients)
- Création des tables :
  - `pos_sessions` : Sessions de caisse
  - `orders` : Commandes/ventes
  - `order_items` : Lignes de commande
  - `payments` : Paiements

### Version 1.2 (2025-10-18)
- Ajout du **module de gestion des Points de Vente** complet avec interface CRUD
- Ajout du **module de gestion des Stocks** avec :
  - Visualisation des stocks par point de vente et dépôt
  - Filtrage avancé (point de vente, dépôt)
  - Indicateurs de stock (vide, faible, OK)
  - Gestion complète CRUD des stocks
  - Date du dernier inventaire
- Configuration test Restaurant Le Jardin :
  - Stock initial de 100 canettes 33 Cl dans le Dépôt Bar Jardin
  - Produit Coca Cola 33cl configuré avec prix de vente 2000 XAF
  - Recette liée : 1 canette 33 Cl par Coca Cola 33cl vendu

### Version 1.1 (2025-10-18)
- Ajout du système de **types de produits** (Produits Vente, Matières Premières, Consommables, Services)
- Ajout de la **duplication intelligente par point de vente** (uniquement pour produits vendables)
- Ajout de la **gestion des recettes par point de vente** pour produits composés
- Configuration du **dépôt de stockage des ingrédients** spécifique à chaque point de vente
- Création de la table `product_types` et `product_recipes_by_sales_point`
- **Interface conditionnelle selon le type de produit** :
  - Type "Produits Vente" : accès aux onglets Composition, Points de vente, et Recettes par point de vente
  - Type "Matières Premières" : accès à l'onglet Dépôts de stockage uniquement
  - Type "Consommables" : accès à l'onglet Dépôts de stockage uniquement
  - Type "Services" : accès à l'onglet Points de vente uniquement

### Version 1.0 (2025-10-16)
- Spécifications initiales validées
