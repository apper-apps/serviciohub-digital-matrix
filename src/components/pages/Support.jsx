import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import TicketList from "@/components/organisms/TicketList";
import LoadingState from "@/components/molecules/LoadingState";
import ErrorState from "@/components/molecules/ErrorState";
import EmptyState from "@/components/molecules/EmptyState";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import Badge from "@/components/atoms/Badge";
import { useLanguage } from "@/contexts/LanguageContext";
import ticketService from "@/services/api/ticketService";
import clientService from "@/services/api/clientService";
import serviceService from "@/services/api/serviceService";

const Support = () => {
  const [tickets, setTickets] = useState([]);
  const [clients, setClients] = useState([]);
  const [services, setServices] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const { t } = useLanguage();

  useEffect(() => {
    loadSupportData();
  }, []);

  useEffect(() => {
    filterTickets();
  }, [tickets, searchQuery, selectedStatus, selectedPriority]);

  const loadSupportData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [ticketsResult, clientsResult, servicesResult] = await Promise.all([
        ticketService.getAll(),
        clientService.getAll(),
        serviceService.getAll()
      ]);
      
      setTickets(ticketsResult);
      setClients(clientsResult);
      setServices(servicesResult);
    } catch (err) {
      setError(err.message || t('Error al cargar datos'));
      toast.error(t('Error al cargar datos'));
    } finally {
      setLoading(false);
    }
  };

  const filterTickets = () => {
    let filtered = [...tickets];

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(ticket =>
        ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.Id.toString().includes(searchQuery)
      );
    }

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === selectedStatus);
    }

    // Filter by priority
    if (selectedPriority !== 'all') {
      filtered = filtered.filter(ticket => ticket.priority === selectedPriority);
    }

    setFilteredTickets(filtered);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleEdit = (ticket) => {
    // Modal de edición - placeholder
    toast.info('Función de edición en desarrollo');
  };

  const handleDelete = async (ticketId) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este ticket?')) {
      return;
    }

    try {
      await ticketService.delete(ticketId);
      setTickets(prev => prev.filter(t => t.Id !== ticketId));
      toast.success('Ticket eliminado correctamente');
    } catch (err) {
      toast.error('Error al eliminar el ticket');
    }
  };

  const handleCreateTicket = () => {
    // Modal de creación - placeholder
    toast.info('Función de creación en desarrollo');
  };

  const statusOptions = [
    { value: 'open', label: t('Abierto'), color: 'warning' },
    { value: 'inProgress', label: t('En Progreso'), color: 'info' },
    { value: 'resolved', label: t('Resuelto'), color: 'success' },
    { value: 'closed', label: t('Cerrado'), color: 'default' }
  ];

  const priorityOptions = [
    { value: 'low', label: t('Baja'), color: 'default' },
    { value: 'medium', label: t('Media'), color: 'warning' },
    { value: 'high', label: t('Alta'), color: 'error' },
    { value: 'urgent', label: t('Urgente'), color: 'error' }
  ];

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
        <LoadingState count={4} />
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
          onRetry={loadSupportData}
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
            {t('Soporte')}
          </h1>
          <p className="text-surface-600">
            Gestiona tickets de soporte y comunicación con clientes
          </p>
        </div>
        <Button icon="Plus" onClick={handleCreateTicket}>
          {t('Crear Ticket')}
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="flex flex-col gap-4">
          <div className="flex-1">
            <SearchBar 
              onSearch={handleSearch}
              placeholder="Buscar tickets por asunto o ID..."
            />
          </div>
          
          <div className="flex flex-wrap gap-4">
            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-surface-700">Estado:</span>
              <div className="flex gap-2">
                <Badge
                  variant={selectedStatus === 'all' ? 'primary' : 'default'}
                  className="cursor-pointer"
                  onClick={() => setSelectedStatus('all')}
                >
                  Todos
                </Badge>
                {statusOptions.map(status => (
                  <Badge
                    key={status.value}
                    variant={selectedStatus === status.value ? 'primary' : status.color}
                    className="cursor-pointer"
                    onClick={() => setSelectedStatus(status.value)}
                  >
                    {status.label}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Priority Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-surface-700">Prioridad:</span>
              <div className="flex gap-2">
                <Badge
                  variant={selectedPriority === 'all' ? 'primary' : 'default'}
                  className="cursor-pointer"
                  onClick={() => setSelectedPriority('all')}
                >
                  Todas
                </Badge>
{priorityOptions.map(priority => (
                  <Badge
                    key={priority.value}
                    variant={selectedPriority === priority.value ? 'primary' : priority.color}
                    className="cursor-pointer"
                    onClick={() => setSelectedPriority(priority.value)}
                  >
                    {priority.label}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {tickets.length === 0 ? (
        <EmptyState
          icon="MessageCircle"
          title={t('No hay tickets de soporte')}
          description={t('Los tickets aparecerán aquí cuando los clientes necesiten ayuda')}
          actionLabel={t('Crear Ticket')}
          onAction={handleCreateTicket}
        />
      ) : filteredTickets.length === 0 ? (
        <EmptyState
          icon="Search"
          title="No se encontraron resultados"
          description="Intenta con otros términos de búsqueda o filtros"
        />
      ) : (
        <TicketList
          tickets={filteredTickets}
          clients={clients}
          services={services}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Results count */}
      {tickets.length > 0 && (
        <div className="mt-6 text-center text-sm text-surface-500">
          Mostrando {filteredTickets.length} de {tickets.length} tickets
        </div>
      )}
    </motion.div>
  );
};

export default Support;