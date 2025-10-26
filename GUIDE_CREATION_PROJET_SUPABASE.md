# 🚀 GUIDE COMPLET : CRÉER VOTRE PROJET SUPABASE ERP

## 📋 Vue d'ensemble

Vous allez créer votre propre projet Supabase pour avoir :
- ✅ Accès complet au Dashboard
- ✅ Sauvegardes automatiques
- ✅ Contrôle total de votre base de données
- ✅ Monitoring et statistiques

**Durée estimée : 30-45 minutes**

---

## 🎯 PHASE 1 : CRÉER LE PROJET SUPABASE (10 min)

### Étape 1.1 : Créer un compte Supabase (si pas déjà fait)

1. Allez sur **https://supabase.com**
2. Cliquez sur **"Start your project"** ou **"Sign up"**
3. Choisissez votre méthode de connexion :
   - Via GitHub (recommandé)
   - Via Google
   - Via email

4. Suivez les instructions pour créer votre compte

### Étape 1.2 : Créer un nouveau projet

1. Une fois connecté, cliquez sur **"New Project"**

2. Remplissez les informations :
   ```
   Organization : Choisissez ou créez une organisation
   Project Name : ERP-Hotel-Casino
   Database Password : [CHOISISSEZ UN MOT DE PASSE FORT]
   Region : Europe (West) - eu-west-1
   Pricing Plan : Free (parfait pour commencer)
   ```

   **⚠️ IMPORTANT** : Notez bien votre mot de passe de base de données !

3. Cliquez sur **"Create new project"**

4. Attendez 2-3 minutes que le projet soit créé
   - Vous verrez une barre de progression
   - Le projet sera prêt quand vous verrez "Project is ready"

### Étape 1.3 : Récupérer vos clés API

1. Une fois le projet créé, allez dans **Settings** (roue dentée en bas à gauche)

2. Dans le menu Settings, cliquez sur **API**

3. Vous verrez trois informations importantes :

   **a) Project URL**
   ```
   Exemple : https://abcdefghijklmnop.supabase.co
   ```

   **b) anon public key**
   ```
   Commence par : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   (Très longue clé)
   ```

   **c) service_role key** (gardez-la secrète !)
   ```
   Commence aussi par : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   (Très longue clé, différente de anon)
   ```

4. **Copiez ces trois informations dans un fichier texte temporaire**
   - Vous en aurez besoin à l'étape 2

---

## 🏗️ PHASE 2 : CRÉER LA STRUCTURE DE LA BASE (15 min)

### Étape 2.1 : Accéder au SQL Editor

1. Dans votre projet Supabase, cliquez sur **SQL Editor** dans le menu latéral
   - Icône : `</>`

2. Vous verrez un éditeur SQL vide

### Étape 2.2 : Exécuter les migrations

**Je vais vous fournir les scripts SQL dans l'ordre.**

Pour chaque script :

1. **Copiez** le contenu du script
2. **Collez** dans le SQL Editor
3. Cliquez sur **"Run"** (bouton en bas à droite)
4. Attendez le message de succès : "Success. No rows returned"
5. Passez au script suivant

**Liste des migrations à exécuter :**

```
Migration 1 : Créer les tables de base (product_types, categories, products, etc.)
Migration 2 : Créer les tables de stock (storage_locations, product_stocks, etc.)
Migration 3 : Créer les tables de vente (sales_points, orders, order_items, etc.)
Migration 4 : Créer les tables d'achats (suppliers, purchase_orders, etc.)
Migration 5 : Créer les tables de personnel (employees, roles, permissions, etc.)
Migration 6 : Créer les tables de traçabilité (action_logs, void_logs, etc.)
Migration 7 : Créer les triggers automatiques
Migration 8 : Insérer les données initiales
```

**⚠️ IMPORTANT** : Exécutez les migrations **dans l'ordre** !

---

## 📊 PHASE 3 : IMPORTER VOS DONNÉES (10 min)

### Étape 3.1 : Script d'import des données

Une fois toutes les migrations exécutées, vous importerez vos données actuelles :

1. Je vous fournirai un script SQL avec toutes vos données
2. Copiez le script complet
3. Collez dans le SQL Editor
4. Cliquez sur **"Run"**

Ce script contiendra :
- ✅ Vos 100+ produits configurés
- ✅ Les 20 matières premières avec stocks
- ✅ Les 6 points de vente
- ✅ Les 198 tables de restaurant
- ✅ Les fournisseurs
- ✅ Les commandes et réceptions
- ✅ Tous les utilisateurs et permissions

---

## ⚙️ PHASE 4 : CONFIGURER VOTRE APPLICATION (5 min)

### Étape 4.1 : Mettre à jour le fichier .env

Dans votre projet local, créez ou modifiez le fichier `.env` :

```env
VITE_SUPABASE_URL=https://VOTRE-PROJECT-URL.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.votre-cle-anon...
```

**Remplacez** :
- `VOTRE-PROJECT-URL` par votre URL de projet (étape 1.3a)
- La clé anon par votre clé anon (étape 1.3b)

### Étape 4.2 : Tester la connexion

1. Redémarrez votre application
2. Essayez de vous connecter :
   - Username : `admin`
   - Password : `admin123`

3. Si la connexion fonctionne, c'est réussi ! 🎉

---

## 🔒 PHASE 5 : SÉCURISER VOTRE PROJET (Optionnel mais recommandé)

### Étape 5.1 : Configurer les sauvegardes automatiques

1. Dans Supabase, allez dans **Database** → **Backups**
2. Les sauvegardes quotidiennes sont déjà activées par défaut
3. Plan gratuit : 7 jours de rétention
4. Plans payants : jusqu'à 30 jours de rétention

### Étape 5.2 : Configurer les alertes

1. Allez dans **Settings** → **Project Settings**
2. Configurez votre email pour recevoir les alertes
3. Activez les notifications pour :
   - Erreurs de base de données
   - Utilisation élevée
   - Sauvegardes échouées

### Étape 5.3 : Changer le mot de passe admin

Une fois connecté à votre application :
1. Allez dans la gestion des utilisateurs
2. Changez le mot de passe de l'admin par défaut
3. Créez vos propres comptes utilisateurs

---

## 📊 VÉRIFICATIONS FINALES

### Checklist de validation :

- [ ] Projet Supabase créé et accessible
- [ ] Clés API récupérées et sauvegardées
- [ ] Toutes les migrations exécutées sans erreur
- [ ] Données importées (produits, stocks, etc.)
- [ ] Fichier .env mis à jour
- [ ] Connexion à l'application réussie
- [ ] Accès au Dashboard Supabase fonctionnel

### Vérifier les données :

Dans le SQL Editor, exécutez :

```sql
-- Compter les produits
SELECT COUNT(*) as total_produits FROM products;

-- Compter les points de vente
SELECT COUNT(*) as total_pos FROM sales_points;

-- Compter les tables de restaurant
SELECT COUNT(*) as total_tables FROM restaurant_tables;

-- Compter les fournisseurs
SELECT COUNT(*) as total_fournisseurs FROM suppliers;
```

Résultats attendus :
- Produits : 100+
- Points de vente : 6
- Tables : 198
- Fournisseurs : selon vos données

---

## 🎉 FÉLICITATIONS !

Vous avez maintenant :

✅ **Votre propre projet Supabase**
- Accès complet au Dashboard
- Contrôle total de la base de données

✅ **Sauvegardes automatiques**
- Quotidiennes
- Téléchargeables à tout moment

✅ **Monitoring en temps réel**
- Logs des requêtes
- Métriques de performance
- Alertes configurées

✅ **Données migrées**
- Toute la structure
- Toutes vos données
- Tous les triggers

---

## 🔄 PROCHAINES ÉTAPES

### Maintenant que votre projet est créé :

1. **Explorer le Dashboard Supabase** :
   - Table Editor : voir et modifier vos données
   - SQL Editor : exécuter des requêtes personnalisées
   - Database : voir la structure et les relations
   - API Docs : documentation automatique de votre API

2. **Faire des sauvegardes régulières** :
   - Database → Backups → Start a backup
   - Télécharger le fichier .sql
   - Conserver dans un endroit sûr

3. **Continuer le développement** :
   - Ajouter de nouvelles fonctionnalités
   - Créer de nouveaux modules
   - Optimiser les performances

---

## ❓ PROBLÈMES COURANTS

### "La migration échoue avec une erreur"

**Solution** :
- Vérifiez que vous avez exécuté les migrations dans l'ordre
- Assurez-vous qu'aucune table n'existe déjà
- Si besoin, supprimez toutes les tables et recommencez

### "L'application ne se connecte pas"

**Solution** :
- Vérifiez le fichier .env
- Assurez-vous que l'URL et la clé sont correctes
- Redémarrez votre serveur de développement
- Vérifiez la console navigateur pour les erreurs

### "Les données ne s'affichent pas"

**Solution** :
- Vérifiez que le script d'import a bien été exécuté
- Utilisez le Table Editor pour voir si les données sont là
- Vérifiez les permissions RLS (actuellement désactivées pour développement)

---

## 📞 BESOIN D'AIDE ?

### Ressources :

- **Documentation Supabase** : https://supabase.com/docs
- **Forum Supabase** : https://github.com/supabase/supabase/discussions
- **Discord Supabase** : https://discord.supabase.com

### Moi :

Je suis là pour vous aider à chaque étape !
- Dites-moi où vous en êtes
- Signalez-moi toute erreur
- Demandez des clarifications si besoin

---

**Prêt à commencer ?**

Dites-moi **"Je suis prêt, envoie-moi les scripts"** et je vous fournirai tous les fichiers SQL nécessaires !

**Créé le : 2025-10-20**
**Pour : ERP Complexe Hôtel Casino Restauration**
