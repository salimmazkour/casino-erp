import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { usePermissions } from '../hooks/usePermissions';
import { supabase } from '../lib/supabase';
import Products from './Products';
import StorageLocations from './StorageLocations';
import Categories from './Categories';
import ProductTypes from './ProductTypes';
import SalesPoints from './SalesPoints';
import Inventory from './Inventory';
import POS from './POS';
import Clients from './Clients';
import TableManagement from './TableManagement';
import Users from './Users';
import ActionLogs from './ActionLogs';
import Roles from './Roles';
import VoidLogs from './VoidLogs';
import Suppliers from './Suppliers';
import PurchaseOrders from './PurchaseOrders';
import PurchaseReceptions from './PurchaseReceptions';
import PurchaseHistory from './PurchaseHistory';
import PrinterDefinitions from './PrinterDefinitions';
import PrintTemplates from './PrintTemplates';
import './Dashboard.css';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { hasAnyPermission, hasPermission, hasActionablePermissions, loading: permissionsLoading } = usePermissions();
  const [activeModule, setActiveModule] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    todaySales: 0,
    salesPointsCount: 0,
    reservations: 0
  });

  useEffect(() => {
    if (activeModule === 'dashboard') {
      loadDashboardStats();
    }
  }, [activeModule]);

  const loadDashboardStats = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];

      const { data: orders } = await supabase
        .from('orders')
        .select('total_amount')
        .eq('payment_status', 'paid')
        .gte('created_at', `${today}T00:00:00`)
        .lte('created_at', `${today}T23:59:59`);

      const todaySales = orders?.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0) || 0;

      const { count: salesPointsCount } = await supabase
        .from('sales_points')
        .select('*', { count: 'exact', head: true });

      setStats({
        todaySales,
        salesPointsCount: salesPointsCount || 0,
        reservations: 0
      });
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
    }
  };

  const allModules = [
    { id: 'dashboard', name: 'Tableau de bord', icon: '📊', requiredPermission: null },
    { id: 'cashregister', name: 'Caisse', icon: '💰', requiredPermission: { module: 'pos', action: 'view' } },
    { id: 'pos', name: 'Points de vente', icon: '💳', requiredPermission: { module: 'settings', action: 'manage_sales_points' } },
    { id: 'tables', name: 'Tables', icon: '🪑', requiredPermission: { module: 'tables', action: 'view' }, requiresActions: true },
    { id: 'products', name: 'Produits', icon: '📦', requiredPermission: { module: 'products', action: 'view' }, requiresActions: true },
    { id: 'categories', name: 'Catégories', icon: '🏷️', requiredPermission: { module: 'products', action: 'view' }, requiresActions: true },
    { id: 'product-types', name: 'Types de produits', icon: '🔖', requiredPermission: { module: 'products', action: 'view' }, requiresActions: true },
    { id: 'storage', name: 'Dépôts', icon: '🏪', requiredPermission: { module: 'settings', action: 'view' }, requiresActions: true },
    { id: 'inventory', name: 'Stock', icon: '📋', requiredPermission: { module: 'inventory', action: 'view' } },
    { id: 'suppliers', name: 'Fournisseurs', icon: '🚚', requiredPermission: { module: 'inventory', action: 'view' } },
    { id: 'purchase-orders', name: 'Commandes Fournisseurs', icon: '📋', requiredPermission: { module: 'inventory', action: 'view' } },
    { id: 'purchase-receptions', name: 'Réceptions', icon: '📥', requiredPermission: { module: 'inventory', action: 'view' } },
    { id: 'purchase-history', name: 'Historique Achats', icon: '📊', requiredPermission: { module: 'inventory', action: 'view' } },
    { id: 'clients', name: 'Clients', icon: '👤', requiredPermission: { module: 'clients', action: 'view' } },
    { id: 'printer-definitions', name: 'Imprimantes Logiques', icon: '🖨️', requiredPermission: { module: 'settings', action: 'view' } },
    { id: 'print-templates', name: 'Fonctions Impression', icon: '📄', requiredPermission: { module: 'settings', action: 'view' } },
    { id: 'void-logs', name: 'Annulations', icon: '🚫', requiredPermission: { module: 'pos', action: 'view' } },
    { id: 'employees', name: 'Personnel', icon: '👥', requiredPermission: { module: 'users', action: 'view' }, requiresActions: true },
    { id: 'roles', name: 'Rôles', icon: '🔐', requiredPermission: { module: 'users', action: 'manage_permissions' } },
    { id: 'action-logs', name: 'Historique', icon: '📜', requiredPermission: { module: 'users', action: 'view' } },
    { id: 'reports', name: 'Rapports', icon: '📈', requiredPermission: { module: 'reports' } },
  ];

  const modules = useMemo(() => {
    if (permissionsLoading) return [allModules[0]];

    return allModules.filter(module => {
      if (!module.requiredPermission) return true;

      const hasRequiredPermission = module.requiredPermission.action
        ? hasPermission(module.requiredPermission.module, module.requiredPermission.action)
        : hasActionablePermissions(module.requiredPermission.module);

      if (!hasRequiredPermission) return false;

      if (module.requiresActions) {
        return hasActionablePermissions(module.requiredPermission.module);
      }

      return true;
    });
  }, [permissionsLoading, hasPermission, hasActionablePermissions]);

  return (
    <div className="dashboard-container">
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h1>ERP Casino</h1>
        </div>
        <nav className="sidebar-nav">
          {modules.map((module) => (
            <button
              key={module.id}
              className={`nav-item ${activeModule === module.id ? 'active' : ''}`}
              onClick={() => {
                if (module.id === 'cashregister') {
                  navigate('/pos');
                } else {
                  setActiveModule(module.id);
                  setSidebarOpen(false);
                }
              }}
            >
              <span className="nav-icon">{module.icon}</span>
              <span className="nav-text">{module.name}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-name">{user?.full_name}</div>
            <div className="user-role">{user?.role}</div>
          </div>
          <button className="logout-btn" onClick={handleSignOut}>
            Déconnexion
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="content-header">
          <button
            className="mobile-menu-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
          <h2>{modules.find(m => m.id === activeModule)?.name}</h2>
        </header>
        <div className="content-body">
          {activeModule === 'dashboard' && (
            <div className="welcome-card">
              <h3>Bienvenue dans votre ERP</h3>
              <p>Système de gestion pour complexe hôtel-casino-restauration</p>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-value">43</div>
                  <div className="stat-label">Chambres</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{stats.salesPointsCount}</div>
                  <div className="stat-label">Points de vente</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{stats.todaySales.toFixed(0)} FCFA</div>
                  <div className="stat-label">CA du jour</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{stats.reservations}</div>
                  <div className="stat-label">Réservations</div>
                </div>
              </div>
            </div>
          )}

          {activeModule === 'products' && <Products />}
          {activeModule === 'categories' && <Categories />}
          {activeModule === 'product-types' && <ProductTypes />}
          {activeModule === 'storage' && <StorageLocations />}
          {activeModule === 'pos' && <SalesPoints />}
          {activeModule === 'inventory' && <Inventory />}
          {activeModule === 'suppliers' && <Suppliers />}
          {activeModule === 'purchase-orders' && <PurchaseOrders />}
          {activeModule === 'purchase-receptions' && <PurchaseReceptions />}
          {activeModule === 'purchase-history' && <PurchaseHistory />}
          {activeModule === 'cashregister' && <POS />}
          {activeModule === 'printer-definitions' && <PrinterDefinitions />}
          {activeModule === 'print-templates' && <PrintTemplates />}
          {activeModule === 'clients' && <Clients />}
          {activeModule === 'void-logs' && <VoidLogs />}
          {activeModule === 'tables' && <TableManagement standalone={true} />}
          {activeModule === 'employees' && <Users />}
          {activeModule === 'roles' && <Roles />}
          {activeModule === 'action-logs' && <ActionLogs />}

          {!['dashboard', 'products', 'categories', 'product-types', 'storage', 'pos', 'inventory', 'suppliers', 'purchase-orders', 'purchase-receptions', 'purchase-history', 'cashregister', 'clients', 'void-logs', 'tables', 'employees', 'roles', 'action-logs', 'printer-definitions', 'print-templates'].includes(activeModule) && (
            <div className="welcome-card">
              <h3>Module en cours de développement</h3>
              <p>Ce module sera disponible prochainement.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
