import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import LoadingState from '@/components/molecules/LoadingState';
import ErrorState from '@/components/molecules/ErrorState';
import ApperIcon from '@/components/ApperIcon';
import { useLanguage } from '@/contexts/LanguageContext';
import serviceService from '@/services/api/serviceService';
import clientService from '@/services/api/clientService';
import ticketService from '@/services/api/ticketService';

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [service, setService] = useState(null);
  const [serviceClients, setServiceClients] = useState([]);
  const [serviceTickets, setServiceTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadServiceData();
  }, [id]);

  const loadServiceData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [serviceData, allClients, allTickets] = await Promise.all([
        serviceService.getById(id),
        clientService.getAll(),
        ticketService.getAll()
      ]);
      
      setService(serviceData);
      
      // Filter clients that have this service
      const clients = allClients.filter(client => 
        client.services && client.services.includes(id)
      );
      setServiceClients(clients);
      
      // Filter tickets related to this service
      const tickets = allTickets.filter(ticket => 
        ticket.serviceId === id
      );
      setServiceTickets(tickets);
      
    } catch (err) {
      setError(err.message || t('Error al cargar datos'));
      toast.error(t('Error al cargar datos'));
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/servicios');
  };

  const handleViewClient = (clientId) => {
    navigate(`/clientes/${clientId}`);
  };

  const handleViewTicket = (ticketId) => {
    navigate(`/soporte/${ticketId}`);
  };

  const formatPrice = (price, cycle) => {
    const formatted = new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price);

    const cycles = {
      monthly: '/mes',
      annual: '/año',
      oneTime: 'único'
    };

    return `${formatted} ${cycles[cycle] || ''}`;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Hosting': 'primary',
      'VPS': 'secondary',
      'Dominios': 'success',
      'Desarrollo': 'warning',
      'Mantenimiento': 'info',
      'Email': 'default',
      'Marketing': 'error'
    };
    return colors[category] || 'default';
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
        <LoadingState count={3} />
      </motion.div>
    );
  }

  if (error || !service) {
    return (
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="p-6"
      >
        <ErrorState 
          message={error || 'Servicio no encontrado'}
          onRetry={loadServiceData}
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
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          icon="ArrowLeft"
          onClick={handleBack}
        >
          Volver
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-surface-900 mb-2 font-heading">
            {service.name}
          </h1>
          <div className="flex items-center gap-3">
            <Badge variant={getCategoryColor(service.category)}>
              {service.category}
            </Badge>
            <span className="text-lg font-semibold text-surface-900">
              {formatPrice(service.price, service.billingCycle)}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Service Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg">
                <ApperIcon name="FileText" size={20} className="text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-surface-900">
                Descripción del Servicio
              </h3>
            </div>
            <p className="text-surface-700 leading-relaxed">
              {service.description}
            </p>
          </Card>

          {/* Clients */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary/10 rounded-lg">
                  <ApperIcon name="Users" size={20} className="text-secondary" />
                </div>
                <h3 className="text-lg font-semibold text-surface-900">
                  Clientes con este Servicio
                </h3>
              </div>
              <Badge variant="info">
                {serviceClients.length} clientes
              </Badge>
            </div>

            {serviceClients.length > 0 ? (
              <div className="space-y-3">
                {serviceClients.map((client) => (
                  <div 
                    key={client.Id} 
                    className="p-4 bg-surface-50 rounded-lg cursor-pointer hover:bg-surface-100 transition-colors"
                    onClick={() => handleViewClient(client.Id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-surface-900">
                          {client.companyName}
                        </h4>
                        <p className="text-sm text-surface-600">
                          RFC: {client.rfc}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={client.status === 'active' ? 'success' : 'default'}
                          size="small"
                        >
                          {t(client.status === 'active' ? 'Activo' : 'Inactivo')}
                        </Badge>
                        <ApperIcon name="ChevronRight" size={16} className="text-surface-400" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-surface-500">
                Ningún cliente tiene contratado este servicio
              </p>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Service Stats */}
          <Card>
            <h3 className="text-lg font-semibold text-surface-900 mb-4">
              Estadísticas
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-surface-600">Precio base</span>
                <span className="font-medium text-surface-900">
                  {new Intl.NumberFormat('es-MX', {
                    style: 'currency',
                    currency: 'MXN'
                  }).format(service.price)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-surface-600">Ciclo de facturación</span>
                <span className="font-medium text-surface-900">
                  {service.billingCycle === 'monthly' ? 'Mensual' :
                   service.billingCycle === 'annual' ? 'Anual' : 'Único'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-surface-600">Clientes activos</span>
                <span className="font-medium text-surface-900">
                  {serviceClients.filter(c => c.status === 'active').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-surface-600">Ingresos estimados</span>
                <span className="font-medium text-surface-900">
                  {new Intl.NumberFormat('es-MX', {
                    style: 'currency',
                    currency: 'MXN'
                  }).format(service.price * serviceClients.filter(c => c.status === 'active').length)}
                </span>
              </div>
            </div>
          </Card>

          {/* Related Tickets */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-surface-900">
                Tickets Relacionados
              </h3>
              {serviceTickets.length > 3 && (
                <Button variant="ghost" size="small" onClick={() => navigate('/soporte')}>
                  Ver todos
                </Button>
              )}
            </div>
            
            {serviceTickets.length > 0 ? (
              <div className="space-y-3">
                {serviceTickets.slice(0, 3).map((ticket) => (
                  <div 
                    key={ticket.Id} 
                    className="p-3 bg-surface-50 rounded-lg cursor-pointer hover:bg-surface-100 transition-colors"
                    onClick={() => handleViewTicket(ticket.Id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-surface-900 text-sm line-clamp-1">
                        {ticket.subject}
                      </h4>
                      <Badge 
                        variant={ticket.status === 'open' ? 'warning' :
                                ticket.status === 'inProgress' ? 'info' :
                                ticket.status === 'resolved' ? 'success' : 'default'}
                        size="small"
                      >
                        {t(ticket.status === 'open' ? 'Abierto' :
                           ticket.status === 'inProgress' ? 'En Progreso' :
                           ticket.status === 'resolved' ? 'Resuelto' : 'Cerrado')}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-surface-500">
                      <span>#{ticket.Id}</span>
                      <Badge 
                        variant={ticket.priority === 'urgent' || ticket.priority === 'high' ? 'error' : 
                                ticket.priority === 'medium' ? 'warning' : 'default'}
                        size="small"
                      >
                        {t(ticket.priority === 'low' ? 'Baja' : 
                           ticket.priority === 'medium' ? 'Media' :
                           ticket.priority === 'high' ? 'Alta' : 'Urgente')}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-surface-500 text-sm">
                No hay tickets relacionados con este servicio
              </p>
            )}
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default ServiceDetail;