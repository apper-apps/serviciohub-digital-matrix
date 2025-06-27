import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import LoadingState from '@/components/molecules/LoadingState';
import ErrorState from '@/components/molecules/ErrorState';
import EmptyState from '@/components/molecules/EmptyState';
import notificationService from '@/services/api/notificationService';
import clientService from '@/services/api/clientService';
import { useLanguage } from '@/contexts/LanguageContext';

const Notifications = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('send');
  const [notifications, setNotifications] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);

  // Form states
  const [selectedClient, setSelectedClient] = useState('');
  const [message, setMessage] = useState('');
  const [notificationType, setNotificationType] = useState('individual');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [notificationsData, clientsData] = await Promise.all([
        notificationService.getAll(),
        clientService.getAll()
      ]);
      setNotifications(notificationsData);
      setClients(clientsData);
    } catch (err) {
      setError(err.message);
      toast.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.warning('Por favor ingresa un mensaje');
      return;
    }
    if (notificationType === 'individual' && !selectedClient) {
      toast.warning('Por favor selecciona un cliente');
      return;
    }

    setSending(true);
    try {
      if (notificationType === 'broadcast') {
        // Send to all clients
        for (const client of clients) {
          await notificationService.create({
            clientId: client.Id,
            message: message.trim(),
            type: 'broadcast',
            status: 'sent',
            timestamp: new Date().toISOString()
          });
        }
        toast.success(`Notificación enviada a ${clients.length} clientes`);
      } else {
        // Send to selected client
        await notificationService.create({
          clientId: parseInt(selectedClient, 10),
          message: message.trim(),
          type: 'individual',
          status: 'sent',
          timestamp: new Date().toISOString()
        });
        toast.success('Notificación enviada exitosamente');
      }

      // Reset form
      setMessage('');
      setSelectedClient('');
      setNotificationType('individual');
      
      // Reload notifications
      loadData();
    } catch (err) {
      toast.error('Error al enviar la notificación');
    } finally {
      setSending(false);
    }
  };

  const handleDeleteNotification = async (id) => {
    if (!confirm('¿Estás seguro de eliminar esta notificación?')) return;

    try {
      await notificationService.delete(id);
      setNotifications(prev => prev.filter(n => n.Id !== id));
      toast.success('Notificación eliminada');
    } catch (err) {
      toast.error('Error al eliminar la notificación');
    }
  };

  const getClientName = (clientId) => {
    const client = clients.find(c => c.Id === clientId);
    return client ? client.name : 'Cliente no encontrado';
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      sent: { variant: 'success', label: 'Enviado' },
      pending: { variant: 'warning', label: 'Pendiente' },
      failed: { variant: 'danger', label: 'Fallido' }
    };
    const config = statusConfig[status] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (loading) return <LoadingState count={6} type="card" />;
  if (error) return <ErrorState message={error} onRetry={loadData} />;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-surface-900 mb-2">Notificaciones</h1>
        <p className="text-surface-600">Envía notificaciones individuales o masivas a tus clientes</p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-surface-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('send')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'send'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-surface-500 hover:text-surface-700 hover:border-surface-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <ApperIcon name="Send" size={16} />
                Enviar Notificación
              </div>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'history'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-surface-500 hover:text-surface-700 hover:border-surface-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <ApperIcon name="History" size={16} />
                Historial ({notifications.length})
              </div>
            </button>
          </nav>
        </div>
      </div>

      {activeTab === 'send' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl"
        >
          <Card>
            <form onSubmit={handleSendNotification} className="space-y-6">
              {/* Notification Type */}
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-3">
                  Tipo de Notificación
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="individual"
                      checked={notificationType === 'individual'}
                      onChange={(e) => setNotificationType(e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-sm">Individual</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="broadcast"
                      checked={notificationType === 'broadcast'}
                      onChange={(e) => setNotificationType(e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-sm">Masiva (Todos los clientes)</span>
                  </label>
                </div>
              </div>

              {/* Client Selection */}
              {notificationType === 'individual' && (
                <div>
                  <label htmlFor="client" className="block text-sm font-medium text-surface-700 mb-2">
                    Seleccionar Cliente
                  </label>
                  <select
                    id="client"
                    value={selectedClient}
                    onChange={(e) => setSelectedClient(e.target.value)}
                    className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required={notificationType === 'individual'}
                  >
                    <option value="">Selecciona un cliente...</option>
                    {clients.map(client => (
                      <option key={client.Id} value={client.Id}>
                        {client.name} - {client.email}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-surface-700 mb-2">
                  Mensaje
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  placeholder="Escribe tu mensaje aquí..."
                  required
                />
              </div>

              {/* Send Button */}
              <div className="flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={sending}
                  icon={sending ? "Loader2" : "Send"}
                >
                  {sending ? 'Enviando...' : 'Enviar Notificación'}
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      )}

      {activeTab === 'history' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {notifications.length === 0 ? (
            <EmptyState
              icon="Bell"
              title="No hay notificaciones"
              description="Aún no has enviado ninguna notificación"
            />
          ) : (
            <div className="grid gap-4">
              {notifications.map((notification) => (
                <Card key={notification.Id}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <ApperIcon 
                          name={notification.type === 'broadcast' ? 'Radio' : 'User'} 
                          size={16} 
                          className="text-surface-500"
                        />
                        <span className="font-medium text-surface-900">
                          {notification.type === 'broadcast' 
                            ? 'Notificación Masiva' 
                            : getClientName(notification.clientId)
                          }
                        </span>
                        {getStatusBadge(notification.status)}
                      </div>
                      <p className="text-surface-600 mb-3">{notification.message}</p>
                      <div className="text-sm text-surface-500">
                        <ApperIcon name="Clock" size={14} className="inline mr-1" />
                        {new Date(notification.timestamp).toLocaleString('es-ES')}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="small"
                        icon="Trash2"
                        onClick={() => handleDeleteNotification(notification.Id)}
                        className="text-red-600 hover:text-red-700"
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default Notifications;