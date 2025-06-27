import mockQuotes from '@/services/mockData/quotes.json';

let quotes = [...mockQuotes];
let nextId = Math.max(...quotes.map(q => q.Id)) + 1;

// Simulate network delay
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const quotesService = {
  // Get all quotes
  async getAll() {
    await delay();
    return [...quotes];
  },

  // Get quote by ID
  async getById(id) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('ID must be a positive integer');
    }
    
    await delay();
    const quote = quotes.find(q => q.Id === id);
    if (!quote) {
      throw new Error(`Quote with ID ${id} not found`);
    }
    return { ...quote };
  },

  // Create new quote
  async create(quoteData) {
    await delay();
    
    // Calculate totals
    const subtotal = quoteData.items?.reduce((sum, item) => sum + (item.total || 0), 0) || 0;
    const tax = subtotal * 0.16; // 16% tax
    const total = subtotal + tax;
    
    const newQuote = {
      ...quoteData,
      Id: nextId++,
      quoteNumber: `COT-2024-${String(nextId - 1).padStart(3, '0')}`,
      subtotal,
      tax,
      total,
      status: 'Pendiente',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    quotes.push(newQuote);
    return { ...newQuote };
  },

  // Update existing quote
  async update(id, updateData) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('ID must be a positive integer');
    }
    
    await delay();
    
    const index = quotes.findIndex(q => q.Id === id);
    if (index === -1) {
      throw new Error(`Quote with ID ${id} not found`);
    }

    // Recalculate totals if items changed
    let updatedData = { ...updateData };
    if (updateData.items) {
      const subtotal = updateData.items.reduce((sum, item) => sum + (item.total || 0), 0);
      const tax = subtotal * 0.16;
      const total = subtotal + tax;
      
      updatedData = {
        ...updateData,
        subtotal,
        tax,
        total
      };
    }

    quotes[index] = {
      ...quotes[index],
      ...updatedData,
      Id: id, // Ensure ID cannot be changed
      updatedAt: new Date().toISOString()
    };
    
    return { ...quotes[index] };
  },

  // Delete quote
  async delete(id) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('ID must be a positive integer');
    }
    
    await delay();
    
    const index = quotes.findIndex(q => q.Id === id);
    if (index === -1) {
      throw new Error(`Quote with ID ${id} not found`);
    }
    
    const deletedQuote = quotes[index];
    quotes.splice(index, 1);
    return { ...deletedQuote };
  },

  // Update quote status
  async updateStatus(id, status) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('ID must be a positive integer');
    }
    
    if (!['Pendiente', 'Aprobada', 'Rechazada'].includes(status)) {
      throw new Error('Invalid status. Must be: Pendiente, Aprobada, or Rechazada');
    }
    
    await delay();
    
    const index = quotes.findIndex(q => q.Id === id);
    if (index === -1) {
      throw new Error(`Quote with ID ${id} not found`);
    }
    
    quotes[index] = {
      ...quotes[index],
      status,
      updatedAt: new Date().toISOString()
    };
    
    return { ...quotes[index] };
  },

  // Get quotes by client ID
  async getByClientId(clientId) {
    if (!Number.isInteger(clientId) || clientId <= 0) {
      throw new Error('Client ID must be a positive integer');
    }
    
    await delay();
    return quotes.filter(q => q.clientId === clientId).map(q => ({ ...q }));
  },

  // Get quotes by status
  async getByStatus(status) {
    if (!['Pendiente', 'Aprobada', 'Rechazada'].includes(status)) {
      throw new Error('Invalid status. Must be: Pendiente, Aprobada, or Rechazada');
    }
    
    await delay();
    return quotes.filter(q => q.status === status).map(q => ({ ...q }));
  }
};

export default quotesService;