import "@/index.css";
import React, { useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { routeArray } from "@/config/routes";
import ApperIcon from "@/components/ApperIcon";
import Profile from "@/components/pages/Profile";
import SearchBar from "@/components/molecules/SearchBar";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useCurrency } from "@/contexts/CurrencyContext";
const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { language, toggleLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { currency, symbol } = useCurrency();
  const visibleRoutes = routeArray.filter(route => !route.hidden);

  const handleSearch = (query) => {
    // Basic search implementation - could be enhanced
    navigate('/clientes');
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white">
      {/* Top Bar */}
      <header className="flex-shrink-0 h-16 bg-white border-b border-surface-200 px-4 flex items-center justify-between z-40">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-surface-100 transition-colors"
          >
            <ApperIcon name="Menu" size={20} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <ApperIcon name="Zap" size={16} className="text-white" />
            </div>
<h1 className="font-heading font-bold text-xl text-surface-900">ServicioHub</h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <SearchBar onSearch={handleSearch} />
          </div>
          <div className="flex items-center gap-2">
            {/* Currency Display */}
            <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-surface-100 rounded-lg">
              <span className="text-sm font-medium text-surface-600">{currency}</span>
              <span className="text-sm text-surface-500">{symbol}</span>
            </div>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-surface-100 transition-colors"
              title={t('Cambiar idioma')}
            >
              <span className="text-xl">{language === 'es' ? '🇲🇽' : '🇺🇸'}</span>
              <span className="hidden sm:inline font-medium text-sm">{language.toUpperCase()}</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-surface-100 transition-colors"
              title={t('Cambiar tema')}
            >
              <ApperIcon 
                name={theme === 'light' ? 'Moon' : 'Sun'} 
                size={18} 
                className="text-surface-600"
              />
            </button>

            {/* Profile Button */}
            <button
              onClick={() => setIsProfileOpen(true)}
              className="p-2 rounded-lg hover:bg-surface-100 transition-colors"
              title={t('Mi perfil')}
            >
              <ApperIcon name="User" size={18} className="text-surface-600" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-64 bg-white border-r border-surface-200 flex-col z-40">
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {visibleRoutes.map((route) => (
              <NavLink
                key={route.id}
                to={route.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                    isActive
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-surface-600 hover:bg-surface-50 hover:text-surface-900'
                  }`
                }
              >
                <ApperIcon name={route.icon} size={20} />
                <span>{t(route.label)}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <>
            <div 
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-surface-200 z-50 flex flex-col"
            >
              <div className="h-16 px-4 flex items-center border-b border-surface-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <ApperIcon name="Zap" size={16} className="text-white" />
                  </div>
                  <h1 className="font-heading font-bold text-xl text-surface-900">ServicioHub</h1>
                </div>
              </div>
              
              <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                {visibleRoutes.map((route) => (
                  <NavLink
                    key={route.id}
                    to={route.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                        isActive
                          ? 'bg-primary text-white shadow-sm'
                          : 'text-surface-600 hover:bg-surface-50 hover:text-surface-900'
                      }`
                    }
                  >
                    <ApperIcon name={route.icon} size={20} />
<span>{t(route.label)}</span>
                  </NavLink>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      {/* Profile Modal */}
      <Profile 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
/>
    </div>
  );
};