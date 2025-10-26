#!/bin/bash

# Script d'export des données depuis l'ancien projet Supabase
# Projet source: lcknhxrksephkshpvfmp

echo "🚀 Export des données en cours..."

# Configuration de la connexion
export PGPASSWORD="votre_mot_de_passe_db"

# Export des données uniquement (sans structure)
pg_dump \
  -h aws-0-eu-central-1.pooler.supabase.com \
  -p 6543 \
  -U postgres.lcknhxrksephkshpvfmp \
  -d postgres \
  --data-only \
  --inserts \
  --no-owner \
  --no-privileges \
  --schema=public \
  -f donnees_export.sql

echo "✅ Export terminé ! Fichier: donnees_export.sql"
echo ""
echo "⚠️ IMPORTANT: Ouvrez le fichier et supprimez les lignes concernant:"
echo "  - Les tables auth.*"
echo "  - Les tables storage.*"
echo "  - Les tables realtime.*"
echo ""
echo "Gardez uniquement les données de vos tables ERP."
