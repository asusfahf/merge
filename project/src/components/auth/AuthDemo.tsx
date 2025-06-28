import React, { useState } from 'react';
import { LoginPage } from './LoginPage';
import { SignupPage } from './SignupPage';
import { RoleSelectionPage } from './RoleSelectionPage';

interface AuthDemoProps {
  initialPage?: 'login' | 'signup' | 'role-selection';
}

export const AuthDemo: React.FC<AuthDemoProps> = ({ initialPage = 'login' }) => {
  const [currentPage, setCurrentPage] = useState<'login' | 'signup' | 'role-selection'>(initialPage);

  const handleClose = () => {
    // In a real app, this would navigate back to the main site
    window.location.reload();
  };

  const switchToSignup = () => {
    setCurrentPage('signup');
  };

  const switchToLogin = () => {
    setCurrentPage('login');
  };

  const switchToRoleSelection = () => {
    setCurrentPage('role-selection');
  };

  // Render Current Page
  if (currentPage === 'login') {
    return <LoginPage onClose={handleClose} onSwitchToSignup={switchToSignup} />;
  } else if (currentPage === 'signup') {
    return <SignupPage onClose={handleClose} onSwitchToLogin={switchToLogin} />;
  } else {
    return <RoleSelectionPage onClose={handleClose} />;
  }
};