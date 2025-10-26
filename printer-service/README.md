# 🖨️ Service d'Impression Local

Service Node.js local qui permet de détecter et gérer les imprimantes système installées sur le PC/POS.

## 📋 Prérequis

- Node.js 16+ installé
- Windows, macOS ou Linux

## 🚀 Installation

```bash
cd printer-service
npm install
```

## ▶️ Démarrage

```bash
npm start
```

Le service démarre sur `http://localhost:3001`

## 📡 Endpoints API

### 1. Santé du service
```
GET http://localhost:3001/api/health
```

### 2. Lister les imprimantes
```
GET http://localhost:3001/api/printers
```

**Réponse:**
```json
{
  "success": true,
  "count": 11,
  "printers": [
    {
      "name": "Canon 1er Etage",
      "isDefault": true,
      "status": "IDLE",
      "driver": "Canon Generic Plus PCL6",
      "portName": "WSD-..."
    },
    {
      "name": "Microsoft Print to PDF",
      "isDefault": false,
      "status": "IDLE",
      "driver": "Microsoft Print To PDF",
      "portName": "PORTPROMPT:"
    }
  ]
}
```

### 3. Imprimer
```
POST http://localhost:3001/api/print
Content-Type: application/json

{
  "printerName": "Canon 1er Etage",
  "content": "Ticket de caisse...",
  "options": {
    "type": "TEXT"
  }
}
```

## 🔧 Configuration

Le service utilise le port **3001** par défaut. Pour changer:

Modifiez `server.js`:
```javascript
const PORT = 3001; // Changez ici
```

## 🛑 Arrêter le service

Appuyez sur `Ctrl+C` dans le terminal

## ⚙️ Utilisation avec l'application ERP

1. Démarrer le service d'impression:
   ```bash
   cd printer-service
   npm start
   ```

2. Démarrer l'application ERP:
   ```bash
   cd ..
   npm run dev
   ```

3. L'application détectera automatiquement les imprimantes via l'API locale

## 🪟 Windows - Démarrage automatique (optionnel)

Pour que le service démarre automatiquement avec Windows, créez un raccourci dans le dossier de démarrage:

1. Créez un fichier `start-printer-service.bat`:
```bat
@echo off
cd C:\chemin\vers\votre\projet\printer-service
npm start
```

2. Placez le raccourci dans: `C:\Users\VotreNom\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup`

## 🐛 Dépannage

### Aucune imprimante détectée
- Vérifiez que les imprimantes sont bien installées dans le Panneau de configuration Windows
- Redémarrez le service
- Vérifiez les logs dans le terminal

### Port déjà utilisé
Si le port 3001 est occupé, modifiez le `PORT` dans `server.js`

### Erreur au démarrage
```bash
npm install --force
npm start
```

## 📦 Dépendances

- **express**: Serveur HTTP
- **cors**: Autoriser les requêtes cross-origin depuis le navigateur
- **printer**: Module Node.js pour accéder aux imprimantes système
