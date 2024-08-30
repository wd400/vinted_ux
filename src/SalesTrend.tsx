'use client';
import Sidebar from './components/Sidebar';
import { Catalog } from './components/models/catalogs';
import SalesTrend, { SalesTrends } from './components/models/sales_trends';
import axios from 'axios';
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js';
import { useEffect, useRef, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { API_URL } from './config';
import { useTranslation } from 'react-i18next';
import { t } from 'i18next';
import React from 'react';
import { useParams } from 'react-router-dom';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SalesTrendDashboard = () => {
  const [salesData, setSalesData] = useState<SalesTrends>([]);
  const [selectedTile, setSelectedTile] = useState<SalesTrend | null>(null);
  const [latestProducts, setLatestProducts] = useState([]);
  const [days, setDays] = useState(30);
  const [groupBy, setGroupBy] = useState('product');
  const [orderBy, setOrderBy] = useState('sum_price');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMainLoading, setIsMainLoading] = useState(false);
  const [isSidebarLoading, setIsSidebarLoading] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const [categories, setCategories] = useState<Record<number, string>>({});

  const { lang } = useParams<{ lang: string }>();
const { i18n } = useTranslation();
React.useEffect(() => {
  if (lang && i18n.language !== lang) {
    i18n.changeLanguage(lang);
  }
}, [lang, i18n]);

  useEffect(() => {

    const fetchSalesTrend = async () => {
      setIsMainLoading(true);
      try {
        const response = await axios.post(
          API_URL + '/api/sales_trend',
          { days, groupBy, orderBy }
        );
        setSalesData(response.data);
      } catch (error) {
        console.error(t('SalesTrendDashboard.error_sales'), error);
      } finally {
        setIsMainLoading(false);
      }
    };

    fetchSalesTrend();
  }, [days, groupBy, orderBy]);


  useEffect(() => {
    const fetchCategories = async (lang:string) => {
      try {
        //https://www.vinted.com/api/v2/catalogs
        const response = await axios.get(`/${lang}/catalogs.json`);
        const data: Record<number, string> = {};
        const getCategories = (catalogs: Catalog[], path: string[] = []) => {
          catalogs.forEach(catalog => {
            data[catalog.id] = path.concat(catalog.title).join('/');
            if (catalog.catalogs) {
              getCategories(catalog.catalogs, path.concat(catalog.title));
            }
          });
        };
        getCategories(response.data.catalogs);
        setCategories(data);
      } catch (error) {
        console.error(t('SalesTrendDashboard.error_categories'), error);
      }
    };
    fetchCategories(lang||'en');
  }, [

    lang
  ]);

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



  const fetchLatestProducts = async (tile: SalesTrend) => {
    setIsSidebarLoading(true);
    try {
      const response = await axios.post(
        API_URL + '/api/latest_items',
        {
          days,
          brand: tile._id.brand_title,
          category: tile._id.catalog_id,
        }
      );
      setLatestProducts(response.data);
    } catch (error) {
      console.error(t('SalesTrendDashboard.error_latest'), error);
    } finally {
      setIsSidebarLoading(false);
    }
  };

  const handleTileClick = (tile: SalesTrend) => {
    if (selectedTile === tile) {
      setSelectedTile(null);
      setLatestProducts([]);
      setSidebarOpen(false);
    } else {
      setSelectedTile(tile);
      fetchLatestProducts(tile);
      setSidebarOpen(true);
    }
  };

  const getChartData = () => {
    const top10 = salesData.slice(0, 20);
    return {
      labels: Array.from({ length: 20 }, (_, i) => i + 1),
      datasets: [
        {
          label: orderBy === 'count' ? t('SalesTrendDashboard.label_count') : orderBy === 'mean_price' ? t('SalesTrendDashboard.label_mean_price') : t('SalesTrendDashboard.label_sum_price'),
          data: top10.map(item => orderBy === 'count' ? item.count : orderBy === 'mean_price' ? item.mean_price : item.sum_price),
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
      tooltip: {
        callbacks: {
          label: function (tooltipItem: any) {
            let s = "";
            if (groupBy === 'product') {
              const tile = salesData[tooltipItem.dataIndex];
              s += `${tile._id.brand_title ? tile._id.brand_title : t('SalesTrendDashboard.label_na')} / ${categories[tile._id.catalog_id]}`;
            } else if (groupBy === 'category') {
              s += `${categories[salesData[tooltipItem.dataIndex]._id.catalog_id]}`;
            } else {
              s += `${salesData[tooltipItem.dataIndex]._id.brand_title}`;
            }
            return s;
          },
        },
      },
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `${t('SalesTrendDashboard.top10')} ${groupBy === 'product' ? t('SalesTrendDashboard.products') : groupBy === 'category' ? t('SalesTrendDashboard.categories') : t('SalesTrendDashboard.brands')} ${t('SalesTrendDashboard.by')} ${orderBy === 'count' ? t('SalesTrendDashboard.count') : orderBy === 'mean_price' ? t('SalesTrendDashboard.mean_price') : t('SalesTrendDashboard.total_price')}`,
      },
    },
    onClick: (_: any, elements: any) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        handleTileClick(salesData[index]);
      }
    },
    resizeDelay: 0,
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col lg:flex-row">
      <div className="flex-grow lg:max-w-4xl xl:max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-primaryDark mb-6">
          {t('SalesTrendDashboard.title')}
        </h1>

        <div className="mb-6 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="bg-white border border-primary text-primaryDark rounded-md px-4 py-2"
          >
            <option value={3}>{t('SalesTrendDashboard.last_3_days')}</option>
            <option value={30}>{t('SalesTrendDashboard.last_30_days')}</option>
          </select>

          <select
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value)}
            className="bg-white border border-primary text-primaryDark rounded-md px-4 py-2"
          >
            <option value="product">{t('SalesTrendDashboard.group_by_product')}</option>
            <option value="category">{t('SalesTrendDashboard.group_by_category')}</option>
            <option value="brand">{t('SalesTrendDashboard.group_by_brand')}</option>
          </select>

          <select
            value={orderBy}
            onChange={(e) => setOrderBy(e.target.value)}
            className="bg-white border border-primary text-primaryDark rounded-md px-4 py-2"
          >
            <option value="count">{t('SalesTrendDashboard.order_by_count')}</option>
            <option value="mean_price">{t('SalesTrendDashboard.order_by_mean_price')}</option>
            <option value="sum_price">{t('SalesTrendDashboard.order_by_total_price')}</option>
          </select>
        </div>

        {isMainLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="mb-8 bg-white rounded-lg shadow-md overflow-hidden p-6 w-full" style={{ height: '400px' }}>
              <Bar data={getChartData()} options={chartOptions} />
            </div>
            <div className="space-y-4">
              {salesData.map((tile, index) => (
                <div key={index} className="bg-secondaryLight rounded-lg shadow-md overflow-hidden">
                  <div
                    className="p-6 cursor-pointer"
                    onClick={() => handleTileClick(tile)}
                  >
                    <h2 className="text-xl font-semibold text-primaryDark mb-4">
                      {groupBy === 'product'
                        ? `${tile._id.brand_title ? tile._id.brand_title : t('SalesTrendDashboard.label_na')}, ${categories[tile._id.catalog_id]}`
                        : groupBy === 'category'
                        ? categories[tile._id.catalog_id]
                        : tile._id.brand_title || t('SalesTrendDashboard.label_na')}
                    </h2>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">{t('SalesTrendDashboard.label_count')}</p>
                        <p className="text-lg font-bold text-primary">{tile.count}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">{t('SalesTrendDashboard.label_mean_price')}</p>
                        <p className="text-lg font-bold text-primary">
                          {tile.mean_price.toFixed(1)} €
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">{t('SalesTrendDashboard.label_sum_price')}</p>
                        <p className="text-lg font-bold text-primary">
                          {tile.sum_price.toFixed(0)} €
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">{t('SalesTrendDashboard.label_mean_sold_days')}</p>
                        <p className="text-lg font-bold text-primary">
                          {tile.mean_sold_days.toFixed(1)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <Sidebar
        isSidebarLoading={isSidebarLoading}
        latestItems={latestProducts}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        title={t('SalesTrendDashboard.sidebar_title')}
        subtitle={selectedTile ? `${selectedTile._id.brand_title ? `${selectedTile._id.brand_title}, ` : ''} ${categories[selectedTile._id.catalog_id]}` : t('SalesTrendDashboard.sidebar_subtitle')}
      />
    </div>
  );
};

export default SalesTrendDashboard;
