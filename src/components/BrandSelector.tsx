import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Brand } from './models/brands';
import { API_URL } from '../config';
import { useParams } from 'react-router-dom';

interface BrandSelectorProps {
  onSelect: (brand: Brand) => void;
}

const BrandSelector: React.FC<BrandSelectorProps> = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [brands, setBrands] = useState<Brand[]>([]);
  // const [loading, setLoading] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const menuRef = useRef<HTMLUListElement>(null);


  const { lang } = useParams<{ lang: string }>();
  const { i18n,t } = useTranslation();
  React.useEffect(() => {
    if (lang && i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);


  useEffect(() => {
    if (query) {
      const fetchBrands = async () => {
    //    setLoading(true);
        try {
          const response = await axios.post(
            `${API_URL}/api/search_brand`, 
            { query }
          );
          setBrands(response.data);
        } catch (error) {
          console.error('Error fetching brands:', error);
        } finally {
    //      setLoading(false);
        }
      };

      fetchBrands();
    }
  }, [query]);

  const handleBrandClick = (brand: Brand) => {
    setSelectedBrand(brand);
    setQuery('');
    setBrands([]);
    onSelect(brand);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setBrands([]);
    }
  };

  const handleRemoveSelectedBrand = () => {
    setSelectedBrand(null);
    onSelect(null as any); // Assuming onSelect can handle null or modify as needed
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="p-4 relative">
      <h1 className="text-2xl mb-4">{t('BrandSelector.select_brand')}</h1>
      <div className="flex items-center mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('BrandSelector.search_placeholder')} 
          className="border p-2 rounded"
        />
        {selectedBrand && (
          <div className="ml-4 p-2 border rounded bg-gray-100 flex items-center">
            {selectedBrand.name}
            <button
              onClick={handleRemoveSelectedBrand}
              className="ml-2 "
            >
              &times;
            </button>
          </div>
        )}
      </div>
      {/* {loading && <p>{t('BrandSelector.loading')}</p>} */}
      {brands.length > 0 && (
        <ul ref={menuRef} className="absolute border rounded mt-2 bg-white  z-10 w-max">
          {brands.map((brand) => (
            <li
              key={brand._id}
              className="p-2 cursor-pointer hover:bg-gray-200"
              onClick={() => handleBrandClick(brand)}
            >
              {brand.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BrandSelector;
