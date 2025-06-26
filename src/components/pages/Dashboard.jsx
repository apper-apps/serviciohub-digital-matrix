import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import StatCard from '@/components/molecules/StatCard';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import LoadingState from '@/components/molecules/LoadingState';
import ErrorState from '@/components/molecules/ErrorState';
import ApperIcon from '@/components/ApperIcon';
import { useLanguage } from '@/contexts/LanguageContext';
import clientService from '@/services/api/clientService';
import serviceService from '@/services/api/serviceService';
import ticketService from '@/services/api/ticketService';

const Dashboard = () => {
  const [data, setData] = useState({
    clients: [],
    services: [],
    tickets: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [clients, services, tickets] = await Promise.all([
        clientService.getAll(),
        serviceService.getAll(),
        ticketService.getAll()
      ]);
      
      setData({ clients, services, tickets });
    } catch (err) {
      setError(err.message || t('Error al cargar datos'));
      toast.error(t('Error al cargar datos'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <div className="h-8 w-48 bg-surface-200 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-96 bg-surface-200 rounded animate-pulse"></div>
        </div>
        <LoadingState count={4} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState 
          message={error}
          onRetry={loadDashboardData}
        />
      </div>
    );
  }

  const activeClients = data.clients.filter(c => c.status === 'active').length;
  const openTickets = data.tickets.filter(t => t.status === 'open' || t.status === 'inProgress').length;
  const totalServices = data.services.length;
  const monthlyRevenue = data.services
    .filter(s => s.billingCycle === 'monthly')
    .reduce((sum, s) => sum + s.price, 0);

  const recentActivity = [
    ...data.tickets.slice(0, 3).map(ticket => ({
      id: ticket.Id,
      type: 'ticket',
      title: ticket.subject,
      subtitle: `Ticket #${ticket.Id}`,
      time: ticket.createdAt,
      icon: 'MessageCircle',
      color: 'warning'
    })),
    ...data.clients.slice(0, 2).map(client => ({
      id: client.Id,
      type: 'client',
      title: client.companyName,
      subtitle: 'Nuevo cliente',
      time: client.createdAt,
      icon: 'UserPlus',
      color: 'success'
    }))
  ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
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
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="p-6 max-w-full overflow-hidden"
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-surface-900 mb-2 font-heading">
          {t('Dashboard')}
        </h1>
        <p className="text-surface-600">
          Resumen de tu negocio de servicios administrados
        </p>
      </div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <motion.div variants={itemVariants}>
          <StatCard
            title={t('Clientes Activos')}
            value={activeClients}
            icon="Users"
            color="primary"
            trend="up"
            trendValue="+12%"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            title={t('Tickets Abiertos')}
            value={openTickets}
            icon="MessageCircle"
            color="warning"
            trend="down"
            trendValue="-8%"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            title={t('Servicios Totales')}
            value={totalServices}
            icon="Package"
            color="secondary"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            title={t('Ingresos del Mes')}
            value={`$${monthlyRevenue.toLocaleString()}`}
            icon="DollarSign"
            color="success"
            trend="up"
            trendValue="+23%"
          />
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div 
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-2"
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-surface-900">
                {t('Actividad Reciente')}
              </h3>
              <Button variant="ghost" size="small">
                {t('Ver Todos')}
              </Button>
            </div>
            
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-surface-50 transition-colors cursor-pointer"
                  onClick={() => {
                    if (activity.type === 'ticket') {
                      navigate(`/soporte/${activity.id}`);
                    } else if (activity.type === 'client') {
                      navigate(`/clientes/${activity.id}`);
                    }
                  }}
                >
                  <div className={`p-2 rounded-lg ${
                    activity.color === 'success' ? 'bg-green-100 text-green-600' :
                    activity.color === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    <ApperIcon name={activity.icon} size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-surface-900 truncate">
                      {activity.title}
                    </p>
                    <p className="text-sm text-surface-500">
                      {activity.subtitle}
                    </p>
                  </div>
                  <div className="text-xs text-surface-500">
                    {new Date(activity.time).toLocaleDateString()}
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <Card>
            <h3 className="text-lg font-semibold text-surface-900 mb-6">
              {t('Acciones Rápidas')}
            </h3>
            
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                icon="UserPlus"
                onClick={() => navigate('/clientes')}
              >
                {t('Crear Cliente')}
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                icon="Package"
                onClick={() => navigate('/servicios')}
              >
                {t('Crear Servicio')}
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                icon="MessageCircle"
                onClick={() => navigate('/soporte')}
              >
                {t('Crear Ticket')}
              </Button>
            </div>

            <div className="mt-6 pt-6 border-t border-surface-200">
              <h4 className="font-medium text-surface-900 mb-3">
                Conexiones Modulares
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-surface-600">Clientes ↔ Servicios</span>
                  <span className="text-green-600 font-medium">Activo</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-surface-600">Servicios ↔ Tickets</span>
                  <span className="text-green-600 font-medium">Activo</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-surface-600">Clientes ↔ Tickets</span>
                  <span className="text-green-600 font-medium">Activo</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;