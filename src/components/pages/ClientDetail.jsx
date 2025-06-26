import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import LoadingState from '@/components/molecules/LoadingState';
import ErrorState from '@/components/molecules/ErrorState';
import ApperIcon from '@/components/ApperIcon';
import { useLanguage } from '@/contexts/LanguageContext';
import clientService from '@/services/api/clientService';
import serviceService from '@/services/api/serviceService';
import ticketService from '@/services/api/ticketService';

const ClientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [client, setClient] = useState(null);
  const [clientServices, setClientServices] = useState([]);
  const [clientTickets, setClientTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadClientData();
  }, [id]);

  const loadClientData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [clientData, allServices, allTickets] = await Promise.all([
        clientService.getById(id),
        serviceService.getAll(),
        ticketService.getAll()
      ]);
      
      setClient(clientData);
      
      // Filter services for this client
      const clientServiceIds = clientData.services || [];
      const services = allServices.filter(service => 
        clientServiceIds.includes(service.Id.toString())
      );
      setClientServices(services);
      
      // Filter tickets for this client
      const tickets = allTickets.filter(ticket => 
        ticket.clientId === id
      );
      setClientTickets(tickets);
      
    } catch (err) {
      setError(err.message || t('Error al cargar datos'));
      toast.error(t('Error al cargar datos'));
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/clientes');
  };

  const handleViewTicket = (ticketId) => {
    navigate(`/soporte/${ticketId}`);
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

  if (error || !client) {
    return (
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="p-6"
      >
        <ErrorState 
          message={error || 'Cliente no encontrado'}
          onRetry={loadClientData}
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
            {client.companyName}
          </h1>
          <p className="text-surface-600">
            RFC: {client.rfc}
          </p>
        </div>
        <Badge 
          variant={client.status === 'active' ? 'success' : 'default'}
        >
          {t(client.status === 'active' ? 'Activo' : 'Inactivo')}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Client Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Information */}
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg">
                <ApperIcon name="User" size={20} className="text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-surface-900">
                Información de Contacto
              </h3>
            </div>

            {client.contacts && client.contacts.length > 0 ? (
              <div className="space-y-4">
                {client.contacts.map((contact, index) => (
                  <div key={index} className="p-4 bg-surface-50 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-medium text-surface-900">
                        {contact.name}
                      </h4>
                      {contact.position && (
                        <Badge variant="default" size="small">
                          {contact.position}
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <ApperIcon name="Mail" size={14} className="text-surface-400" />
                        <span className="text-sm text-surface-600">{contact.email}</span>
                      </div>
                      {contact.phone && (
                        <div className="flex items-center gap-2">
                          <ApperIcon name="Phone" size={14} className="text-surface-400" />
                          <span className="text-sm text-surface-600">{contact.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-surface-500">No hay contactos registrados</p>
            )}
          </Card>

          {/* Services */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary/10 rounded-lg">
                  <ApperIcon name="Package" size={20} className="text-secondary" />
                </div>
                <h3 className="text-lg font-semibold text-surface-900">
                  Servicios Contratados
                </h3>
              </div>
              <Badge variant="info">
                {clientServices.length} servicios
              </Badge>
            </div>

            {clientServices.length > 0 ? (
              <div className="space-y-3">
                {clientServices.map((service) => (
                  <div key={service.Id} className="p-4 bg-surface-50 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-surface-900 mb-1">
                          {service.name}
                        </h4>
                        <p className="text-sm text-surface-600 mb-2">
                          {service.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-surface-500">
                          <span>Categoría: {service.category}</span>
                          <span>
                            {new Intl.NumberFormat('es-MX', {
                              style: 'currency',
                              currency: 'MXN'
                            }).format(service.price)}
                            {service.billingCycle === 'monthly' ? '/mes' :
                             service.billingCycle === 'annual' ? '/año' : ' único'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-surface-500">No hay servicios contratados</p>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Client Stats */}
          <Card>
            <h3 className="text-lg font-semibold text-surface-900 mb-4">
              Estadísticas
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-surface-600">Cliente desde</span>
                <span className="font-medium text-surface-900">
                  {format(new Date(client.createdAt), 'MMM yyyy', { locale: es })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-surface-600">Servicios activos</span>
                <span className="font-medium text-surface-900">
                  {clientServices.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-surface-600">Tickets totales</span>
                <span className="font-medium text-surface-900">
                  {clientTickets.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-surface-600">Tickets abiertos</span>
                <span className="font-medium text-surface-900">
                  {clientTickets.filter(t => t.status === 'open' || t.status === 'inProgress').length}
                </span>
              </div>
            </div>
          </Card>

          {/* Recent Tickets */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-surface-900">
                Tickets Recientes
              </h3>
              {clientTickets.length > 3 && (
                <Button variant="ghost" size="small" onClick={() => navigate('/soporte')}>
                  Ver todos
                </Button>
              )}
            </div>
            
            {clientTickets.length > 0 ? (
              <div className="space-y-3">
                {clientTickets.slice(0, 3).map((ticket) => (
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
                      <span>{format(new Date(ticket.createdAt), 'dd/MM/yyyy')}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-surface-500 text-sm">
                No hay tickets registrados
              </p>
            )}
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default ClientDetail;