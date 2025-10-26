# 🚀 INSTRUCTIONS COMPLÈTES - MIGRATION VERS VOTRE NOUVEAU PROJET SUPABASE

## 📋 Informations de votre nouveau projet

- **URL** : `https://uvwzqfhyafxggrkkfxqg.supabase.co`
- **Clé Anon** : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

---

## ✅ ÉTAPE 1 : CRÉER LA STRUCTURE (5 minutes)

### 1.1 Ouvrir le SQL Editor

1. Allez sur **https://supabase.com/dashboard/project/uvwzqfhyafxggrkkfxqg**
2. Connectez-vous si nécessaire
3. Cliquez sur **SQL Editor** dans le menu latéral gauche (icône `</>`)

### 1.2 Importer toute la structure

1. **Ouvrez le fichier** `MIGRATIONS_CONSOLIDEES.sql` (dans votre projet)
2. **Copiez tout son contenu** (Ctrl+A puis Ctrl+C)
3. **Collez dans le SQL Editor** de Supabase
4. **Cliquez sur "Run"** (ou Ctrl+Entrée)
5. **Attendez 30-60 secondes**

✅ **Résultat attendu** : "Success. No rows returned"

Cela crée :
- ✅ 40 tables complètes
- ✅ Tous les index
- ✅ Tous les triggers
- ✅ Toutes les relations (Foreign Keys)

---

## 📊 ÉTAPE 2 : EXPORTER VOS DONNÉES ACTUELLES (2 minutes)

### 2.1 Depuis l'ancien projet (celui qui existe maintenant)

Votre projet actuel (`lcknhxrksephkshpvfmp`) contient :
- **24 produits**
- **6 points de vente**
- **594 tables de restaurant**
- **5 fournisseurs**
- **Et toutes vos autres données**

### 2.2 Faire l'export via pgAdmin ou pg_dump

**Option A : Via le Dashboard Supabase actuel**

1. Allez sur `https://supabase.com/dashboard/project/lcknhxrksephkshpvfmp`
2. Database → Backups
3. Cliquez sur "Start a backup"
4. Attendez quelques minutes
5. Téléchargez le fichier `.sql`

**Option B : Via pg_dump (ligne de commande)**

```bash
# Remplacez PASSWORD par votre mot de passe de DB
pg_dump -h aws-0-eu-central-1.pooler.supabase.com \
  -p 6543 \
  -U postgres.lcknhxrksephkshpvfmp \
  -d postgres \
  --data-only \
  --inserts \
  -f donnees_export.sql
```

### 2.3 Nettoyer le fichier exporté

Le fichier exporté contiendra des données pour TOUTES les tables.

**Important** : Vous devez supprimer les lignes concernant :
- Les tables système de Supabase (auth.*, storage.*, etc.)
- Garder uniquement les tables de votre ERP

---

## 📥 ÉTAPE 3 : IMPORTER VOS DONNÉES (3 minutes)

### 3.1 Retourner au nouveau projet

1. Allez sur `https://supabase.com/dashboard/project/uvwzqfhyafxggrkkfxqg`
2. SQL Editor

### 3.2 Importer les données

1. **Ouvrez** le fichier `donnees_export.sql` (que vous avez téléchargé)
2. **Copiez** tout le contenu
3. **Collez** dans le SQL Editor
4. **Cliquez sur "Run"**
5. **Attendez** que toutes les insertions soient terminées

---

## ⚙️ ÉTAPE 4 : CONFIGURER VOTRE APPLICATION (1 minute)

### 4.1 Mettre à jour le fichier .env

Dans votre projet local, ouvrez le fichier `.env` et remplacez :

```env
VITE_SUPABASE_URL=https://uvwzqfhyafxggrkkfxqg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2d3pxZmh5YWZ4Z2dya2tmeHFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5ODg5ODEsImV4cCI6MjA3NjU2NDk4MX0.p1d2-2Wc075q-DCilaEomrjloUXSrD6y2_tfsjVdtUk
```

### 4.2 Tester la connexion

1. **Redémarrez** votre serveur de développement (si il tourne)
2. **Ouvrez** votre application
3. **Connectez-vous** avec :
   - Login : `admin`
   - Mot de passe : `admin123`

✅ Si ça fonctionne, **BRAVO** ! Votre migration est terminée !

---

## 🔍 ÉTAPE 5 : VÉRIFIER LES DONNÉES (2 minutes)

### 5.1 Via le Dashboard Supabase

1. Dans votre nouveau projet, cliquez sur **Table Editor**
2. Vérifiez que vos tables ont bien des données :
   - `products` → devrait avoir ~24 lignes
   - `sales_points` → devrait avoir 6 lignes
   - `restaurant_tables` → devrait avoir ~594 lignes
   - `suppliers` → devrait avoir 5 lignes

### 5.2 Via l'application

1. Testez chaque module :
   - ✅ Gestion des produits
   - ✅ POS / Caisse
   - ✅ Gestion des stocks
   - ✅ Commandes d'achat
   - ✅ Gestion des tables

---

## ⚡ MÉTHODE ALTERNATIVE RAPIDE

Si l'export/import de données est trop complexe, je peux vous créer un script SQL avec **des données de démonstration** qui ressemblent à vos données actuelles :

- 30 produits types (boissons, plats, etc.)
- 6 points de vente pré-configurés
- 600 tables de restaurant
- 10 fournisseurs
- Quelques commandes et réceptions d'exemple

**Voulez-vous que je crée ce script de données de démo ?**

---

## 🆘 PROBLÈMES COURANTS

### "La structure ne s'importe pas"

- Assurez-vous de copier TOUT le fichier `MIGRATIONS_CONSOLIDEES.sql`
- Vérifiez qu'il n'y a pas d'erreurs dans le SQL Editor
- Si erreur, notez-la et dites-moi ce qu'elle dit

### "Les données ne s'importent pas"

- Vérifiez que la structure a bien été importée en premier
- Assurez-vous d'avoir nettoyé les données système Supabase
- Vérifiez que les ID UUID correspondent

### "L'application ne se connecte pas"

- Vérifiez le fichier `.env`
- Vérifiez que l'URL et la clé sont correctes (sans espace)
- Redémarrez le serveur de développement
- Videz le cache du navigateur (Ctrl+Shift+R)

---

## 📞 BESOIN D'AIDE ?

Dites-moi simplement où vous en êtes :

1. **"J'ai importé la structure"** → Je vous aide avec les données
2. **"J'ai une erreur SQL"** → Copiez-moi l'erreur complète
3. **"Tout fonctionne !"** → Parfait ! On peut continuer le développement
4. **"Je veux les données de démo"** → Je vous crée un script complet

---

## 🎯 RÉCAPITULATIF DES FICHIERS

Dans votre projet, vous avez maintenant :

1. **MIGRATIONS_CONSOLIDEES.sql**
   → Toute la structure de la base (à importer en premier)

2. **INSTRUCTIONS_IMPORT_NOUVEAU_PROJET.md** (ce fichier)
   → Le guide que vous lisez actuellement

3. **.env**
   → À mettre à jour avec vos nouvelles credentials

---

**Prêt à commencer ?** Dites-moi quand vous avez importé la structure !
