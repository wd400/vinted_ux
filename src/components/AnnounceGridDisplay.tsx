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
            <h3 className="text-xl font-bold">{announce.title}</h3>
            <a href={announce.url} target="_blank" rel="noreferrer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 inline-block"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 4a6 6 0 1110.36 3.64l-1.5-1.5A4 4 0 1010 6h2a6 6 0 01-4 10.36l-1.5-1.5A4 4 0 018 8V6h2z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
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
