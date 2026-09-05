import React, { createContext, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  loginThunk,
  registerThunk,
  fetchMeThunk,
  switchRoleDemoThunk,
  logout
} from '../store/slices/authSlice';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { user, token, role, isAuthenticated, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchMeThunk());
  }, [dispatch]);

  const login = async (email, password) => {
    return await dispatch(loginThunk({ email, password })).unwrap();
  };

  const register = async (name, email, password, role, companyName) => {
    return await dispatch(registerThunk({ name, email, password, role, companyName })).unwrap();
  };

  const logoutUser = () => {
    dispatch(logout());
  };

  const switchDemoRole = async (targetRole) => {
    const result = await dispatch(switchRoleDemoThunk(targetRole)).unwrap();
    return result.user;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role: role || user?.role || '',
        isAuthenticated,
        loading,
        error,
        login,
        register,
        logout: logoutUser,
        switchDemoRole,
      }}
    >
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
