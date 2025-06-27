import Dashboard from '@/components/pages/Dashboard';
import Clients from '@/components/pages/Clients';
import Services from '@/components/pages/Services';
import Support from '@/components/pages/Support';
import Team from '@/components/pages/Team';
import Configuration from '@/components/pages/Configuration';
import Notifications from '@/components/pages/Notifications';
import ClientDetail from '@/components/pages/ClientDetail';
import ServiceDetail from '@/components/pages/ServiceDetail';
import TicketDetail from '@/components/pages/TicketDetail';

export const routes = {
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/',
    icon: 'LayoutDashboard',
    component: Dashboard
  },
  clients: {
    id: 'clients',
    label: 'Clientes',
    path: '/clientes',
    icon: 'Users',
    component: Clients
  },
  services: {
    id: 'services',
    label: 'Servicios',
    path: '/servicios',
    icon: 'Package',
    component: Services
  },
support: {
    id: 'support',
    label: 'Soporte',
    path: '/soporte',
    icon: 'MessageCircle',
    component: Support
  },
  team: {
    id: 'team',
    label: 'Equipo',
    path: '/equipo',
    icon: 'Users',
    component: Team
},
  notifications: {
    id: 'notifications',
    label: 'Notificaciones',
    path: '/notificaciones',
    icon: 'Bell',
    component: Notifications
  },
  configuration: {
    id: 'configuration',
    label: 'Configuración',
    path: '/configuracion',
    icon: 'Settings',
    component: Configuration
  },
  clientDetail: {
    id: 'clientDetail',
    label: 'Detalle Cliente',
    path: '/clientes/:id',
    icon: 'User',
    component: ClientDetail,
    hidden: true
  },
  serviceDetail: {
    id: 'serviceDetail',
    label: 'Detalle Servicio',
    path: '/servicios/:id',
    icon: 'Package',
    component: ServiceDetail,
    hidden: true
  },
  ticketDetail: {
    id: 'ticketDetail',
    label: 'Detalle Ticket',
    path: '/soporte/:id',
    icon: 'MessageCircle',
    component: TicketDetail,
    hidden: true
  }
};

export const routeArray = Object.values(routes);
export default routes;