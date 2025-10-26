# 🖨️ Service Local d'Impression v2

Service Windows qui reçoit les demandes d'impression de l'application, consulte le serveur de routage central, et imprime sur les imprimantes physiques locales.

## 🏗️ Architecture

```
[1] Application Web (POS)
     ↓ PrintService.printOrder()
     ↓ HTTP POST /api/print

[2] Service Local (ce service) - Port 3001
     ↓ HTTP POST /route

[3] Serveur Routeur Central - Port 3002
     - Consulte Supabase
     - Détermine imprimante logique
     ↓ Retourne config imprimante

[2] Service Local
     - Consulte mapping local
     - Traduit logique → physique
     ↓ Commande Windows

[4] Imprimante Physique Windows
```

## 📦 Installation

```bash
cd printer-service
npm install
```

## ⚙️ Configuration

### 1. Variables d'environnement

Créer un fichier `.env` (optionnel) :

```env
ROUTER_URL=http://localhost:3002
PORT=3001
```

### 2. Mapping des imprimantes

Le service maintient un fichier `printer-mapping.json` qui fait le lien entre :
- **Imprimantes logiques** (ID depuis Supabase)
- **Imprimantes physiques** (nom Windows)

Exemple :

```json
{
  "07544531-5923-4240-87a8-aba5debd3758": "HP LaserJet Pro M404",
  "56aafabe-caea-4d2e-99c3-e09d5099bc1e": "Canon PIXMA TS3450",
  "2a3b4c5d-6789-abcd-ef01-234567890abc": "Epson TM-T88VI"
}
```

## ▶️ Démarrage

```bash
# Version 2 avec routeur
npm run start:v2

# Version 1 simple (sans routeur)
npm start
```

Le service démarre sur **http://localhost:3001**

## 🔌 API Endpoints

### POST /api/print
Imprime une commande (consulte le routeur automatiquement)

**Body:**
```json
{
  "order_id": 123,
  "sales_point_id": "uuid",
  "template_type": "ticket_cuisine"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Impression envoyée vers HP LaserJet Pro M404",
  "routing": {
    "logicalPrinter": "Imprimante Cuisine",
    "physicalPrinter": "HP LaserJet Pro M404",
    "template": "ticket_cuisine",
    "order": "ORD-123456"
  }
}
```

### GET /api/printers
Liste toutes les imprimantes physiques Windows disponibles

**Response:**
```json
{
  "success": true,
  "count": 3,
  "printers": [
    {
      "name": "HP LaserJet Pro M404",
      "isDefault": true,
      "deviceId": "HP LaserJet Pro M404"
    }
  ]
}
```

### GET /api/mapping
Récupère le mapping actuel logique → physique

**Response:**
```json
{
  "success": true,
  "mapping": {
    "uuid-1": "HP LaserJet Pro M404",
    "uuid-2": "Canon PIXMA TS3450"
  }
}
```

### POST /api/mapping
Configure un mapping logique → physique

**Body:**
```json
{
  "logicalPrinterId": "07544531-5923-4240-87a8-aba5debd3758",
  "physicalPrinterName": "HP LaserJet Pro M404"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Mapping enregistré",
  "mapping": { ... }
}
```

### GET /api/health
Vérifie le statut du service

**Response:**
```json
{
  "status": "ok",
  "service": "printer-service",
  "version": "2.0.0",
  "timestamp": "2025-10-24T13:00:00.000Z",
  "router": "http://localhost:3002"
}
```

## 🔧 Configuration Initiale

### 1. Démarrer le routeur central

```bash
cd print-router-service
npm install
npm start
```

### 2. Démarrer ce service

```bash
cd printer-service
npm run start:v2
```

### 3. Récupérer les IDs des imprimantes logiques

Depuis Supabase ou via le routeur :

```bash
curl http://localhost:3002/printers
```

### 4. Lister les imprimantes Windows

```bash
curl http://localhost:3001/api/printers
```

### 5. Configurer les mappings

Pour chaque imprimante logique :

```bash
curl -X POST http://localhost:3001/api/mapping \
  -H "Content-Type: application/json" \
  -d '{
    "logicalPrinterId": "07544531-5923-4240-87a8-aba5debd3758",
    "physicalPrinterName": "HP LaserJet Pro M404"
  }'
```

## 🧪 Tests

### Test complet du flux

```bash
curl -X POST http://localhost:3001/api/print \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": 1,
    "sales_point_id": "2601da89-2837-43f8-a316-dbf1476c3dd2",
    "template_type": "ticket_cuisine"
  }'
```

### Vérifier le mapping

```bash
curl http://localhost:3001/api/mapping
```

## 📝 Logs

Le service affiche des logs détaillés :

```
🖨️  [PRINT] Demande d'impression:
   Commande: #123
   Point de vente: uuid
   Type: ticket_cuisine

📡 Consultation du routeur...
✅ Routage reçu:
   Imprimante logique: Imprimante Cuisine
   IP: 192.168.1.102:9100

🎯 Imprimante physique: HP LaserJet Pro M404

📄 Génération du contenu...
✅ Contenu généré pour 3 article(s)
💰 Total: 15000 FCFA

🖨️  Envoi vers l'imprimante...
✅ [PRINT] Terminé
```

## 🔐 Sécurité

- Service local uniquement (localhost)
- Pas d'authentification (réseau local sécurisé)
- Mapping stocké localement
- Logs de toutes les opérations

## 🚨 Dépannage

### Erreur "Routeur: Erreur inconnue"
→ Vérifier que le routeur central est démarré sur le port 3002

### Erreur "Mapping imprimante introuvable"
→ Configurer le mapping via POST /api/mapping

### Erreur "Imprimante physique introuvable"
→ Vérifier le nom exact de l'imprimante Windows via GET /api/printers

### Erreur "Template introuvable"
→ Vérifier que les templates existent en base Supabase

## 📦 Dépendances

- **express** - Serveur HTTP
- **cors** - CORS
- **node-fetch** - Requêtes HTTP vers routeur
- **pdf-to-printer** - Impression Windows
- **node-windows** - Service Windows

## 🔄 Différences v1 vs v2

| Fonctionnalité | v1 (server.js) | v2 (server-v2.js) |
|----------------|----------------|-------------------|
| Routage | ❌ Manuel | ✅ Automatique via routeur |
| Mapping | ❌ Non | ✅ Oui (logique → physique) |
| Base de données | ❌ Non | ✅ Oui (via routeur) |
| Templates | ❌ Non | ✅ Oui (via routeur) |
| Configuration | Locale | Centralisée |

## 🎯 Prochaines étapes

1. Installer le service comme service Windows
2. Configurer démarrage automatique
3. Ajouter interface web pour gérer les mappings
4. Implémenter génération PDF pour tickets
5. Ajouter support ESC/POS pour tickets thermiques
