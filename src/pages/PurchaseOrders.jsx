import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import './PurchaseOrders.css';

export default function PurchaseOrders() {
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [storageLocations, setStorageLocations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [formData, setFormData] = useState({
    supplier_id: '',
    order_date: new Date().toISOString().split('T')[0],
    expected_delivery_date: '',
    destination_location_id: '',
    notes: ''
  });

  const [orderLines, setOrderLines] = useState([]);
  const [newLine, setNewLine] = useState({
    product_id: '',
    quantity_ordered: '',
    unit_price: '',
    vat_rate: 0,
    notes: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    await Promise.all([
      loadOrders(),
      loadSuppliers(),
      loadProducts(),
      loadStorageLocations()
    ]);
    setLoading(false);
  }

  async function loadOrders() {
    try {
      const { data, error } = await supabase
        .from('purchase_orders')
        .select(`
          *,
          supplier:suppliers(name),
          destination:storage_locations(name),
          lines:purchase_order_lines(
            id,
            product_id,
            product:products(name),
            quantity_ordered,
            quantity_received,
            unit_price,
            vat_rate,
            total_line
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Erreur chargement commandes:', error);
    }
  }

  async function loadSuppliers() {
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setSuppliers(data || []);
    } catch (error) {
      console.error('Erreur chargement fournisseurs:', error);
    }
  }

  async function loadProducts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, unit')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Erreur chargement produits:', error);
    }
  }

  async function loadStorageLocations() {
    try {
      const { data, error } = await supabase
        .from('storage_locations')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setStorageLocations(data || []);
    } catch (error) {
      console.error('Erreur chargement dépôts:', error);
    }
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  function handleLineChange(e) {
    const { name, value } = e.target;
    setNewLine(prev => ({ ...prev, [name]: value }));
  }

  function addLine() {
    if (!newLine.product_id || !newLine.quantity_ordered || !newLine.unit_price) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const product = products.find(p => p.id === newLine.product_id);
    const totalLine = parseFloat(newLine.quantity_ordered) * parseFloat(newLine.unit_price);

    setOrderLines(prev => [...prev, {
      ...newLine,
      product_name: product.name,
      total_line: totalLine,
      temp_id: Date.now()
    }]);

    setNewLine({
      product_id: '',
      quantity_ordered: '',
      unit_price: '',
      vat_rate: 0,
      notes: ''
    });
  }

  function removeLine(tempId) {
    setOrderLines(prev => prev.filter(line => line.temp_id !== tempId));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.supplier_id) {
      alert('Veuillez sélectionner un fournisseur');
      return;
    }

    if (orderLines.length === 0) {
      alert('Veuillez ajouter au moins une ligne de commande');
      return;
    }

    try {
      const totalAmount = orderLines.reduce((sum, line) => sum + line.total_line, 0);
      const vatAmount = orderLines.reduce((sum, line) => {
        return sum + (line.total_line * line.vat_rate / 100);
      }, 0);

      if (editingOrder) {
        const { error } = await supabase
          .from('purchase_orders')
          .update({
            ...formData,
            total_amount: totalAmount,
            vat_amount: vatAmount,
            total_with_vat: totalAmount + vatAmount,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingOrder.id);

        if (error) throw error;

        await supabase
          .from('purchase_order_lines')
          .delete()
          .eq('purchase_order_id', editingOrder.id);

        const linesToInsert = orderLines.map(line => ({
          purchase_order_id: editingOrder.id,
          product_id: line.product_id,
          quantity_ordered: parseFloat(line.quantity_ordered),
          unit_price: parseFloat(line.unit_price),
          vat_rate: parseFloat(line.vat_rate),
          notes: line.notes
        }));

        const { error: linesError } = await supabase
          .from('purchase_order_lines')
          .insert(linesToInsert);

        if (linesError) throw linesError;
        alert('Commande modifiée avec succès');
      } else {
        const { data: numberData, error: numberError } = await supabase
          .rpc('generate_next_purchase_order_number');

        if (numberError) throw numberError;

        const { data: orderData, error: orderError } = await supabase
          .from('purchase_orders')
          .insert([{
            order_number: numberData,
            ...formData,
            total_amount: totalAmount,
            vat_amount: vatAmount,
            total_with_vat: totalAmount + vatAmount
          }])
          .select()
          .single();

        if (orderError) throw orderError;

        const linesToInsert = orderLines.map(line => ({
          purchase_order_id: orderData.id,
          product_id: line.product_id,
          quantity_ordered: parseFloat(line.quantity_ordered),
          unit_price: parseFloat(line.unit_price),
          vat_rate: parseFloat(line.vat_rate),
          notes: line.notes
        }));

        const { error: linesError } = await supabase
          .from('purchase_order_lines')
          .insert(linesToInsert);

        if (linesError) throw linesError;
        alert('Commande créée avec succès: ' + numberData);
      }

      resetForm();
      loadOrders();
    } catch (error) {
      console.error('Erreur sauvegarde commande:', error);
      alert('Erreur: ' + error.message);
    }
  }

  async function editOrder(order) {
    setEditingOrder(order);
    setFormData({
      supplier_id: order.supplier_id,
      order_date: order.order_date,
      expected_delivery_date: order.expected_delivery_date || '',
      destination_location_id: order.destination_location_id || '',
      notes: order.notes || ''
    });

    const lines = order.lines.map(line => ({
      product_id: line.product_id,
      product_name: line.product.name,
      quantity_ordered: line.quantity_ordered,
      unit_price: line.unit_price,
      vat_rate: line.vat_rate,
      total_line: line.total_line,
      notes: line.notes || '',
      temp_id: line.id
    }));

    setOrderLines(lines);
    setShowForm(true);
  }

  async function changeStatus(orderId, newStatus) {
    if (!confirm(`Changer le statut vers "${getStatusLabel(newStatus)}" ?`)) return;

    try {
      const { error } = await supabase
        .from('purchase_orders')
        .update({
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) throw error;
      loadOrders();
    } catch (error) {
      console.error('Erreur changement statut:', error);
      alert('Erreur: ' + error.message);
    }
  }

  async function deleteOrder(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) return;

    try {
      const { error } = await supabase
        .from('purchase_orders')
        .delete()
        .eq('id', id);

      if (error) throw error;
      alert('Commande supprimée');
      loadOrders();
    } catch (error) {
      console.error('Erreur suppression:', error);
      alert('Impossible de supprimer cette commande');
    }
  }

  function resetForm() {
    setFormData({
      supplier_id: '',
      order_date: new Date().toISOString().split('T')[0],
      expected_delivery_date: '',
      destination_location_id: '',
      notes: ''
    });
    setOrderLines([]);
    setNewLine({
      product_id: '',
      quantity_ordered: '',
      unit_price: '',
      vat_rate: 0,
      notes: ''
    });
    setEditingOrder(null);
    setShowForm(false);
  }

  function getStatusLabel(status) {
    const labels = {
      draft: 'Brouillon',
      sent: 'Envoyée',
      partially_received: 'Partiellement reçue',
      received: 'Reçue',
      cancelled: 'Annulée'
    };
    return labels[status] || status;
  }

  function getStatusClass(status) {
    const classes = {
      draft: 'draft',
      sent: 'sent',
      partially_received: 'partial',
      received: 'received',
      cancelled: 'cancelled'
    };
    return classes[status] || '';
  }

  const filteredOrders = orders.filter(o => {
    const matchesSearch =
      o.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.supplier?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || o.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalOrdersAmount = filteredOrders.reduce((sum, o) => sum + (parseFloat(o.total_with_vat) || 0), 0);

  return (
    <div className="purchase-orders-page">
      <div className="page-header">
        <h1>Commandes Fournisseurs</h1>
        <button
          className="btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Annuler' : '+ Nouvelle Commande'}
        </button>
      </div>

      {showForm && (
        <div className="order-form-container">
          <h2>{editingOrder ? 'Modifier la commande' : 'Nouvelle commande'}</h2>
          <form onSubmit={handleSubmit} className="order-form">
            <div className="form-section">
              <h3>Informations générales</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Fournisseur *</label>
                  <select
                    name="supplier_id"
                    value={formData.supplier_id}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Sélectionner un fournisseur</option>
                    {suppliers.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.supplier_code} - {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Date de commande *</label>
                  <input
                    type="date"
                    name="order_date"
                    value={formData.order_date}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Date de livraison prévue</label>
                  <input
                    type="date"
                    name="expected_delivery_date"
                    value={formData.expected_delivery_date}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>Dépôt de destination</label>
                  <select
                    name="destination_location_id"
                    value={formData.destination_location_id}
                    onChange={handleInputChange}
                  >
                    <option value="">Sélectionner un dépôt</option>
                    {storageLocations.map(loc => (
                      <option key={loc.id} value={loc.id}>
                        {loc.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="2"
                  placeholder="Notes sur la commande"
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Lignes de commande</h3>

              <div className="add-line-form">
                <select
                  name="product_id"
                  value={newLine.product_id}
                  onChange={handleLineChange}
                >
                  <option value="">Sélectionner un produit</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.unit})
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  name="quantity_ordered"
                  value={newLine.quantity_ordered}
                  onChange={handleLineChange}
                  placeholder="Quantité"
                  step="0.001"
                  min="0"
                />

                <input
                  type="number"
                  name="unit_price"
                  value={newLine.unit_price}
                  onChange={handleLineChange}
                  placeholder="Prix unitaire HT"
                  step="0.01"
                  min="0"
                />

                <input
                  type="number"
                  name="vat_rate"
                  value={newLine.vat_rate}
                  onChange={handleLineChange}
                  placeholder="TVA %"
                  step="0.01"
                  min="0"
                />

                <button type="button" onClick={addLine} className="btn-add-line">
                  Ajouter
                </button>
              </div>

              {orderLines.length > 0 && (
                <div className="order-lines-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Produit</th>
                        <th>Quantité</th>
                        <th>Prix Unit. HT</th>
                        <th>TVA %</th>
                        <th>Total HT</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderLines.map(line => (
                        <tr key={line.temp_id}>
                          <td>{line.product_name}</td>
                          <td>{line.quantity_ordered}</td>
                          <td>{parseFloat(line.unit_price).toFixed(2)} €</td>
                          <td>{parseFloat(line.vat_rate).toFixed(2)} %</td>
                          <td>{line.total_line.toFixed(2)} €</td>
                          <td>
                            <button
                              type="button"
                              onClick={() => removeLine(line.temp_id)}
                              className="btn-remove-line"
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="4" className="text-right"><strong>Total HT:</strong></td>
                        <td><strong>{orderLines.reduce((sum, l) => sum + l.total_line, 0).toFixed(2)} €</strong></td>
                        <td></td>
                      </tr>
                      <tr>
                        <td colSpan="4" className="text-right"><strong>Total TVA:</strong></td>
                        <td><strong>{orderLines.reduce((sum, l) => sum + (l.total_line * l.vat_rate / 100), 0).toFixed(2)} €</strong></td>
                        <td></td>
                      </tr>
                      <tr className="total-row">
                        <td colSpan="4" className="text-right"><strong>Total TTC:</strong></td>
                        <td><strong>{orderLines.reduce((sum, l) => sum + l.total_line + (l.total_line * l.vat_rate / 100), 0).toFixed(2)} €</strong></td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>

            <div className="form-actions">
              <button type="button" onClick={resetForm} className="btn-secondary">
                Annuler
              </button>
              <button type="submit" className="btn-primary">
                {editingOrder ? 'Modifier' : 'Créer'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="orders-list-container">
        <div className="list-header">
          <input
            type="text"
            placeholder="Rechercher par numéro ou fournisseur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">Tous les statuts</option>
            <option value="draft">Brouillon</option>
            <option value="sent">Envoyée</option>
            <option value="partially_received">Partiellement reçue</option>
            <option value="received">Reçue</option>
            <option value="cancelled">Annulée</option>
          </select>
          <span className="count-badge">
            {filteredOrders.length} commande(s) - {totalOrdersAmount.toFixed(2)} € TTC
          </span>
        </div>

        {loading ? (
          <div className="loading">Chargement...</div>
        ) : (
          <div className="orders-grid">
            {filteredOrders.map(order => (
              <div key={order.id} className="order-card">
                <div className="card-header">
                  <div>
                    <div className="order-number">{order.order_number}</div>
                    <div className="supplier-name">{order.supplier?.name}</div>
                  </div>
                  <span className={`status-badge ${getStatusClass(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                </div>

                <div className="card-body">
                  <div className="info-row">
                    <span className="label">Date:</span>
                    <span>{new Date(order.order_date).toLocaleDateString()}</span>
                  </div>
                  {order.expected_delivery_date && (
                    <div className="info-row">
                      <span className="label">Livraison prévue:</span>
                      <span>{new Date(order.expected_delivery_date).toLocaleDateString()}</span>
                    </div>
                  )}
                  <div className="info-row">
                    <span className="label">Dépôt:</span>
                    <span>{order.destination?.name || '-'}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Lignes:</span>
                    <span>{order.lines?.length || 0} produit(s)</span>
                  </div>
                  <div className="info-row total">
                    <span className="label">Total TTC:</span>
                    <span className="amount">{parseFloat(order.total_with_vat).toFixed(2)} €</span>
                  </div>
                </div>

                <div className="card-actions">
                  {order.status === 'draft' && (
                    <button
                      onClick={() => changeStatus(order.id, 'sent')}
                      className="btn-action"
                    >
                      Envoyer
                    </button>
                  )}
                  {(order.status === 'draft' || order.status === 'sent') && (
                    <button
                      onClick={() => editOrder(order)}
                      className="btn-action"
                    >
                      Modifier
                    </button>
                  )}
                  {order.status === 'draft' && (
                    <button
                      onClick={() => deleteOrder(order.id)}
                      className="btn-action delete"
                    >
                      Supprimer
                    </button>
                  )}
                </div>
              </div>
            ))}

            {filteredOrders.length === 0 && (
              <div className="empty-state">
                {searchTerm || filterStatus !== 'all' ? 'Aucune commande trouvée' : 'Aucune commande créée'}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
