# 🖨️ GUIDE DE DÉMARRAGE - SYSTÈME D'IMPRESSION

Guide complet pour mettre en place le système d'impression multi-postes.

## 📊 ARCHITECTURE GLOBALE

```
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION WEB (POS)                     │
│                   React + Supabase Client                    │
└────────────────────────────┬────────────────────────────────┘
                             │ PrintService.printOrder()
                             │ HTTP POST
                             ↓
┌─────────────────────────────────────────────────────────────┐
│              SERVICE LOCAL (Poste Windows)                   │
│                  Node.js - Port 3001                         │
│             printer-service/server-v2.js                     │
└────────────────────────────┬────────────────────────────────┘
                             │ HTTP POST /route
                             ↓
┌─────────────────────────────────────────────────────────────┐
│           SERVEUR ROUTEUR CENTRAL (Serveur)                 │
│                  Node.js - Port 3002                         │
│              print-router-service/server.js                  │
│                                                              │
│  • Consulte Supabase (print_templates)                      │
│  • Consulte Supabase (printer_definitions)                  │
│  • Détermine l'imprimante logique                           │
│  • Retourne la configuration complète                       │
└────────────────────────────┬────────────────────────────────┘
                             │ JSON Response
                             ↓
┌─────────────────────────────────────────────────────────────┐
│              SERVICE LOCAL (Poste Windows)                   │
│  • Consulte le mapping local (logique → physique)           │
│  • Traduit en commande Windows                              │
│  • Imprime sur l'imprimante physique                        │
└────────────────────────────┬────────────────────────────────┘
                             │ Commande Windows
                             ↓
┌─────────────────────────────────────────────────────────────┐
│                  IMPRIMANTE PHYSIQUE                         │
│                     Réseau / USB                             │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 INSTALLATION ÉTAPE PAR ÉTAPE

### ÉTAPE 1 : Serveur Routeur Central

**Sur le serveur central (accessible par tous les postes) :**

```bash
# 1. Aller dans le dossier du routeur
cd print-router-service

# 2. Installer les dépendances
npm install

# 3. Copier le fichier .env depuis le projet principal
cp ../.env .env

# 4. Démarrer le serveur
npm start
```

Le serveur démarre sur **http://localhost:3002** ou sur l'IP du serveur.

**Vérifier que ça fonctionne :**
```bash
curl http://localhost:3002/health
```

### ÉTAPE 2 : Service Local (sur chaque poste POS)

**Sur chaque poste Windows :**

```bash
# 1. Aller dans le dossier printer-service
cd printer-service

# 2. Installer les dépendances (si pas déjà fait)
npm install

# 3. Configurer l'URL du routeur (optionnel)
# Créer un fichier .env avec :
# ROUTER_URL=http://ip-serveur:3002

# 4. Démarrer le service v2
npm run start:v2
```

Le service démarre sur **http://localhost:3001**

**Vérifier que ça fonctionne :**
```bash
curl http://localhost:3001/api/health
```

### ÉTAPE 3 : Configuration des Mappings

**Sur CHAQUE poste, configurer le mapping imprimantes logiques → physiques :**

#### 3.1 Récupérer les IDs des imprimantes logiques

Depuis le routeur central :
```bash
curl http://ip-serveur:3002/printers
```

Vous obtiendrez quelque chose comme :
```json
{
  "success": true,
  "printers": [
    {
      "id": "07544531-5923-4240-87a8-aba5debd3758",
      "name": "Caisse le Jardin",
      "printer_ip_address": "192.168.1.101"
    },
    {
      "id": "56aafabe-caea-4d2e-99c3-e09d5099bc1e",
      "name": "Imprimante Cuisine",
      "printer_ip_address": "192.168.1.102"
    }
  ]
}
```

#### 3.2 Lister les imprimantes Windows locales

```bash
curl http://localhost:3001/api/printers
```

Résultat :
```json
{
  "success": true,
  "printers": [
    { "name": "HP LaserJet Pro M404", "isDefault": true },
    { "name": "Canon PIXMA TS3450", "isDefault": false }
  ]
}
```

#### 3.3 Créer les mappings

Pour CHAQUE imprimante logique que ce poste doit utiliser :

```bash
# Exemple : Mapper "Caisse le Jardin" vers "HP LaserJet Pro M404"
curl -X POST http://localhost:3001/api/mapping \
  -H "Content-Type: application/json" \
  -d '{
    "logicalPrinterId": "07544531-5923-4240-87a8-aba5debd3758",
    "physicalPrinterName": "HP LaserJet Pro M404"
  }'
```

Répéter pour chaque imprimante.

#### 3.4 Vérifier les mappings

```bash
curl http://localhost:3001/api/mapping
```

## 🧪 TESTS

### Test 1 : Vérifier le routeur

```bash
curl -X POST http://localhost:3002/route \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": 1,
    "sales_point_id": "2601da89-2837-43f8-a316-dbf1476c3dd2",
    "template_type": "ticket_cuisine"
  }'
```

Vous devriez recevoir une config complète avec l'imprimante logique.

### Test 2 : Test complet d'impression

```bash
curl -X POST http://localhost:3001/api/print \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": 1,
    "sales_point_id": "2601da89-2837-43f8-a316-dbf1476c3dd2",
    "template_type": "ticket_cuisine"
  }'
```

Si tout est bien configuré, l'imprimante devrait imprimer !

### Test 3 : Depuis l'application POS

1. Ouvrir l'application POS
2. Créer une commande
3. Valider le paiement
4. Vérifier que les 3 tickets s'impriment :
   - Ticket Cuisine
   - Ticket Bar
   - Ticket Caisse

## 📋 BASE DE DONNÉES

Le système utilise 2 tables principales dans Supabase :

### Table `printer_definitions`

| Colonne | Type | Description |
|---------|------|-------------|
| id | uuid | ID unique (utilisé pour mapping) |
| name | text | Nom de l'imprimante logique |
| printer_ip_address | text | IP de l'imprimante réseau |
| printer_port | integer | Port (défaut 9100) |
| printer_type | text | 'network', 'usb', 'shared' |
| is_active | boolean | Imprimante active ? |

### Table `print_templates`

| Colonne | Type | Description |
|---------|------|-------------|
| id | uuid | ID unique |
| name | text | Nom du template |
| template_type | text | Type : 'ticket_cuisine', 'ticket_bar', 'ticket_caisse' |
| printer_id | uuid | Référence vers printer_definitions |
| template_format | text | Format : 'html', 'text', 'escpos' |
| template_content | jsonb | Structure du template |
| is_active | boolean | Template actif ? |

## 🔧 CONFIGURATION AVANCÉE

### Ajouter une nouvelle imprimante

1. **Dans Supabase** (via l'interface ou SQL) :

```sql
INSERT INTO printer_definitions (name, sales_point_id, printer_ip_address, printer_port, printer_type, is_active)
VALUES ('Imprimante Bar Restaurant', '...uuid...', '192.168.1.104', 9100, 'network', true);
```

2. **Sur chaque poste**, ajouter le mapping :

```bash
curl -X POST http://localhost:3001/api/mapping \
  -H "Content-Type: application/json" \
  -d '{
    "logicalPrinterId": "nouveau-uuid",
    "physicalPrinterName": "Nom Imprimante Windows"
  }'
```

### Ajouter un nouveau template

```sql
INSERT INTO print_templates (name, template_type, printer_id, template_format, template_content, is_active)
VALUES (
  'Ticket Desserts',
  'ticket_desserts',
  'uuid-imprimante',
  'html',
  '{"width": "80mm", "sections": [...]}'::jsonb,
  true
);
```

Puis dans l'app, utiliser :
```javascript
PrintService.printOrder(orderId, salesPointId, 'ticket_desserts');
```

## 🚨 DÉPANNAGE

### Erreur : "Routeur: Erreur inconnue"

**Cause :** Le routeur central n'est pas accessible
**Solution :**
- Vérifier que le routeur est démarré
- Vérifier l'URL du routeur dans le service local
- Tester : `curl http://ip-routeur:3002/health`

### Erreur : "Mapping imprimante introuvable"

**Cause :** Aucun mapping configuré pour cette imprimante logique
**Solution :**
- Lister les mappings : `curl http://localhost:3001/api/mapping`
- Ajouter le mapping manquant

### Erreur : "Template introuvable"

**Cause :** Le template n'existe pas en base ou n'est pas actif
**Solution :**
- Vérifier dans Supabase : `SELECT * FROM print_templates WHERE is_active = true;`
- Créer le template manquant

### Erreur : "Imprimante physique introuvable"

**Cause :** Le nom de l'imprimante Windows ne correspond pas
**Solution :**
- Lister les imprimantes : `curl http://localhost:3001/api/printers`
- Corriger le mapping avec le nom exact

### L'impression ne sort pas

**Vérifications :**
1. Imprimante allumée et en ligne ?
2. Pilote d'imprimante installé sur Windows ?
3. Test d'impression Windows fonctionne ?
4. Vérifier les logs du service local

## 📦 INSTALLATION COMME SERVICE WINDOWS

Pour que le service local démarre automatiquement avec Windows :

```bash
cd printer-service
node install-service.js
```

Voir le fichier `GUIDE_INSTALLATION.txt` pour plus de détails.

## 🔐 SÉCURITÉ

- Le routeur central devrait être accessible uniquement sur le réseau local
- Pas d'authentification (réseau local sécurisé)
- Toutes les opérations sont loggées
- Les mappings sont stockés localement sur chaque poste

## 📊 MONITORING

### Vérifier l'état des services

```bash
# Routeur central
curl http://ip-serveur:3002/health

# Service local
curl http://localhost:3001/api/health
```

### Logs

Les deux services affichent des logs détaillés dans la console :

- `[ROUTER]` - Opérations du routeur
- `[PRINT]` - Opérations d'impression

## 🎯 AVANTAGES DE CETTE ARCHITECTURE

✅ **Centralisé** - Configuration unique dans Supabase
✅ **Flexible** - Chaque poste peut avoir ses propres imprimantes
✅ **Évolutif** - Facile d'ajouter des postes/imprimantes
✅ **Maintenable** - Modifications sans redéployer les postes
✅ **Traçable** - Tous les événements sont loggés
✅ **Résilient** - Si le routeur tombe, les postes continuent (cache local possible)

## 📞 SUPPORT

En cas de problème :
1. Vérifier les logs des services
2. Tester chaque composant séparément
3. Vérifier la configuration réseau
4. Consulter ce guide de dépannage
