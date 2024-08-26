'use client';

import { useEffect, useState } from 'react';
import authUtils from '../utils/auth';
import { useTranslation } from 'react-i18next';
import { t } from 'i18next';
import React from 'react';
import { useParams } from 'react-router-dom';

const ProStatus = () => {
  const [isPro, setIsPro] = useState<boolean | null>(null);

  const { lang } = useParams<{ lang: string }>();
const { i18n } = useTranslation();
React.useEffect(() => {
  if (lang && i18n.language !== lang) {
    i18n.changeLanguage(lang);
  }
}, [lang, i18n]);

  useEffect(() => {
    authUtils.useSession().then((session) => {
      setIsPro(session.is_pro);
    });
  }, []);

  if (isPro === null) {
    return <div className="text-center text-gray-500">{t('ProStatus.loading')}</div>;
  }

  return (
    <div className="p-6 bg-secondaryLight rounded-lg shadow-lg text-center">
      {isPro ? (
        <div>
          <p className="text-primary text-xl font-semibold mb-4">{t('ProStatus.proUser')}</p>

          <a href="https://stripe.com/manage-account" className="inline-block px-4 py-2 bg-primary text-white rounded hover:bg-primaryDark transition">
            {t('ProStatus.manageAccount')}
          </a>
        </div>
      ) : (
        <div>
          <p className="text-secondaryDark text-xl font-semibold mb-4">{t('ProStatus.notProUser')}</p>

          <a href="/" className="inline-block px-4 py-2 bg-secondary text-white rounded hover:bg-secondaryDark transition">
            {t('ProStatus.unlockAnalytics')}
          </a>
        </div>
      )}
    </div>
  );
};

export default ProStatus;
