import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { useLanguage } from '@/contexts/LanguageContext';

const Configuration = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    autoBackup: true,
    clientModule: true,
    serviceModule: true,
    supportModule: true
  });
  const [loading, setLoading] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setLoading(false);
    toast.success(t('Cambios guardados correctamente'));
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="p-6 max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-surface-900 mb-2 font-heading">
          {t('Configuración')}
        </h1>
        <p className="text-surface-600">
          {t('Configuración del Sistema')}
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Language Settings */}
        <motion.div variants={itemVariants}>
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg">
                <ApperIcon name="Globe" size={20} className="text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-surface-900">
                {t('Configuración de Idioma')}
              </h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-surface-50 rounded-lg">
                <div>
                  <p className="font-medium text-surface-900">
                    Idioma de la interfaz
                  </p>
                  <p className="text-sm text-surface-600">
                    Cambia el idioma de la aplicación
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-surface-600">
                    {language === 'es' ? t('Español') : t('Inglés')}
                  </span>
                  <button
                    onClick={toggleLanguage}
                    className="flex items-center gap-2 px-3 py-2 bg-white border border-surface-300 rounded-lg hover:bg-surface-50 transition-colors"
                  >
                    <span className="text-xl">
                      {language === 'es' ? '🇲🇽' : '🇺🇸'}
                    </span>
                    <ApperIcon name="RefreshCw" size={14} />
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Notification Settings */}
        <motion.div variants={itemVariants}>
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-secondary/10 rounded-lg">
                <ApperIcon name="Bell" size={20} className="text-secondary" />
              </div>
              <h3 className="text-lg font-semibold text-surface-900">
                {t('Notificaciones')}
              </h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-surface-50 rounded-lg">
                <div>
                  <p className="font-medium text-surface-900">
                    {t('Recibir notificaciones por email')}
                  </p>
                  <p className="text-sm text-surface-600">
                    Recibe alertas sobre nuevos tickets y actividad
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-surface-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-surface-50 rounded-lg">
                <div>
                  <p className="font-medium text-surface-900">
                    {t('Notificaciones push')}
                  </p>
                  <p className="text-sm text-surface-600">
                    Recibe notificaciones en tiempo real en el navegador
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.pushNotifications}
                    onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-surface-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Module Settings */}
        <motion.div variants={itemVariants}>
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-accent/10 rounded-lg">
                <ApperIcon name="Layers" size={20} className="text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-surface-900">
                {t('Configuración de Módulos')}
              </h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-surface-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <ApperIcon name="Users" size={16} className="text-surface-600" />
                  <div>
                    <p className="font-medium text-surface-900">
                      Módulo de Clientes
                    </p>
                    <p className="text-sm text-surface-600">
                      Gestión de clientes y contactos
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                    Activo
                  </span>
                  <span className="text-xs text-surface-500">v1.0</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-surface-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <ApperIcon name="Package" size={16} className="text-surface-600" />
                  <div>
                    <p className="font-medium text-surface-900">
                      Módulo de Servicios
                    </p>
                    <p className="text-sm text-surface-600">
                      Catálogo de servicios y precios
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                    Activo
                  </span>
                  <span className="text-xs text-surface-500">v1.0</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-surface-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <ApperIcon name="MessageCircle" size={16} className="text-surface-600" />
                  <div>
                    <p className="font-medium text-surface-900">
                      Módulo de Soporte
                    </p>
                    <p className="text-sm text-surface-600">
                      Sistema de tickets y comunicación
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                    Activo
                  </span>
                  <span className="text-xs text-surface-500">v1.0</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-surface-50 rounded-lg opacity-60">
                <div className="flex items-center gap-3">
                  <ApperIcon name="BarChart3" size={16} className="text-surface-600" />
                  <div>
                    <p className="font-medium text-surface-900">
                      Módulo de Reportes
                    </p>
                    <p className="text-sm text-surface-600">
                      Análisis y reportes de rendimiento
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full">
                    Próximamente
                  </span>
                  <span className="text-xs text-surface-500">v1.1</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Save Button */}
        <motion.div variants={itemVariants} className="flex justify-end">
          <Button 
            onClick={handleSaveSettings}
            loading={loading}
            icon="Save"
            size="large"
          >
            {t('Guardar Cambios')}
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Configuration;