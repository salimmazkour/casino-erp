# 🚀 Guide Complet : Electron + GitHub Auto-Update

## 📦 Étape 1 : Télécharger et configurer GitHub Desktop

### Si tu n'as pas GitHub Desktop :
1. Télécharge-le : https://desktop.github.com/
2. Installe-le
3. Connecte-toi avec ton compte GitHub (salimmazkour)

---

## 📂 Étape 2 : Ajouter le projet téléchargé à GitHub Desktop

1. **Ouvre GitHub Desktop**

2. **File → Add Local Repository**
   - Clique sur "Choose..." et sélectionne le dossier `project/` que tu as téléchargé

3. **Si GitHub Desktop dit "This is not a Git repository"** :
   - Clique sur **"Create a repository"**
   - Laisse les options par défaut
   - Clique **"Create Repository"**

4. Tu devrais maintenant voir tous les fichiers dans la liste des changements

---

## 🌐 Étape 3 : Publier sur GitHub

1. **Dans GitHub Desktop, en haut à droite** : clique sur **"Publish repository"**

2. **Configure** :
   - Name : `casino-erp`
   - Description : `ERP Casino/Restaurant avec Electron auto-update`
   - ☑️ **DÉCOCHE** "Keep this code private" (pour que GitHub Actions marche gratuitement)
   - Ou laisse coché si tu veux que ce soit privé (GitHub Actions a une limite gratuite)

3. **Clique "Publish repository"**

4. ✅ **Ton projet est maintenant sur GitHub !**

---

## ⚙️ Étape 4 : Activer GitHub Actions

1. **Va sur GitHub.com** → clique sur ton profil en haut à droite → **"Your repositories"**

2. **Clique sur** `casino-erp`

3. **Clique sur l'onglet "Actions"** (en haut)

4. **Si demandé**, clique sur **"I understand my workflows, go ahead and enable them"**

---

## 🏷️ Étape 5 : Créer la première release (Version 1.0.1)

### Dans GitHub Desktop :

1. **En haut** : clique sur **"Repository" → "Create Tag..."**

2. **Configure** :
   - Tag name : `v1.0.1`
   - Description : `Première version avec auto-update`

3. **Clique "Create Tag"**

4. **IMPORTANT** : clique ensuite sur **"Push origin"** en haut (pour envoyer le tag)

---

## ⏳ Étape 6 : Attendre le build automatique

1. **Va sur GitHub.com** → ton repo `casino-erp`

2. **Clique sur "Actions"** (onglet en haut)

3. Tu verras un workflow **"Build and Release"** en cours (cercle orange 🟠)

4. **ATTENDS 5-10 minutes** que le build se termine

5. Quand c'est terminé, tu verras une **coche verte** ✅

---

## 📥 Étape 7 : Télécharger et installer l'application

1. **Sur GitHub.com**, clique sur **"Releases"** (colonne de droite)

2. Tu devrais voir **"v1.0.1"** avec ces fichiers :
   - ✅ `CasinoERP-Setup-1.0.1.exe` ← **L'installateur Windows**
   - ✅ `dist.zip` ← Le contenu web
   - ✅ `latest.yml` ← Fichier de version pour l'auto-update

3. **Télécharge `CasinoERP-Setup-1.0.1.exe`**

4. **Installe-le** sur ton PC Windows

5. **Lance l'application** !

---

## 🎯 Étape 8 : Tester l'auto-update

### Maintenant on va créer une v1.0.2 pour tester l'update :

1. **Dans Bolt** (ou localement), fais une petite modification
   - Par exemple : change une couleur dans `src/index.css`
   - Ou change le titre dans `index.html`

2. **Dans GitHub Desktop** :
   - Tu verras les changements
   - **Commit** avec le message : "Test auto-update v1.0.2"
   - **Push origin**

3. **Crée un nouveau tag** :
   - Repository → Create Tag
   - Tag name : `v1.0.2`
   - Description : "Test auto-update"
   - Create Tag
   - **Push origin**

4. **Attends que GitHub Actions build** (5-10 min)

5. **Sur le PC avec l'app installée** :
   - Ouvre l'application Electron
   - **ATTENDS 3 secondes** (l'app vérifie automatiquement)
   - Tu devrais voir : **"Mise à jour disponible (1.0.2) !"**
   - Clique **"Télécharger"**
   - Une fois téléchargé : **"Redémarrer maintenant"**
   - ✅ **L'app redémarre avec la nouvelle version !**

---

## 🔄 Workflow quotidien (après configuration)

### À partir de maintenant, pour chaque nouvelle version :

1. **Code dans Bolt** ou localement
2. **GitHub Desktop** → Commit → Push
3. **Créer un tag** : v1.0.3, v1.0.4, etc.
4. **Attendre 5-10 min** (build automatique)
5. **Toutes les apps installées reçoivent la notification**
6. ✅ **Mise à jour automatique !**

---

## ✅ Ce qui a été configuré automatiquement

### Dans `electron-erp-app/package.json` :
- ✅ `electron-updater` ajouté
- ✅ Configuration de publication GitHub
- ✅ Version 1.0.1

### Dans `electron-erp-app/main.js` :
- ✅ Vérification automatique au démarrage (après 3 secondes)
- ✅ Notifications de mise à jour
- ✅ Téléchargement et installation automatiques
- ✅ Double système d'update : GitHub + Web content

### Dans `.github/workflows/build-and-release.yml` :
- ✅ Build automatique Windows
- ✅ Création de l'installateur .exe
- ✅ Publication sur GitHub Releases
- ✅ Génération du fichier `latest.yml`

---

## 🔧 Options avancées

### Forcer la vérification des updates manuellement :
- **Clic droit sur l'icône dans la barre des tâches**
- **"Vérifier les mises à jour"**

### Désactiver le démarrage automatique :
- Dans `electron-erp-app/main.js`, change :
```javascript
openAtLogin: store.get('autoStart', false), // au lieu de true
```

### Télécharger automatiquement les updates :
- Dans `electron-erp-app/main.js`, change :
```javascript
autoUpdater.autoDownload = true; // au lieu de false
```

---

## 🐛 Dépannage

### ❌ "GitHub Actions failed"
**Solution** : Va dans Actions → ton workflow → voir les erreurs en détail

### ❌ "Electron app ne trouve pas la mise à jour"
**Solutions** :
- Vérifie que le fichier `latest.yml` existe dans Releases
- Vérifie que l'app a accès à internet
- Ouvre la console (Ctrl+Shift+I) pour voir les logs

### ❌ "No icon found"
**Solution** : L'app utilise l'icône par défaut d'Electron
- Pour ajouter une icône personnalisée :
  - Mets `icon.png` (512x512px) dans `electron-erp-app/resources/`
  - Mets `icon.ico` dans `electron-erp-app/resources/`

### ❌ "Build échoue sur GitHub Actions"
**Solution** :
- Vérifie que tu as bien poussé tous les fichiers
- Vérifie que `package.json` est correct
- Regarde les logs détaillés dans Actions

---

## 📊 Résumé visuel du workflow

```
┌─────────────────────────────────────────────────────────────┐
│  1. CODE DANS BOLT                                          │
│     ↓                                                        │
│  2. TÉLÉCHARGER LE PROJET                                   │
│     ↓                                                        │
│  3. GITHUB DESKTOP → COMMIT → PUSH                          │
│     ↓                                                        │
│  4. CRÉER UN TAG (v1.0.X)                                   │
│     ↓                                                        │
│  5. GITHUB ACTIONS BUILD (5-10 min)                         │
│     ↓                                                        │
│  6. RELEASE AUTOMATIQUE (.exe + latest.yml)                 │
│     ↓                                                        │
│  7. APPS INSTALLÉES REÇOIVENT LA NOTIFICATION               │
│     ↓                                                        │
│  8. UTILISATEURS CLIQUENT "METTRE À JOUR"                   │
│     ↓                                                        │
│  9. ✅ MISE À JOUR AUTOMATIQUE !                            │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎉 C'est prêt !

Ton système d'auto-update est **100% fonctionnel** :
- ✅ Build automatique sur GitHub
- ✅ Détection automatique des updates au démarrage
- ✅ Téléchargement et installation en un clic
- ✅ Workflow simple et rapide

**Bon développement ! 🚀**
