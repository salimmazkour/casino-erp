# ⚡ Installation Rapide - 5 Minutes Chrono

## 🎯 Tu veux quoi ?

Installer ton ERP Casino sur 3 PCs et que ça se mette à jour automatiquement quand tu codes ici sur Bolt.

## 📋 Checklist ultra-rapide

### ✅ Étape 1 : Build l'installeur (2 minutes)

```bash
# Dans electron-erp-app/
npm install
npm run build-win
```

Ou double-clic sur `BUILD.bat`

Tu obtiens : `electron-erp-app/dist/CasinoERP Setup 1.0.0.exe`

### ✅ Étape 2 : Configurer l'URL (30 secondes)

**AVANT de build**, édite `electron-erp-app/main.js` ligne 11 :

```javascript
// Remplace par ton repo GitHub
const UPDATE_URL = 'https://raw.githubusercontent.com/TON_USER/TON_REPO/main';
```

### ✅ Étape 3 : Installer sur les PCs (2 minutes × 3)

1. Copie l'installeur sur clé USB
2. Double-clic sur chaque PC
3. Suivre l'assistant
4. C'est tout !

---

## 🔄 Pour mettre à jour après

### 1. Tu codes sur Bolt

```bash
# Modifie ce que tu veux dans src/
```

### 2. Tu packages

```bash
npm run package
```

### 3. Tu push

```bash
git add .
git commit -m "Update"
git push
```

### 4. Tes PCs se mettent à jour

Au prochain démarrage : **automatique** ! ✨

---

## 🆘 Besoin de plus de détails ?

Voir `GUIDE_COMPLET_ELECTRON_ERP.md` pour tout comprendre.

---

## 🎉 C'est tout !

**Installe une fois, update pour toujours.**
