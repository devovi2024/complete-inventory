import { create } from 'zustand';
import { io } from 'socket.io-client';

const saved = JSON.parse(localStorage.getItem('factory_notifications') || '[]');

export const useNotifications = create((set, get) => ({
  items: saved,
  
  add: item => {
    const next = [
      { id: crypto.randomUUID(), read: false, createdAt: new Date().toISOString(), type: 'info', ...item },
      ...get().items
    ].slice(0, 100);
    localStorage.setItem('factory_notifications', JSON.stringify(next));
    set({ items: next });
  },
  
  markRead: id => {
    const next = get().items.map(item =>
      item.id === id ? { ...item, read: true } : item
    );
    localStorage.setItem('factory_notifications', JSON.stringify(next));
    set({ items: next });
  },
  
  markAllRead: () => {
    const next = get().items.map(item => ({ ...item, read: true }));
    localStorage.setItem('factory_notifications', JSON.stringify(next));
    set({ items: next });
  }
}));

let socket;

export function connectNotifications() {
  if (socket || !localStorage.getItem('factory_token')) return;
  
  socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
    auth: { token: localStorage.getItem('factory_token') }
  });
  
  socket.on('notification', item => useNotifications.getState().add(item));
  socket.on('connect_error', () => {});
  
  return () => {
    socket?.disconnect();
    socket = null;
  };
}