'use client';

import BrandSelector from './components/BrandSelector';
import CatalogSelector from './components/CategorySelector';
import PriceDistributionChart from './components/PriceDistributionChart';
import Sidebar from './components/Sidebar';
import axios from 'axios';
import React, { useState } from 'react';

// Define brand type
import { Brand } from './components/models/brands';
import { API_URL } from './config';
import { useTranslation } from 'react-i18next';
import { t } from 'i18next';
import { useParams } from 'react-router-dom';

const PriceEstimation: React.FC = () => {

  const [selectedCatalogId, setSelectedCatalogId] = useState<number | null>(null); // 1242
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null); // { _id: 53, name: 'Nike' }
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarData, setSidebarData] = useState([]);
  const [SidebarLoading, setSidebarLoading] = useState(false);

  const handleBrandSelect = (brand: Brand) => {
    setSelectedBrand(brand);
  };

  const { lang } = useParams<{ lang: string }>();
const { i18n } = useTranslation();
React.useEffect(() => {
  if (lang && i18n.language !== lang) {
    i18n.changeLanguage(lang);
  }
}, [lang, i18n]);

  const handleCatalogSelect = (catalogId: number | null) => {
    setSelectedCatalogId(catalogId);
  };

  const handleBarClick = (minPrice: number, maxPrice: number) => {
    setSidebarLoading(true);
    setSidebarOpen(true);
    axios
      .post(API_URL + '/api/latest_items', {
        brandId: selectedBrand ? selectedBrand._id : undefined,
        category: selectedCatalogId ? selectedCatalogId : undefined,
        priceMin: minPrice,
        priceMax: maxPrice,
        days: 180,
      })
      .then((response) => {
        setSidebarData(response.data);
        setSidebarOpen(true);
      })
      .catch((error) => {
        console.error('Error fetching latest items:', error);
      })
      .finally(() => {
        setSidebarLoading(false);
      });
  };

  return (
    <div className="container justify-center mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{t('PriceEstimation.title')}</h1>

  

    
    <div className="flex flex-row justify-between">
<BrandSelector onSelect={handleBrandSelect} />
</div>

      <PriceDistributionChart
        catalogId={selectedCatalogId}
        brandId={selectedBrand ? selectedBrand._id : null}
        onBarClick={handleBarClick}
      />

<div className="flex flex-row justify-between">


<CatalogSelector onCatalogSelect={handleCatalogSelect} />

      
    </div>

      <Sidebar
        isSidebarLoading={SidebarLoading}
        latestItems={sidebarData}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        title={t('PriceEstimation.sidebarTitle')}
        subtitle=""
      />
    </div>
  );
};

export default PriceEstimation;
