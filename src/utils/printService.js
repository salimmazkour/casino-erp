import { supabase } from '../lib/supabase.js';

export class PrintService {
  static async printOrder(orderId, salesPointId, templateType = 'ticket_cuisine') {
    try {
      const printServiceUrl = import.meta.env.VITE_PRINT_SERVICE_URL || 'http://localhost:3001';
      const localServiceUrl = `${printServiceUrl}/print`;

      const templateHtml = await this.generateTicketHtml(orderId, templateType);

      const printerIdMap = {
        'ticket_cuisine': 'CUISINE',
        'ticket_bar': 'BAR',
        'ticket_caisse': 'CAISSE'
      };

      const response = await fetch(localServiceUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateHtml: templateHtml,
          printerId: printerIdMap[templateType] || 'CAISSE',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Print failed');
      }

      const result = await response.json();

      return {
        success: true,
        message: result.message,
      };
    } catch (error) {
      console.error(`Error printing ${templateType}:`, error);
      return {
        success: false,
        message: error.message,
        error,
      };
    }
  }

  static async generateTicketHtml(orderId, templateType) {

    const { data: order } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(*),
        sales_points(name)
      `)
      .eq('id', orderId)
      .single();

    if (!order) return '<div>Commande introuvable</div>';

    const items = order.order_items || [];
    const date = new Date(order.created_at).toLocaleString('fr-FR');

    let html = `
      <div class="header">
        ${templateType === 'ticket_cuisine' ? 'CUISINE' : templateType === 'ticket_bar' ? 'BAR' : 'TICKET'}
      </div>
      <div class="line">Point de vente: ${order.sales_points?.name || 'N/A'}</div>
      <div class="line">N° commande: ${order.order_number}</div>
      <div class="line">Date: ${date}</div>
      <div class="separator"></div>
    `;

    items.forEach(item => {
      html += `<div class="line">${item.quantity}x ${item.product_name} - ${item.unit_price.toFixed(2)}€</div>`;
    });

    html += `
      <div class="separator"></div>
      <div class="total">TOTAL: ${order.total_amount.toFixed(2)}€</div>
    `;

    return html;
  }

  static async printMultipleTickets(orderId, salesPointId, templateTypes = ['ticket_cuisine', 'ticket_bar', 'ticket_caisse']) {
    const results = [];

    for (const templateType of templateTypes) {
      try {
        const result = await this.printOrder(orderId, salesPointId, templateType);
        results.push({
          templateType,
          ...result,
        });
      } catch (error) {
        results.push({
          templateType,
          success: false,
          message: error.message,
        });
      }
    }

    return results;
  }

  static async checkService() {
    try {
      const printServiceUrl = import.meta.env.VITE_PRINT_SERVICE_URL || 'http://localhost:3001';
      const response = await fetch(`${printServiceUrl}/health`);
      if (!response.ok) throw new Error('Service unavailable');
      return await response.json();
    } catch (error) {
      console.error('Print service check failed:', error);
      return { status: 'error', error: error.message };
    }
  }

  static async getPrinters() {
    try {
      const printServiceUrl = import.meta.env.VITE_PRINT_SERVICE_URL || 'http://localhost:3001';
      const response = await fetch(`${printServiceUrl}/printers`);
      if (!response.ok) throw new Error('Failed to fetch printers');
      return await response.json();
    } catch (error) {
      console.error('Error fetching printers:', error);
      return { success: false, printers: [] };
    }
  }

  static async getMapping() {
    try {
      const printServiceUrl = import.meta.env.VITE_PRINT_SERVICE_URL || 'http://localhost:3001';
      const response = await fetch(`${printServiceUrl}/mapping`);
      if (!response.ok) throw new Error('Failed to fetch mapping');
      return await response.json();
    } catch (error) {
      console.error('Error fetching mapping:', error);
      return { success: false, mapping: {} };
    }
  }

  static async setMapping(logicalPrinterId, physicalPrinterName) {
    try {
      const printServiceUrl = import.meta.env.VITE_PRINT_SERVICE_URL || 'http://localhost:3001';
      const response = await fetch(`${printServiceUrl}/mapping`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          logicalPrinterId,
          physicalPrinterName,
        }),
      });

      if (!response.ok) throw new Error('Failed to set mapping');
      return await response.json();
    } catch (error) {
      console.error('Error setting mapping:', error);
      return { success: false, error: error.message };
    }
  }
}
