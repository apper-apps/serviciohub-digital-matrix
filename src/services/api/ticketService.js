import ticketsData from '../mockData/tickets.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let tickets = [...ticketsData];

const ticketService = {
  async getAll() {
    await delay(300);
    return [...tickets];
  },

  async getById(id) {
    await delay(200);
    const ticket = tickets.find(t => t.Id === parseInt(id, 10));
    if (!ticket) {
      throw new Error('Ticket no encontrado');
    }
    return { ...ticket };
  },

  async create(ticketData) {
    await delay(400);
    const newTicket = {
      ...ticketData,
      Id: Math.max(...tickets.map(t => t.Id), 0) + 1,
      createdAt: new Date().toISOString(),
      status: 'open',
      messages: []
    };
    tickets.push(newTicket);
    return { ...newTicket };
  },

  async update(id, ticketData) {
    await delay(350);
    const index = tickets.findIndex(t => t.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Ticket no encontrado');
    }
    const updatedTicket = { ...tickets[index], ...ticketData };
    tickets[index] = updatedTicket;
    return { ...updatedTicket };
  },

  async delete(id) {
    await delay(250);
    const index = tickets.findIndex(t => t.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Ticket no encontrado');
    }
    tickets.splice(index, 1);
    return true;
  },

  async addMessage(ticketId, message) {
    await delay(200);
    const ticket = tickets.find(t => t.Id === parseInt(ticketId, 10));
    if (!ticket) {
      throw new Error('Ticket no encontrado');
    }
    const newMessage = {
      id: Math.max(...(ticket.messages?.map(m => m.id) || [0]), 0) + 1,
      content: message.content,
      sender: message.sender,
      timestamp: new Date().toISOString()
    };
    ticket.messages = [...(ticket.messages || []), newMessage];
    return { ...ticket };
  }
};

export default ticketService;