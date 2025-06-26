import { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

const translations = {
  es: {
    'Dashboard': 'Panel',
    'Clientes': 'Clientes',
    'Servicios': 'Servicios',
    'Soporte': 'Soporte',
    'Configuración': 'Configuración',
    'Buscar...': 'Buscar...',
    'Crear Cliente': 'Crear Cliente',
    'Crear Servicio': 'Crear Servicio',
    'Crear Ticket': 'Crear Ticket',
    'Clientes Activos': 'Clientes Activos',
    'Tickets Abiertos': 'Tickets Abiertos',
    'Servicios Totales': 'Servicios Totales',
    'Ingresos del Mes': 'Ingresos del Mes',
    'Actividad Reciente': 'Actividad Reciente',
    'Acciones Rápidas': 'Acciones Rápidas',
    'Ver Todos': 'Ver Todos',
    'Empresa': 'Empresa',
    'RFC': 'RFC',
    'Estado': 'Estado',
    'Servicios': 'Servicios',
    'Creado': 'Creado',
    'Acciones': 'Acciones',
    'Activo': 'Activo',
    'Inactivo': 'Inactivo',
    'Editar': 'Editar',
    'Eliminar': 'Eliminar',
    'Ver': 'Ver',
    'Nombre': 'Nombre',
    'Categoría': 'Categoría',
    'Precio': 'Precio',
    'Ciclo': 'Ciclo',
    'Descripción': 'Descripción',
    'Título': 'Título',
    'Cliente': 'Cliente',
    'Prioridad': 'Prioridad',
    'Baja': 'Baja',
    'Media': 'Media',
    'Alta': 'Alta',
    'Urgente': 'Urgente',
    'Abierto': 'Abierto',
    'En Progreso': 'En Progreso',
    'Resuelto': 'Resuelto',
    'Cerrado': 'Cerrado',
    'No se encontraron clientes': 'No se encontraron clientes',
    'Agrega tu primer cliente para comenzar': 'Agrega tu primer cliente para comenzar',
    'No hay servicios disponibles': 'No hay servicios disponibles',
    'Crea tu primer servicio para comenzar': 'Crea tu primer servicio para comenzar',
    'No hay tickets de soporte': 'No hay tickets de soporte',
    'Los tickets aparecerán aquí cuando los clientes necesiten ayuda': 'Los tickets aparecerán aquí cuando los clientes necesiten ayuda',
    'Error al cargar datos': 'Error al cargar datos',
    'Reintentar': 'Reintentar',
    'Página no encontrada': 'Página no encontrada',
    'La página que buscas no existe': 'La página que buscas no existe',
    'Volver al Panel': 'Volver al Panel',
    'Configuración del Sistema': 'Configuración del Sistema',
    'Configuración de Idioma': 'Configuración de Idioma',
    'Español': 'Español',
    'Inglés': 'Inglés',
    'Notificaciones': 'Notificaciones',
    'Recibir notificaciones por email': 'Recibir notificaciones por email',
    'Notificaciones push': 'Notificaciones push',
    'Configuración de Módulos': 'Configuración de Módulos',
    'Guardar Cambios': 'Guardar Cambios',
    'Cambios guardados correctamente': 'Cambios guardados correctamente'
  },
  en: {
    'Dashboard': 'Dashboard',
    'Clientes': 'Clients',
    'Servicios': 'Services',
    'Soporte': 'Support',
    'Configuración': 'Settings',
    'Buscar...': 'Search...',
    'Crear Cliente': 'Create Client',
    'Crear Servicio': 'Create Service',
    'Crear Ticket': 'Create Ticket',
    'Clientes Activos': 'Active Clients',
    'Tickets Abiertos': 'Open Tickets',
    'Servicios Totales': 'Total Services',
    'Ingresos del Mes': 'Monthly Revenue',
    'Actividad Reciente': 'Recent Activity',
    'Acciones Rápidas': 'Quick Actions',
    'Ver Todos': 'View All',
    'Empresa': 'Company',
    'RFC': 'RFC',
    'Estado': 'Status',
    'Servicios': 'Services',
    'Creado': 'Created',
    'Acciones': 'Actions',
    'Activo': 'Active',
    'Inactivo': 'Inactive',
    'Editar': 'Edit',
    'Eliminar': 'Delete',
    'Ver': 'View',
    'Nombre': 'Name',
    'Categoría': 'Category',
    'Precio': 'Price',
    'Ciclo': 'Cycle',
    'Descripción': 'Description',
    'Título': 'Title',
    'Cliente': 'Client',
    'Prioridad': 'Priority',
    'Baja': 'Low',
    'Media': 'Medium',
    'Alta': 'High',
    'Urgente': 'Urgent',
    'Abierto': 'Open',
    'En Progreso': 'In Progress',
    'Resuelto': 'Resolved',
    'Cerrado': 'Closed',
    'No se encontraron clientes': 'No clients found',
    'Agrega tu primer cliente para comenzar': 'Add your first client to get started',
    'No hay servicios disponibles': 'No services available',
    'Crea tu primer servicio para comenzar': 'Create your first service to get started',
    'No hay tickets de soporte': 'No support tickets',
    'Los tickets aparecerán aquí cuando los clientes necesiten ayuda': 'Tickets will appear here when clients need help',
    'Error al cargar datos': 'Failed to load data',
    'Reintentar': 'Retry',
    'Página no encontrada': 'Page not found',
    'La página que buscas no existe': 'The page you are looking for does not exist',
    'Volver al Panel': 'Back to Dashboard',
    'Configuración del Sistema': 'System Settings',
    'Configuración de Idioma': 'Language Settings',
    'Español': 'Spanish',
    'Inglés': 'English',
    'Notificaciones': 'Notifications',
    'Recibir notificaciones por email': 'Receive email notifications',
    'Notificaciones push': 'Push notifications',
    'Configuración de Módulos': 'Module Settings',
    'Guardar Cambios': 'Save Changes',
    'Cambios guardados correctamente': 'Changes saved successfully'
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('es');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'es' ? 'en' : 'es');
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};