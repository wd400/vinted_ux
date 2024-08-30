'use client';

import Sidebar from './components/Sidebar';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { API_URL } from './config';

interface MostExpensiveBrand {
  brand: string;
  quantity: number;
  averagePrice: number;
}

const MostExpensiveBrands = () => {
  const [mostExpensiveBrands, setMostExpensiveBrands] = useState<MostExpensiveBrand[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<MostExpensiveBrand | null>(null);
  const [latestItems, setLatestItems] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarLoading, setIsSidebarLoading] = useState(false);
 // const sidebarRef = useRef<HTMLDivElement>(null);

  const { lang } = useParams<{ lang: string }>();
  const { i18n, t } = useTranslation();

  useEffect(() => {
    if (lang && i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  useEffect(() => {
    const fetchMostExpensiveBrands = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          API_URL + '/api/most_expensive_brands',
          {
            withCredentials: true,
          }
        );
        setMostExpensiveBrands(response.data);
      } catch (error) {
        console.error('Error fetching most expensive brands:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMostExpensiveBrands();
  }, []);

  const handleBrandClick = async (brand: MostExpensiveBrand) => {
    if (selectedBrand === brand) {
      setSelectedBrand(null);
      setLatestItems([]);
      setSidebarOpen(false);
    } else {
      setSelectedBrand(brand);
      setIsSidebarLoading(true);
      try {
        const response = await axios.post(API_URL + `/api/latest_items`, {
          brand: brand.brand,
        },
          {
            withCredentials: true,
          }
      );
        setLatestItems(response.data);
      } catch (error) {
        console.error('Error fetching latest items:', error);
      } finally {
        setIsSidebarLoading(false);
        setSidebarOpen(true);
      }
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col lg:flex-row">
      <div className="flex-grow lg:max-w-4xl xl:max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-primaryDark mb-6">
          {t('mostExpensiveBrands.title')}
        </h1>
        <p className="text-sm text-gray-600 mb-4">
          {t('mostExpensiveBrands.description')}
        </p>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2">{t('mostExpensiveBrands.brand')}</th>
                <th className="py-2">{t('mostExpensiveBrands.averagePrice')}</th>
                <th className="py-2">{t('mostExpensiveBrands.quantity')}</th>
              </tr>
            </thead>
            <tbody>
              {mostExpensiveBrands.map((brand) => (
                <tr
                  key={brand.brand}
                  onClick={() => handleBrandClick(brand)}
                  className="cursor-pointer transform transition duration-300 hover:bg-gray-100 hover:scale-105"
                >
                  <td className="border px-4 py-2">{brand.brand}</td>
                  <td className="border px-4 py-2">
                    
                    {brand.averagePrice.toFixed(2)}</td>
                  <td className="border px-4 py-2">{brand.quantity}</td>
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
        title={
          selectedBrand
            ? `${t('sidebar.latestItemsFor')} ${selectedBrand.brand}`
            : t('sidebar.latestItems')
        }
        subtitle=""
      />
    </div>
  );
};

export default MostExpensiveBrands;
