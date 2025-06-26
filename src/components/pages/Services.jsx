import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ServiceTable from '@/components/organisms/ServiceTable';
import LoadingState from '@/components/molecules/LoadingState';
import ErrorState from '@/components/molecules/ErrorState';
import EmptyState from '@/components/molecules/EmptyState';
import Button from '@/components/atoms/Button';
import SearchBar from '@/components/molecules/SearchBar';
import Badge from '@/components/atoms/Badge';
import { useLanguage } from '@/contexts/LanguageContext';
import serviceService from '@/services/api/serviceService';

const Services = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { t } = useLanguage();

  useEffect(() => {
    loadServices();
  }, []);

  useEffect(() => {
    filterServices();
  }, [services, searchQuery, selectedCategory]);

  const loadServices = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await serviceService.getAll();
      setServices(result);
    } catch (err) {
      setError(err.message || t('Error al cargar datos'));
      toast.error(t('Error al cargar datos'));
    } finally {
      setLoading(false);
    }
  };

  const filterServices = () => {
    let filtered = [...services];

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(service => service.category === selectedCategory);
    }

    setFilteredServices(filtered);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleEdit = (service) => {
    // Modal de edición - placeholder
    toast.info('Función de edición en desarrollo');
  };

  const handleDelete = async (serviceId) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este servicio?')) {
      return;
    }

    try {
      await serviceService.delete(serviceId);
      setServices(prev => prev.filter(s => s.Id !== serviceId));
      toast.success('Servicio eliminado correctamente');
    } catch (err) {
      toast.error('Error al eliminar el servicio');
    }
  };

  const handleCreateService = () => {
    // Modal de creación - placeholder
    toast.info('Función de creación en desarrollo');
  };

  // Get unique categories
  const categories = [...new Set(services.map(s => s.category))];

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
        <LoadingState count={5} type="table" />
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
          onRetry={loadServices}
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
            {t('Servicios')}
          </h1>
          <p className="text-surface-600">
            Administra tu catálogo de servicios y precios
          </p>
        </div>
        <Button icon="Plus" onClick={handleCreateService}>
          {t('Crear Servicio')}
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <SearchBar 
              onSearch={handleSearch}
              placeholder="Buscar servicios por nombre, categoría o descripción..."
            />
          </div>
          
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={selectedCategory === 'all' ? 'primary' : 'default'}
                className="cursor-pointer"
                onClick={() => setSelectedCategory('all')}
              >
                Todos
              </Badge>
              {categories.map(category => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? 'primary' : 'default'}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      {services.length === 0 ? (
        <EmptyState
          icon="Package"
          title={t('No hay servicios disponibles')}
          description={t('Crea tu primer servicio para comenzar')}
          actionLabel={t('Crear Servicio')}
          onAction={handleCreateService}
        />
      ) : filteredServices.length === 0 ? (
        <EmptyState
          icon="Search"
          title="No se encontraron resultados"
          description="Intenta con otros términos de búsqueda o filtros"
        />
      ) : (
        <ServiceTable
          services={filteredServices}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Results count */}
      {services.length > 0 && (
        <div className="mt-6 text-center text-sm text-surface-500">
          Mostrando {filteredServices.length} de {services.length} servicios
        </div>
      )}
    </motion.div>
  );
};

export default Services;