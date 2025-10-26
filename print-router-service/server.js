const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '../.env' });

const app = express();
const PORT = process.env.PRINT_ROUTER_PORT || 3002;

app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

app.post('/route', async (req, res) => {
  try {
    const { order_id, sales_point_id, template_type } = req.body;

    if (!order_id || !sales_point_id || !template_type) {
      return res.status(400).json({
        error: 'Paramètres manquants',
        required: ['order_id', 'sales_point_id', 'template_type']
      });
    }

    console.log(`[ROUTER] Demande de routage pour commande #${order_id}, type: ${template_type}`);

    const { data: template, error: templateError } = await supabase
      .from('print_templates')
      .select(`
        *,
        printer:printer_definitions (*)
      `)
      .eq('template_type', template_type)
      .eq('is_active', true)
      .maybeSingle();

    if (templateError || !template) {
      console.error('[ROUTER] Template non trouvé:', templateError);
      return res.status(404).json({
        error: 'Template d\'impression introuvable',
        template_type
      });
    }

    if (!template.printer || !template.printer.is_active) {
      console.error('[ROUTER] Imprimante inactive ou inexistante');
      return res.status(404).json({
        error: 'Imprimante introuvable ou inactive',
        template_type
      });
    }

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          product:products (*)
        )
      `)
      .eq('id', order_id)
      .maybeSingle();

    if (orderError || !order) {
      console.error('[ROUTER] Commande non trouvée:', orderError);
      return res.status(404).json({
        error: 'Commande introuvable',
        order_id
      });
    }

    await supabase
      .from('action_logs')
      .insert({
        action_type: 'PRINT_ROUTED',
        details: {
          order_id,
          template_type,
          printer_name: template.printer.name,
          printer_ip: template.printer.printer_ip_address
        }
      });

    const response = {
      success: true,
      printer: {
        id: template.printer.id,
        name: template.printer.name,
        ip: template.printer.printer_ip_address,
        port: template.printer.printer_port || 9100,
        type: template.printer.printer_type || 'network'
      },
      template: {
        id: template.id,
        name: template.name,
        type: template.template_type,
        format: template.template_format || 'html',
        content: template.template_content || {}
      },
      order: {
        id: order.id,
        order_number: order.order_number,
        table_name: order.table_name,
        items: order.order_items,
        subtotal: order.subtotal,
        tax_amount: order.tax_amount,
        total_amount: order.total_amount,
        created_at: order.created_at
      }
    };

    console.log(`[ROUTER] ✓ Routage vers ${response.printer.name} (${response.printer.ip}:${response.printer.port})`);

    res.json(response);
  } catch (error) {
    console.error('[ROUTER] Erreur:', error);
    res.status(500).json({
      error: 'Erreur serveur',
      message: error.message
    });
  }
});

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'print-router',
    timestamp: new Date().toISOString()
  });
});

app.get('/printers', async (req, res) => {
  try {
    const { data: printers, error } = await supabase
      .from('printer_definitions')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) throw error;

    res.json({
      success: true,
      printers
    });
  } catch (error) {
    console.error('[ROUTER] Erreur récupération imprimantes:', error);
    res.status(500).json({
      error: 'Erreur récupération imprimantes',
      message: error.message
    });
  }
});

app.get('/templates', async (req, res) => {
  try {
    const { data: templates, error } = await supabase
      .from('print_templates')
      .select(`
        *,
        printer:printer_definitions (*)
      `)
      .eq('is_active', true)
      .order('name');

    if (error) throw error;

    res.json({
      success: true,
      templates
    });
  } catch (error) {
    console.error('[ROUTER] Erreur récupération templates:', error);
    res.status(500).json({
      error: 'Erreur récupération templates',
      message: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════╗
║   🖨️  SERVEUR DE ROUTAGE D'IMPRESSION         ║
║                                                ║
║   Port:     ${PORT}                            ║
║   Status:   ✓ EN LIGNE                        ║
║                                                ║
║   Endpoints:                                   ║
║   POST /route      - Router une impression    ║
║   GET  /health     - Status du serveur        ║
║   GET  /printers   - Liste des imprimantes    ║
║   GET  /templates  - Liste des templates      ║
╚════════════════════════════════════════════════╝
  `);
});

process.on('SIGTERM', () => {
  console.log('[ROUTER] Arrêt du serveur...');
  process.exit(0);
});
