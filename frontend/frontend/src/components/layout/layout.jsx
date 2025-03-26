import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../../service/api';

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname === '/' ? '/dashboard' : location.pathname;

  // Menu items configuration
  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/citerne', label: 'Citerne', icon: '🛢️' },
    { path: '/employees', label: 'Employees', icon: '👥' },
    { path: '/pompes', label: 'Pompes', icon: '⛽' },
    { path: '/ventes', label: 'Ventes', icon: '💰' },
    { path: '/plan', label: 'Plan', icon: '🗺️' },
    { path: '/produits', label: 'Produits', icon: '🛒' },
    { path: '/Fournisseurs', label: 'Fournisseur', icon: '👤' },
    { path: '/Station', label: 'Station', icon: '⚙️' }
  ];

  // Get the current page title
  const getCurrentTitle = () => {
    const currentItem = menuItems.find(item => currentPath.includes(item.path));
    return currentItem ? currentItem.label : 'Dashboard';
  };

  // Dropdown state for admin menu
  const [showAdminMenu, setShowAdminMenu] = useState(false);

  const toggleAdminMenu = () => {
    setShowAdminMenu((prev) => !prev);
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-red-900 text-white flex flex-col flex-shrink-0">
        <div className="text-2xl font-bold p-4 border-b border-white/10 mb-4">
          StationSH
        </div>
        <div className="flex flex-col">
          {menuItems.map((item) => (
            <Link 
              key={item.path}
              to={item.path} 
              className={`flex items-center px-4 py-3 text-white hover:bg-white/10 transition ${
                currentPath.includes(item.path) ? 'bg-white/10' : ''
              }`}
            >
              <span className="mr-3 w-5">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-grow flex flex-col">
        {/* Top navbar */}
        <div className="bg-gray-50 h-16 flex justify-between items-center px-5 border-b border-gray-200 relative">
          <div className="text-xl font-bold">
            {getCurrentTitle()}
          </div>
          <div className="relative" onClick={toggleAdminMenu}>
            <div className="flex items-center cursor-pointer">
              <div className="mr-3 text-sm">admin</div>
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center border border-gray-300">
                👤
              </div>
            </div>
            {showAdminMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10">
                <Link
                  to="/admin"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setShowAdminMenu(false)}
                >
                  Profil
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Déconnexion
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content container */}
        <div className="p-5 bg-gray-100 flex-grow">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
