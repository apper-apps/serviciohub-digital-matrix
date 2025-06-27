import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';
import { useLanguage } from '@/contexts/LanguageContext';
import userService from '@/services/api/userService';

const Profile = ({ isOpen, onClose }) => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    position: ''
  });
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    if (isOpen) {
      loadProfile();
    }
  }, [isOpen]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const userData = await userService.getCurrentUser();
      setProfile(userData);
    } catch (error) {
      toast.error(t('Error al cargar perfil'));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setSaveLoading(true);
    try {
      await userService.updateProfile(profile);
      toast.success(t('Perfil actualizado correctamente'));
      onClose();
    } catch (error) {
      toast.error(t('Error al actualizar perfil'));
    } finally {
      setSaveLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md"
      >
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <ApperIcon name="User" size={20} className="text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-surface-900">
                {t('Mi Perfil')}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-surface-100 rounded-lg transition-colors"
            >
              <ApperIcon name="X" size={20} />
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <ApperIcon name="Loader2" size={24} className="animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-4">
              <Input
                label={t('Nombre completo')}
                value={profile.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder={t('Ingresa tu nombre completo')}
              />
              
              <Input
                label={t('Correo electrónico')}
                type="email"
                value={profile.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder={t('correo@ejemplo.com')}
              />
              
              <Input
                label={t('Teléfono')}
                value={profile.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder={t('Número de teléfono')}
              />
              
              <Input
                label={t('Empresa')}
                value={profile.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                placeholder={t('Nombre de la empresa')}
              />
              
              <Input
                label={t('Cargo')}
                value={profile.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
                placeholder={t('Tu cargo o posición')}
              />

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                >
                  {t('Cancelar')}
                </Button>
                <Button
                  onClick={handleSave}
                  loading={saveLoading}
                  icon="Save"
                  className="flex-1"
                >
                  {t('Guardar')}
                </Button>
              </div>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default Profile;