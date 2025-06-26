import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Input from '@/components/atoms/Input';
import LoadingState from '@/components/molecules/LoadingState';
import ErrorState from '@/components/molecules/ErrorState';
import ApperIcon from '@/components/ApperIcon';
import { useLanguage } from '@/contexts/LanguageContext';
import ticketService from '@/services/api/ticketService';
import clientService from '@/services/api/clientService';
import serviceService from '@/services/api/serviceService';

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [ticket, setTicket] = useState(null);
  const [client, setClient] = useState(null);
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    loadTicketData();
  }, [id]);

  const loadTicketData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const ticketData = await ticketService.getById(id);
      setTicket(ticketData);
      
      // Load related client and service data
      if (ticketData.clientId) {
        try {
          const clientData = await clientService.getById(ticketData.clientId);
          setClient(clientData);
        } catch (err) {
          console.warn('Client not found:', ticketData.clientId);
        }
      }
      
      if (ticketData.serviceId) {
        try {
          const serviceData = await serviceService.getById(ticketData.serviceId);
          setService(serviceData);
        } catch (err) {
          console.warn('Service not found:', ticketData.serviceId);
        }
      }
      
    } catch (err) {
      setError(err.message || t('Error al cargar datos'));
      toast.error(t('Error al cargar datos'));
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/soporte');
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    setSendingMessage(true);
    try {
      const updatedTicket = await ticketService.addMessage(id, {
        content: newMessage.trim(),
        sender: 'support'
      });
      setTicket(updatedTicket);
      setNewMessage('');
      toast.success('Mensaje enviado correctamente');
    } catch (err) {
      toast.error('Error al enviar el mensaje');
    } finally {
      setSendingMessage(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const updatedTicket = await ticketService.update(id, { status: newStatus });
      setTicket(updatedTicket);
      toast.success('Estado actualizado correctamente');
    } catch (err) {
      toast.error('Error al actualizar el estado');
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'default',
      medium: 'warning',
      high: 'error',
      urgent: 'error'
    };
    return colors[priority] || 'default';
  };

  const getStatusColor = (status) => {
    const colors = {
      open: 'warning',
      inProgress: 'info',
      resolved: 'success',
      closed: 'default'
    };
    return colors[status] || 'default';
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

  if (error || !ticket) {
    return (
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="p-6"
      >
        <ErrorState 
          message={error || 'Ticket no encontrado'}
          onRetry={loadTicketData}
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
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-surface-900 font-heading">
              Ticket #{ticket.Id}
            </h1>
            <Badge 
              variant={getPriorityColor(ticket.priority)}
            >
              {t(ticket.priority === 'low' ? 'Baja' : 
                 ticket.priority === 'medium' ? 'Media' :
                 ticket.priority === 'high' ? 'Alta' : 'Urgente')}
            </Badge>
            <Badge 
              variant={getStatusColor(ticket.status)}
            >
              {t(ticket.status === 'open' ? 'Abierto' :
                 ticket.status === 'inProgress' ? 'En Progreso' :
                 ticket.status === 'resolved' ? 'Resuelto' : 'Cerrado')}
            </Badge>
          </div>
          <h2 className="text-xl text-surface-700">
            {ticket.subject}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-surface-900">
                Conversación
              </h3>
              <div className="flex gap-2">
                {ticket.status !== 'closed' && (
                  <>
                    {ticket.status === 'open' && (
                      <Button
                        size="small"
                        variant="outline"
                        onClick={() => handleStatusChange('inProgress')}
                      >
                        Tomar Ticket
                      </Button>
                    )}
                    {ticket.status === 'inProgress' && (
                      <Button
                        size="small"
                        variant="outline"
                        onClick={() => handleStatusChange('resolved')}
                      >
                        Marcar Resuelto
                      </Button>
                    )}
                    {ticket.status === 'resolved' && (
                      <Button
                        size="small"
                        variant="outline"
                        onClick={() => handleStatusChange('closed')}
                      >
                        Cerrar Ticket
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Messages List */}
            <div className="space-y-4 mb-6">
              {ticket.messages && ticket.messages.length > 0 ? (
                ticket.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'support' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-2xl p-4 rounded-lg ${
                      message.sender === 'support' 
                        ? 'bg-primary text-white' 
                        : 'bg-surface-100 text-surface-900'
                    }`}>
                      <p className="mb-2">{message.content}</p>
                      <div className={`text-xs ${
                        message.sender === 'support' 
                          ? 'text-primary-100' 
                          : 'text-surface-500'
                      }`}>
                        {message.sender === 'support' ? 'Soporte' : 'Cliente'} • {' '}
                        {format(new Date(message.timestamp), 'PPpp', { locale: es })}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-surface-500 text-center py-8">
                  No hay mensajes en esta conversación
                </p>
              )}
            </div>

            {/* New Message Form */}
            {ticket.status !== 'closed' && (
              <div className="border-t border-surface-200 pt-6">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Escribe tu respuesta..."
                      disabled={sendingMessage}
                    />
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    loading={sendingMessage}
                    disabled={!newMessage.trim()}
                    icon="Send"
                  >
                    Enviar
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Ticket Info */}
          <Card>
            <h3 className="text-lg font-semibold text-surface-900 mb-4">
              Información del Ticket
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-surface-600">Creado:</span>
                <p className="font-medium text-surface-900">
                  {format(new Date(ticket.createdAt), 'PPpp', { locale: es })}
                </p>
              </div>
              <div>
                <span className="text-sm text-surface-600">Estado:</span>
                <div className="mt-1">
                  <Badge variant={getStatusColor(ticket.status)}>
                    {t(ticket.status === 'open' ? 'Abierto' :
                       ticket.status === 'inProgress' ? 'En Progreso' :
                       ticket.status === 'resolved' ? 'Resuelto' : 'Cerrado')}
                  </Badge>
                </div>
              </div>
              <div>
                <span className="text-sm text-surface-600">Prioridad:</span>
                <div className="mt-1">
                  <Badge variant={getPriorityColor(ticket.priority)}>
                    {t(ticket.priority === 'low' ? 'Baja' : 
                       ticket.priority === 'medium' ? 'Media' :
                       ticket.priority === 'high' ? 'Alta' : 'Urgente')}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Client Info */}
          {client && (
            <Card>
              <h3 className="text-lg font-semibold text-surface-900 mb-4">
                Cliente
              </h3>
              <div 
                className="p-3 bg-surface-50 rounded-lg cursor-pointer hover:bg-surface-100 transition-colors"
                onClick={() => navigate(`/clientes/${client.Id}`)}
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
                  <ApperIcon name="ChevronRight" size={16} className="text-surface-400" />
                </div>
              </div>
            </Card>
          )}

          {/* Service Info */}
          {service && (
            <Card>
              <h3 className="text-lg font-semibold text-surface-900 mb-4">
                Servicio Relacionado
              </h3>
              <div 
                className="p-3 bg-surface-50 rounded-lg cursor-pointer hover:bg-surface-100 transition-colors"
                onClick={() => navigate(`/servicios/${service.Id}`)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-surface-900">
                      {service.name}
                    </h4>
                    <p className="text-sm text-surface-600">
                      {service.category}
                    </p>
                  </div>
                  <ApperIcon name="ChevronRight" size={16} className="text-surface-400" />
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TicketDetail;