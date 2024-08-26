'use client';
import Sidebar from './components/Sidebar';
import { Performer } from './components/models/top_performers';
import axios from 'axios';
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js';
import { useEffect, useRef, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';
import { API_URL } from './config';
import { t } from 'i18next';
import React from 'react';
import { useParams } from 'react-router-dom';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TopPerformers = () => {
  const [performersData, setPerformersData] = useState<Performer[]>([]);
  const [days, setDays] = useState(30);
  const [orderBy, setOrderBy] = useState('sum_price');
  const [selectedPerformer, setSelectedPerformer] = useState<Performer | null>(null);
  const [latestItems, setLatestItems] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarLoading, setIsSidebarLoading] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const { lang } = useParams<{ lang: string }>();
const { i18n } = useTranslation();
React.useEffect(() => {
  if (lang && i18n.language !== lang) {
    i18n.changeLanguage(lang);
  }
}, [lang, i18n]);

  useEffect(() => {

    const fetchTopPerformers = async () => {
      setIsLoading(true);
      try {
        const response = await axios.post(
          API_URL + '/api/top_performers',
          { days, orderBy }
        );
        setPerformersData(response.data);
      } catch (error) {
        console.error('Error fetching top performers:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopPerformers();
  }, [days, orderBy]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);



  const fetchLatestItemsSold = async (performer: Performer) => {
    setIsSidebarLoading(true);
    try {
      const response = await axios.post(
        API_URL + '/api/latest_items',
        { userId: performer._id.user_id }
      );
      setLatestItems(response.data);
    } catch (error) {
      console.error('Error fetching latest items sold:', error);
    } finally {
      setIsSidebarLoading(false);
    }
  };

  const handlePerformerClick = (performer: Performer) => {
    if (selectedPerformer === performer) {
      setSelectedPerformer(null);
      setLatestItems([]);
      setSidebarOpen(false);
    } else {
      setSelectedPerformer(performer);
      fetchLatestItemsSold(performer);
      setSidebarOpen(true);
    }
  };

  const getChartData = () => {
    const top10 = performersData.slice(0, 10);
    return {
      labels: top10.map(item => item._id.user_login || t('TopPerformers.unknownUser')),
      datasets: [
        {
          label: orderBy === 'sum_price' ? t('TopPerformers.totalPrice') : t('TopPerformers.totalSold'),
          data: top10.map(item => (orderBy === 'sum_price' ? item.sum_price : item.total_sold)),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: t(`TopPerformers.chartTitle`, { orderBy: orderBy === 'sum_price' ? t('TopPerformers.totalPrice') : t('TopPerformers.totalSold') }),
      },
    },
    onClick: (_: any, elements: string | any[]) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        handlePerformerClick(performersData[index]);
      }
    },
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col lg:flex-row">
      <div className="flex-grow lg:max-w-4xl xl:max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-primaryDark mb-6">
          {t('TopPerformers.title')}
        </h1>
        
        <div className="mb-6 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="bg-white border border-primary text-primaryDark rounded-md px-4 py-2"
          >
            <option value={3}>{t('TopPerformers.last3Days')}</option>
            <option value={30}>{t('TopPerformers.last30Days')}</option>
          </select>
          
          <select
            value={orderBy}
            onChange={(e) => setOrderBy(e.target.value)}
            className="bg-white border border-primary text-primaryDark rounded-md px-4 py-2"
          >
            <option value="sum_price">{t('TopPerformers.orderByTotalPrice')}</option>
            <option value="total_sold">{t('TopPerformers.orderByTotalSold')}</option>
          </select>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="mb-8 bg-white rounded-lg shadow-md overflow-hidden p-6 w-full" style={{ height: '400px' }}>
              <Bar data={getChartData()} options={chartOptions} />
            </div>
            <div className="space-y-4">
              {performersData.map((performer, index) => (
                <div key={index} className="bg-secondaryLight rounded-lg shadow-md overflow-hidden">
                  <div
                    className="p-6 cursor-pointer"
                    onClick={() => handlePerformerClick(performer)}
                  >
                    <h2 className="text-xl font-semibold text-primaryDark mb-4">
                      {performer._id.user_login || t('TopPerformers.unknownUser')}
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">{t('TopPerformers.totalPrice')}</p>
                        <p className="text-lg font-bold text-primary">{performer.sum_price.toFixed(1)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">{t('TopPerformers.totalSold')}</p>
                        <p className="text-lg font-bold text-primary">{performer.total_sold}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Sidebar */}
      <Sidebar
        isSidebarLoading={isSidebarLoading}
        latestItems={latestItems}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        title={t('TopPerformers.latestSoldItems')}
        subtitle={selectedPerformer ? `${t('TopPerformers.forUser')} ${selectedPerformer._id.user_login}` : t('TopPerformers.selectPerformer')}
      />
    </div>
  );
};

export default TopPerformers;
