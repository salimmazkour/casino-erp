# 📥 GUIDE COMPLET : SAUVEGARDER VOS DONNÉES VIA SUPABASE DASHBOARD

## 🎯 Ce que vous allez faire
Créer une sauvegarde complète de votre base de données ERP et la télécharger sur votre ordinateur.

---

## 📋 ÉTAPE 1 : Se connecter à Supabase

### 1.1 Ouvrir le Dashboard
- Ouvrez votre navigateur web (Chrome, Firefox, Safari, etc.)
- Allez sur : **https://supabase.com**
- Cliquez sur **"Sign in"** (en haut à droite)

### 1.2 Se connecter
- Entrez votre **email** et **mot de passe** Supabase
- Cliquez sur **"Sign in"**

### 1.3 Sélectionner votre projet
- Une fois connecté, vous verrez la liste de vos projets
- Cliquez sur votre projet ERP
  - **Nom du projet** : Vous devriez reconnaître le nom que vous avez donné
  - **Référence** : `lcknhxrksephkshpvfmp`

---

## 💾 ÉTAPE 2 : Créer une sauvegarde

### 2.1 Accéder à la section Database
- Dans le menu latéral gauche, cliquez sur **"Database"**
- Un sous-menu s'ouvrira

### 2.2 Aller dans Backups
- Dans le sous-menu Database, cliquez sur **"Backups"**
- Vous verrez la page de gestion des sauvegardes

### 2.3 Vérifier les sauvegardes automatiques
- Supabase crée automatiquement des sauvegardes quotidiennes
- Vous verrez une liste des sauvegardes récentes avec :
  - Date et heure de création
  - Taille du fichier
  - Boutons d'action

### 2.4 Créer une nouvelle sauvegarde (optionnel)
Si vous voulez créer une sauvegarde fraîche maintenant :
- Cherchez le bouton **"Start a backup"** ou **"Create backup"**
- Cliquez dessus
- Attendez quelques secondes (une icône de chargement apparaîtra)
- La nouvelle sauvegarde apparaîtra dans la liste

---

## ⬇️ ÉTAPE 3 : Télécharger la sauvegarde

### 3.1 Choisir la sauvegarde
- Dans la liste des sauvegardes, trouvez celle que vous voulez télécharger
- Généralement, choisissez la plus récente (en haut de la liste)

### 3.2 Télécharger
- À droite de la ligne de la sauvegarde, cliquez sur le bouton **"Download"** (icône de téléchargement ⬇️)
- Votre navigateur va télécharger un fichier `.sql`

### 3.3 Sauvegarder le fichier
- Le fichier sera téléchargé dans votre dossier **Téléchargements**
- Nom du fichier : quelque chose comme `backup_2025-10-20.sql`
- **IMPORTANT** : Déplacez ce fichier dans un dossier sûr de votre ordinateur
  - Exemple : `Documents/Sauvegardes_ERP/`
  - Ne le laissez pas dans Téléchargements où il pourrait être supprimé

---

## 📂 ÉTAPE 4 : Organiser vos sauvegardes

### 4.1 Créer une structure de dossiers
Créez cette structure sur votre ordinateur :

```
Documents/
└── Sauvegardes_ERP/
    ├── Quotidienne/          (sauvegardes automatiques fréquentes)
    ├── Hebdomadaire/         (une par semaine)
    ├── Mensuelle/            (une par mois)
    └── Avant_modification/   (avant chaque gros changement)
```

### 4.2 Renommer le fichier téléchargé
Pour mieux vous y retrouver, renommez le fichier :
- Format recommandé : `ERP_backup_YYYYMMDD_description.sql`
- Exemple : `ERP_backup_20251020_apres_systeme_achats.sql`

---

## 🔄 ÉTAPE 5 : Restaurer une sauvegarde (si besoin)

### 5.1 Retourner dans Backups
- Menu **Database** → **Backups**

### 5.2 Restaurer
- Trouvez la sauvegarde que vous voulez restaurer
- Cliquez sur le bouton **"Restore"** (icône ↻)
- **⚠️ ATTENTION** : Cela va remplacer toutes vos données actuelles !
- Confirmez en cliquant **"Restore backup"**
- Attendez la fin de la restauration (quelques minutes)

---

## 📸 CAPTURES D'ÉCRAN DES ÉTAPES

### Ce que vous verrez :

**1. Page d'accueil Supabase après connexion**
```
┌─────────────────────────────────────────┐
│  [Logo Supabase]        Profile [▼]     │
├─────────────────────────────────────────┤
│                                          │
│  Vos Projets                             │
│                                          │
│  ┌──────────────────────────────┐       │
│  │  📊 Votre Projet ERP          │       │
│  │  lcknhxrksephkshpvfmp        │       │
│  │  [Ouvrir]                     │       │
│  └──────────────────────────────┘       │
│                                          │
└─────────────────────────────────────────┘
```

**2. Menu Database > Backups**
```
┌─────────────────────────────────────────┐
│ ☰ Menu                                  │
├─────────────────────────────────────────┤
│                                          │
│  🏠 Home                                 │
│  📊 Database          ◀── Cliquez ici   │
│    ├─ Tables                            │
│    ├─ Backups        ◀── Puis ici       │
│    └─ ...                               │
│                                          │
└─────────────────────────────────────────┘
```

**3. Page Backups**
```
┌─────────────────────────────────────────────────┐
│  Database Backups        [Start a backup] ◀─ Ici│
├─────────────────────────────────────────────────┤
│                                                  │
│  Sauvegardes automatiques                       │
│                                                  │
│  📅 2025-10-20 22:00  │  45 MB  │ [Download ⬇️] │
│  📅 2025-10-19 22:00  │  44 MB  │ [Download ⬇️] │
│  📅 2025-10-18 22:00  │  43 MB  │ [Download ⬇️] │
│                                                  │
└─────────────────────────────────────────────────┘
```

---

## ✅ VÉRIFICATION : Votre sauvegarde est réussie si

1. ✓ Vous avez un fichier `.sql` sur votre ordinateur
2. ✓ Le fichier a une taille > 0 (au moins quelques Mo)
3. ✓ Vous pouvez l'ouvrir avec un éditeur de texte (Notepad, TextEdit)
4. ✓ Le fichier commence par des commentaires SQL et des commandes `CREATE TABLE`

---

## ⚠️ PROBLÈMES COURANTS

### "Je ne vois pas le bouton Download"
- **Solution** : Attendez quelques secondes que la page charge complètement
- Rafraîchissez la page (F5)
- Vérifiez que vous êtes bien dans Database > Backups

### "Le téléchargement échoue"
- **Solution** : Vérifiez votre connexion internet
- Essayez avec un autre navigateur (Chrome recommandé)
- Désactivez temporairement les bloqueurs de publicités

### "Je ne vois aucune sauvegarde"
- **Solution** : Cliquez sur "Start a backup" pour en créer une
- Attendez 1-2 minutes que la sauvegarde soit créée
- Rafraîchissez la page

### "Le fichier téléchargé est vide (0 Ko)"
- **Solution** : Le téléchargement a été interrompu
- Supprimez le fichier et téléchargez à nouveau
- Vérifiez votre espace disque disponible

---

## 📞 BESOIN D'AIDE ?

### Documentation officielle Supabase
- https://supabase.com/docs/guides/database/backups

### Alternatives si le Dashboard ne fonctionne pas
1. Contactez le support Supabase
2. Utilisez l'outil `pg_dump` (méthode avancée - voir INSTRUCTIONS_BACKUP.md)

---

## 🎉 FÉLICITATIONS !

Une fois votre sauvegarde téléchargée et stockée en sécurité, vous avez :
- ✅ Une copie complète de toutes vos données
- ✅ La possibilité de restaurer à tout moment
- ✅ Une protection contre la perte de données
- ✅ Une archive historique de votre système

**RECOMMANDATION** : Faites une sauvegarde :
- Avant chaque modification importante du système
- Une fois par semaine minimum
- Avant toute restauration ou test majeur

---

**Créé le : 2025-10-20**
**Pour : ERP Complexe Hôtel Casino Restauration**
