'use client';

import AnnounceGrid from './components/AnnounceGrid';
import BrandSelector from './components/BrandSelector';
import CatalogSelector from './components/CategorySelector';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Brand } from './components/models/brands';

const TopAnnounces: React.FC = () => {
  const { t } = useTranslation(); // Using the i18n hook for translation
  const [selectedCatalogId, setSelectedCatalogId] = useState<number | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);

  const handleBrandSelect = (brand: Brand) => {
    setSelectedBrand(brand);
    // Fetch data or perform actions based on the selected brand
  };

  const handleCatalogSelect = (catalogId: number | null) => {
    setSelectedCatalogId(catalogId);
    // Do something with the selected catalog ID
  };

  return (
    <div>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">{t('TopAnnounces.title')}</h1>
        <BrandSelector onSelect={handleBrandSelect} />
        <CatalogSelector onCatalogSelect={handleCatalogSelect} />
      </div>

      <AnnounceGrid catalogId={selectedCatalogId} brandId={selectedBrand ? selectedBrand._id : null} />
    </div>
  );
};

export default TopAnnounces;





