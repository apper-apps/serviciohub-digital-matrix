import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Input from '@/components/atoms/Input';
import LoadingState from '@/components/molecules/LoadingState';
import ErrorState from '@/components/molecules/ErrorState';
import EmptyState from '@/components/molecules/EmptyState';
import SearchBar from '@/components/molecules/SearchBar';
import ApperIcon from '@/components/ApperIcon';
import { useLanguage } from '@/contexts/LanguageContext';
import teamService from '@/services/api/teamService';

const Team = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Colaborator',
    status: 'Activo'
  });
  const [formLoading, setFormLoading] = useState(false);
  const { t } = useLanguage();

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setError(null);
      const result = await teamService.getAll();
      setUsers(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'Colaborator',
      status: 'Activo'
    });
  };

  const handleCreateUser = () => {
    resetForm();
    setSelectedUser(null);
    setShowCreateModal(true);
  };

  const handleEditUser = (user) => {
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      status: user.status
    });
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      if (selectedUser) {
        await teamService.update(selectedUser.Id, formData);
        toast.success(t('Usuario actualizado correctamente'));
        setShowEditModal(false);
      } else {
        await teamService.create(formData);
        toast.success(t('Usuario creado correctamente'));
        setShowCreateModal(false);
      }
      
      await loadUsers();
      resetForm();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteUser = async (user) => {
    if (!window.confirm(t('¿Estás seguro de que deseas eliminar este usuario?'))) {
      return;
    }

    try {
      await teamService.delete(user.Id);
      toast.success(t('Usuario eliminado correctamente'));
      await loadUsers();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'Superadmin': return 'bg-red-100 text-red-700';
      case 'Admin': return 'bg-blue-100 text-blue-700';
      case 'Colaborator': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusBadgeColor = (status) => {
    return status === 'Activo' 
      ? 'bg-green-100 text-green-700' 
      : 'bg-gray-100 text-gray-700';
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={loadUsers} />;

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">{t('Gestión de Equipo')}</h1>
          <p className="text-surface-600 mt-1">
            {t('Administra los usuarios y sus permisos en el sistema')}
          </p>
        </div>
        <Button
          onClick={handleCreateUser}
          className="flex items-center gap-2"
        >
          <ApperIcon name="UserPlus" size={16} />
          {t('Agregar Usuario')}
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              onSearch={handleSearch}
              placeholder={t('Buscar por nombre o email...')}
            />
          </div>
          <div className="flex gap-4">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">{t('Todos los roles')}</option>
              <option value="Superadmin">Superadmin</option>
              <option value="Admin">Admin</option>
              <option value="Colaborator">Colaborator</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">{t('Todos los estados')}</option>
              <option value="Activo">{t('Activo')}</option>
              <option value="Inactivo">{t('Inactivo')}</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Users List */}
      {filteredUsers.length === 0 ? (
        <EmptyState
          title={t('No hay usuarios en el equipo')}
          description={t('Agrega el primer usuario para comenzar')}
          icon="Users"
        />
      ) : (
        <div className="grid gap-4">
          {filteredUsers.map((user) => (
            <Card key={user.Id} className="p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <ApperIcon name="User" size={20} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-surface-900">{user.name}</h3>
                    <p className="text-surface-600 text-sm">{user.email}</p>
                    {user.phone && (
                      <p className="text-surface-500 text-sm">{user.phone}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={getRoleBadgeColor(user.role)}>
                        {user.role}
                      </Badge>
                      <Badge className={getStatusBadgeColor(user.status)}>
                        {t(user.status)}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleEditUser(user)}
                  >
                    <ApperIcon name="Edit" size={16} />
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteUser(user)}
                  >
                    <ApperIcon name="Trash2" size={16} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-surface-900">
                  {t('Agregar Usuario')}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCreateModal(false)}
                >
                  <ApperIcon name="X" size={20} />
                </Button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label={t('Nombre completo')}
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label={t('Correo electrónico')}
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label={t('Teléfono')}
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    {t('Rol')}
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  >
                    <option value="Colaborator">Colaborator</option>
                    <option value="Admin">Admin</option>
                    <option value="Superadmin">Superadmin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    {t('Estado')}
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  >
                    <option value="Activo">{t('Activo')}</option>
                    <option value="Inactivo">{t('Inactivo')}</option>
                  </select>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowCreateModal(false)}
                    disabled={formLoading}
                    className="flex-1"
                  >
                    {t('Cancelar')}
                  </Button>
                  <Button
                    type="submit"
                    disabled={formLoading}
                    className="flex-1"
                  >
                    {formLoading ? t('Creando...') : t('Crear Usuario')}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-surface-900">
                  {t('Editar Usuario')}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowEditModal(false)}
                >
                  <ApperIcon name="X" size={20} />
                </Button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label={t('Nombre completo')}
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label={t('Correo electrónico')}
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label={t('Teléfono')}
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    {t('Rol')}
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  >
                    <option value="Colaborator">Colaborator</option>
                    <option value="Admin">Admin</option>
                    <option value="Superadmin">Superadmin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    {t('Estado')}
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  >
                    <option value="Activo">{t('Activo')}</option>
                    <option value="Inactivo">{t('Inactivo')}</option>
                  </select>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowEditModal(false)}
                    disabled={formLoading}
                    className="flex-1"
                  >
                    {t('Cancelar')}
                  </Button>
                  <Button
                    type="submit"
                    disabled={formLoading}
                    className="flex-1"
                  >
                    {formLoading ? t('Guardando...') : t('Guardar Cambios')}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Team;