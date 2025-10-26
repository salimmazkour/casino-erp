# 🎰 Casino ERP - Application Desktop Auto-Synchronisée

Application Electron qui embarque **TOUTE l'application ERP** et se synchronise automatiquement depuis le projet Bolt.

## ✨ Fonctionnalités

- ✅ **ERP complet** : Toute l'interface React (POS, inventory, users, etc.)
- ✅ **Auto-update** : Télécharge automatiquement les nouvelles versions
- ✅ **Multi-PC** : Installe une fois, met à jour partout
- ✅ **Démarrage automatique** : Se lance au démarrage de Windows
- ✅ **Splash screen** : Écran de chargement pendant les mises à jour
- ✅ **Offline-ready** : Fonctionne même sans connexion après le premier téléchargement
- ✅ **System tray** : Accès rapide depuis la barre des tâches

## 🎯 Architecture

```
┌─────────────────────────────────────────┐
│  Toi + Moi (développement sur Bolt)    │
│  - Modifie React/CSS/etc.               │
│  - Build : npm run package              │
│  - Crée dist.zip + version.json         │
└──────────────┬──────────────────────────┘
               ↓
    ┌──────────────────────┐
    │  Hébergement Public   │
    │  (GitHub/Serveur)     │
    │  - dist.zip           │
    │  - version.json       │
    └──────┬──────┬─────┬───┘
           ↓      ↓     ↓
      ┌────┐  ┌────┐  ┌────┐
      │PC#1│  │PC#2│  │PC#3│
      │ 🎰 │  │ 🎰 │  │ 🎰 │
      └────┘  └────┘  └────┘
   Electron  Electron  Electron
   Auto-update automatique !
```

## 📦 Installation

### Sur le PC de développement (Bolt)

#### 1. Préparer l'application React

```bash
# Installer archiver pour créer le package
npm install

# Build + créer dist.zip
npm run package
```

Cela crée :
- `dist/` - Application React buildée
- `dist.zip` - Archive de l'application
- `dist/version.json` - Numéro de version

#### 2. Build l'app Electron

```bash
cd electron-erp-app
npm install
npm run build-win
```

Ou double-cliquer sur `BUILD.bat`

Tu obtiens : `electron-erp-app/dist/CasinoERP Setup 1.0.0.exe`

### Sur les PCs de production

1. Copier `CasinoERP Setup 1.0.0.exe` sur chaque PC
2. Lancer l'installeur
3. L'app se lance automatiquement et télécharge l'ERP complet
4. Terminé ! 🎉

## 🔄 Workflow de mise à jour

### Étape 1 : Développer sur Bolt

```bash
# Tu modifies n'importe quoi :
src/pages/POS.jsx
src/components/...
src/index.css
# etc.
```

### Étape 2 : Mettre à jour la version

```json
// dist/version.json
{
  "version": "1.1.0",  // ← Incrémenter
  "releaseDate": "2025-10-26",
  "changelog": [
    "Nouvelle fonctionnalité X",
    "Correction bug Y"
  ]
}
```

### Étape 3 : Packager

```bash
npm run package
```

Cela build React ET crée le dist.zip automatiquement.

### Étape 4 : Héberger

**Option A - GitHub (RECOMMANDÉ)** :

```bash
git add .
git commit -m "Update to v1.1.0"
git push
```

Les fichiers sont accessibles via :
```
https://raw.githubusercontent.com/USERNAME/REPO/main/dist.zip
https://raw.githubusercontent.com/USERNAME/REPO/main/dist/version.json
```

**Option B - Serveur Web** :

Upload via FTP :
- `dist.zip` → `https://ton-serveur.com/dist.zip`
- `dist/version.json` → `https://ton-serveur.com/dist/version.json`

### Étape 5 : Les PCs se mettent à jour

Au prochain démarrage de l'app Electron :
1. Vérifie `version.json`
2. Compare avec la version locale
3. Si différente → Télécharge `dist.zip`
4. Extrait et remplace l'ancienne version
5. Relance l'application

**Automatique. Transparent. Rapide.** ⚡

## ⚙️ Configuration

### Configurer l'URL de mise à jour

Avant de build l'installeur, éditer `electron-erp-app/main.js` ligne 11 :

```javascript
const UPDATE_URL = 'https://raw.githubusercontent.com/TON_USER/TON_REPO/main';
```

OU créer un fichier `.env` :

```env
UPDATE_URL=https://raw.githubusercontent.com/TON_USER/TON_REPO/main
```

### Structure des URLs

L'app Electron cherche :
- `${UPDATE_URL}/dist/version.json` - Pour vérifier la version
- `${UPDATE_URL}/dist.zip` - Pour télécharger l'app

## 🎨 Interface

### Splash Screen (pendant la mise à jour)

```
┌──────────────────────────┐
│          🎰              │
│     Casino ERP           │
│ Système de gestion       │
│                          │
│ ▓▓▓▓▓▓▓▓▓▓░░░░░ 75%     │
│ Téléchargement...        │
└──────────────────────────┘
```

### Fenêtre principale

L'interface React complète s'affiche :
- Login
- POS
- Inventory
- Users
- Clients
- Tables
- Purchase Orders
- Etc.

### System Tray

Clic droit sur l'icône :
```
┌───────────────────────────┐
│ Ouvrir ERP Casino         │
│ Vérifier les mises à jour │
│ ───────────────────────   │
│ Quitter                   │
└───────────────────────────┘
```

## 📁 Structure des fichiers

```
electron-erp-app/
├── main.js              # Process principal Electron
├── preload.js           # Bridge sécurisé
├── update.html          # Splash screen mise à jour
├── package.json
├── BUILD.bat            # Script de build facile
├── resources/
│   ├── icon.png
│   └── icon.ico
└── README.md
```

## 🔧 Fonctionnement technique

### Au démarrage

1. **Vérification de version**
   - Télécharge `version.json`
   - Compare avec version locale

2. **Si mise à jour disponible**
   - Affiche splash screen
   - Télécharge `dist.zip`
   - Extrait dans `AppData/casino-erp/app/dist/`
   - Sauvegarde nouveau numéro de version

3. **Lancement**
   - Charge `index.html` depuis le dossier local
   - Si échec → fallback sur l'URL en ligne

### Stockage local

```
C:\Users\USERNAME\AppData\Roaming\casino-erp\
├── app/
│   └── dist/          # Application React complète
│       ├── index.html
│       ├── assets/
│       └── ...
└── config.json        # Version actuelle, préférences
```

## 🐛 Dépannage

### L'app ne télécharge pas les mises à jour

✅ **Vérifier** :
- L'URL dans `main.js` est accessible
- `dist.zip` et `version.json` existent en ligne
- Pas de blocage pare-feu
- Console Electron (F12) pour voir les erreurs

### La fenêtre est blanche au démarrage

✅ **Solution** :
- Attendre le téléchargement initial (première fois)
- Vérifier que `dist.zip` contient bien `dist/index.html`
- Vérifier les chemins dans Vite build

### Erreur "Failed to extract"

✅ **Solution** :
- Vérifier que `dist.zip` est valide
- Supprimer `AppData/Roaming/casino-erp/app/`
- Relancer l'app

## 📊 Avantages vs Alternative

| Méthode | Temps de mise à jour | Complexité | Maintenance |
|---------|---------------------|------------|-------------|
| **Cette solution** | < 1 minute | ⭐ Facile | ⭐ Automatique |
| Copier-coller manuel | 30 min × 3 PCs | ⭐⭐⭐ Difficile | ⭐⭐⭐ Manuelle |
| VPN + serveur central | Variable | ⭐⭐⭐⭐ Très difficile | ⭐⭐⭐⭐ Complexe |

## 🚀 Pour aller plus loin

### Fonctionnalités futures

- [ ] Notifications de mises à jour
- [ ] Rollback automatique en cas d'erreur
- [ ] Signature de code Windows
- [ ] Support macOS et Linux
- [ ] Compression différentielle (download partiel)
- [ ] Changelog visible dans l'app

### Optimisations

- Utiliser CDN pour héberger dist.zip
- Compression brotli pour réduire la taille
- Cache intelligent côté Electron
- Téléchargement en arrière-plan

## 📝 Notes importantes

⚠️ **Sécurité** :
- Les fichiers sont téléchargés via HTTPS
- Pas d'exécution de code distant
- L'app Electron elle-même n'est jamais mise à jour (seulement le contenu React)

⚠️ **Performance** :
- Premier lancement : téléchargement complet (~1-2 MB)
- Lancements suivants : instantanés (utilise cache local)
- Mises à jour : uniquement si version.json change

⚠️ **Réseau** :
- Connexion requise pour les mises à jour
- L'app fonctionne offline après téléchargement
- Supabase nécessite toujours une connexion

## 📄 Licence

MIT
