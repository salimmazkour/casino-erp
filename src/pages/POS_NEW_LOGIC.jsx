// Nouvelles fonctions pour la logique Orchestra

// État à ajouter au composant principal:
// const [currentOrderStatus, setCurrentOrderStatus] = useState('draft'); // draft, validated
// const [productionSlipPrinted, setProductionSlipPrinted] = useState(false);
// const [cancellationSlipPrinted, setCancellationSlipPrinted] = useState(false);

// Modifier le cart pour inclure un statut de pending cancellation
// item.pendingCancellation = true (ligne barrée visuellement)

export const markLineForCancellation = (setCart, productId, voidReason) => {
  setCart(prevCart =>
    prevCart.map(item =>
      item.product_id === productId
        ? { ...item, pendingCancellation: true, void_reason: voidReason }
        : item
    )
  );
};

export const removeLineFromCart = (setCart, productId) => {
  setCart(prevCart => prevCart.filter(item => item.product_id !== productId));
};

export const printProductionSlip = async (orderItems, orderNumber, salesPointId) => {
  console.log('🖨️ IMPRESSION BON DE FABRICATION:', {
    orderNumber,
    items: orderItems
  });

  // TODO: Implémenter l'impression réelle vers les imprimantes
  await new Promise(resolve => setTimeout(resolve, 500));
  return true;
};

export const printCancellationSlip = async (cancelledItems, orderNumber, salesPointId) => {
  console.log('🖨️ IMPRESSION BON D\'ANNULATION:', {
    orderNumber,
    cancelledItems
  });

  // TODO: Implémenter l'impression réelle vers les imprimantes
  await new Promise(resolve => setTimeout(resolve, 500));
  return true;
};

export const handleTicketButton = async (cart, currentOrderId, currentOrderStatus, productionSlipPrinted, supabase, user, selectedSalesPoint, currentSession, setProductionSlipPrinted, setCancellationSlipPrinted, setCart) => {
  if (cart.length === 0) {
    alert('Le panier est vide');
    return;
  }

  try {
    const totals = calculateCartTotals(cart);
    const orderNumber = currentOrderId ? null : `ORD-${Date.now()}`;

    // Si pas encore de commande, créer une
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
        kitchen_status: 'pending',
        print_count: 1
      };

      const { data: order, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();

      if (error) throw error;

      const orderItems = cart.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        unit_price_ht: item.unit_price_ht,
        tax_rate: item.tax_rate,
        subtotal: item.unit_price_ht * item.quantity,
        total: item.unit_price * item.quantity
      }));

      await supabase.from('order_items').insert(orderItems);

      // Première impression = lancer le bon de fabrication
      await printProductionSlip(cart, orderNumber, selectedSalesPoint.id);

      await supabase
        .from('orders')
        .update({
          kitchen_status: 'sent',
          sent_to_kitchen_at: new Date().toISOString()
        })
        .eq('id', order.id);

      setProductionSlipPrinted(true);

      console.log('✅ Ticket imprimé et bon de fabrication envoyé');
      alert('✅ Ticket imprimé et envoyé en cuisine/bar');

      return order.id;
    } else {
      // Réimpression du ticket

      // Gérer les lignes en attente d'annulation
      const itemsToCancel = cart.filter(item => item.pendingCancellation);
      if (itemsToCancel.length > 0) {
        // Imprimer bon d'annulation une seule fois
        if (!currentOrderStatus.cancellationSlipPrinted) {
          await printCancellationSlip(itemsToCancel, orderNumber, selectedSalesPoint.id);
          setCancellationSlipPrinted(true);
        }

        // Marquer les items comme annulés dans la DB
        for (const item of itemsToCancel) {
          const { data: orderItem } = await supabase
            .from('order_items')
            .select('id')
            .eq('order_id', currentOrderId)
            .eq('product_id', item.product_id)
            .maybeSingle();

          if (orderItem) {
            await supabase
              .from('order_items')
              .update({ is_voided: true })
              .eq('id', orderItem.id);

            await supabase
              .from('void_logs')
              .insert([{
                order_id: currentOrderId,
                order_item_id: orderItem.id,
                product_name: item.product_name,
                quantity: item.quantity,
                unit_price: item.unit_price,
                total_amount: item.unit_price * item.quantity,
                voided_by: user.id,
                void_reason: item.void_reason,
                sales_point_id: selectedSalesPoint.id
              }]);
          }
        }

        // Retirer les lignes annulées du panier
        setCart(prevCart => prevCart.filter(item => !item.pendingCancellation));
      }

      // Mettre à jour le total
      await supabase
        .from('orders')
        .update({
          subtotal: totals.subtotal,
          tax_amount: totals.taxAmount,
          total_amount: totals.total,
          print_count: supabase.raw('print_count + 1')
        })
        .eq('id', currentOrderId);

      console.log('✅ Ticket réimprimé');
      alert('✅ Ticket réimprimé');
    }
  } catch (error) {
    console.error('Erreur:', error);
    alert('Erreur: ' + error.message);
  }
};

export const handleSendButton = async (cart, currentOrderId, productionSlipPrinted, supabase, user, selectedSalesPoint, currentSession, setProductionSlipPrinted, setCurrentOrderId, setCurrentOrderStatus, setCart, loadHoldTickets) => {
  if (cart.length === 0) {
    alert('Le panier est vide');
    return;
  }

  try {
    const totals = calculateCartTotals(cart);
    const orderNumber = `ORD-${Date.now()}`;

    let orderId = currentOrderId;

    // Si pas de commande existante, créer une
    if (!orderId) {
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
        hold_time: new Date().toISOString(),
        print_count: 0
      };

      const { data: order, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();

      if (error) throw error;
      orderId = order.id;

      const orderItems = cart.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        unit_price_ht: item.unit_price_ht,
        tax_rate: item.tax_rate,
        subtotal: item.unit_price_ht * item.quantity,
        total: item.unit_price * item.quantity
      }));

      await supabase.from('order_items').insert(orderItems);

      // Première fois = imprimer bon de fabrication
      if (!productionSlipPrinted) {
        await printProductionSlip(cart, orderNumber, selectedSalesPoint.id);
        setProductionSlipPrinted(true);
      }
    } else {
      // Commande existe déjà

      // Gérer les annulations en attente
      const itemsToCancel = cart.filter(item => item.pendingCancellation);
      if (itemsToCancel.length > 0) {
        await printCancellationSlip(itemsToCancel, orderNumber, selectedSalesPoint.id);

        for (const item of itemsToCancel) {
          const { data: orderItem } = await supabase
            .from('order_items')
            .select('id')
            .eq('order_id', orderId)
            .eq('product_id', item.product_id)
            .maybeSingle();

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
                product_name: item.product_name,
                quantity: item.quantity,
                unit_price: item.unit_price,
                total_amount: item.unit_price * item.quantity,
                voided_by: user.id,
                void_reason: item.void_reason,
                sales_point_id: selectedSalesPoint.id
              }]);
          }
        }
      }

      // Mettre à jour la commande
      await supabase
        .from('orders')
        .update({
          subtotal: totals.subtotal,
          tax_amount: totals.taxAmount,
          total_amount: totals.total,
          is_on_hold: true,
          hold_time: new Date().toISOString()
        })
        .eq('id', orderId);
    }

    // Vider le panier et recharger
    setCart([]);
    setCurrentOrderId(null);
    setCurrentOrderStatus('draft');
    setProductionSlipPrinted(false);
    await loadHoldTickets();

    alert('✅ Commande envoyée et mise en attente');
  } catch (error) {
    console.error('Erreur:', error);
    alert('Erreur: ' + error.message);
  }
};

export const handleHoldButton = async (cart, currentOrderId, productionSlipPrinted, supabase, user, selectedSalesPoint, currentSession, setProductionSlipPrinted, setCurrentOrderId, setCurrentOrderStatus, setCart, loadHoldTickets) => {
  // Identique à handleSendButton
  return handleSendButton(cart, currentOrderId, productionSlipPrinted, supabase, user, selectedSalesPoint, currentSession, setProductionSlipPrinted, setCurrentOrderId, setCurrentOrderStatus, setCart, loadHoldTickets);
};

export const handlePaymentButton = async (cart, currentOrderId, productionSlipPrinted, supabase, user, selectedSalesPoint, currentSession, setProductionSlipPrinted, setCurrentOrderId, setShowPayment) => {
  if (cart.length === 0) {
    alert('Le panier est vide');
    return;
  }

  try {
    const totals = calculateCartTotals(cart);
    const orderNumber = `ORD-${Date.now()}`;

    let orderId = currentOrderId;

    if (!orderId) {
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

      const { data: order, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();

      if (error) throw error;
      orderId = order.id;

      const orderItems = cart.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        unit_price_ht: item.unit_price_ht,
        tax_rate: item.tax_rate,
        subtotal: item.unit_price_ht * item.quantity,
        total: item.unit_price * item.quantity
      }));

      await supabase.from('order_items').insert(orderItems);

      // Première fois = bon de fabrication
      if (!productionSlipPrinted) {
        await printProductionSlip(cart, orderNumber, selectedSalesPoint.id);
        setProductionSlipPrinted(true);
      }

      setCurrentOrderId(orderId);
    } else {
      // Gérer les annulations en attente avant paiement
      const itemsToCancel = cart.filter(item => item.pendingCancellation);
      if (itemsToCancel.length > 0) {
        await printCancellationSlip(itemsToCancel, orderNumber, selectedSalesPoint.id);

        for (const item of itemsToCancel) {
          const { data: orderItem } = await supabase
            .from('order_items')
            .select('id')
            .eq('order_id', orderId)
            .eq('product_id', item.product_id)
            .maybeSingle();

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
                product_name: item.product_name,
                quantity: item.quantity,
                unit_price: item.unit_price,
                total_amount: item.unit_price * item.quantity,
                voided_by: user.id,
                void_reason: item.void_reason,
                sales_point_id: selectedSalesPoint.id
              }]);
          }
        }
      }
    }

    // Ouvrir le modal de paiement
    setShowPayment(true);
  } catch (error) {
    console.error('Erreur:', error);
    alert('Erreur: ' + error.message);
  }
};

function calculateCartTotals(cart) {
  let subtotal = 0;
  let taxAmount = 0;

  cart.filter(item => !item.pendingCancellation).forEach(item => {
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
}
