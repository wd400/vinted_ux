'use client';

import React from 'react';
import ProStatus from './components/ProStatus';
import { useTranslation } from 'react-i18next';
import { t } from 'i18next';
import { useParams } from 'react-router-dom';

const MePage = () => {
  
  const { lang } = useParams<{ lang: string }>();
const { i18n } = useTranslation();
React.useEffect(() => {
  if (lang && i18n.language !== lang) {
    i18n.changeLanguage(lang);
  }
}, [lang, i18n]);




  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{t('AccountPage.title')}</h1>
      <ProStatus />
    </div>
  );
};

export default MePage;


