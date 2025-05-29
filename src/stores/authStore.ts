import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';
import { dummyUsers } from '../data/dummyData';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User>, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      error: null,

      // Login function - simulates API request
      login: async (email: string, password: string) => {
        set({ loading: true, error: null });
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Find user in dummy data
        const user = dummyUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
        
        // For demo purposes, we're accepting any password
        if (user) {
          set({ 
            user, 
            token: `dummy-token-${user.id}`,
            loading: false,
            error: null
          });
        } else {
          set({ 
            loading: false, 
            error: 'Invalid email or password' 
          });
        }
      },

      // Register function - simulates API request
      register: async (userData: Partial<User>, password: string) => {
        set({ loading: true, error: null });
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check if email already exists
        const existingUser = dummyUsers.find(
          u => u.email.toLowerCase() === userData.email?.toLowerCase()
        );
        
        if (existingUser) {
          set({ 
            loading: false, 
            error: 'Email already in use' 
          });
          return;
        }
        
        // Create new user (in a real app, this would be done on the server)
        const newUser: User = {
          id: `user-${Date.now()}`,
          name: userData.name || 'New User',
          email: userData.email || '',
          role: userData.role || 'purchaser',
          company: userData.company || 'Company Name',
          createdAt: new Date().toISOString(),
        };
        
        // In a real app, we would send this data to the server
        // For this demo, we'll just set the user
        set({ 
          user: newUser, 
          token: `dummy-token-${newUser.id}`,
          loading: false,
          error: null
        });
      },

      // Logout function
      logout: () => {
        set({ user: null, token: null, error: null });
      },

      // Check if user is authenticated
      checkAuth: () => {
        const { user, token } = get();
        if (!user || !token) {
          set({ user: null, token: null });
        }
      },

      // Clear error
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      // Only persist these keys
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token 
      }),
    }
  )
);