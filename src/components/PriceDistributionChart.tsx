'use client';

import axios from 'axios';
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js';
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';

import { API_URL } from '../config';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface PriceDistributionChartProps {
  brandId: number | null;
  catalogId: number | null;
  onBarClick: (minPrice: number, maxPrice: number) => void;
}

const PriceDistributionChart: React.FC<PriceDistributionChartProps> = ({ brandId, catalogId, onBarClick }) => {
  const { t } = useTranslation(); // Use the translation hook
  const [histogramData, setHistogramData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchPriceDistribution = async () => {
      setIsLoading(true);
      try {
        const response = await axios.post(API_URL + '/api/price_distribution', { brandId, catalogId },      {
          withCredentials: true,
        });
        const data = response.data;
        setData(data);

        const labels = data.map((bucket: any) => bucket._id.min + '-' + bucket._id.max);
        const counts = data.map((bucket: any) => bucket.count);

        setHistogramData({
          labels,
          datasets: [
            {
              label: t('PriceDistributionChart.quantity'), // Use translation for 'Quantity'
              data: counts,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching price distribution:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPriceDistribution();
  }, [brandId, catalogId, t]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: t('PriceDistributionChart.priceDistributionTitle'), // Use translation for the chart title
      },
    },
    onClick: (event: any, elements: string | any[]) => {
      if (elements.length > 0) {
        const elementIndex = elements[0].index;
        const minPrice = data[elementIndex]._id.min;
        const maxPrice = data[elementIndex]._id.max;
        onBarClick(minPrice, maxPrice);
      }
    },
  };

  return (
    <div style={{ height: '300px' }} className="flex items-center justify-center">
      {histogramData && histogramData.datasets[0].data.length > 0 && (
        <Bar data={histogramData} options={options} />
      )}
      {!isLoading && histogramData && histogramData.datasets[0].data.length === 0 && (
        <p className="text-center text-gray-500">
          {t('PriceDistributionChart.notEnoughData')} {/* Use translation for no data message */}
        </p>
      )}
    </div>
  );
};

export default PriceDistributionChart;
