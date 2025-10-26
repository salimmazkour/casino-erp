# INSTRUCTIONS DE SAUVEGARDE ET TÉLÉCHARGEMENT

## 📥 TÉLÉCHARGER LES FICHIERS DU PROJET

### Option 1 : Télécharger le cahier des charges
Le fichier `SPECIFICATIONS_ERP.md` contient toute la documentation du projet.
- Chemin : `/tmp/cc-agent/58766645/project/SPECIFICATIONS_ERP.md`
- Version actuelle : **2.3** (mise à jour le 2025-10-20)

### Option 2 : Télécharger une sauvegarde de la base de données

#### Via Supabase Dashboard (Recommandé)

1. **Accéder au Dashboard Supabase** :
   - URL : https://lcknhxrksephkshpvfmp.supabase.co
   - Connectez-vous avec vos identifiants

2. **Créer une sauvegarde** :
   - Allez dans **Database** → **Backups**
   - Cliquez sur **Create backup**
   - Attendez la fin de la création
   - Cliquez sur **Download** pour télécharger le fichier `.sql`

3. **Sauvegarde automatique** :
   - Supabase crée des sauvegardes automatiques quotidiennes
   - Accessible dans la section **Backups**
   - Conservation selon votre plan (7 jours pour le plan gratuit)

#### Via pg_dump (Manuel)

Si vous avez accès à PostgreSQL en local :

```bash
# Obtenir l'URL de connexion depuis le Dashboard Supabase
# Settings → Database → Connection string

pg_dump "postgresql://postgres:[PASSWORD]@db.lcknhxrksephkshpvfmp.supabase.co:5432/postgres" \
  --no-owner --no-privileges \
  > backup_erp_$(date +%Y%m%d_%H%M%S).sql
```

#### Via SQL Export (Tables spécifiques)

Depuis le Dashboard Supabase :
1. **Table Editor** → Sélectionnez une table
2. Cliquez sur **Export** → **CSV** ou **JSON**
3. Répétez pour chaque table importante

### Option 3 : Sauvegardes existantes dans le projet

Le projet contient déjà une sauvegarde des matières premières :
- `backup_matieres_premieres_20251020_212619.sql`

## 📊 CONTENU DE LA BASE DE DONNÉES

### Tables principales créées :

#### Gestion des produits :
- `product_types` : Types de produits (Vente, Matières Premières, Consommables, Services)
- `categories` : Catégories de produits
- `products` : Catalogue produits
- `product_recipes` : Compositions/recettes des produits composés
- `product_recipes_by_sales_point` : Recettes spécifiques par point de vente

#### Gestion des stocks :
- `storage_locations` : Dépôts de stockage
- `product_stocks` : Stocks actuels par dépôt
- `product_prices` : Prix par produit et point de vente/dépôt
- `stock_movements` : Journal de tous les mouvements de stock
- `inventory_sessions` : Sessions d'inventaire
- `inventory_items` : Détails des inventaires

#### Gestion des points de vente :
- `sales_points` : Points de vente (Hôtel, Restaurants, Bars)
- `restaurant_tables` : Tables de restaurant avec gestion complète
- `table_transfers` : Historique des transferts de tables

#### Système de caisse (POS) :
- `pos_sessions` : Sessions de caisse (ouverture/clôture)
- `orders` : Commandes/ventes
- `order_items` : Lignes de commande
- `payments` : Paiements
- `void_logs` : Journal des annulations

#### Gestion clients :
- `clients` : Fiches clients
- `client_payments` : Paiements clients
- `payment_invoice_allocations` : Allocations de paiements sur factures

#### Gestion fournisseurs et achats :
- `suppliers` : Fournisseurs
- `purchase_orders` : Commandes d'achat
- `purchase_order_lines` : Lignes de commande d'achat
- `purchase_receptions` : Réceptions de marchandises
- `purchase_reception_lines` : Lignes de réception

#### Gestion du personnel :
- `users` : Utilisateurs/employés
- `roles` : Rôles et permissions
- `employee_permissions` : Permissions personnalisées par employé

#### Traçabilité :
- `action_logs` : Journal de toutes les actions sensibles

## 🔄 RESTAURER UNE SAUVEGARDE

### Via Supabase Dashboard :

1. **Aller dans Database** → **Backups**
2. Sélectionner la sauvegarde à restaurer
3. Cliquer sur **Restore**
4. Confirmer la restauration

⚠️ **ATTENTION** : La restauration écrase toutes les données actuelles !

### Via psql (Manuel) :

```bash
psql "postgresql://postgres:[PASSWORD]@db.lcknhxrksephkshpvfmp.supabase.co:5432/postgres" \
  < backup_file.sql
```

## 📋 DONNÉES DE TEST ACTUELLES

### Matières premières (20 ingrédients) :
- 5 produits de base (farine, sucre, huile, sel, poivre)
- 5 produits laitiers (lait, œufs, beurre, crème, fromage)
- 2 viandes (bœuf, poulet)
- 4 légumes (tomates, oignons, pommes de terre, ail)
- 4 autres (pain, riz, pâtes, sauce tomate)

### Produits de test (100 produits) :
- 30 ingrédients
- 20 boissons non-alcoolisées
- 20 boissons alcoolisées
- 10 desserts
- 20 plats (dont 10 composés avec recettes)

### Points de vente configurés :
- Hôtel (Réception)
- Restaurant Le Jardin (99 tables : T1-T100 sans T13)
- Bar JT
- Bar Machines à Sous
- Restaurant Seven Seven (99 tables : T1-T100 sans T13)
- Boîte de Nuit Seven

### Dépôts de stockage :
- Economat Général
- Casse / Périmés
- Dépôts spécifiques par point de vente

## 🔐 SÉCURITÉ

- **Ne partagez JAMAIS** vos clés API Supabase publiquement
- Les sauvegardes peuvent contenir des données sensibles
- Conservez les sauvegardes dans un endroit sécurisé
- Chiffrez les sauvegardes si elles contiennent des données clients réelles

## 📞 SUPPORT

Pour toute question sur la sauvegarde ou restauration :
1. Consultez la documentation Supabase : https://supabase.com/docs/guides/database/backups
2. Contactez le support Supabase si nécessaire

---

**Dernière mise à jour : 2025-10-20**
