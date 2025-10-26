import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { logAction } from '../utils/actionLogger';
import SplitTicketModal from '../components/SplitTicketModal';
import './POS.css';

export default function POS() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [salesPoints, setSalesPoints] = useState([]);
  const [selectedSalesPoint, setSelectedSalesPoint] = useState(null);
  const [currentSession, setCurrentSession] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState([]);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState({});
  const [loading, setLoading] = useState(true);
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showClientModal, setShowClientModal] = useState(false);
  const [clientSearch, setClientSearch] = useState('');
  const [newClient, setNewClient] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    company_name: '',
    is_company: false
  });
  const [holdTickets, setHoldTickets] = useState([]);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportType, setReportType] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [showCountingModal, setShowCountingModal] = useState(false);
  const [physicalCounts, setPhysicalCounts] = useState({});
  const [variance, setVariance] = useState(null);
  const [justification, setJustification] = useState('');
  const [pendingReportType, setPendingReportType] = useState(null);
  const [pendingVoids, setPendingVoids] = useState([]);
  const [showVoidModal, setShowVoidModal] = useState(false);
  const [voidItem, setVoidItem] = useState(null);
  const [voidReason, setVoidReason] = useState('');
  const [showSplitModal, setShowSplitModal] = useState(false);

  useEffect(() => {
    loadSalesPoints();
  }, []);

  useEffect(() => {
    if (selectedSalesPoint) {
      checkOrCreateSession();
      loadCategories();
      loadProducts();
      loadTables();
      loadClients();
      loadHoldTickets();
    }
  }, [selectedSalesPoint]);

  const loadSalesPoints = async () => {
    try {
      const { data, error } = await supabase
        .from('sales_points')
        .select('*')
        .order('name');

      if (error) throw error;
      setSalesPoints(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Erreur chargement points de vente:', error);
      setLoading(false);
    }
  };

  const checkOrCreateSession = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];

      const { data: existingSession } = await supabase
        .from('pos_sessions')
        .select('*')
        .eq('sales_point_id', selectedSalesPoint.id)
        .eq('employee_id', user.id)
        .eq('status', 'active')
        .gte('opened_at', `${today}T00:00:00`)
        .maybeSingle();

      if (existingSession) {
        setCurrentSession(existingSession);
      } else {
        const openingBalance = parseFloat(prompt('Montant en caisse à l\'ouverture (FCFA):', '0')) || 0;

        const { data: newSession, error } = await supabase
          .from('pos_sessions')
          .insert([{
            sales_point_id: selectedSalesPoint.id,
            employee_id: user.id,
            opened_at: new Date().toISOString(),
            opening_balance: openingBalance,
            status: 'active'
          }])
          .select()
          .single();

        if (error) throw error;
        setCurrentSession(newSession);

        await logAction({
          employee_id: user.id,
          action_type: 'POS_SESSION_OPENED',
          entity_type: 'pos_session',
          entity_id: newSession.id,
          details: `Session ouverte pour ${selectedSalesPoint.name} avec ${openingBalance} FCFA`,
          pos_id: selectedSalesPoint.id
        });
      }
    } catch (error) {
      console.error('Erreur session:', error);
      alert('Erreur lors de la gestion de la session');
    }
  };

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Erreur chargement catégories:', error);
    }
  };

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_prices!inner(
            sales_point_id,
            selling_price
          )
        `)
        .eq('product_prices.sales_point_id', selectedSalesPoint.id)
        .order('name');

      if (error) throw error;

      const productsWithPrices = (data || []).map(product => ({
        ...product,
        selling_price: product.product_prices?.[0]?.selling_price || 0
      }));

      setProducts(productsWithPrices);
    } catch (error) {
      console.error('Erreur chargement produits:', error);
    }
  };

  const loadTables = async () => {
    try {
      const { data, error } = await supabase
        .from('tables')
        .select('*')
        .eq('sales_point_id', selectedSalesPoint.id)
        .order('table_number');

      if (error) throw error;
      setTables(data || []);
    } catch (error) {
      console.error('Erreur chargement tables:', error);
    }
  };

  const loadClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Erreur chargement clients:', error);
    }
  };

  const loadHoldTickets = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('sales_point_id', selectedSalesPoint.id)
        .eq('is_on_hold', true)
        .eq('payment_status', 'pending')
        .order('hold_time', { ascending: false });

      if (error) throw error;
      setHoldTickets(data || []);
    } catch (error) {
      console.error('Erreur chargement tickets en attente:', error);
    }
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.product_id === product.id);

    if (existingItem) {
      setCart(cart.map(item =>
        item.product_id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      const priceHT = product.selling_price / (1 + (product.vat_rate || 0) / 100);

      setCart([...cart, {
        product_id: product.id,
        product_name: product.name,
        unit_price: product.selling_price,
        unit_price_ht: priceHT,
        quantity: 1,
        tax_rate: product.vat_rate || 0
      }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.product_id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item =>
        item.product_id === productId
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const initiateVoid = (item) => {
    setVoidItem(item);
    setVoidReason('');
    setShowVoidModal(true);
  };

  const confirmVoid = () => {
    if (!voidReason.trim()) {
      alert('Veuillez saisir une raison pour l\'annulation');
      return;
    }

    if (currentOrderId) {
      setPendingVoids([...pendingVoids, {
        ...voidItem,
        void_reason: voidReason
      }]);
    }

    removeFromCart(voidItem.product_id);
    setShowVoidModal(false);
    setVoidItem(null);
    setVoidReason('');
  };

  const processPendingVoids = async (orderId) => {
    if (pendingVoids.length === 0) return;

    try {
      for (const voidedItem of pendingVoids) {
        const { data: orderItem } = await supabase
          .from('order_items')
          .select('id')
          .eq('order_id', orderId)
          .eq('product_id', voidedItem.product_id)
          .single();

        if (orderItem) {
          await supabase
            .from('order_items')
            .update({ is_voided: true })
            .eq('id', orderItem.id);

          await supabase
            .from('void_logs')
            .insert([{
              order_id: orderId,
              order_item_id: orderItem.id,
              product_name: voidedItem.product_name,
              quantity: voidedItem.quantity,
              unit_price: voidedItem.unit_price,
              total_amount: voidedItem.unit_price * voidedItem.quantity,
              voided_by: user.id,
              void_reason: voidedItem.void_reason,
              sales_point_id: selectedSalesPoint.id
            }]);
        }
      }

      setPendingVoids([]);
    } catch (error) {
      console.error('Erreur traitement annulations:', error);
    }
  };

  const calculateCartTotals = () => {
    let subtotal = 0;
    let taxAmount = 0;

    cart.forEach(item => {
      const itemSubtotal = item.unit_price_ht * item.quantity;
      const itemTax = itemSubtotal * (item.tax_rate / 100);
      subtotal += itemSubtotal;
      taxAmount += itemTax;
    });

    const total = subtotal + taxAmount;

    return {
      subtotal: parseFloat(subtotal.toFixed(2)),
      taxAmount: parseFloat(taxAmount.toFixed(2)),
      total: parseFloat(total.toFixed(2))
    };
  };

  const handlePayment = async () => {
    const totals = calculateCartTotals();
    const totalPaid = Object.values(paymentMethods).reduce((sum, amount) => sum + parseFloat(amount || 0), 0);

    if (Math.abs(totalPaid - totals.total) > 0.01) {
      alert(`Montant incomplet !\nAttendu: ${totals.total.toFixed(0)} FCFA\nReçu: ${totalPaid.toFixed(0)} FCFA`);
      return;
    }

    try {
      let orderId = currentOrderId;
      let orderNumber = null;

      if (!orderId) {
        const orderData = {
          order_number: `ORD-${Date.now()}`,
          sales_point_id: selectedSalesPoint.id,
          pos_session_id: currentSession.id,
          employee_id: user.id,
          subtotal: totals.subtotal,
          tax_amount: totals.taxAmount,
          total_amount: totals.total,
          status: 'completed',
          payment_status: 'paid',
          kitchen_status: 'sent',
          sent_to_kitchen_at: new Date().toISOString()
        };

        if (selectedTable) orderData.table_id = selectedTable.id;
        if (selectedClient) orderData.client_id = selectedClient.id;

        const { data: order, error: orderError } = await supabase
          .from('orders')
          .insert([orderData])
          .select()
          .single();

        if (orderError) throw orderError;

        orderId = order.id;
        orderNumber = order.order_number;

        const orderItems = cart.map(item => ({
          order_id: order.id,
          product_id: item.product_id,
          product_name: item.product_name,
          quantity: item.quantity,
          unit_price: item.unit_price,
          subtotal: item.unit_price * item.quantity,
          tax_rate: item.tax_rate,
          tax_amount: (item.unit_price * item.quantity) * (item.tax_rate / 100),
          total: (item.unit_price * item.quantity) * (1 + item.tax_rate / 100)
        }));

        const { data: insertedItems } = await supabase.from('order_items').insert(orderItems).select();

        await deductStockFromOrder(insertedItems, order.order_number);

        await processPendingVoids(order.id);
      } else {
        await supabase
          .from('orders')
          .update({
            status: 'completed',
            payment_status: 'paid'
          })
          .eq('id', orderId);

        const { data: order } = await supabase
          .from('orders')
          .select('order_number')
          .eq('id', orderId)
          .single();

        orderNumber = order.order_number;
      }

      for (const [method, amount] of Object.entries(paymentMethods)) {
        if (parseFloat(amount || 0) > 0) {
          await supabase.from('payments').insert([{
            order_id: orderId,
            payment_method: method,
            amount: parseFloat(amount)
          }]);
        }
      }

      if (selectedTable) {
        await supabase
          .from('tables')
          .update({ status: 'available', current_order_id: null })
          .eq('id', selectedTable.id);
      }

      await logAction({
        employee_id: user.id,
        action_type: 'PAYMENT_PROCESSED',
        entity_type: 'order',
        entity_id: orderId,
        details: `Paiement de ${totals.total.toFixed(0)} FCFA`,
        pos_id: selectedSalesPoint.id
      });

      setShowPayment(false);
      setCart([]);
      setPaymentMethods({});
      setSelectedClient(null);
      setSelectedTable(null);
      setCurrentOrderId(null);

      if (selectedClient) {
        const clientName = selectedClient.is_company
          ? selectedClient.company_name
          : `${selectedClient.first_name} ${selectedClient.last_name}`;
        alert(`Vente validée !\nCommande N° ${orderNumber}\nClient: ${clientName}\nMontant: ${totals.total.toFixed(0)} FCFA`);
      } else {
        alert(`Vente validée !\nCommande N° ${orderNumber}\nMontant: ${totals.total.toFixed(0)} FCFA`);
      }
    } catch (error) {
      console.error('Erreur traitement paiement:', error);
      alert('Erreur lors du traitement du paiement: ' + error.message);
    }
  };

  const deductStockFromOrder = async (orderItems, orderNumber) => {
    try {
      const { data: salesPointData } = await supabase
        .from('sales_points')
        .select('default_storage_location_id')
        .eq('id', selectedSalesPoint.id)
        .single();

      const storageLocationId = salesPointData?.default_storage_location_id;
      if (!storageLocationId) {
        console.warn('No default storage location configured for this POS');
        return;
      }

      for (const item of orderItems) {
        const { data: productData } = await supabase
          .from('products')
          .select('is_composed')
          .eq('id', item.product_id)
          .single();

        if (productData?.is_composed) {
          const { data: recipe, error: recipeError } = await supabase
            .from('product_recipes')
            .select('ingredient_id, quantity')
            .eq('product_id', item.product_id);

          if (recipeError) throw recipeError;

          if (!recipe || recipe.length === 0) {
            console.warn(`No recipe found for composed product: ${item.product_name}`);
            continue;
          }

          for (const component of recipe) {
            const quantityToDeduct = component.quantity * item.quantity;

            const { data: currentStock, error: stockError } = await supabase
              .from('product_stocks')
              .select('*')
              .eq('product_id', component.ingredient_id)
              .eq('storage_location_id', storageLocationId)
              .maybeSingle();

            if (stockError) throw stockError;

            let previousQuantity = 0;
            let stockId = null;

            if (!currentStock) {
              const { data: newStock, error: createError } = await supabase
                .from('product_stocks')
                .insert([{
                  product_id: component.ingredient_id,
                  storage_location_id: storageLocationId,
                  quantity: 0
                }])
                .select()
                .single();

              if (createError) throw createError;
              stockId = newStock.id;
              previousQuantity = 0;
            } else {
              stockId = currentStock.id;
              previousQuantity = parseFloat(currentStock.quantity);
            }

            const newQuantity = previousQuantity - quantityToDeduct;

            const { error: updateError } = await supabase
              .from('product_stocks')
              .update({
                quantity: newQuantity,
                updated_at: new Date().toISOString()
              })
              .eq('id', stockId);

            if (updateError) throw updateError;

            await supabase.from('stock_movements').insert([{
              product_id: component.ingredient_id,
              storage_location_id: storageLocationId,
              movement_type: 'sale',
              quantity: -quantityToDeduct,
              previous_quantity: previousQuantity,
              new_quantity: newQuantity,
              reference: orderNumber,
              pos_id: selectedSalesPoint.id,
              notes: `Vente: ${item.product_name}`
            }]);
          }
        }
      }
    } catch (error) {
      console.error('Erreur déduction stock:', error);
      throw error;
    }
  };

  const restoreStockFromOrder = async (orderItems, orderNumber) => {
    try {
      const { data: salesPointData } = await supabase
        .from('sales_points')
        .select('default_storage_location_id')
        .eq('id', selectedSalesPoint.id)
        .single();

      const storageLocationId = salesPointData?.default_storage_location_id;
      if (!storageLocationId) {
        console.warn('No default storage location configured for this POS');
        return;
      }

      for (const item of orderItems) {
        const { data: productData } = await supabase
          .from('products')
          .select('is_composed')
          .eq('id', item.product_id)
          .single();

        if (productData?.is_composed) {
          const { data: recipe } = await supabase
            .from('product_recipes')
            .select('ingredient_id, quantity')
            .eq('product_id', item.product_id);

          if (!recipe || recipe.length === 0) continue;

          for (const component of recipe) {
            const quantityToRestore = component.quantity * item.quantity;

            const { data: currentStock } = await supabase
              .from('product_stocks')
              .select('*')
              .eq('product_id', component.ingredient_id)
              .eq('storage_location_id', storageLocationId)
              .maybeSingle();

            if (currentStock) {
              const previousQuantity = parseFloat(currentStock.quantity);
              const newQuantity = previousQuantity + quantityToRestore;

              await supabase
                .from('product_stocks')
                .update({
                  quantity: newQuantity,
                  updated_at: new Date().toISOString()
                })
                .eq('id', currentStock.id);

              await supabase.from('stock_movements').insert([{
                product_id: component.ingredient_id,
                storage_location_id: storageLocationId,
                movement_type: 'adjustment',
                quantity: quantityToRestore,
                previous_quantity: previousQuantity,
                new_quantity: newQuantity,
                reference: orderNumber,
                pos_id: selectedSalesPoint.id,
                notes: `Annulation commande: ${item.product_name}`
              }]);
            }
          }
        }
      }
    } catch (error) {
      console.error('Erreur restauration stock:', error);
    }
  };

  const handlePrintTicket = async () => {
    if (cart.length === 0) {
      alert('Le panier est vide');
      return;
    }

    try {
      const totals = calculateCartTotals();
      const orderNumber = `ORD-${Date.now()}`;

      if (!currentOrderId) {
        const orderData = {
          order_number: orderNumber,
          sales_point_id: selectedSalesPoint.id,
          pos_session_id: currentSession.id,
          employee_id: user.id,
          subtotal: totals.subtotal,
          tax_amount: totals.taxAmount,
          total_amount: totals.total,
          status: 'pending',
          payment_status: 'pending',
          kitchen_status: 'sent',
          sent_to_kitchen_at: new Date().toISOString(),
          print_count: 1,
          last_printed_at: new Date().toISOString()
        };

        if (selectedTable) orderData.table_id = selectedTable.id;
        if (selectedClient) orderData.client_id = selectedClient.id;

        const { data: order, error: orderError } = await supabase
          .from('orders')
          .insert([orderData])
          .select()
          .single();

        if (orderError) throw orderError;

        const orderItems = cart.map(item => ({
          order_id: order.id,
          product_id: item.product_id,
          product_name: item.product_name,
          quantity: item.quantity,
          unit_price: item.unit_price,
          subtotal: item.unit_price * item.quantity,
          tax_rate: item.tax_rate,
          tax_amount: (item.unit_price * item.quantity) * (item.tax_rate / 100),
          total: (item.unit_price * item.quantity) * (1 + item.tax_rate / 100)
        }));

        const { data: insertedItems } = await supabase.from('order_items').insert(orderItems).select();
        setCurrentOrderId(order.id);

        await deductStockFromOrder(insertedItems, order.order_number);

        await processPendingVoids(order.id);

        alert('✅ Ticket imprimé et envoyé en cuisine !');
      } else {
        const { data: currentOrder } = await supabase
          .from('orders')
          .select('kitchen_status')
          .eq('id', currentOrderId)
          .single();

        const updateData = {
          print_count: supabase.raw('print_count + 1'),
          last_printed_at: new Date().toISOString()
        };

        if (currentOrder && currentOrder.kitchen_status === 'pending') {
          updateData.kitchen_status = 'sent';
          updateData.sent_to_kitchen_at = new Date().toISOString();
        }

        await supabase
          .from('orders')
          .update(updateData)
          .eq('id', currentOrderId);

        alert('✅ Ticket réimprimé !');
      }
    } catch (error) {
      console.error('Erreur impression ticket:', error);
      alert('Erreur lors de l\'impression: ' + error.message);
    }
  };

  const handleSendAndHold = async () => {
    if (cart.length === 0) {
      alert('Le panier est vide');
      return;
    }

    try {
      const totals = calculateCartTotals();
      const orderNumber = `ORD-${Date.now()}`;

      const orderData = {
        order_number: orderNumber,
        sales_point_id: selectedSalesPoint.id,
        pos_session_id: currentSession.id,
        employee_id: user.id,
        subtotal: totals.subtotal,
        tax_amount: totals.taxAmount,
        total_amount: totals.total,
        status: 'pending',
        payment_status: 'pending',
        kitchen_status: 'sent',
        sent_to_kitchen_at: new Date().toISOString(),
        is_on_hold: true,
        hold_time: new Date().toISOString()
      };

      if (selectedTable) orderData.table_id = selectedTable.id;
      if (selectedClient) orderData.client_id = selectedClient.id;

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = cart.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        subtotal: item.unit_price * item.quantity,
        tax_rate: item.tax_rate,
        tax_amount: (item.unit_price * item.quantity) * (item.tax_rate / 100),
        total: (item.unit_price * item.quantity) * (1 + item.tax_rate / 100)
      }));

      const { data: insertedItems } = await supabase.from('order_items').insert(orderItems).select();

      await deductStockFromOrder(insertedItems, order.order_number);

      await processPendingVoids(order.id);

      setCart([]);
      setSelectedClient(null);
      setSelectedTable(null);
      setCurrentOrderId(null);
      await loadHoldTickets();
      alert('✅ Commande envoyée en cuisine et mise en attente !');
    } catch (error) {
      console.error('Erreur envoi cuisine:', error);
      alert('Erreur lors de l\'envoi: ' + error.message);
    }
  };

  const loadTicketToCart = async (orderId) => {
    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('id', orderId)
        .single();

      if (orderError) throw orderError;

      const cartItems = order.order_items.map(item => ({
        product_id: item.product_id,
        product_name: item.product_name,
        unit_price: item.unit_price,
        unit_price_ht: item.subtotal / item.quantity,
        quantity: item.quantity,
        tax_rate: item.tax_rate
      }));

      setCart(cartItems);
      setCurrentOrderId(order.id);

      await supabase
        .from('orders')
        .update({ is_on_hold: false })
        .eq('id', orderId);

      await loadHoldTickets();
      alert('Ticket rechargé !');
    } catch (error) {
      console.error('Erreur chargement ticket:', error);
      alert('Erreur: ' + error.message);
    }
  };

  const handlePaymentClick = async () => {
    if (cart.length === 0) return;

    try {
      if (!currentOrderId) {
        const totals = calculateCartTotals();
        const orderNumber = `ORD-${Date.now()}`;

        const orderData = {
          order_number: orderNumber,
          sales_point_id: selectedSalesPoint.id,
          pos_session_id: currentSession.id,
          employee_id: user.id,
          subtotal: totals.subtotal,
          tax_amount: totals.taxAmount,
          total_amount: totals.total,
          status: 'pending',
          payment_status: 'pending',
          kitchen_status: 'sent',
          sent_to_kitchen_at: new Date().toISOString(),
          print_count: 0
        };

        if (selectedTable) orderData.table_id = selectedTable.id;
        if (selectedClient) orderData.client_id = selectedClient.id;

        const { data: order, error: orderError } = await supabase
          .from('orders')
          .insert([orderData])
          .select()
          .single();

        if (orderError) throw orderError;

        const orderItems = cart.map(item => ({
          order_id: order.id,
          product_id: item.product_id,
          product_name: item.product_name,
          quantity: item.quantity,
          unit_price: item.unit_price,
          subtotal: item.unit_price * item.quantity,
          tax_rate: item.tax_rate,
          tax_amount: (item.unit_price * item.quantity) * (item.tax_rate / 100),
          total: (item.unit_price * item.quantity) * (1 + item.tax_rate / 100)
        }));

        const { data: insertedItems } = await supabase.from('order_items').insert(orderItems).select();
        setCurrentOrderId(order.id);

        await deductStockFromOrder(insertedItems, order.order_number);
      } else {
        const { data: currentOrder } = await supabase
          .from('orders')
          .select('kitchen_status')
          .eq('id', currentOrderId)
          .single();

        if (currentOrder && currentOrder.kitchen_status === 'pending') {
          await supabase
            .from('orders')
            .update({
              kitchen_status: 'sent',
              sent_to_kitchen_at: new Date().toISOString()
            })
            .eq('id', currentOrderId);
        }
      }

      setShowPayment(true);
    } catch (error) {
      console.error('Erreur préparation paiement:', error);
      alert('Erreur: ' + error.message);
    }
  };

  const startReportProcess = async (type) => {
    setPendingReportType(type);

    try {
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          payments(payment_method, amount)
        `)
        .eq('sales_point_id', selectedSalesPoint.id)
        .eq('pos_session_id', currentSession.id);

      if (ordersError) throw ordersError;

      const paymentSummary = {};
      let totalSales = 0;

      ordersData.forEach(order => {
        if (order.payment_status === 'paid') {
          totalSales += parseFloat(order.total_amount);

          order.payments.forEach(payment => {
            const method = payment.payment_method;
            paymentSummary[method] = (paymentSummary[method] || 0) + parseFloat(payment.amount);
          });
        }
      });

      const expectedCash = (currentSession.opening_balance || 0) + (paymentSummary['cash'] || 0);

      setReportData({
        totalOrders: ordersData.filter(o => o.payment_status === 'paid').length,
        totalSales,
        paymentSummary,
        openingBalance: currentSession.opening_balance || 0,
        expectedCash,
        expectedAmounts: paymentSummary
      });

      setShowCountingModal(true);
    } catch (error) {
      console.error('Erreur génération rapport:', error);
      alert('Erreur: ' + error.message);
    }
  };

  const validateCounting = () => {
    const variances = {};
    let hasVariance = false;
    let totalVariance = 0;

    Object.keys(reportData.expectedAmounts).forEach(method => {
      const expected = reportData.expectedAmounts[method] || 0;
      const actual = parseFloat(physicalCounts[method] || 0);
      const diff = actual - expected;

      if (Math.abs(diff) > 0.01) {
        variances[method] = {
          expected,
          actual,
          difference: diff
        };
        hasVariance = true;
        totalVariance += Math.abs(diff);
      }
    });

    if (hasVariance) {
      setVariance({ details: variances, total: totalVariance });
    } else {
      setVariance(null);
      generateFinalReport();
    }
  };

  const generateFinalReport = () => {
    setShowCountingModal(false);
    setReportType(pendingReportType);
    setShowReportModal(true);

    if (pendingReportType === 'Z') {
      const confirmClose = window.confirm('Le rapport Z va clôturer définitivement la session. Continuer ?');
      if (!confirmClose) {
        setShowReportModal(false);
        return;
      }
    }
  };

  const confirmWithVariance = () => {
    if (!justification.trim() && variance.total > 1000) {
      alert('Une justification est requise pour un écart supérieur à 1000 FCFA');
      return;
    }
    generateFinalReport();
  };

  const closeSession = async () => {
    try {
      const { error } = await supabase
        .from('pos_sessions')
        .update({
          closed_at: new Date().toISOString(),
          closing_balance: reportData.expectedCash,
          status: 'closed'
        })
        .eq('id', currentSession.id);

      if (error) throw error;

      alert('Session clôturée avec succès !');
      setShowReportModal(false);
      setCurrentSession(null);
      setCart([]);
    } catch (error) {
      console.error('Erreur clôture session:', error);
      alert('Erreur lors de la clôture: ' + error.message);
    }
  };

  const cancelOrder = async (orderId) => {
    if (!window.confirm('Voulez-vous vraiment annuler cette commande ?')) return;

    try {
      const { data: order } = await supabase
        .from('orders')
        .select('order_number')
        .eq('id', orderId)
        .single();

      const { data: orderItems } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderId);

      await restoreStockFromOrder(orderItems, order.order_number);

      await supabase
        .from('orders')
        .update({ status: 'voided' })
        .eq('id', orderId);

      await loadHoldTickets();
      alert('Commande annulée et stock restauré !');
    } catch (error) {
      console.error('Erreur annulation commande:', error);
      alert('Erreur: ' + error.message);
    }
  };

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category_id === selectedCategory);

  const totals = calculateCartTotals();

  if (loading) return <div className="loading">Chargement...</div>;

  if (!selectedSalesPoint) {
    return (
      <div className="pos-container">
        <div className="pos-selection">
          <h2>Sélectionner un point de vente</h2>
          <div className="sales-points-grid">
            {salesPoints.map(sp => (
              <button
                key={sp.id}
                className="sales-point-card"
                onClick={() => setSelectedSalesPoint(sp)}
              >
                <h3>{sp.name}</h3>
                <p>{sp.type}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!currentSession) {
    return <div className="loading">Initialisation de la session...</div>;
  }

  return (
    <div className="pos-container">
      <div className="orchestra-layout">
        <div className="pos-sidebar">
          <div className="pos-sidebar-header">
            <h3>{selectedSalesPoint.name}</h3>
            <span className="session-badge-small">{user?.username}</span>
          </div>
          <div className="sidebar-actions">
            <button onClick={() => startReportProcess('X')} className="sidebar-btn">RAPPORT X</button>
            <button onClick={() => startReportProcess('Z')} className="sidebar-btn">RAPPORT Z</button>
            <button onClick={() => navigate('/')} className="sidebar-btn">RETOUR</button>
          </div>
        </div>

        <div className="pos-main">
          <div className="ticket-section">
            <div className="ticket-header">
              <div className="ticket-info">
                <span className="ticket-label">TICKET</span>
                {selectedTable && (
                  <span className="table-indicator">Table {selectedTable.table_number}</span>
                )}
              </div>
              <div className="ticket-total">
                <span className="total-amount">{totals.total.toFixed(0)}</span>
                <span className="currency">FCFA</span>
              </div>
            </div>
            <div className="ticket-items">
              {cart.length === 0 ? (
                <div className="ticket-empty">Aucun article</div>
              ) : (
                cart.map(item => (
                  <div key={item.product_id} className="ticket-item">
                    <div className="ticket-item-qty">{item.quantity}</div>
                    <div className="ticket-item-name">{item.product_name}</div>
                    <div className="ticket-item-price">{item.unit_price.toFixed(0)}</div>
                    <div className="ticket-item-actions">
                      <button onClick={() => initiateVoid(item)} className="ticket-item-void">⚠️</button>
                      <button onClick={() => removeFromCart(item.product_id)} className="ticket-item-remove">×</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="products-section-new">
            <div className="categories-tabs-horizontal">
              <button
                className={selectedCategory === 'all' ? 'cat-tab active' : 'cat-tab'}
                onClick={() => setSelectedCategory('all')}
              >
                Tous
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  className={selectedCategory === cat.id ? 'cat-tab active' : 'cat-tab'}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.name}
                </button>
              ))}
            </div>
            <div className="products-grid-new">
              {filteredProducts.map(product => (
                <button
                  key={product.id}
                  className="product-card-new"
                  onClick={() => addToCart(product)}
                >
                  <div className="product-name">{product.name}</div>
                  <div className="product-price">{product.selling_price.toFixed(0)}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="pos-rightbar">
          <div className="numpad-section">
            <div className="numpad-display">
              <div className="display-value">0</div>
            </div>
            <div className="numpad-grid">
              <button className="numpad-btn">7</button>
              <button className="numpad-btn">8</button>
              <button className="numpad-btn">9</button>
              <button className="numpad-btn">4</button>
              <button className="numpad-btn">5</button>
              <button className="numpad-btn">6</button>
              <button className="numpad-btn">1</button>
              <button className="numpad-btn">2</button>
              <button className="numpad-btn">3</button>
              <button className="numpad-btn">C</button>
              <button className="numpad-btn">0</button>
              <button className="numpad-btn">⌫</button>
            </div>
          </div>
          <div className="main-actions">
            <button onClick={handlePrintTicket} className="action-btn action-ticket-print" disabled={cart.length === 0}>IMPRIMER<br/>TICKET</button>
            <button onClick={handleSendAndHold} className="action-btn action-send" disabled={cart.length === 0}>ENVOYER<br/>CUISINE</button>
            <button onClick={handlePaymentClick} className="action-btn action-payment" disabled={cart.length === 0}>PAIEMENT</button>
          </div>
        </div>
      </div>

      {holdTickets.length > 0 && (
        <div className="hold-tickets">
          <h3>Tickets en attente</h3>
          <div className="tickets-list">
            {holdTickets.map(ticket => (
              <div key={ticket.id} className="hold-ticket">
                <div className="ticket-info">
                  <p className="ticket-number">{ticket.order_number}</p>
                  <p className="ticket-time">{new Date(ticket.hold_time).toLocaleTimeString()}</p>
                  <p className="ticket-total">{parseFloat(ticket.total_amount).toFixed(0)} FCFA</p>
                </div>
                <div className="ticket-actions">
                  <button onClick={() => loadTicketToCart(ticket.id)} className="btn-load-ticket">Charger</button>
                  <button onClick={() => cancelOrder(ticket.id)} className="btn-secondary">Annuler</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showPayment && (
        <div className="modal-overlay">
          <div className="modal-content payment-modal">
            <div className="modal-header">
              <h3>Paiement</h3>
              <button onClick={() => setShowPayment(false)} className="close-btn">×</button>
            </div>
            <div className="payment-amount">
              <span>Montant à payer</span>
              <div className="amount">{totals.total.toFixed(0)} FCFA</div>
            </div>
            <div className="payment-methods">
              {['cash', 'card', 'mobile_money', 'cheque', 'credit'].map(method => (
                <div key={method} className="payment-method">
                  <label>{method === 'cash' ? 'Espèces' : method === 'card' ? 'Carte' : method === 'mobile_money' ? 'Mobile Money' : method === 'cheque' ? 'Chèque' : 'Crédit'}</label>
                  <input
                    type="number"
                    value={paymentMethods[method] || ''}
                    onChange={(e) => setPaymentMethods({ ...paymentMethods, [method]: e.target.value })}
                    placeholder="0"
                  />
                </div>
              ))}
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowPayment(false)} className="cancel">Annuler</button>
              <button onClick={handlePayment} className="confirm">Valider</button>
            </div>
          </div>
        </div>
      )}

      {showClientModal && (
        <div className="modal-overlay">
          <div className="modal large">
            <h3>Gestion Client</h3>
            <input
              type="text"
              placeholder="Rechercher un client..."
              value={clientSearch}
              onChange={(e) => setClientSearch(e.target.value)}
              className="search-input"
            />
            <div className="clients-list">
              {clients
                .filter(c =>
                  c.first_name?.toLowerCase().includes(clientSearch.toLowerCase()) ||
                  c.last_name?.toLowerCase().includes(clientSearch.toLowerCase()) ||
                  c.company_name?.toLowerCase().includes(clientSearch.toLowerCase())
                )
                .map(client => (
                  <div
                    key={client.id}
                    className="client-item"
                    onClick={() => {
                      setSelectedClient(client);
                      setShowClientModal(false);
                    }}
                  >
                    <p>{client.is_company ? client.company_name : `${client.first_name} ${client.last_name}`}</p>
                    <p className="client-phone">{client.phone}</p>
                  </div>
                ))}
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowClientModal(false)} className="cancel">Fermer</button>
            </div>
          </div>
        </div>
      )}

      {showVoidModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Annuler l'article</h3>
            <p>Article: {voidItem?.product_name}</p>
            <textarea
              placeholder="Raison de l'annulation (obligatoire)"
              value={voidReason}
              onChange={(e) => setVoidReason(e.target.value)}
              rows="3"
            />
            <div className="modal-actions">
              <button onClick={() => setShowVoidModal(false)} className="cancel">Annuler</button>
              <button onClick={confirmVoid} className="confirm danger">Confirmer</button>
            </div>
          </div>
        </div>
      )}

      {showCountingModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Comptage des moyens de paiement</h3>
            {Object.keys(reportData.expectedAmounts).map(method => (
              <div key={method} className="payment-counting">
                <label>
                  {method === 'cash' ? 'Espèces' : method === 'card' ? 'Carte' : method === 'mobile_money' ? 'Mobile Money' : method === 'cheque' ? 'Chèque' : method}
                  <span className="expected"> (Attendu: {reportData.expectedAmounts[method].toFixed(0)} FCFA)</span>
                </label>
                <input
                  type="number"
                  value={physicalCounts[method] || ''}
                  onChange={(e) => setPhysicalCounts({ ...physicalCounts, [method]: e.target.value })}
                  placeholder="Montant réel"
                />
              </div>
            ))}
            {variance && (
              <div className="variance-alert">
                <h4>⚠️ Écart détecté: {variance.total.toFixed(0)} FCFA</h4>
                <textarea
                  placeholder="Justification (obligatoire si écart > 1000 FCFA)"
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  rows="3"
                />
                <button onClick={confirmWithVariance} className="confirm">Confirmer avec écart</button>
              </div>
            )}
            <div className="modal-actions">
              <button onClick={() => setShowCountingModal(false)} className="cancel">Annuler</button>
              <button onClick={validateCounting} className="confirm">Valider</button>
            </div>
          </div>
        </div>
      )}

      {showReportModal && reportData && (
        <div className="modal-overlay">
          <div className="modal report">
            <h2>Rapport {reportType}</h2>
            <div className="report-content">
              <p><strong>Point de vente:</strong> {selectedSalesPoint.name}</p>
              <p><strong>Caissier:</strong> {user?.username}</p>
              <p><strong>Date:</strong> {new Date().toLocaleString()}</p>
              <hr />
              <p><strong>Nombre de commandes:</strong> {reportData.totalOrders}</p>
              <p><strong>Total des ventes:</strong> {reportData.totalSales.toFixed(0)} FCFA</p>
              <hr />
              <h4>Détail des paiements:</h4>
              {Object.entries(reportData.paymentSummary).map(([method, amount]) => (
                <p key={method}>
                  {method === 'cash' ? 'Espèces' : method === 'card' ? 'Carte' : method === 'mobile_money' ? 'Mobile Money' : method === 'cheque' ? 'Chèque' : method}: {amount.toFixed(0)} FCFA
                </p>
              ))}
              <hr />
              <p><strong>Fond de caisse ouverture:</strong> {reportData.openingBalance.toFixed(0)} FCFA</p>
              <p><strong>Espèces attendues:</strong> {reportData.expectedCash.toFixed(0)} FCFA</p>
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowReportModal(false)} className="cancel">Fermer</button>
              {reportType === 'Z' && (
                <button onClick={closeSession} className="confirm danger">Clôturer session</button>
              )}
            </div>
          </div>
        </div>
      )}

      {showSplitModal && (
        <SplitTicketModal
          cart={cart}
          onClose={() => setShowSplitModal(false)}
          onSplit={(splitCarts) => {
            console.log('Tickets divisés:', splitCarts);
            setShowSplitModal(false);
          }}
        />
      )}
    </div>
  );
}
