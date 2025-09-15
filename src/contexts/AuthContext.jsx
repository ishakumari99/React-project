import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, isAuthenticated: true, user: action.payload };
    case 'LOGOUT':
      return { ...state, isAuthenticated: false, user: null };
    case 'UPDATE_USER':
      return { ...state, user: { ...state.user, ...action.payload } };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [storedUser, setStoredUser] = useLocalStorage('user', null);
  const [state, dispatch] = useReducer(authReducer, {
    isAuthenticated: !!storedUser,
    user: storedUser
  });

  useEffect(() => {
    if (storedUser) {
      dispatch({ type: 'LOGIN', payload: storedUser });
    }
  }, [storedUser]);

  const login = (userData) => {
    // userData should include at least { id, name, email, token }
    setStoredUser(userData);
    dispatch({ type: 'LOGIN', payload: userData });
  };

  const logout = () => {
    setStoredUser(null);
    dispatch({ type: 'LOGOUT' });
  };

  const updateUser = (updates) => {
    const updatedUser = { ...state.user, ...updates };
    setStoredUser(updatedUser);
    dispatch({ type: 'UPDATE_USER', payload: updates });
  };

  const value = {
    ...state,
    login,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
