# 🖨️ Service de Routage d'Impression

Service central Node.js qui gère l'intelligence de routage des impressions vers les bonnes imprimantes.

## 📋 Architecture

```
[1] Application Web
     ↓ HTTP POST /print
[2] Agent local (poste)
     ↓ HTTP GET /route
[3] Serveur routeur central (CE SERVICE)
     ↓ réponse imprimante logique
[2] Agent local (poste)
     ↓ impression Windows
[4] Imprimante physique
```

## 🚀 Installation

```bash
cd print-router-service
npm install
```

## ⚙️ Configuration

1. Copier `.env.example` vers `.env`
2. Configurer les variables Supabase

```bash
cp .env.example .env
```

## ▶️ Démarrage

```bash
# Mode production
npm start

# Mode développement (avec auto-reload)
npm run dev
```

Le serveur démarre sur le port **3002** (configurable via `PRINT_ROUTER_PORT`)

## 🔌 API Endpoints

### POST /route
Route une demande d'impression vers la bonne imprimante

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
  "printer": {
    "id": "uuid",
    "name": "Imprimante Cuisine",
    "ip": "192.168.1.102",
    "port": 9100,
    "type": "network"
  },
  "template": {
    "id": "uuid",
    "name": "Ticket Cuisine",
    "type": "ticket_cuisine",
    "format": "html",
    "content": {}
  },
  "order": {
    "id": 123,
    "order_number": "ORD-123456",
    "items": [...],
    "total_amount": 15000
  }
}
```

### GET /health
Vérifie le statut du serveur

**Response:**
```json
{
  "status": "ok",
  "service": "print-router",
  "timestamp": "2025-10-24T13:00:00.000Z"
}
```

### GET /printers
Liste toutes les imprimantes actives

### GET /templates
Liste tous les templates d'impression actifs

## 🔐 Sécurité

- CORS activé pour tous les domaines (à restreindre en production)
- Logs de toutes les opérations de routage
- Validation des paramètres d'entrée

## 📝 Logs

Le serveur log toutes les opérations :
- `[ROUTER]` - Demandes de routage
- Erreurs de configuration
- État des imprimantes et templates

## 🛠️ Maintenance

### Vérifier le statut
```bash
curl http://localhost:3002/health
```

### Lister les imprimantes
```bash
curl http://localhost:3002/printers
```

### Tester le routage
```bash
curl -X POST http://localhost:3002/route \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": 1,
    "sales_point_id": "uuid",
    "template_type": "ticket_cuisine"
  }'
```

## 🔧 Dépannage

### Le serveur ne démarre pas
- Vérifier que le port 3002 est libre
- Vérifier les variables d'environnement
- Vérifier la connexion à Supabase

### Erreur "Template introuvable"
- Vérifier que les templates existent en base
- Vérifier que les templates sont actifs (`is_active = true`)

### Erreur "Imprimante introuvable"
- Vérifier que les imprimantes sont configurées
- Vérifier que les imprimantes sont actives
- Vérifier la liaison template ↔ imprimante

## 📦 Dépendances

- **express** - Serveur HTTP
- **cors** - Gestion CORS
- **@supabase/supabase-js** - Client Supabase
- **dotenv** - Variables d'environnement
