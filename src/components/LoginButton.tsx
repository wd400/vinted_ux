// src/components/LoginButton.tsx
'use client';

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { EmailPopup } from "./LoginPopup";
import { useParams } from "react-router-dom";
import React from "react";

export default function LoginButton() {
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  
  const { lang } = useParams<{ lang: string }>();
const { i18n,t } = useTranslation();
React.useEffect(() => {
  if (lang && i18n.language !== lang) {
    i18n.changeLanguage(lang);
  }
}, [lang, i18n]);

  function handleLoginClick() {
    setShowLoginPopup(true);
  }

  return (
    <>
      <button
        onClick={handleLoginClick}
        className="px-2 py-1 rounded-md text-primary border-primary border-2 hover:bg-gray-50 text-xs"
      >
        {t('LoginButton.login_button_text')}
      </button>
      {showLoginPopup && <EmailPopup onClose={() => setShowLoginPopup(false)} />}
    </>
  );
}
