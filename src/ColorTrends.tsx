'use client';
import axios from 'axios';
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';

import { API_URL } from './config';
import { t } from 'i18next';
import { useParams } from 'react-router-dom';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface DataItem {
  _id: {
    color: string | null;
    sold_week: number;
    sold_year: number;
  };
  count: number;
  color: string | null;
  sold_week: number;
  sold_year: number;
}

let colorsCache: Record<string, { title: string, hex: string }> = {};

export const fetchColors = async (lang:string): Promise<Record<string, { title: string, hex: string }>> => {
  if (colorsCache && Object.keys(colorsCache).length) {
    return colorsCache;
  }

  // https://www.vinted.fr/api/v2/colors
  return fetch(`/${lang}/colors.json`)
    .then((response) => response.json())
    .then((colors) => {
      colorsCache = colors.colors.reduce(
        (
          acc: Record<string, { title: string, hex: string }>,
          color: { id: number; hex: string; title: string }
        ) => {
          acc[color.id] = {
            hex: color.hex,
            title: color.title,
          };
          return acc;
        },
        {}
      );

      return colorsCache;
    });
};

const ColorTrends: React.FC = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [colors, setColors] = useState<Record<string, { title: string, hex: string }>>({});
  const [aggregationType, setAggregationType] = useState<string>('week');

  const { lang } = useParams<{ lang: string }>();
const { i18n } = useTranslation();
React.useEffect(() => {
  if (lang && i18n.language !== lang) {
    i18n.changeLanguage(lang);
  }
}, [lang, i18n]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [colorsResponse, dataResponse] = await Promise.all([
          fetchColors(lang||'en'),
          axios.post(API_URL + '/api/popular_colors', { aggregateBy: aggregationType }),
        ]);
        //order data by sold_week (integer)
        dataResponse.data.sort((a: DataItem, b: DataItem) => a.sold_week - b.sold_week);
        setData(dataResponse.data);
        setColors(colorsResponse);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [aggregationType,lang]);

  const groupedData = data.reduce((acc, item) => {
    const color = item.color || 'Unknown';
    if (!acc[color]) {
      acc[color] = [];
    }
    acc[color].push(item);
    return acc;
  }, {} as Record<string, DataItem[]>);

  const chartData = {
    labels: Array.from(new Set(data.map((item) => item.sold_week))),
    datasets: Object.keys(groupedData).map((color) => ({
      label: colors[color]?.title || color,
      data: groupedData[color].map((item) => item.count),
      fill: false,
      borderColor: ('#' + colors[color].hex) || '#000000', // Default to black if color not found
      backgroundColor: ('#' + colors[color].hex) || '#000000', // Default to black if color not found
    })),
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: t('ColorTrends.title'),
      },
    },
  };

  return (
    <div className="w-full lg:w-1/2 p-6 mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        {t('ColorTrends.dashboardTitle')}
      </h2>
      <div className="mb-6">
        <label className="block mb-2 text-lg font-medium text-gray-700">
          {t('ColorTrends.aggregationType')}:
          <select
            className="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            value={aggregationType}
            onChange={(e) => setAggregationType(e.target.value)}
          >
            <option value="week">{t('ColorTrends.week')}</option>
            <option value="month">{t('ColorTrends.month')}</option>
          </select>
        </label>
      </div>
      <div className="p-4 bg-gray-50 rounded-lg shadow-inner">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default ColorTrends;
