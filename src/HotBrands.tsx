'use client';

import Sidebar from './components/Sidebar';
import axios from 'axios';
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js';
import { useEffect,  useState } from 'react';
import { Bar } from 'react-chartjs-2';

import {API_URL} from './config';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BrandSalesData {
  brand_title: string;
  last_month_sales: number;
  average_previous_three_months_sales: number;
  sales_difference: number;
}

const HotBrands = () => {
  const { lang } = useParams<{ lang: string }>();
  const { i18n } = useTranslation();
  useEffect(() => {
    if (lang && i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  const [brandSalesData, setBrandSalesData] = useState<BrandSalesData[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<BrandSalesData | null>(null);
  const [latestItems, setLatestItems] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarLoading, setIsSidebarLoading] = useState(false);
  // const sidebarRef = useRef(null);

  async function fetchLatestItemsSold(brand: { brand_title: string }) {
    setIsSidebarLoading(true);
    try {
      const response = await axios.post(API_URL + '/api/latest_items', { brand: brand.brand_title });
      setLatestItems(response.data);
    } catch (error) {
      console.error('Error fetching latest items sold:', error);
    } finally {
      setIsSidebarLoading(false);
    }
  }

  useEffect(() => {
    if (selectedBrand) {
      fetchLatestItemsSold(selectedBrand);
    }
  }, [selectedBrand]);

  useEffect(() => {
    const fetchBrandSalesTrend = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          API_URL + '/api/brand_sales_trend',
          {
            withCredentials: true,
          });
        setBrandSalesData(response.data);
      } catch (error) {
        console.error('Error fetching brand sales trend:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrandSalesTrend();
  }, []);

  const handleBrandClick = (brand: BrandSalesData) => {
    setSelectedBrand(brand);
    setSidebarOpen(true);
  };

  const histogramData = {
    labels: brandSalesData.slice(0, 10).map((brand) => (brand.brand_title ? brand.brand_title : 'N/A')),

    datasets: [
      {
        label: i18n.t('BrandSales.lastMonthSales'),
        data: brandSalesData.slice(0, 10).map((brand) => brand.last_month_sales),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: i18n.t('BrandSales.avgPreviousThreeMonthsSales'),
        data: brandSalesData.slice(0, 10).map((brand) => brand.average_previous_three_months_sales),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
    ],
  };

  const histogramOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: i18n.t('BrandSales.histogramTitle'),
      },
    },
  };

  return (
    <>
      <div className="w-full lg:w-1/2 p-4 mx-auto">
        <h2 className="text-2xl font-bold mb-4">{i18n.t('BrandSales.trendTitle')}</h2>
        <Bar data={histogramData} options={histogramOptions} />
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <table className="min-w-full bg-white mt-4">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">{i18n.t('BrandSales.brandColumn')}</th>
                <th className="py-2 px-4 border-b">{i18n.t('BrandSales.lastMonthSalesColumn')}</th>
                <th className="py-2 px-4 border-b">{i18n.t('BrandSales.avgPreviousThreeMonthsSalesColumn')}</th>
                <th className="py-2 px-4 border-b">{i18n.t('BrandSales.salesDifferenceColumn')}</th>
              </tr>
            </thead>
            <tbody>
              {brandSalesData.map((brand, index) => (
                <tr
                  key={index}
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => handleBrandClick(brand)}
                >
                  <td className="py-2 px-4 border-b">{brand.brand_title}</td>
                  <td className="py-2 px-4 border-b">{brand.last_month_sales}</td>
                  <td className="py-2 px-4 border-b">{brand.average_previous_three_months_sales.toFixed(0)}</td>
                  <td className="py-2 px-4 border-b">{brand.sales_difference.toFixed(0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Sidebar
        isSidebarLoading={isSidebarLoading}
        latestItems={latestItems}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        title={i18n.t('Sidebar.latestSoldItemsTitle')}
        subtitle={selectedBrand ? `${i18n.t('Sidebar.subtitleFor')} ${selectedBrand.brand_title}` : ''}
      />
    </>
  );
};

export default HotBrands;
