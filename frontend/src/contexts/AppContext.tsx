'use client';

import { createContext, useContext, useReducer, ReactNode } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  preferences?: Record<string, any>;
}

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  theme: 'light' | 'dark';
  notifications: any[];
  categories: string[];
  locations: string[];
}

type Action =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'ADD_NOTIFICATION'; payload: any }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'SET_CATEGORIES'; payload: string[] }
  | { type: 'SET_LOCATIONS'; payload: string[] };

const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  theme: 'light',
  notifications: [],
  categories: [],
  locations: [],
};

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
      };
    case 'SET_THEME':
      return {
        ...state,
        theme: action.payload,
      };
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter((n) => n.id !== action.payload),
      };
    case 'SET_CATEGORIES':
      return {
        ...state,
        categories: action.payload,
      };
    case 'SET_LOCATIONS':
      return {
        ...state,
        locations: action.payload,
      };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => null,
});

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

// Utility hooks for specific state slices
export function useUser() {
  const { state, dispatch } = useApp();
  return {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    setUser: (user: User | null) => dispatch({ type: 'SET_USER', payload: user }),
  };
}

export function useTheme() {
  const { state, dispatch } = useApp();
  return {
    theme: state.theme,
    setTheme: (theme: 'light' | 'dark') =>
      dispatch({ type: 'SET_THEME', payload: theme }),
  };
}

export function useNotifications() {
  const { state, dispatch } = useApp();
  return {
    notifications: state.notifications,
    addNotification: (notification: any) =>
      dispatch({ type: 'ADD_NOTIFICATION', payload: notification }),
    removeNotification: (id: string) =>
      dispatch({ type: 'REMOVE_NOTIFICATION', payload: id }),
  };
}

export function useCategories() {
  const { state, dispatch } = useApp();
  return {
    categories: state.categories,
    setCategories: (categories: string[]) =>
      dispatch({ type: 'SET_CATEGORIES', payload: categories }),
  };
}

export function useLocations() {
  const { state, dispatch } = useApp();
  return {
    locations: state.locations,
    setLocations: (locations: string[]) =>
      dispatch({ type: 'SET_LOCATIONS', payload: locations }),
  };
}
