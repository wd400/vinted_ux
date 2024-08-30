'use client';

import { Meteors } from './components/magicui/meteors';
import ShimmerButton from './components/magicui/shimmer-button';
import SparklesText from "./components/magicui/sparkles-text";
import { motion } from "framer-motion";

import { useState } from 'react';

import FeatureCard from './components/FeatureCard'; // Adjust the import path as needed
import { useEffect } from 'react';

import authUtils from './utils/auth';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

const LandingPage = () => {

  const [isPro, setIsPro] = useState<boolean | null>(null);

  useEffect(() => {
    authUtils.useSession().then((session) => {
      setIsPro(session.is_pro);
    });
  }, []);

  const { lang } = useParams<{ lang: string }>();
  const { i18n, t } = useTranslation();

  React.useEffect(() => {
    if (lang && i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <header className="bg-slate-900 py-20 overflow-hidden relative">
        <div className="container mx-auto px-4 text-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold tracking-tight md:text-6xl relative inline-block"
          >
            {t('LandingPage.title')}
            {isPro !== true && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold py-1 px-2 rounded-full ml-2 animate-bounce -mt-3">
                {t('LandingPage.newBadge')}
              </span>
            )}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-lg md:text-2xl"
          >
            {t('LandingPage.subtitle')}
          </motion.p>
        </div>

        <Meteors number={6} />
      </header>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-center mb-12 md:text-4xl">
            {t('LandingPage.featuresSectionTitle')}
          </h2>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              isPro={isPro}
              title={t('LandingPage.topSellingProductsTitle')}
              description={t('LandingPage.topSellingProductsDesc')}
              page="/sales-trend"
            />
            <FeatureCard
              isPro={isPro}
              title={t('LandingPage.hotBrandNichesTitle')}
              description={t('LandingPage.hotBrandNichesDesc')}
              page="/hot-brands"


            />
            <FeatureCard
              isPro={isPro}
              title={t('LandingPage.mostExpensiveBrandsTitle')}
              description={t('LandingPage.mostExpensiveBrandsDesc')}
              page="/expensive-brands"
            />
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-center mb-12 md:text-4xl">
            {t('LandingPage.optimizeProfileTitle')}
          </h2>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              isPro={isPro}
              title={t('LandingPage.announcesThatSellTitle')}
              description={t('LandingPage.announcesThatSellDesc')}
              page="/top-announces"
            />
            <FeatureCard
              isPro={isPro}
              title={t('LandingPage.topPerformersTitle')}
              description={t('LandingPage.topPerformersDesc')}
              page="/top-performers"
            />
            <FeatureCard
              isPro={isPro}
              title={t('LandingPage.priceEstimationTitle')}
              description={t('LandingPage.priceEstimationDesc')}
              page='/price-estimation'
            />
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-center mb-12 md:text-4xl">
            {t('LandingPage.moreFeaturesTitle')}
          </h2>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              isPro={isPro}
              title={t('LandingPage.trendingColorsTitle')}
              description={t('LandingPage.trendingColorsDesc')}
              page="/color-trends"
            />
            <FeatureCard
              isPro={isPro}
              title={t('LandingPage.mostExpensiveProductsTitle')}
              description={t('LandingPage.mostExpensiveProductsDesc')}
              page="/expensive-products"
            />
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          {/* <h2 className="text-3xl font-semibold text-center mb-8 md:text-4xl">
            User Reviews
          </h2> */}
          <div className="flex flex-col items-center">
            {/* <img src={JbImage.src} alt="JB" className="w-20 h-20 rounded-full mb-4" /> */}
            <p className="text-lg md:text-xl font-medium">"
              {t('LandingPage.userReview')}
              "</p>
            <p className="text-sm text-gray-500">JB - {t('LandingPage.userReviewPro')}
            </p>
            <div className="flex mt-4">
              {Array(5).fill('').map((_, i) => (
                <svg
                  key={i}
                  className="w-6 h-6 text-yellow-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 .288l2.833 8.718h9.167l-7.417 5.393 2.833 8.718-7.416-5.392-7.416 5.392 2.833-8.718-7.417-5.393h9.167z" />
                </svg>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="absolute bottom-0 right-0 mt-4 mr-4">
            <img src="/heart.png" alt="Heart" className="w-32 h-32" />
          </div>
          {isPro ? (
            <div className="text-center mt-4">
              <p>{t('LandingPage.moreFeaturesComingSoon')}</p>
            </div>
          ) : (
            <>
              <h2 className="text-3xl font-semibold md:text-4xl">
                {t('LandingPage.ctaTitle')}
              </h2>
              <p className="mt-4 text-lg md:text-xl">
                {t('LandingPage.ctaSubtitle')}
              </p>
              <div className="flex justify-center">
                <ShimmerButton className="shadow-2xl mt-8 w-80 h-20 hover:scale-110"

                  onClick={() => {
                    //open the billing page in a new tab
                    const mail= authUtils.ExtractEmail;

                      window.open(`https://buy.stripe.com/00g00t3AJ00Xf0AdQQ?prefilled_email=${mail}&prefilled_promo_code=LAUNCH`);

                  }
                  }

                >
                 
                  <SparklesText
                    className="text-2xl"
                    text={t('LandingPage.ctaButton')}
                  />
                </ShimmerButton>
              </div>
              <div className="text-center mt-4">
                <p>{t('LandingPage.noCommitmentSubscription')}</p>
              </div>
            </>
          )}
        </div>
      </section>

      

      <footer className="bg-slate-900 text-gray-400 py-10">
        <div className="container mx-auto px-4 text-center">
          <a href="/faq">{t('LandingPage.faq')}</a>
          <a href="https://wa.me/message/PRUIVUOAEI2ZG1" className="ml-4"
          
          target='_blank'
          rel='noreferrer'
          >
            {t('LandingPage.contact')}
          </a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
