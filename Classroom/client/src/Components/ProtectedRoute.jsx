import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles, children }) => {
  const user = useSelector((state) => state.auth.user);

  if (!user) {
    return <Navigate to='/' />; 
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to='/' />; 
  }
  // return <Outlet />;
  return children ? children : <Outlet />;

  // return user ? <Outlet /> : <Navigate to="/" replace />;

};

export default ProtectedRoute;