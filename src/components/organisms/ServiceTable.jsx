import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import { useLanguage } from '@/contexts/LanguageContext';

const ServiceTable = ({ services, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleView = (serviceId) => {
    navigate(`/servicios/${serviceId}`);
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

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="bg-white rounded-lg border border-surface-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-surface-50 border-b border-surface-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-surface-900">
                {t('Nombre')}
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-surface-900">
                {t('Categoría')}
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-surface-900">
                {t('Precio')}
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-surface-900">
                {t('Descripción')}
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-surface-900">
                {t('Acciones')}
              </th>
            </tr>
          </thead>
          <motion.tbody
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="divide-y divide-surface-200"
          >
            {services.map((service) => (
              <motion.tr
                key={service.Id}
                variants={itemVariants}
                className="hover:bg-surface-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="font-medium text-surface-900">
                    {service.name}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge 
                    variant={getCategoryColor(service.category)}
                    size="small"
                  >
                    {service.category}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <span className="text-surface-900 font-medium">
                    {formatPrice(service.price, service.billingCycle)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-surface-600 line-clamp-2 max-w-xs">
                    {service.description}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="small"
                      variant="ghost"
                      icon="Eye"
                      onClick={() => handleView(service.Id)}
                    >
                      {t('Ver')}
                    </Button>
                    <Button
                      size="small"
                      variant="ghost"
                      icon="Edit"
                      onClick={() => onEdit && onEdit(service)}
                    >
                      {t('Editar')}
                    </Button>
                    <Button
                      size="small"
                      variant="ghost"
                      icon="Trash2"
                      onClick={() => onDelete && onDelete(service.Id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      {t('Eliminar')}
                    </Button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </motion.tbody>
        </table>
      </div>
    </div>
  );
};

export default ServiceTable;