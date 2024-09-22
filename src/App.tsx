// src/App.tsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes,  useParams, useLocation, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LandingPage from './lp';
import ProvidedNavigation from './components/ProvidedNavigation';

import ColorTrends from './ColorTrends';
import ExpensiveProducts from './ExpensiveProducts';
import Login from './Login';
import MePage from './Me';
import PriceEstimation from './PriceEstimation';
import TopAnnounces from './TopAnnounces';
import SalesTrendDashboard from './SalesTrend';
import TopPerformers from './TopPerformers';
import authUtils from './utils/auth';
import RedirectLang from './components/RedirectLang';

import ThanksPage from './Thanks';

import HotBrands from './HotBrands';

import MostExpensiveBrands from './MostExpensiveBrand';
import { API_URL } from './config';

// const Home = () => {
//   const { t } = useTranslation();
//   return <h1 className="text-3xl mt-4">{t('welcome')}</h1>;
// };

// const ImageHandler: React.FC = () => {
//   const { imageName } = useParams<{ imageName: string }>();
//   return <img src={`/images/${imageName}`} alt={imageName} />;
// };


const Verify = () => {
  const location = useLocation();

  useEffect(() => {
      const params = new URLSearchParams(location.search);
      const token = params.get('token');
      if (token) {
       const checked= authUtils.verifyMagicLink(token)
       if(checked){


        fetch(API_URL + '/api/log', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
               // 'Cookie': `session=${token}`,
            },
            
            //include credentials
            credentials: 'include',
            body: JSON.stringify({ action: 'magic' }),
        }).then((response) => {

        window.location.href = '/';
        });
       }
      }
  }
  , [location.search]);

  return <div>Verifying...</div>;
};


const RedirectThanks: React.FC = () => {
  const lang = localStorage.getItem('locale') || 'en';
  return <Navigate to={`/${lang}/thanks`} />;
};

const RedirectDiscord: React.FC = () => {
  //get all url params

  const lang = localStorage.getItem('locale') || 'en';
  const params = window.location.search;
  console.log("params",params)
  return <Navigate to={`/${lang}/me${params}`} />;
}



const App: React.FC = () => {



  return (

    <Router>
      <div className="text-center">
        <header >
          <ProvidedNavigation />
                </header>
        <Routes>
          <Route path="/" element={<RedirectLang/>} />
          <Route path="/thanks" element={<RedirectThanks/>} />
          <Route path="/discord" element={<RedirectDiscord/>} />
          <Route path="/:lang/me?*" element={<MePage />} />

          <Route path="/:lang/thanks" element={<ThanksPage/>} />
          <Route path="/:lang" element={<LandingPage />} />
          <Route path="/:lang/login" element={<Login />} />
          <Route path="/:lang/me" element={<MePage />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/:lang/hot-brands" element={<HotBrands />} />

          <Route path="/:lang/expensive-brands" element={<MostExpensiveBrands />} />
          <Route path="/:lang/top-performers" element={<TopPerformers />} />
          <Route path="/:lang/top-announces" element={<TopAnnounces />} />
          <Route path="/:lang/sales-trend" element={<SalesTrendDashboard />} />
          <Route path="/:lang/price-estimation" element={<PriceEstimation />} />
          <Route path="/:lang/color-trends" element={<ColorTrends />} />
          <Route path="/:lang/expensive-products" element={<ExpensiveProducts />} />
          <Route path="/:lang/about" element={<LanguageWrapper />} />
          <Route path="*" element={<div>Not Found</div>} />

        </Routes>
      </div>
    </Router>
  );
};

// src/App.tsx
const LanguageWrapper: React.FC = () => {
  const { lang } = useParams<{ lang: string }>();
  const { i18n } = useTranslation();
  React.useEffect(() => {
    if (lang && i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);
  return <div>{/* Your about page content */}</div>;
};

export default App;