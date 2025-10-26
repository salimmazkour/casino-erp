# 🎰 Guide Complet - App Electron ERP Casino

## 🎯 Objectif

Créer une application desktop Windows qui :
1. S'installe sur tes 3 PCs de production
2. Télécharge et affiche TOUTE l'interface ERP
3. Se met à jour automatiquement quand tu modifies le code sur Bolt
4. Fonctionne sans avoir à copier-coller du code manuellement

---

## 📋 Vue d'ensemble du système

```
┌─────────────────────────────────────────────────────┐
│           TOI + MOI (Bolt.new)                      │
│                                                     │
│  1. On code l'ERP (React)                          │
│  2. On build : npm run package                     │
│  3. On push sur GitHub                             │
└───────────────────┬─────────────────────────────────┘
                    ↓
        ┌───────────────────────┐
        │   GitHub Repository    │
        │   ├── dist.zip         │ ← Application complète
        │   └── version.json     │ ← Numéro de version
        └──────┬────────┬────────┘
               ↓        ↓        ↓
          ┌────┐    ┌────┐    ┌────┐
          │PC#1│    │PC#2│    │PC#3│
          │ 🖥️ │    │ 🖥️ │    │ 🖥️ │
          └────┘    └────┘    └────┘
        Electron  Electron  Electron

   Au démarrage de chaque PC :
   1. "Nouvelle version ?"
   2. Oui → Télécharge dist.zip
   3. Extrait et lance l'ERP
   4. ✅ À jour !
```

---

## 🚀 PARTIE 1 : Configuration initiale (Une seule fois)

### Étape 1.1 : Préparer le projet

```bash
# Tu es déjà sur Bolt, vérifie que tout compile
npm run build
```

### Étape 1.2 : Configurer l'URL de mise à jour

Tu as 2 choix :

**OPTION A : GitHub (RECOMMANDÉ)** - Gratuit et simple

1. Crée un repo GitHub (public ou privé)
2. Dans `electron-erp-app/main.js`, ligne 11, change :

```javascript
const UPDATE_URL = 'https://raw.githubusercontent.com/TON_USERNAME/TON_REPO/main';
```

Exemple :
```javascript
const UPDATE_URL = 'https://raw.githubusercontent.com/john/casino-erp/main';
```

**OPTION B : Serveur Web** - Si tu as déjà un serveur

```javascript
const UPDATE_URL = 'https://ton-domaine.com';
```

### Étape 1.3 : Build l'installeur Electron

```bash
cd electron-erp-app
npm install
npm run build-win
```

Ou double-clic sur `BUILD.bat` (plus simple)

Tu obtiens : `electron-erp-app/dist/CasinoERP Setup 1.0.0.exe`

### Étape 1.4 : Installer sur les 3 PCs

1. Copie `CasinoERP Setup 1.0.0.exe` sur une clé USB
2. Sur chaque PC : double-clic sur l'installeur
3. Suivre l'assistant d'installation
4. L'app se lance automatiquement

**⚠️ AU PREMIER LANCEMENT** :

L'app va essayer de télécharger l'ERP depuis l'URL configurée.
Comme tu n'as pas encore pushé le code, elle va afficher une erreur.

**C'est normal !** On va résoudre ça à l'étape suivante.

---

## 🔄 PARTIE 2 : Workflow quotidien

### Scénario : Tu veux modifier quelque chose dans l'ERP

#### Étape 2.1 : Développer normalement sur Bolt

```bash
# Tu modifies ce que tu veux :
src/pages/POS.jsx
src/components/SplitTicketModal.jsx
src/index.css
# etc.
```

Tu testes en local avec le serveur Vite (automatique sur Bolt).

#### Étape 2.2 : Incrémenter la version

Édite `dist/version.json` :

```json
{
  "version": "1.1.0",  // ← Change ça (1.0.0 → 1.1.0)
  "releaseDate": "2025-10-26",
  "changelog": [
    "Ajout du bouton imprimer dans POS",
    "Correction bug affichage tables"
  ]
}
```

#### Étape 2.3 : Packager l'application

```bash
npm run package
```

Cette commande fait 2 choses :
1. Build React (`npm run build`)
2. Crée `dist.zip` avec tout le contenu

Tu obtiens :
- `dist/` - Dossier avec l'app buildée
- `dist.zip` - Archive prête à déployer

#### Étape 2.4 : Déployer

**OPTION A : GitHub**

```bash
git add .
git commit -m "Update to v1.1.0"
git push
```

Attendre 10-30 secondes que GitHub enregistre.

**OPTION B : Serveur Web**

Via FTP/SFTP, upload :
- `dist.zip` → `/public_html/dist.zip`
- `dist/version.json` → `/public_html/dist/version.json`

#### Étape 2.5 : Sur les PCs de production

**RIEN À FAIRE !** 🎉

Au prochain démarrage de l'app (ou clic sur "Vérifier MAJ") :
1. L'app vérifie `version.json`
2. "Ah ! 1.1.0 > 1.0.0"
3. Télécharge `dist.zip`
4. Extrait et remplace
5. Relance l'interface
6. ✅ Mise à jour terminée !

**Durée : ~30 secondes à 1 minute**

---

## 📊 Comparaison avant/après

### AVANT (méthode manuelle)

```
┌─────────────────────────────────────┐
│ 1. Développer sur Bolt              │  5 min
├─────────────────────────────────────┤
│ 2. Copier code sur clé USB          │  2 min
├─────────────────────────────────────┤
│ 3. Aller au PC #1                   │
│    - Coller fichiers                │  10 min
│    - Restart app                    │
├─────────────────────────────────────┤
│ 4. Aller au PC #2                   │
│    - Coller fichiers                │  10 min
│    - Restart app                    │
├─────────────────────────────────────┤
│ 5. Aller au PC #3                   │
│    - Coller fichiers                │  10 min
│    - Restart app                    │
└─────────────────────────────────────┘
TOTAL : ~37 minutes par mise à jour
Risques : erreurs, oubli, désynchronisation
```

### APRÈS (avec Electron)

```
┌─────────────────────────────────────┐
│ 1. Développer sur Bolt              │  5 min
├─────────────────────────────────────┤
│ 2. npm run package                  │  30 sec
├─────────────────────────────────────┤
│ 3. git push                         │  10 sec
├─────────────────────────────────────┤
│ 4. Les 3 PCs se mettent à jour      │  Auto
│    au prochain démarrage            │
└─────────────────────────────────────┘
TOTAL : ~6 minutes
Risques : aucun, tout automatisé
```

---

## 🎨 Interface utilisateur

### Au démarrage (avec mise à jour)

```
┌────────────────────────────┐
│          🎰                │
│      Casino ERP            │
│  Système de gestion        │
│                            │
│  ▓▓▓▓▓▓▓▓▓░░░░░░  60%     │
│  Téléchargement...         │
│                            │
│           ⌛                │
└────────────────────────────┘
```

### Fenêtre principale

L'app Electron affiche exactement la même interface que tu vois dans Bolt :

- Page de login
- Dashboard POS
- Gestion des produits
- Inventaire
- Utilisateurs
- Clients
- Tables
- Etc.

**C'est littéralement ton application React complète !**

### System tray (barre des tâches)

Clic droit sur l'icône 🎰 :

```
┌──────────────────────────────┐
│ Ouvrir ERP Casino            │
│ Vérifier les mises à jour    │
│ ────────────────────────     │
│ Quitter                      │
└──────────────────────────────┘
```

---

## 🔧 Détails techniques

### Où est stockée l'application ?

```
C:\Users\TON_NOM\AppData\Roaming\casino-erp\
├── app\
│   └── dist\              ← Ton app React complète
│       ├── index.html
│       ├── assets\
│       │   ├── index-XXX.js
│       │   └── index-XXX.css
│       └── ...
└── config.json            ← Version actuelle, config
```

### Comment fonctionne la mise à jour ?

1. **Au démarrage**, l'app Electron :
   ```javascript
   // Télécharge version.json
   GET https://github.com/.../version.json

   // Compare versions
   local: "1.0.0"
   remote: "1.1.0"

   // Si différent → mise à jour
   if (remote !== local) {
     downloadUpdate();
   }
   ```

2. **Téléchargement** :
   ```javascript
   GET https://github.com/.../dist.zip
   // Avec barre de progression
   ```

3. **Installation** :
   ```javascript
   // Extrait dist.zip dans AppData
   extract(dist.zip, 'AppData/casino-erp/app/')

   // Sauvegarde nouvelle version
   config.version = "1.1.0"
   ```

4. **Lancement** :
   ```javascript
   // Charge l'app depuis le disque local
   window.loadFile('AppData/casino-erp/app/dist/index.html')
   ```

### Connexion à Supabase

**Ça marche automatiquement !**

Ton fichier `.env` est inclus dans le build :
```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxx
```

L'app Electron charge simplement l'HTML, qui contient le JavaScript avec les appels Supabase.

**Aucune configuration supplémentaire nécessaire.**

---

## 🐛 Dépannage

### Problème : L'app ne télécharge pas les mises à jour

**Symptômes** : Splash screen reste bloqué

**Solutions** :

1. Vérifier l'URL dans `main.js`
2. Tester l'URL dans le navigateur :
   ```
   https://raw.githubusercontent.com/TON_USER/TON_REPO/main/dist/version.json
   ```
   Doit retourner le JSON

3. Vérifier que `dist.zip` existe :
   ```
   https://raw.githubusercontent.com/TON_USER/TON_REPO/main/dist.zip
   ```

4. Vérifier les logs Electron :
   - Appuyer sur F12 dans l'app
   - Regarder la console

### Problème : Écran blanc après lancement

**Symptômes** : La fenêtre s'ouvre mais reste blanche

**Solutions** :

1. Vérifier que le build Vite a fonctionné :
   ```bash
   npm run build
   # Doit créer dist/index.html
   ```

2. Vérifier que `dist.zip` contient bien `dist/index.html`

3. Supprimer le cache :
   ```
   C:\Users\TON_NOM\AppData\Roaming\casino-erp\
   ```
   Et relancer l'app

4. Vérifier la console (F12) pour les erreurs

### Problème : "Failed to fetch"

**Symptômes** : Erreur réseau

**Solutions** :

1. Vérifier la connexion Internet
2. Vérifier que GitHub/serveur est accessible
3. Désactiver temporairement le pare-feu
4. Si GitHub privé : ajouter token d'authentification

### Problème : L'app ne se lance pas au démarrage

**Symptômes** : Après installation, l'app ne démarre pas avec Windows

**Solutions** :

1. Lancer l'app manuellement une fois
2. Elle s'enregistre automatiquement
3. Redémarrer Windows pour tester
4. Vérifier dans :
   ```
   Win + R → shell:startup
   ```

---

## 📈 Optimisations possibles

### Réduire la taille du téléchargement

```bash
# Dans vite.config.js
export default {
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true
      }
    }
  }
}
```

### Accélérer les mises à jour

Utiliser un CDN :
```javascript
const UPDATE_URL = 'https://cdn.jsdelivr.net/gh/USER/REPO@main';
```

### Ajouter des notifications

Dans `main.js` :
```javascript
const { Notification } = require('electron');

new Notification({
  title: 'Mise à jour disponible',
  body: 'Version 1.1.0 en cours d\'installation...'
}).show();
```

---

## 🎓 Concepts clés

### Electron = Chromium + Node.js

Electron embarque un navigateur Chrome complet.
Ton app React est juste un site web affiché dans ce navigateur.

### Auto-update != Electron auto-update

On ne met PAS à jour Electron lui-même.
On met à jour uniquement le **contenu** (ton app React).

### Offline-first

Après le premier téléchargement, l'app fonctionne sans Internet.
Les mises à jour nécessitent Internet, mais l'utilisation normale non (sauf Supabase).

---

## ✅ Checklist finale

Avant de distribuer :

- [ ] URL de mise à jour configurée dans `main.js`
- [ ] Build Electron créé : `npm run build-win`
- [ ] Installeur testé sur un PC
- [ ] Version.json créé et accessible en ligne
- [ ] dist.zip créé et accessible en ligne
- [ ] Variables d'environnement Supabase dans le build
- [ ] Icône personnalisée ajoutée (optionnel)

Après installation :

- [ ] L'app se lance
- [ ] L'interface ERP s'affiche
- [ ] Connexion à Supabase fonctionne
- [ ] Mise à jour manuelle fonctionne
- [ ] L'app redémarre avec Windows

---

## 🚀 Prochaines étapes

Maintenant que tu as compris le système :

1. **Configurer l'URL** dans `main.js`
2. **Build l'installeur** : double-clic sur `BUILD.bat`
3. **Tester sur 1 PC** : installer et vérifier
4. **Pousser une mise à jour** : changer version.json, npm run package, git push
5. **Vérifier que ça marche** : redémarrer l'app, doit se mettre à jour
6. **Installer sur les 2 autres PCs**

---

## 📞 Support

Tu es bloqué quelque part ? Demande-moi !

Je suis là pour :
- Déboguer des problèmes
- Optimiser le workflow
- Ajouter des fonctionnalités
- Améliorer l'interface

**On y va ensemble ! 🚀**
