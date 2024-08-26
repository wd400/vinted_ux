'use client';
import React from 'react';
import authUtils from '../utils/auth';
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

const knownEmailProviders: Record<string, string> = {
  'gmail.com': 'https://mail.google.com',
  'outlook.com': 'https://outlook.live.com/mail',
  'hotmail.com': 'https://outlook.live.com/mail',
  'yahoo.com': 'https://mail.yahoo.com',
  'aol.com': 'https://mail.aol.com',
  "laposte.net": "https://web-mail.laposte.net",
};

export function EmailPopup({ onClose }: { onClose?: () => void }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const [sent, setSent] = useState(false);

  const { lang } = useParams<{ lang: string }>();
const { i18n,t } = useTranslation();
React.useEffect(() => {
  if (lang && i18n.language !== lang) {
    i18n.changeLanguage(lang);
  }
}, [lang, i18n]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        if (onClose) onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleSubmit = async () => {
    setLoading(true);
    const locale = localStorage.getItem('locale') || i18n.language || 'en';
    const status = await authUtils.signIn(email, locale);
    setLoading(false);
    if (status) {
      setSent(true);
      openMailbox(email);
    }
  };

  const openMailbox = (email: string) => {
    const domain = email.split('@')[1];
    const mailboxUrl = knownEmailProviders[domain];
    if (mailboxUrl) {
      window.open(mailboxUrl, '_blank');
    }
  };

  return (
    <div className="z-50 fixed inset-0 flex items-center justify-center pointer-events-none">
      <div ref={popupRef} className="w-96 rounded-lg bg-white p-8 shadow-lg relative pointer-events-auto">
        {onClose && (
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-4xl font-thin"
            onClick={onClose}
          >
            &times;
          </button>
        )}
        <h2 className="mb-4 text-2xl text-center font-semibold text-black">
          {t('LoginPopup.log_in')}
        </h2>
        <input
          className="mb-4 w-full border-b-2 border-gray-300 focus:border-primary p-2 text-black focus:outline-none"
          onChange={(event) => setEmail(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              handleSubmit();
            }
          }}
          placeholder={t('LoginPopup.email_placeholder')}
          type="email"
          value={email}
          id="email"
        />
        <button
          className={`w-full rounded p-2 text-white hover:bg-opacity-90
            ${sent ? 'bg-primaryLight' : 'bg-primary'}
          `}
          disabled={loading || sent}
          onClick={handleSubmit}
          type="submit"
        >
          {loading
            ? t('LoginPopup.loading')
            : sent
            ? t('LoginPopup.check_your_email')
            : t('LoginPopup.send_magic_link')}
        </button>
      </div>
    </div>
  );
}

export function LoginPopup() {
  const [status, setStatus] = useState<'loading' | 'unauthenticated' | 'authenticated'>('loading');

  useEffect(() => {
    authUtils.useSession().then((session) => {
      setStatus(session.status);
    });
  }, []);

  if (status === 'unauthenticated') {
    return <EmailPopup />;
  }
  return null;
}
