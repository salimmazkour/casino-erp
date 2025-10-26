import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import './PurchaseReceptions.css';

export default function PurchaseReceptions() {
  const [receptions, setReceptions] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [storageLocations, setStorageLocations] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [formData, setFormData] = useState({
    purchase_order_id: '',
    reception_date: new Date().toISOString().split('T')[0],
    storage_location_id: '',
    notes: ''
  });

  const [receptionLines, setReceptionLines] = useState([]);

  useEffect(() => {
    loadData();
    loadCurrentUser();
  }, []);

  async function loadCurrentUser() {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        setCurrentUser(user);
      }
    } catch (error) {
      console.error('Erreur chargement utilisateur:', error);
    }
  }

  async function loadData() {
    setLoading(true);
    await Promise.all([
      loadReceptions(),
      loadPendingOrders(),
      loadStorageLocations()
    ]);
    setLoading(false);
  }

  async function loadReceptions() {
    try {
      const { data, error } = await supabase
        .from('purchase_receptions')
        .select(`
          *,
          purchase_order:purchase_orders(
            order_number,
            supplier:suppliers(name)
          ),
          storage_location:storage_locations(name),
          employee:employees(full_name),
          lines:purchase_reception_lines(
            *,
            product:products(name)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReceptions(data || []);
    } catch (error) {
      console.error('Erreur chargement réceptions:', error);
    }
  }

  async function loadPendingOrders() {
    try {
      const { data, error } = await supabase
        .from('purchase_orders')
        .select(`
          *,
          supplier:suppliers(name),
          destination:storage_locations(name),
          lines:purchase_order_lines(
            *,
            product:products(name, unit)
          )
        `)
        .in('status', ['sent', 'partially_received'])
        .order('order_date', { ascending: false });

      if (error) throw error;
      setPendingOrders(data || []);
    } catch (error) {
      console.error('Erreur chargement commandes:', error);
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

  function handleOrderSelect(e) {
    const orderId = e.target.value;
    const order = pendingOrders.find(o => o.id === orderId);

    if (!order) {
      setSelectedOrder(null);
      setReceptionLines([]);
      setFormData(prev => ({
        ...prev,
        purchase_order_id: '',
        storage_location_id: ''
      }));
      return;
    }

    setSelectedOrder(order);
    setFormData(prev => ({
      ...prev,
      purchase_order_id: orderId,
      storage_location_id: order.destination_location_id || ''
    }));

    const lines = order.lines.map((line, index) => ({
      purchase_order_line_id: line.id,
      product_id: line.product_id,
      product_name: line.product.name,
      product_unit: line.product.unit,
      quantity_ordered: parseFloat(line.quantity_ordered),
      quantity_already_received: parseFloat(line.quantity_received),
      quantity_remaining: parseFloat(line.quantity_ordered) - parseFloat(line.quantity_received),
      quantity_received: '',
      quantity_accepted: '',
      quantity_rejected: '0',
      rejection_reason: '',
      expiry_date: '',
      batch_number: '',
      notes: '',
      temp_id: index
    }));

    setReceptionLines(lines);
  }

  function handleLineChange(tempId, field, value) {
    setReceptionLines(prev => prev.map(line => {
      if (line.temp_id !== tempId) return line;

      const updated = { ...line, [field]: value };

      if (field === 'quantity_received') {
        const received = parseFloat(value) || 0;
        updated.quantity_accepted = received.toString();
        updated.quantity_rejected = '0';
      }

      if (field === 'quantity_accepted' || field === 'quantity_rejected') {
        const accepted = parseFloat(updated.quantity_accepted) || 0;
        const rejected = parseFloat(updated.quantity_rejected) || 0;
        updated.quantity_received = (accepted + rejected).toString();
      }

      return updated;
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.purchase_order_id || !formData.storage_location_id) {
      alert('Veuillez sélectionner une commande et un dépôt');
      return;
    }

    if (!currentUser) {
      alert('Utilisateur non connecté');
      return;
    }

    const linesToReceive = receptionLines.filter(line =>
      parseFloat(line.quantity_received || 0) > 0
    );

    if (linesToReceive.length === 0) {
      alert('Veuillez saisir au moins une quantité reçue');
      return;
    }

    for (const line of linesToReceive) {
      const received = parseFloat(line.quantity_received);
      const accepted = parseFloat(line.quantity_accepted);
      const rejected = parseFloat(line.quantity_rejected);

      if (received !== accepted + rejected) {
        alert(`Erreur ligne "${line.product_name}": Reçu doit égaler Accepté + Rejeté`);
        return;
      }

      if (rejected > 0 && !line.rejection_reason.trim()) {
        alert(`Veuillez indiquer la raison du rejet pour "${line.product_name}"`);
        return;
      }
    }

    try {
      const { data: numberData, error: numberError } = await supabase
        .rpc('generate_next_reception_number');

      if (numberError) throw numberError;

      const { data: receptionData, error: receptionError } = await supabase
        .from('purchase_receptions')
        .insert([{
          reception_number: numberData,
          ...formData,
          received_by: currentUser.id
        }])
        .select()
        .single();

      if (receptionError) throw receptionError;

      const linesToInsert = linesToReceive.map(line => ({
        reception_id: receptionData.id,
        purchase_order_line_id: line.purchase_order_line_id,
        product_id: line.product_id,
        quantity_received: parseFloat(line.quantity_received),
        quantity_accepted: parseFloat(line.quantity_accepted),
        quantity_rejected: parseFloat(line.quantity_rejected),
        rejection_reason: line.rejection_reason,
        expiry_date: line.expiry_date || null,
        batch_number: line.batch_number,
        notes: line.notes
      }));

      const { error: linesError } = await supabase
        .from('purchase_reception_lines')
        .insert(linesToInsert);

      if (linesError) throw linesError;

      alert('Réception créée avec succès: ' + numberData);
      resetForm();
      loadData();
    } catch (error) {
      console.error('Erreur sauvegarde réception:', error);
      alert('Erreur: ' + error.message);
    }
  }

  async function validateReception(receptionId) {
    if (!confirm('Valider définitivement cette réception ?')) return;

    try {
      const { error } = await supabase
        .from('purchase_receptions')
        .update({
          status: 'validated',
          updated_at: new Date().toISOString()
        })
        .eq('id', receptionId);

      if (error) throw error;
      alert('Réception validée');
      loadData();
    } catch (error) {
      console.error('Erreur validation:', error);
      alert('Erreur: ' + error.message);
    }
  }

  async function cancelReception(receptionId) {
    if (!confirm('Annuler cette réception ?')) return;

    try {
      const { error } = await supabase
        .from('purchase_receptions')
        .update({
          status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('id', receptionId);

      if (error) throw error;
      alert('Réception annulée');
      loadData();
    } catch (error) {
      console.error('Erreur annulation:', error);
      alert('Erreur: ' + error.message);
    }
  }

  function resetForm() {
    setFormData({
      purchase_order_id: '',
      reception_date: new Date().toISOString().split('T')[0],
      storage_location_id: '',
      notes: ''
    });
    setSelectedOrder(null);
    setReceptionLines([]);
    setShowForm(false);
  }

  function getStatusLabel(status) {
    const labels = {
      pending: 'En attente',
      validated: 'Validée',
      cancelled: 'Annulée'
    };
    return labels[status] || status;
  }

  function getStatusClass(status) {
    const classes = {
      pending: 'pending',
      validated: 'validated',
      cancelled: 'cancelled'
    };
    return classes[status] || '';
  }

  const filteredReceptions = receptions.filter(r =>
    r.reception_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.purchase_order?.order_number || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.purchase_order?.supplier?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="purchase-receptions-page">
      <div className="page-header">
        <h1>Réception de Commandes</h1>
        <button
          className="btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Annuler' : '+ Nouvelle Réception'}
        </button>
      </div>

      {showForm && (
        <div className="reception-form-container">
          <h2>Nouvelle réception</h2>
          <form onSubmit={handleSubmit} className="reception-form">
            <div className="form-section">
              <h3>Informations générales</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Commande à réceptionner *</label>
                  <select
                    value={formData.purchase_order_id}
                    onChange={handleOrderSelect}
                    required
                  >
                    <option value="">Sélectionner une commande</option>
                    {pendingOrders.map(order => (
                      <option key={order.id} value={order.id}>
                        {order.order_number} - {order.supplier?.name} ({order.status === 'sent' ? 'Non reçue' : 'Partiellement reçue'})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Date de réception *</label>
                  <input
                    type="date"
                    value={formData.reception_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, reception_date: e.target.value }))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Dépôt de réception *</label>
                  <select
                    value={formData.storage_location_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, storage_location_id: e.target.value }))}
                    required
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
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows="2"
                  placeholder="Notes sur la réception"
                />
              </div>
            </div>

            {selectedOrder && receptionLines.length > 0 && (
              <div className="form-section">
                <h3>Produits à réceptionner</h3>
                <div className="reception-lines-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Produit</th>
                        <th>Commandé</th>
                        <th>Déjà reçu</th>
                        <th>Restant</th>
                        <th>Reçu</th>
                        <th>Accepté</th>
                        <th>Rejeté</th>
                        <th>Motif rejet</th>
                        <th>N° Lot</th>
                        <th>Péremption</th>
                      </tr>
                    </thead>
                    <tbody>
                      {receptionLines.map(line => (
                        <tr key={line.temp_id}>
                          <td className="product-name">
                            {line.product_name}
                            <div className="product-unit">({line.product_unit})</div>
                          </td>
                          <td className="qty">{line.quantity_ordered}</td>
                          <td className="qty received">{line.quantity_already_received}</td>
                          <td className="qty remaining">{line.quantity_remaining}</td>
                          <td>
                            <input
                              type="number"
                              value={line.quantity_received}
                              onChange={(e) => handleLineChange(line.temp_id, 'quantity_received', e.target.value)}
                              step="0.001"
                              min="0"
                              max={line.quantity_remaining}
                              placeholder="0"
                              className="input-qty"
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={line.quantity_accepted}
                              onChange={(e) => handleLineChange(line.temp_id, 'quantity_accepted', e.target.value)}
                              step="0.001"
                              min="0"
                              placeholder="0"
                              className="input-qty accepted"
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={line.quantity_rejected}
                              onChange={(e) => handleLineChange(line.temp_id, 'quantity_rejected', e.target.value)}
                              step="0.001"
                              min="0"
                              placeholder="0"
                              className="input-qty rejected"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={line.rejection_reason}
                              onChange={(e) => handleLineChange(line.temp_id, 'rejection_reason', e.target.value)}
                              placeholder="Si rejet..."
                              className="input-text"
                              disabled={parseFloat(line.quantity_rejected || 0) === 0}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={line.batch_number}
                              onChange={(e) => handleLineChange(line.temp_id, 'batch_number', e.target.value)}
                              placeholder="Lot"
                              className="input-text"
                            />
                          </td>
                          <td>
                            <input
                              type="date"
                              value={line.expiry_date}
                              onChange={(e) => handleLineChange(line.temp_id, 'expiry_date', e.target.value)}
                              className="input-date"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="form-actions">
              <button type="button" onClick={resetForm} className="btn-secondary">
                Annuler
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={!selectedOrder || receptionLines.filter(l => parseFloat(l.quantity_received || 0) > 0).length === 0}
              >
                Créer la réception
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="receptions-list-container">
        <div className="list-header">
          <input
            type="text"
            placeholder="Rechercher par numéro, commande ou fournisseur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="count-badge">{filteredReceptions.length} réception(s)</span>
        </div>

        {loading ? (
          <div className="loading">Chargement...</div>
        ) : (
          <div className="receptions-grid">
            {filteredReceptions.map(reception => (
              <div key={reception.id} className="reception-card">
                <div className="card-header">
                  <div>
                    <div className="reception-number">{reception.reception_number}</div>
                    <div className="order-ref">Commande: {reception.purchase_order?.order_number}</div>
                    <div className="supplier-name">{reception.purchase_order?.supplier?.name}</div>
                  </div>
                  <span className={`status-badge ${getStatusClass(reception.status)}`}>
                    {getStatusLabel(reception.status)}
                  </span>
                </div>

                <div className="card-body">
                  <div className="info-row">
                    <span className="label">Date:</span>
                    <span>{new Date(reception.reception_date).toLocaleDateString()}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Dépôt:</span>
                    <span>{reception.storage_location?.name}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Réceptionné par:</span>
                    <span>{reception.employee?.full_name || '-'}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Produits:</span>
                    <span>{reception.lines?.length || 0} ligne(s)</span>
                  </div>
                  {reception.lines && reception.lines.some(l => l.quantity_rejected > 0) && (
                    <div className="info-row warning">
                      <span className="label">⚠️ Rejets:</span>
                      <span>{reception.lines.filter(l => l.quantity_rejected > 0).length} produit(s)</span>
                    </div>
                  )}
                </div>

                <div className="card-actions">
                  {reception.status === 'pending' && (
                    <>
                      <button
                        onClick={() => validateReception(reception.id)}
                        className="btn-action validate"
                      >
                        Valider
                      </button>
                      <button
                        onClick={() => cancelReception(reception.id)}
                        className="btn-action cancel"
                      >
                        Annuler
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}

            {filteredReceptions.length === 0 && (
              <div className="empty-state">
                {searchTerm ? 'Aucune réception trouvée' : 'Aucune réception créée'}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
