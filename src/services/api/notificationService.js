import notificationsData from '../mockData/notifications.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let notifications = [...notificationsData];
let nextId = Math.max(...notifications.map(n => n.Id), 0) + 1;

const notificationService = {
  async getAll() {
    await delay(300);
    return [...notifications].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  },

  async getById(id) {
    await delay(200);
    const notification = notifications.find(n => n.Id === parseInt(id, 10));
    if (!notification) {
      throw new Error('Notificación no encontrada');
    }
    return { ...notification };
  },

  async create(notificationData) {
    await delay(400);
    const newNotification = {
      ...notificationData,
      Id: nextId++,
      timestamp: notificationData.timestamp || new Date().toISOString(),
      status: notificationData.status || 'sent'
    };
    notifications.push(newNotification);
    return { ...newNotification };
  },

  async update(id, notificationData) {
    await delay(350);
    const index = notifications.findIndex(n => n.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Notificación no encontrada');
    }
    const updatedNotification = { ...notifications[index], ...notificationData };
    notifications[index] = updatedNotification;
    return { ...updatedNotification };
  },

  async delete(id) {
    await delay(250);
    const index = notifications.findIndex(n => n.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Notificación no encontrada');
    }
    notifications.splice(index, 1);
    return true;
  }
};

export default notificationService;