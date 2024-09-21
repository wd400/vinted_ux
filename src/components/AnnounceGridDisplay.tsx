'use client';
import { ISold } from './models/sold';
import React from 'react';
import ImageGallery from './ImageGallery';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

interface AnnounceGridDisplayProps {
  announces: ISold[] | null;
}

const AnnounceGridDisplay: React.FC<AnnounceGridDisplayProps> = ({ announces }) => {

  const { lang } = useParams<{ lang: string }>();
  const { i18n,t } = useTranslation();
  React.useEffect(() => {
    if (lang && i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {announces && announces.map((announce, index) => (
          <div key={index} className="border p-4 rounded shadow">
            <h3 className="text-xl font-bold">{announce.title} <a href={announce.url} target="_blank" rel="noreferrer">
            ↗️
            </a></h3>
            
            <p className="text-gray-500">
              {announce.price.amount} {announce.price.currency_code}
            </p>
            <p>
              {announce.description.split('\n').map((line, index) => (
                <span key={index}>
                  {line}
                  <br />
                </span>
              ))}
            </p>
            <ImageGallery images={announce.photos} />
          </div>
        ))}
      </div>
      {announces && announces.length === 0 && (
        <p className="text-center">{t('AnnounceGridDisplay.no_announces')}</p>
      )}
    </>
  );
};

export default AnnounceGridDisplay;
