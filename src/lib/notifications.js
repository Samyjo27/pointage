// Simple notifications store in localStorage

const STORAGE_KEY = 'tt_notifications';

const readAll = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
};

const writeAll = (list) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
};

export const addNotification = ({ title, description, route = '/', emoji = '', toUserId = null, meta = {} }) => {
  const list = readAll();
  const item = {
    id: Date.now(),
    title: `${emoji ? emoji + ' ' : ''}${title}`,
    description,
    route,
    toUserId,
    meta,
    time: new Date().toISOString(),
    read: false
  };
  list.unshift(item);
  writeAll(list);
  return item;
};

export const getNotificationsFor = (userId) => {
  const list = readAll();
  return list.filter(n => !n.toUserId || String(n.toUserId) === String(userId));
};

export const markAsRead = (id) => {
  const list = readAll();
  const next = list.map(n => n.id === id ? { ...n, read: true } : n);
  writeAll(next);
};


