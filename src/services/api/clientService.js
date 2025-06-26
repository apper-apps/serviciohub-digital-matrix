import clientsData from '../mockData/clients.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let clients = [...clientsData];

const clientService = {
  async getAll() {
    await delay(300);
    return [...clients];
  },

  async getById(id) {
    await delay(200);
    const client = clients.find(c => c.Id === parseInt(id, 10));
    if (!client) {
      throw new Error('Cliente no encontrado');
    }
    return { ...client };
  },

  async create(clientData) {
    await delay(400);
    const newClient = {
      ...clientData,
      Id: Math.max(...clients.map(c => c.Id), 0) + 1,
      createdAt: new Date().toISOString(),
      status: 'active'
    };
    clients.push(newClient);
    return { ...newClient };
  },

  async update(id, clientData) {
    await delay(350);
    const index = clients.findIndex(c => c.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Cliente no encontrado');
    }
    const updatedClient = { ...clients[index], ...clientData };
    clients[index] = updatedClient;
    return { ...updatedClient };
  },

  async delete(id) {
    await delay(250);
    const index = clients.findIndex(c => c.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Cliente no encontrado');
    }
    clients.splice(index, 1);
    return true;
  }
};

export default clientService;