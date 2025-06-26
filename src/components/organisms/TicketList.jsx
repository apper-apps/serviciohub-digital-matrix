import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import { useLanguage } from '@/contexts/LanguageContext';

const TicketList = ({ tickets, clients, services, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleView = (ticketId) => {
    navigate(`/soporte/${ticketId}`);
  };

  const getClientName = (clientId) => {
    const client = clients?.find(c => c.Id.toString() === clientId);
    return client?.companyName || 'Cliente no encontrado';
  };

  const getServiceName = (serviceId) => {
    const service = services?.find(s => s.Id.toString() === serviceId);
    return service?.name || 'Servicio no encontrado';
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
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      {tickets.map((ticket) => (
        <motion.div key={ticket.Id} variants={itemVariants}>
          <Card hover className="cursor-pointer" onClick={() => handleView(ticket.Id)}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-surface-900 mb-2 line-clamp-1">
                  {ticket.subject}
                </h3>
                <div className="flex items-center gap-4 text-sm text-surface-600 mb-2">
                  <div className="flex items-center gap-1">
                    <ApperIcon name="Building" size={14} />
                    <span className="truncate">{getClientName(ticket.clientId)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ApperIcon name="Package" size={14} />
                    <span className="truncate">{getServiceName(ticket.serviceId)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ApperIcon name="Calendar" size={14} />
                    <span>{format(new Date(ticket.createdAt), 'PPP', { locale: es })}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 ml-4">
                <Badge 
                  variant={getPriorityColor(ticket.priority)}
                  size="small"
                >
                  {t(ticket.priority === 'low' ? 'Baja' : 
                     ticket.priority === 'medium' ? 'Media' :
                     ticket.priority === 'high' ? 'Alta' : 'Urgente')}
                </Badge>
                <Badge 
                  variant={getStatusColor(ticket.status)}
                  size="small"
                >
                  {t(ticket.status === 'open' ? 'Abierto' :
                     ticket.status === 'inProgress' ? 'En Progreso' :
                     ticket.status === 'resolved' ? 'Resuelto' : 'Cerrado')}
                </Badge>
              </div>
            </div>

            {ticket.messages && ticket.messages.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-surface-600 line-clamp-2">
                  {ticket.messages[0].content}
                </p>
                {ticket.messages.length > 1 && (
                  <div className="flex items-center gap-1 mt-2">
                    <ApperIcon name="MessageCircle" size={14} className="text-surface-400" />
                    <span className="text-xs text-surface-500">
                      {ticket.messages.length} mensajes
                    </span>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-surface-100">
              <div className="flex items-center gap-2">
                <ApperIcon 
                  name={ticket.priority === 'urgent' ? 'AlertTriangle' : 
                        ticket.priority === 'high' ? 'AlertCircle' : 'Info'} 
                  size={14} 
                  className={
                    ticket.priority === 'urgent' || ticket.priority === 'high' 
                      ? 'text-red-500' 
                      : 'text-surface-400'
                  } 
                />
                <span className="text-xs text-surface-500">
                  ID: #{ticket.Id}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  size="small"
                  variant="ghost"
                  icon="Eye"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleView(ticket.Id);
                  }}
                >
                  {t('Ver')}
                </Button>
                <Button
                  size="small"
                  variant="ghost"
                  icon="Edit"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit && onEdit(ticket);
                  }}
                >
                  {t('Editar')}
                </Button>
                <Button
                  size="small"
                  variant="ghost"
                  icon="Trash2"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete && onDelete(ticket.Id);
                  }}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  {t('Eliminar')}
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default TicketList;