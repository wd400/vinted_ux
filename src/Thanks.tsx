'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

const ThanksPage: React.FC = () => {
  const { t } = useTranslation();

//   "ThanksPage.title": "¡Bravo, su cuenta está en proceso de activación!",
// "ThanksPage.subtitle": "Recibirá un correo electrónico de activación en breve.",
// "ThanksPage.whatsapp": "Para obtener asistencia, contáctenos directamente en WhatsApp:", https://wa.me/message/PRUIVUOAEI2ZG1
// "ThanksPage.cta": "Volver a la página de inicio",


  return (
    <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">{t('ThanksPage.title')}</h1>
        <p>{t('ThanksPage.subtitle')}</p>
         <a href="https://wa.me/message/PRUIVUOAEI2ZG1">{t('ThanksPage.whatsapp')} </a>
        <a href="/" className="inline-block px-4 py-2 bg-primary text-white rounded hover:bg-primaryDark transition mt-4">{t('ThanksPage.cta')}</a>
        

    </div>
  );
};

export default ThanksPage;