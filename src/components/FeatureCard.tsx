'use client';

import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { useEffect, useState } from 'react';
import {  useNavigate, useParams } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import React from "react";

interface FeatureCardProps {
  title: string;
  description: string;
  isPro: boolean | null;
  page: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, isPro ,page}) => {

  const { lang } = useParams<{ lang: string }>();
  const { i18n,t } = useTranslation();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (lang && i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  const controls = useAnimation();
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    if (showOverlay) {
      const timer = setTimeout(() => setShowOverlay(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [showOverlay]);

  const handleClick = async () => {
    if (isPro) {
      await controls.start({
        scale: [1, 1.1, 0],
        rotate: [0, 5, -5, 0],
        transition: { duration: 0.5 }
      });
      // Redirect to the pricing page
      const url = `/${lang}${page}`;
    //  window.location.href = url;
       navigate(url);


    } else {
      setShowOverlay(true);
      await controls.start({
        x: [-10, 10, -10, 10, 0],
        transition: { duration: 0.4 }
      });
    }
  };

  return (
    <motion.div
      className="flex flex-col items-start justify-start p-6 gap-4 bg-white shadow-lg rounded-xl  relative cursor-pointer"
      whileHover={{
        scale: 1.05,
        rotateY: 10,
        z: 50,
        transition: { duration: 0.3 }
      }}
      style={{ transformStyle: "preserve-3d" }}
      animate={controls}
      onClick={handleClick}
      
    >
<motion.h3
  className="text-2xl font-semibold text-gray-800 dark:text-gray-200 text-center w-full"
  style={{ transform: "translateZ(20px)" }}
>
  {title}
</motion.h3>
      <motion.p
        className="text-base text-gray-600 dark:text-gray-300"
        style={{ transform: "translateZ(10px)" }}
      >
        {description}
      </motion.p>
      <AnimatePresence>
        {showOverlay && !isPro && (
          <motion.div
            className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-white text-lg font-semibold">
              {t('FeatureCard.proFeature')}
            </p>
          </motion.div>
        )} 
      </AnimatePresence>
    </motion.div>
  );
};

export default FeatureCard;
