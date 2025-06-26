import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ClientGrid from '@/components/organisms/ClientGrid';
import LoadingState from '@/components/molecules/LoadingState';
import ErrorState from '@/components/molecules/ErrorState';
import EmptyState from '@/components/molecules/EmptyState';
import Button from '@/components/atoms/Button';
import SearchBar from '@/components/molecules/SearchBar';
import { useLanguage } from '@/contexts/LanguageContext';
import clientService from '@/services/api/clientService';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { t } = useLanguage();

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    filterClients();
  }, [clients, searchQuery]);

  const loadClients = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await clientService.getAll();
      setClients(result);
    } catch (err) {
      setError(err.message || t('Error al cargar datos'));
      toast.error(t('Error al cargar datos'));
    } finally {
      setLoading(false);
    }
  };

  const filterClients = () => {
    if (!searchQuery.trim()) {
      setFilteredClients(clients);
      return;
    }

    const filtered = clients.filter(client =>
      client.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.rfc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (client.contacts && client.contacts.some(contact =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchQuery.toLowerCase())
      ))
    );
    setFilteredClients(filtered);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleEdit = (client) => {
    // Modal de edición - placeholder
    toast.info('Función de edición en desarrollo');
  };

  const handleDelete = async (clientId) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      return;
    }

    try {
      await clientService.delete(clientId);
      setClients(prev => prev.filter(c => c.Id !== clientId));
      toast.success('Cliente eliminado correctamente');
    } catch (err) {
      toast.error('Error al eliminar el cliente');
    }
  };

  const handleCreateClient = () => {
    // Modal de creación - placeholder
    toast.info('Función de creación en desarrollo');
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  if (loading) {
    return (
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="p-6"
      >
        <div className="mb-8">
          <div className="h-8 w-48 bg-surface-200 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-96 bg-surface-200 rounded animate-pulse"></div>
        </div>
        <LoadingState count={6} />
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="p-6"
      >
        <ErrorState 
          message={error}
          onRetry={loadClients}
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="p-6 max-w-full overflow-hidden"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-surface-900 mb-2 font-heading">
            {t('Clientes')}
          </h1>
          <p className="text-surface-600">
            Gestiona tu cartera de clientes y sus servicios contratados
          </p>
        </div>
        <Button icon="Plus" onClick={handleCreateClient}>
          {t('Crear Cliente')}
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar 
              onSearch={handleSearch}
              placeholder="Buscar por empresa, RFC o contacto..."
            />
          </div>
        </div>
      </div>

      {/* Content */}
      {clients.length === 0 ? (
        <EmptyState
          icon="Users"
          title={t('No se encontraron clientes')}
          description={t('Agrega tu primer cliente para comenzar')}
          actionLabel={t('Crear Cliente')}
          onAction={handleCreateClient}
        />
      ) : filteredClients.length === 0 ? (
        <EmptyState
          icon="Search"
          title="No se encontraron resultados"
          description="Intenta con otros términos de búsqueda"
        />
      ) : (
        <ClientGrid
          clients={filteredClients}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Results count */}
      {clients.length > 0 && (
        <div className="mt-6 text-center text-sm text-surface-500">
          Mostrando {filteredClients.length} de {clients.length} clientes
        </div>
      )}
    </motion.div>
  );
};

export default Clients;