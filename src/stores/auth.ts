import { defineStore } from 'pinia';
import { api } from 'boot/axios';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  token: string;
  user: User | null;
}

interface JwtPayload {
  sub: string;
  email: string;
  // Añade aquí otros campos que esperas en tu token JWT
}

function decodeJwt(token: string): JwtPayload | null {
  try {
    return JSON.parse(atob(token.split('.')[1])) as JwtPayload;
  } catch (e) {
    console.error('Error decoding JWT', e);
    return null;
  }
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: localStorage.getItem('token') || '',
    user: null,
  }),

  getters: {
    isAuthenticated: (state): boolean => !!state.token,
  },

  actions: {
    async login(email: string, password: string): Promise<boolean> {
      try {
        const response = await api.post<{ access_token: string }>(
          '/auth/login',
          { email, password }
        );
        const { access_token } = response.data;
        this.token = access_token;
        localStorage.setItem('token', access_token);

        const decoded = decodeJwt(access_token);
        if (decoded) {
          this.user = {
            id: decoded.sub,
            email: decoded.email,
            name: decoded.email.split('@')[0], // Asumiendo que el nombre es la parte antes del @
          };
        }

        api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        return true;
      } catch (error) {
        console.error('Login error:', error);
        return false;
      }
    },

    logout(): void {
      this.token = '';
      this.user = null;
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
    },
  },
});
