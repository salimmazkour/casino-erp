import { supabase } from '../lib/supabase';

export async function logAction(employeeId, actionType, module, details = {}, ipAddress = null) {
  try {
    const { error } = await supabase
      .from('user_action_logs')
      .insert([{
        employee_id: employeeId,
        action_type: actionType,
        module: module,
        details: details,
        ip_address: ipAddress
      }]);

    if (error) {
      console.error('Erreur lors de l\'enregistrement du log:', error);
    }
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement du log:', error);
  }
}

export const ActionTypes = {
  LOGIN: 'login',
  LOGOUT: 'logout',
  CREATE_ORDER: 'create_order',
  MODIFY_ORDER: 'modify_order',
  VOID_ORDER: 'void_order',
  APPLY_DISCOUNT: 'apply_discount',
  APPLY_PERSONAL_OFFER: 'apply_personal_offer',
  CLOSE_CASH_REGISTER: 'close_cash_register',
  CREATE_PRODUCT: 'create_product',
  UPDATE_PRODUCT: 'update_product',
  DELETE_PRODUCT: 'delete_product',
  CREATE_USER: 'create_user',
  UPDATE_USER: 'update_user',
  DELETE_USER: 'delete_user',
  VALIDATE_INVENTORY: 'validate_inventory',
  STOCK_MOVEMENT: 'stock_movement',
  UPDATE_PRICE: 'update_price',
  MANAGE_CREDIT: 'manage_credit'
};
