'use client';

import AnnounceGridDisplay from './components/AnnounceGridDisplay';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

import { ISold } from './components/models/sold';

import { API_URL } from './config';
import { useTranslation } from 'react-i18next';
import { t } from 'i18next';
import { useParams } from 'react-router-dom';

const ExpensiveProducts: React.FC = () => {
  const [products, setProducts] = useState<ISold[] | null>(null);
  const [timeFrame, setTimeFrame] = useState<string>('month');


  const { lang } = useParams<{ lang: string }>();
const { i18n } = useTranslation();
React.useEffect(() => {
  if (lang && i18n.language !== lang) {
    i18n.changeLanguage(lang);
  }
}, [lang, i18n]);

  useEffect(() => {
    axios
      .post(API_URL + '/api/expensive_products', {
        period: timeFrame,
      },
      {
        withCredentials: true,
      }
    )
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      });
  }, [timeFrame]);

  return (
    <>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">{t('ExpensiveProducts.title')}</h1>
        <div className="mb-4">
          <label htmlFor="timeFrame" className="mr-2 text-lg">
            {t('ExpensiveProducts.selectTimeFrame')}
          </label>
          <select
            id="timeFrame"
            value={timeFrame}
            onChange={(e) => setTimeFrame(e.target.value)}
            className="border p-2 bg-primary rounded hover:bg-primaryLight text-white"
          >
            <option value="week">{t('ExpensiveProducts.weekly')}</option>
            <option value="month">{t('ExpensiveProducts.monthly')}</option>
            <option value="year">{t('ExpensiveProducts.yearly')}</option>
          </select>
        </div>
      </div>
      {products && <AnnounceGridDisplay announces={products} />}
    </>
  );
};

export default ExpensiveProducts;
