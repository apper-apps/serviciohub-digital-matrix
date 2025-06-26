import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import { useLanguage } from '@/contexts/LanguageContext';

const ClientGrid = ({ clients, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleView = (clientId) => {
    navigate(`/clientes/${clientId}`);
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
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {clients.map((client) => (
        <motion.div key={client.Id} variants={itemVariants}>
          <Card hover className="h-full">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-surface-900 truncate mb-1">
                  {client.companyName}
                </h3>
                <p className="text-sm text-surface-500">RFC: {client.rfc}</p>
              </div>
              <Badge 
                variant={client.status === 'active' ? 'success' : 'default'}
                size="small"
              >
                {t(client.status === 'active' ? 'Activo' : 'Inactivo')}
              </Badge>
            </div>

            {client.contacts && client.contacts.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <ApperIcon name="User" size={14} className="text-surface-400" />
                  <span className="text-sm font-medium text-surface-700">
                    {client.contacts[0].name}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <ApperIcon name="Mail" size={14} className="text-surface-400" />
                  <span className="text-sm text-surface-600 truncate">
                    {client.contacts[0].email}
                  </span>
                </div>
                {client.contacts[0].phone && (
                  <div className="flex items-center gap-2">
                    <ApperIcon name="Phone" size={14} className="text-surface-400" />
                    <span className="text-sm text-surface-600">
                      {client.contacts[0].phone}
                    </span>
                  </div>
                )}
              </div>
            )}

            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <ApperIcon name="Package" size={14} className="text-surface-400" />
                <span className="text-sm font-medium text-surface-700">
                  {t('Servicios')}: {client.services?.length || 0}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ApperIcon name="Calendar" size={14} className="text-surface-400" />
                <span className="text-sm text-surface-600">
                  {format(new Date(client.createdAt), 'PPP', { locale: es })}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-surface-100">
              <Button
                size="small"
                variant="ghost"
                icon="Eye"
                onClick={() => handleView(client.Id)}
              >
                {t('Ver')}
              </Button>
              <Button
                size="small"
                variant="ghost"
                icon="Edit"
                onClick={() => onEdit && onEdit(client)}
              >
                {t('Editar')}
              </Button>
              <Button
                size="small"
                variant="ghost"
                icon="Trash2"
                onClick={() => onDelete && onDelete(client.Id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                {t('Eliminar')}
              </Button>
            </div>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ClientGrid;