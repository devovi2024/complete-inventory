import { create } from 'zustand';
import { get, post, put } from './api';

export const useStore = create((set, getState) => ({
  user: JSON.parse(localStorage.getItem('factory_user') || 'null'),
  theme: localStorage.getItem('factory_theme') || 'light',
  data: {},
  loading: false,
  error: '',
  toast: '',

  setTheme: theme => {
    localStorage.setItem('factory_theme', theme);
    set({ theme });
  },

  logout: async () => {
    const refreshToken = localStorage.getItem('factory_refresh_token');
    if (refreshToken) await post('/auth/logout', { refreshToken }).catch(() => {});
    localStorage.removeItem('factory_token');
    localStorage.removeItem('factory_refresh_token');
    localStorage.removeItem('factory_user');
    set({ user: null });
  },

  setToast: toast => {
    set({ toast });
    setTimeout(() => set({ toast: '' }), 3000);
  },

  login: async credentials => {
    const result = await post('/auth/login', credentials);
    localStorage.setItem('factory_token', result.token);
    localStorage.setItem('factory_refresh_token', result.refreshToken);
    localStorage.setItem('factory_user', JSON.stringify(result.user));
    set({ user: result.user });
  },

  register: async credentials => {
    const result = await post('/auth/register', credentials);
    localStorage.setItem('factory_token', result.token);
    localStorage.setItem('factory_refresh_token', result.refreshToken);
    localStorage.setItem('factory_user', JSON.stringify(result.user));
    set({ user: result.user });
  },

  refresh: async () => {
    const result = await post('/auth/refresh', {
      refreshToken: localStorage.getItem('factory_refresh_token')
    });
    localStorage.setItem('factory_token', result.token);
    localStorage.setItem('factory_refresh_token', result.refreshToken);
    localStorage.setItem('factory_user', JSON.stringify(result.user));
    set({ user: result.user });
    return result.token;
  },

  load: async (key, path) => {
    set({ loading: true, error: '' });
    try {
      const result = await get(path);
      set(state => ({
        data: { ...state.data, [key]: result.data },
        loading: false
      }));
      return result.data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  create: async (key, path, payload) => {
    const result = await post(path, payload);
    set(state => ({
      data: {
        ...state.data,
        [key]: [result.data, ...(state.data[key] || [])]
      }
    }));
    return result.data;
  },

  update: async (key, path, payload) => {
    const result = await put(path, payload);
    set(state => ({
      data: {
        ...state.data,
        [key]: (state.data[key] || []).map(item =>
          item._id === result.data._id ? result.data : item
        )
      }
    }));
    return result.data;
  }
}));