'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  users: User[];
  login: (email: string, password: string) => { success: boolean; error?: string };
  signup: (
    name: string,
    email: string,
    phone: string,
    password: string
  ) => { success: boolean; error?: string };
  logout: () => void;
  updateUser: (data: Partial<Pick<User, 'name' | 'phone'>>) => void;
}

const ADMIN_SEED: User = {
  id: 'admin-1',
  name: 'Admin',
  email: 'admin@turfbook.com',
  phone: '9999999999',
  password: 'admin123',
  isAdmin: true,
  createdAt: new Date().toISOString(),
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      users: [ADMIN_SEED],

      login: (email, password) => {
        const { users } = get();
        const found = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
        if (found) {
          set({ user: found });
          return { success: true };
        }
        return { success: false, error: 'Invalid email or password' };
      },

      signup: (name, email, phone, password) => {
        const { users } = get();
        if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
          return { success: false, error: 'An account with this email already exists' };
        }
        const newUser: User = {
          id: `user-${Date.now()}`,
          name,
          email,
          phone,
          password,
          isAdmin: false,
          createdAt: new Date().toISOString(),
        };
        set({ users: [...users, newUser], user: newUser });
        return { success: true };
      },

      logout: () => set({ user: null }),

      updateUser: data => {
        const { user, users } = get();
        if (!user) return;
        const updated = { ...user, ...data };
        set({
          user: updated,
          users: users.map(u => (u.id === updated.id ? updated : u)),
        });
      },
    }),
    { name: 'turf-auth-store' }
  )
);
