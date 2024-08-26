// src/RedirectLang.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const RedirectLang: React.FC = () => {
  const lang = localStorage.getItem('locale') || 'en';
  return <Navigate to={`/${lang}`} />;
};

export default RedirectLang;