// src/components/LocaleSwitcher.tsx
import React from 'react';
import {  useNavigate } from 'react-router-dom';
import LocaleSwitcherSelect from './LocaleSwitcherSelect';
import { useTranslation } from 'react-i18next';



const LocaleSwitcher: React.FC = () => {
    // extract the lang from the url directly
    const navigate = useNavigate();
    const { i18n } = useTranslation();


    
    const path = window.location.pathname;
    var lang = path.split('/')[1];
    

    // if lang is an empty string, return to the default language
    if (lang === '') {
      // use localStorage to store the user's language preference
       lang = localStorage.getItem('locale') || 'en';
       i18n.changeLanguage(lang);
    } else {
      localStorage.setItem('locale', lang);
  //   
    }

    // check if the lang is in the list of supported languages
    if (lang && !['en', 'fr'].includes(lang)) { // , 'es'
      navigate('/en');
      i18n.changeLanguage('en');
      lang='en';
    }

const [currentLocale, setCurrentLocale] = React.useState(lang || 'en');

  
  
  
  



  const handleLocaleChange = (locale: string) => {
    navigate(`/${locale}`);



    setCurrentLocale(locale);

    localStorage.setItem('locale', locale);




  };

  return (
    <LocaleSwitcherSelect
      selectedLocale={currentLocale || 'en'}
      onSelectChange={handleLocaleChange}
    >
      {['en', 'fr'].map((cur) => ( //  'es'
        <option key={cur} value={cur}>
         {cur.toUpperCase()}
        </option>
      ))}
    </LocaleSwitcherSelect>
  );
};

export default LocaleSwitcher;