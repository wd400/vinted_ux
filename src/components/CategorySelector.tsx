'use client';
import axios from 'axios';
import { t } from 'i18next';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

interface Catalog {
  id: number;
  title: string;
  photo: { url: string } | null;
  catalogs: Catalog[];
}

const CatalogSelectorHelper: React.FC<{
  catalogs: Catalog[];
  onSelect: (catalog: Catalog) => void;
}> = ({ catalogs, onSelect }) => {
  return (
    <ul className="list-none p-0 absolute z-50 bg-white shadow-lg">
      {catalogs.map((catalog) => (
        <li key={catalog.id} className="mb-2">
          <div
            onClick={() => onSelect(catalog)}
            className="cursor-pointer p-2 bg-secondaryLight text-secondaryDark rounded flex items-center hover:bg-primaryLight hover:text-primaryDark"
            style={{ width: '250px' }} // Fixed width for each tile
          >
            <div
              className="w-10 h-10 bg-cover bg-center mr-2 rounded"
              style={{
                backgroundImage: `${
                  catalog.photo ? `url(${catalog.photo.url})` : 'none'
                }`,
              }}
            ></div>
            {catalog.title}
          </div>
        </li>
      ))}
    </ul>
  );
};

const CatalogSelector: React.FC<{
  onCatalogSelect: (catalogId: number | null) => void;
}> = ({ onCatalogSelect }) => {
  
  const { lang } = useParams<{ lang: string }>();
  const { i18n } = useTranslation();
  React.useEffect(() => {
    if (lang && i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);



  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [selectedPath, setSelectedPath] = useState<Catalog[]>([]);
  const [noMoreChoices, setNoMoreChoices] = useState(false);
  const [listingVisible, setListingVisible] = useState(false);
  const listingRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchCatalogs = async (lang:string) => {
      try {
        const response = await axios.get(`/${lang}/catalogs.json`);
        setCatalogs(response.data.catalogs);
      } catch (error) {
        console.error('Error fetching catalogs:', error);
      }
    };
    fetchCatalogs(lang||'en');
  }, [lang]);

  useEffect(() => {
    if (selectedPath.length > 0) {
      const currentCatalogs = selectedPath[selectedPath.length - 1].catalogs;
      setNoMoreChoices(currentCatalogs.length === 0);
    } else {
      onCatalogSelect(null);
    }
  }, [selectedPath, onCatalogSelect]);

  const handleSelect = (catalog: Catalog) => {
    setSelectedPath([...selectedPath, catalog]);
    onCatalogSelect(catalog.id);
  };

  const handleBackButton = () => {
    setListingVisible(true);
    if (selectedPath.length > 0) {
      setSelectedPath(selectedPath.slice(0, -1));
      onCatalogSelect(selectedPath[selectedPath.length - 1]?.id || null);
    } else {
      setSelectedPath([]);
    }
  };

  const handleBreadcrumbClick = (index: number) => {
    setListingVisible(true);
    setSelectedPath(selectedPath.slice(0, index + 1));
    onCatalogSelect(selectedPath[index].id);
  };

  const getCurrentCatalogs = (): Catalog[] => {
    if (selectedPath.length === 0) {
      return catalogs;
    } else {
      return selectedPath[selectedPath.length - 1].catalogs;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (listingRef.current && !listingRef.current.contains(event.target as Node)) {
        setListingVisible(false);
      }
    };

    if (listingVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [listingVisible]);

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">{t('CatalogSelector.heading')}</h1>
      <div className="flex flex-wrap mb-4">
        <button
          onClick={handleBackButton}
          className={`text-white mr-2 mb-2 p-2 rounded ${
            selectedPath.length === 0
              ? 'bg-primary'
              : 'cursor-pointer bg-secondary hover:bg-secondaryDark'
          }`}
        >
          {t(
            selectedPath.length === 0
              ? 'CatalogSelector.selectButton'
              : 'CatalogSelector.backButton'
          )}
        </button>
        {selectedPath.map((catalog, index) => (
          <React.Fragment key={catalog.id}>
            <div
              className={`text-white p-2 hover:bg-secondaryDark rounded mb-2 cursor-pointer ${
                noMoreChoices ? 'bg-primaryDark' : 'bg-primary'
              }`}
              onClick={() => handleBreadcrumbClick(index)}
            >
              {catalog.title}
            </div>
            {index < selectedPath.length - 1 && (
              <div className="p-2 rounded mb-2">/</div>
            )}
          </React.Fragment>
        ))}
      </div>
      {listingVisible && (
        <div ref={listingRef}>
          <CatalogSelectorHelper
            catalogs={getCurrentCatalogs()}
            onSelect={handleSelect}
          />
        </div>
      )}
    </div>
  );
};

export default CatalogSelector;
