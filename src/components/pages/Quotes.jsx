import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Badge from '@/components/atoms/Badge';
import LoadingState from '@/components/molecules/LoadingState';
import ErrorState from '@/components/molecules/ErrorState';
import EmptyState from '@/components/molecules/EmptyState';
import quotesService from '@/services/api/quotesService';
import clientService from '@/services/api/clientService';

const Quotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuote, setEditingQuote] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    clientId: '',
    clientName: '',
    title: '',
    description: '',
    items: [{ description: '', quantity: 1, unitPrice: 0, total: 0 }],
    validUntil: '',
    notes: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [quotesData, clientsData] = await Promise.all([
        quotesService.getAll(),
        clientService.getAll()
      ]);
      setQuotes(quotesData);
      setClients(clientsData);
      setError(null);
    } catch (err) {
      setError('Error al cargar las cotizaciones');
      toast.error('Error al cargar las cotizaciones');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (quote = null) => {
    if (quote) {
      setEditingQuote(quote);
      setFormData({
        clientId: quote.clientId,
        clientName: quote.clientName,
        title: quote.title,
        description: quote.description,
        items: [...quote.items],
        validUntil: quote.validUntil,
        notes: quote.notes || ''
      });
    } else {
      setEditingQuote(null);
      setFormData({
        clientId: '',
        clientName: '',
        title: '',
        description: '',
        items: [{ description: '', quantity: 1, unitPrice: 0, total: 0 }],
        validUntil: '',
        notes: ''
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingQuote(null);
  };

  const handleClientSelect = (clientId) => {
    const client = clients.find(c => c.Id === parseInt(clientId));
    setFormData(prev => ({
      ...prev,
      clientId: parseInt(clientId),
      clientName: client ? client.name : ''
    }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, unitPrice: 0, total: 0 }]
    }));
  };

  const removeItem = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateItem = (index, field, value) => {
    setFormData(prev => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: value };
      
      // Recalculate total for this item
      if (field === 'quantity' || field === 'unitPrice') {
        newItems[index].total = newItems[index].quantity * newItems[index].unitPrice;
      }
      
      return { ...prev, items: newItems };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.clientId || !formData.title || formData.items.length === 0) {
      toast.error('Por favor complete todos los campos requeridos');
      return;
    }

    try {
      if (editingQuote) {
        await quotesService.update(editingQuote.Id, formData);
        toast.success('Cotización actualizada exitosamente');
      } else {
        await quotesService.create(formData);
        toast.success('Cotización creada exitosamente');
      }
      
      closeModal();
      loadData();
    } catch (err) {
      toast.error('Error al guardar la cotización');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta cotización?')) {
      try {
        await quotesService.delete(id);
        toast.success('Cotización eliminada exitosamente');
        loadData();
      } catch (err) {
        toast.error('Error al eliminar la cotización');
      }
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await quotesService.updateStatus(id, status);
      toast.success(`Cotización ${status.toLowerCase()} exitosamente`);
      loadData();
    } catch (err) {
      toast.error('Error al actualizar el estado');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Pendiente': { variant: 'warning', text: 'Pendiente' },
      'Aprobada': { variant: 'success', text: 'Aprobada' },
      'Rechazada': { variant: 'error', text: 'Rechazada' }
    };
    
    const config = statusConfig[status] || statusConfig['Pendiente'];
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = quote.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.quoteNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || quote.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={loadData} />;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-surface-900 mb-2">Cotizaciones</h1>
          <p className="text-surface-600">Gestiona las cotizaciones y presupuestos para clientes</p>
        </div>
        <Button onClick={() => openModal()} className="flex items-center gap-2">
          <ApperIcon name="Plus" size={16} />
          Nueva Cotización
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Buscar cotizaciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Todos los estados</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Aprobada">Aprobada</option>
            <option value="Rechazada">Rechazada</option>
          </select>
        </div>
      </Card>

      {/* Quotes Table */}
      {filteredQuotes.length === 0 ? (
        <EmptyState
          icon="FileText"
          title="No hay cotizaciones"
          description="Comienza creando tu primera cotización"
          actionLabel="Nueva Cotización"
          onAction={() => openModal()}
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-50 border-b border-surface-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                    Cotización
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                    Monto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                    Válida hasta
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-surface-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-surface-200">
                {filteredQuotes.map((quote) => (
                  <motion.tr
                    key={quote.Id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-surface-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-surface-900">
                          {quote.quoteNumber}
                        </div>
                        <div className="text-sm text-surface-500 truncate max-w-xs">
                          {quote.title}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-surface-900">{quote.clientName}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-surface-900">
                        ${quote.total?.toLocaleString() || '0'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(quote.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-surface-900">
                        {new Date(quote.validUntil).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {quote.status === 'Pendiente' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusChange(quote.Id, 'Aprobada')}
                              className="text-green-600 border-green-200 hover:bg-green-50"
                            >
                              <ApperIcon name="Check" size={14} />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusChange(quote.Id, 'Rechazada')}
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              <ApperIcon name="X" size={14} />
                            </Button>
                          </>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openModal(quote)}
                        >
                          <ApperIcon name="Edit" size={14} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(quote.Id)}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <ApperIcon name="Trash2" size={14} />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-surface-200">
              <h2 className="text-xl font-semibold text-surface-900">
                {editingQuote ? 'Editar Cotización' : 'Nueva Cotización'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Cliente *
                  </label>
                  <select
                    value={formData.clientId}
                    onChange={(e) => handleClientSelect(e.target.value)}
                    className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  >
                    <option value="">Seleccionar cliente</option>
                    {clients.map(client => (
                      <option key={client.Id} value={client.Id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                </div>
                <Input
                  label="Válida hasta *"
                  type="date"
                  value={formData.validUntil}
                  onChange={(e) => setFormData(prev => ({ ...prev, validUntil: e.target.value }))}
                  required
                />
              </div>

              <Input
                label="Título *"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />

              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={3}
                />
              </div>

              {/* Items */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-surface-700">
                    Elementos de la cotización
                  </label>
                  <Button type="button" onClick={addItem} variant="outline" size="sm">
                    <ApperIcon name="Plus" size={14} />
                    Agregar elemento
                  </Button>
                </div>

                <div className="space-y-4">
                  {formData.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border border-surface-200 rounded-lg">
                      <div className="md:col-span-2">
                        <Input
                          placeholder="Descripción"
                          value={item.description}
                          onChange={(e) => updateItem(index, 'description', e.target.value)}
                        />
                      </div>
                      <Input
                        type="number"
                        placeholder="Cantidad"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                      />
                      <Input
                        type="number"
                        placeholder="Precio unitario"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-surface-900">
                          ${item.total?.toLocaleString() || '0'}
                        </span>
                        {formData.items.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeItem(index)}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <ApperIcon name="Trash2" size={14} />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Notas adicionales
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={3}
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-4 pt-4 border-t border-surface-200">
                <Button type="button" variant="outline" onClick={closeModal}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingQuote ? 'Actualizar' : 'Crear'} Cotización
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Quotes;