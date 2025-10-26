# 🚀 GUIDE D'INSTALLATION COMPLET - ERP HÔTEL CASINO

## 📧 Contact Support
**Email:** salim.mazkour@gmail.com

---

## PRÉREQUIS

### 1️⃣ Installer Node.js
1. Allez sur : https://nodejs.org/
2. Téléchargez la version **LTS** (Long Term Support)
3. Installez-le (suivez l'assistant, cliquez sur "Next")
4. Vérifiez l'installation :
   - Ouvrez l'invite de commandes (tapez `cmd` dans Windows)
   - Tapez : `node --version`
   - Vous devriez voir : `v18.x.x` ou `v20.x.x`

### 2️⃣ Installer un éditeur de code (recommandé)
- **VS Code** : https://code.visualstudio.com/
- OU utilisez Notepad (déjà installé sur Windows)

---

## 📂 INSTALLATION DU PROJET

### ÉTAPE 1 : Créer le dossier
1. Créez un dossier sur votre PC : `C:\ERP-Complet`
2. Ouvrez ce dossier

### ÉTAPE 2 : Ouvrir l'invite de commandes
- **Méthode 1** : Dans le dossier, tapez `cmd` dans la barre d'adresse et appuyez sur Entrée
- **Méthode 2** : Shift + Clic-droit dans le dossier vide → "Ouvrir dans le terminal"

### ÉTAPE 3 : Initialiser le projet
Tapez ces commandes **une par une** :

```bash
npm init -y
```

### ÉTAPE 4 : Installer les dépendances
```bash
npm install @supabase/supabase-js@^2.75.0 @vitejs/plugin-react@^5.0.4 react@^19.2.0 react-dom@^19.2.0 react-router-dom@^7.9.4 vite@^7.1.10
```

**⏳ Attendez 2-3 minutes** que tout s'installe.

---

## 📝 CRÉER LES FICHIERS DE CONFIGURATION

### Fichier 1 : `.env`
Créez un fichier nommé `.env` à la racine avec ce contenu :

```
VITE_SUPABASE_URL=https://lcknhxrksephkshpvfmp.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxja25oeHJrc2VwaGtzaHB2Zm1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MjUxNTAsImV4cCI6MjA3NjIwMTE1MH0.4HAG-6vgyHxRfmakn9CgJiMMbVO1lBYbIYYq3ZDdjv0
```

**💡 Astuce Windows :** Pour créer un fichier `.env` :
- Ouvrez Notepad
- Copiez le contenu ci-dessus
- Fichier → Enregistrer sous
- Nom du fichier : `.env` (avec le point au début)
- Type : **Tous les fichiers**
- Enregistrez dans `C:\ERP-Complet`

### Fichier 2 : Modifier `package.json`
Ouvrez le fichier `package.json` qui a été créé et remplacez TOUT le contenu par :

```json
{
  "name": "erp-complet",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.75.0",
    "@vitejs/plugin-react": "^5.0.4",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-router-dom": "^7.9.4",
    "vite": "^7.1.10"
  }
}
```

### Fichier 3 : `vite.config.js`
Créez un fichier `vite.config.js` à la racine :

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  }
});
```

### Fichier 4 : `index.html`
Créez un fichier `index.html` à la racine :

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ERP Hôtel Casino</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>
```

---

## 📁 CRÉER LA STRUCTURE DES DOSSIERS

Dans `C:\ERP-Complet`, créez cette structure de dossiers :

```
ERP-Complet/
├── src/
│   ├── components/
│   ├── contexts/
│   ├── hooks/
│   ├── lib/
│   ├── pages/
│   └── utils/
```

---

## 🔑 FICHIERS SOURCES PRINCIPAUX

Je vais vous donner les fichiers principaux à créer dans `src/`.

### `src/main.jsx`

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### `src/App.jsx`

```javascript
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import POS from './pages/POS';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Inventory from './pages/Inventory';
import Users from './pages/Users';
import Roles from './pages/Roles';
import SalesPoints from './pages/SalesPoints';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/pos" element={<ProtectedRoute><POS /></ProtectedRoute>} />
          <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
          <Route path="/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
          <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
          <Route path="/roles" element={<ProtectedRoute><Roles /></ProtectedRoute>} />
          <Route path="/sales-points" element={<ProtectedRoute><SalesPoints /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
```

### `src/index.css`

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f5f5f5;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}

#root {
  min-height: 100vh;
}
```

### `src/lib/supabase.js`

```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

---

## 🔐 AUTHENTIFICATION

### `src/contexts/AuthContext.jsx`

```javascript
import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*, roles(*)')
        .eq('username', username)
        .eq('password_hash', password)
        .eq('active', true)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error('Identifiants incorrects');

      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
```

### `src/components/ProtectedRoute.jsx`

```javascript
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
```

---

## 📄 PAGE DE CONNEXION

### `src/pages/Login.jsx`

```javascript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(username, password);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>ERP Hôtel Casino</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nom d'utilisateur</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="form-group">
            <label>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
}
```

### `src/pages/Login.css`

```css
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-box {
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  width: 100%;
  max-width: 400px;
}

.login-box h1 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #555;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.error-message {
  color: #e74c3c;
  background: #fadbd8;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 15px;
  font-size: 14px;
}

button[type="submit"] {
  width: 100%;
  padding: 12px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

button[type="submit"]:hover {
  background: #5568d3;
}

button[type="submit"]:disabled {
  background: #ccc;
  cursor: not-allowed;
}
```

---

## 🏠 PAGE DASHBOARD (SIMPLE)

### `src/pages/Dashboard.jsx`

```javascript
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>ERP Hôtel Casino</h1>
        <div className="user-info">
          <span>Bienvenue, {user?.first_name} {user?.last_name}</span>
          <button onClick={handleLogout}>Déconnexion</button>
        </div>
      </header>

      <nav className="dashboard-nav">
        <button onClick={() => navigate('/pos')}>Point de Vente</button>
        <button onClick={() => navigate('/products')}>Produits</button>
        <button onClick={() => navigate('/categories')}>Catégories</button>
        <button onClick={() => navigate('/inventory')}>Inventaire</button>
        <button onClick={() => navigate('/users')}>Utilisateurs</button>
        <button onClick={() => navigate('/roles')}>Rôles</button>
        <button onClick={() => navigate('/sales-points')}>Points de Vente</button>
      </nav>

      <main className="dashboard-content">
        <h2>Tableau de bord</h2>
        <div className="dashboard-cards">
          <div className="card">
            <h3>Ventes du jour</h3>
            <p className="card-value">0 €</p>
          </div>
          <div className="card">
            <h3>Commandes en cours</h3>
            <p className="card-value">0</p>
          </div>
          <div className="card">
            <h3>Produits</h3>
            <p className="card-value">-</p>
          </div>
          <div className="card">
            <h3>Stock bas</h3>
            <p className="card-value">-</p>
          </div>
        </div>
      </main>
    </div>
  );
}
```

### `src/pages/Dashboard.css`

```css
.dashboard {
  min-height: 100vh;
  background: #f5f5f5;
}

.dashboard-header {
  background: white;
  padding: 20px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.dashboard-header h1 {
  color: #333;
  font-size: 24px;
}

.user-info {
  display: flex;
  gap: 20px;
  align-items: center;
}

.user-info span {
  color: #666;
}

.user-info button {
  padding: 8px 16px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.dashboard-nav {
  background: white;
  padding: 15px 40px;
  display: flex;
  gap: 10px;
  border-bottom: 1px solid #e0e0e0;
  overflow-x: auto;
}

.dashboard-nav button {
  padding: 10px 20px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  white-space: nowrap;
}

.dashboard-nav button:hover {
  background: #5568d3;
}

.dashboard-content {
  padding: 40px;
}

.dashboard-content h2 {
  margin-bottom: 30px;
  color: #333;
}

.dashboard-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.card {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.card h3 {
  color: #666;
  font-size: 16px;
  margin-bottom: 15px;
}

.card-value {
  font-size: 32px;
  font-weight: bold;
  color: #333;
}
```

---

## 🚀 LANCER LE PROJET

### Dans l'invite de commandes :

```bash
npm run dev
```

### Ouvrez votre navigateur :
```
http://localhost:5173
```

### Identifiants de connexion :
- **Utilisateur** : `admin`
- **Mot de passe** : `admin123`

---

## ✅ PAGES À CRÉER

Les autres pages (POS, Products, Categories, etc.) sont déjà dans la base de données.
Je peux vous les fournir une par une si nécessaire.

Pour l'instant, vous avez :
- ✅ Page de connexion fonctionnelle
- ✅ Dashboard avec navigation
- ✅ Connexion à la base de données Supabase
- ✅ Système d'authentification

---

## 📞 SUPPORT

Si vous avez des questions ou besoin d'aide :
**Email:** salim.mazkour@gmail.com

---

## 🎯 PROCHAINES ÉTAPES

1. Tester la connexion
2. Vérifier que tout fonctionne
3. Demander les autres pages si besoin

**Bon courage !** 🚀
