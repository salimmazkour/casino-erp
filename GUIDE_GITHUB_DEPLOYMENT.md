# 🚀 Guide GitHub - Déploiement ERP Casino

## 🎯 Objectif

Héberger ton ERP sur GitHub pour que tes 3 PCs puissent télécharger les mises à jour automatiquement.

---

## 📋 ÉTAPE 1 : Créer le repository GitHub

### 1.1 Aller sur GitHub

1. Ouvre [github.com](https://github.com)
2. Connecte-toi avec ton compte
3. Clique sur le bouton **"+"** en haut à droite
4. Sélectionne **"New repository"**

### 1.2 Configurer le repository

```
Repository name: casino-erp
Description: ERP Casino/Restaurant - Système de gestion complet
```

**Choix important** :

- **✅ Public** (RECOMMANDÉ) : Gratuit, accès facile, pas de token nécessaire
- **⚠️ Private** : Nécessite un token d'authentification pour les téléchargements

Pour commencer, choisis **Public**.

**NE PAS** :
- ❌ Initialize with README
- ❌ Add .gitignore
- ❌ Choose a license

Clique sur **"Create repository"**

---

## 📋 ÉTAPE 2 : Connecter ton projet local

### 2.1 Copier l'URL du repository

GitHub t'affiche une page avec des commandes. Tu verras quelque chose comme :

```
https://github.com/TON_USERNAME/casino-erp.git
```

**Copie cette URL** !

### 2.2 Ajouter le remote

Dans ton terminal Bolt :

```bash
git remote add origin https://github.com/salimmazkour/casino-erp.git
```

Remplace `TON_USERNAME` par ton nom d'utilisateur GitHub.

Exemple :
```bash
git remote add origin https://github.com/john-doe/casino-erp.git
```

### 2.3 Vérifier

```bash
git remote -v
```

Tu dois voir :
```
origin  https://github.com/TON_USERNAME/casino-erp.git (fetch)
origin  https://github.com/TON_USERNAME/casino-erp.git (push)
```

---

## 📋 ÉTAPE 3 : Pousser le code

### 3.1 Push initial

```bash
git push -u origin main
```

GitHub va te demander de t'authentifier :

**Option A : GitHub CLI (recommandé)**
- Follow les instructions à l'écran

**Option B : Personal Access Token**
- Username : `TON_USERNAME`
- Password : Ton Personal Access Token (pas ton mot de passe !)

### Comment créer un Personal Access Token (si nécessaire)

1. GitHub → Settings (en haut à droite)
2. Developer settings (tout en bas à gauche)
3. Personal access tokens → Tokens (classic)
4. Generate new token (classic)
5. Nom : "Bolt Deploy"
6. Permissions : Cocher **"repo"**
7. Generate token
8. **COPIER LE TOKEN** (tu ne le reverras pas !)

### 3.2 Vérifier le push

Rafraîchir ta page GitHub : tu dois voir tous tes fichiers !

```
casino-erp/
├── src/
├── electron-erp-app/
├── dist.zip
├── dist/
│   └── version.json
├── package.json
└── ...
```

---

## 📋 ÉTAPE 4 : Vérifier les fichiers accessibles

### 4.1 Tester l'accès à version.json

Ouvre ton navigateur et va à :

```
https://raw.githubusercontent.com/TON_USERNAME/casino-erp/main/dist/version.json
```

Tu dois voir :
```json
{
  "version": "1.0.0",
  "releaseDate": "2025-10-25",
  "changelog": [...]
}
```

### 4.2 Tester l'accès à dist.zip

```
https://raw.githubusercontent.com/TON_USERNAME/casino-erp/main/dist.zip
```

Le fichier doit se télécharger (~195 KB).

---

## 📋 ÉTAPE 5 : Configurer l'app Electron

### 5.1 Éditer main.js

Ouvre `electron-erp-app/main.js` et trouve la ligne 11 :

```javascript
const UPDATE_URL = process.env.UPDATE_URL || 'http://localhost:5173';
```

Remplace par :

```javascript
const UPDATE_URL = process.env.UPDATE_URL || 'https://raw.githubusercontent.com/TON_USERNAME/casino-erp/main';
```

**Exemple complet** :
```javascript
const UPDATE_URL = process.env.UPDATE_URL || 'https://raw.githubusercontent.com/john-doe/casino-erp/main';
```

### 5.2 Sauvegarder et commit

```bash
git add electron-erp-app/main.js
git commit -m "Configure GitHub URL for updates"
git push
```

---

## 📋 ÉTAPE 6 : Build l'installeur Windows

### 6.1 Installer les dépendances (si pas déjà fait)

```bash
cd electron-erp-app
npm install
```

### 6.2 Lancer le build

**Option A : Script facile**
```bash
# Double-clic sur BUILD.bat
```

**Option B : Ligne de commande**
```bash
npm run build-win
```

### 6.3 Attendre

Le build prend 2-5 minutes selon ta machine.

Tu verras :
```
Building...
Packaging app for Windows...
Creating installer...
```

### 6.4 Récupérer l'installeur

L'installeur est créé dans :
```
electron-erp-app/dist/CasinoERP Setup 1.0.0.exe
```

Taille : ~150-200 MB (contient Electron + Chromium)

---

## 📋 ÉTAPE 7 : Installer sur les PCs

### 7.1 Copier l'installeur

Copie `CasinoERP Setup 1.0.0.exe` sur :
- Clé USB
- Réseau local
- Google Drive / Dropbox
- Ou n'importe quel moyen

### 7.2 Sur chaque PC

1. Double-clic sur l'installeur
2. Suivre l'assistant :
   - Choisir le dossier d'installation
   - Créer raccourci bureau : ✅
   - Lancer au démarrage : ✅
3. Cliquer "Install"
4. L'app se lance automatiquement

### 7.3 Premier lancement

L'app va :
1. Afficher le splash screen
2. Télécharger `version.json` depuis GitHub
3. Télécharger `dist.zip` (~195 KB)
4. Extraire dans `AppData`
5. Lancer l'ERP

**Durée : 30 secondes à 1 minute**

Si tout fonctionne : tu vois l'interface de login de ton ERP !

---

## 🔄 ÉTAPE 8 : Workflow de mise à jour

### Scénario : Tu modifies quelque chose dans le POS

#### 8.1 Développer

```bash
# Modifie src/pages/POS.jsx
# Teste en local sur Bolt
```

#### 8.2 Incrémenter la version

Édite `dist/version.json` :

```json
{
  "version": "1.1.0",  // 1.0.0 → 1.1.0
  "releaseDate": "2025-10-26",
  "changelog": [
    "Amélioration interface POS",
    "Correction bug calcul total"
  ]
}
```

#### 8.3 Packager

```bash
npm run package
```

Crée un nouveau `dist.zip` avec tes changements.

#### 8.4 Commit et push

```bash
git add .
git commit -m "Update to v1.1.0 - POS improvements"
git push
```

#### 8.5 Sur les PCs

**RIEN À FAIRE !**

Au prochain démarrage de l'app (ou clic sur "Vérifier MAJ") :
1. Vérifie GitHub
2. "1.1.0 > 1.0.0 → Mise à jour !"
3. Télécharge
4. Installe
5. Relance

**Durée : 30-60 secondes**

---

## 🎯 URLs importantes à retenir

Remplace `TON_USERNAME` et `REPO_NAME` par tes valeurs :

### Repository principal
```
https://github.com/TON_USERNAME/casino-erp
```

### Version tracking
```
https://raw.githubusercontent.com/TON_USERNAME/casino-erp/main/dist/version.json
```

### Application complète
```
https://raw.githubusercontent.com/TON_USERNAME/casino-erp/main/dist.zip
```

---

## ✅ Checklist finale

Avant de distribuer l'installeur :

- [ ] Repository GitHub créé
- [ ] Code pushé avec succès
- [ ] version.json accessible en ligne
- [ ] dist.zip accessible en ligne
- [ ] URL configurée dans main.js
- [ ] Installeur buildé
- [ ] Testé sur 1 PC minimum

---

## 🐛 Dépannage

### Problème : "Failed to fetch version.json"

**Cause** : URL incorrecte ou repository inaccessible

**Solution** :
1. Vérifier l'URL dans le navigateur
2. S'assurer que le repository est Public
3. Vérifier que le fichier existe dans le bon dossier

### Problème : "Permission denied" lors du push

**Cause** : Authentification échouée

**Solution** :
1. Utiliser un Personal Access Token
2. Vérifier que le token a les permissions "repo"
3. Vérifier l'URL du remote

### Problème : L'app télécharge mais ne lance pas

**Cause** : dist.zip corrompu ou incomplet

**Solution** :
1. Vérifier que `npm run package` a fonctionné
2. Télécharger dist.zip depuis GitHub et vérifier son contenu
3. Supprimer le cache : `AppData/Roaming/casino-erp/`

---

## 🎉 C'est tout !

Ton ERP est maintenant :
✅ Hébergé sur GitHub
✅ Accessible depuis n'importe où
✅ Prêt pour les mises à jour auto

**Tu peux maintenant coder tranquillement sur Bolt, et tes 3 PCs se mettront à jour automatiquement !**

---

## 📞 Prochaine étape

Une fois que tout fonctionne, tu peux :
1. Ajouter une icône personnalisée
2. Configurer le certificat de signature (pour éviter les warnings Windows)
3. Optimiser la taille du bundle
4. Ajouter des notifications de mise à jour

**Besoin d'aide sur une étape ? Dis-moi où tu en es !**
