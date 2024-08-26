import { useEffect, useRef, useState } from 'react';
import LoginButton from './LoginButton';
import LocaleSwitcher from './LocaleSwitcher';
import {  Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';  // Import useTranslation hook

import authUtils from '../utils/auth';
import { API_URL } from '../config';

function ProvidedNavigation2() {
  const { lang } = useParams<{ lang: string }>(); // Get the language parameter from the URL
  const { i18n } = useTranslation(); // Initialize the translation hook
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [isPro, setIsPro] = useState<boolean | null>(null);

  const navigate = useNavigate();

  // Change the language based on the URL parameter
  useEffect(() => {
    if (lang && i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  useEffect(() => {
    authUtils.useSession().then((session) => {
      setStatus(session.status);
      setIsPro(session.is_pro);
    });
  }, []);

  useEffect(() => {
    const avatar_url = localStorage.getItem('avatar_url');
    if (!avatar_url) {
      fetch(
        API_URL + '/api/vavatar',
        { credentials: 'include' },
      )
        .then((response) => response.json())
        .then((data) => {
          localStorage.setItem('avatar_url', data.url || '/images/vempty.svg');
          setAvatarUrl(data.url);
        })
        .catch(() => {
          console.error('Failed to fetch avatar');
        });
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (status === 'authenticated') {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [status]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuVisible(false);
      }
    };

    if (menuVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuVisible]);

  const handleLogout = async () => {
    localStorage.clear();
    authUtils.signOut();
  };

  return (
    <div className="bg-slate-850">
      <nav className="container flex justify-between p-2 text-white">
        <div className="flex items-center space-x-4">
          <Link className="m-0 p-0" to={`/${i18n.language}`}>
            <div className="flex items-center">
              <img src="/v.svg" alt="logo" className="hidden sm:block m-0 p-0" />
              <img src="/v_small.svg" alt="logo" className="block sm:hidden m-0 p-0" />
              <div className="text-2xl font-semibold leading-tight tracking-tight text-primary ml-2">
               Analytics
              </div>
            </div>
          </Link>
        </div>
        <div className="relative flex items-center space-x-2">
          {isLoggedIn && (
            <>
              <img
                src={avatarUrl || '/images/vempty.svg'}
                alt="avatar"
                className={`w-8 h-8 rounded-full cursor-pointer  ${isPro ? 'glow-effect' : ''}`}
                onClick={() => setMenuVisible(!menuVisible)}
              />
              {menuVisible && (
                <div
                  ref={menuRef}
                  className="absolute right-0 mt-2 w-44 bg-white rounded-md shadow-lg z-40 top-full 
                border border-gray-200"
                >
                  <button
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center justify-between"
                    onClick={() => {
                      const extension: { [key: string]: string } = {
                        'en':'com',
                        'fr':'fr',
                        'de':'de',
                        'es':'es',
                      }
                      // check if the language is supported
                      const vinted_extension= extension[i18n.language] || 'com';
                      window.open( `https://www.vinted.${vinted_extension}/`);


                    
                    }
                    }
                  >
                    {i18n.t('Navigation.MoveToVinted')} {/* Translated text for "Move to Vinted" */}
                    <svg
                      width="15px"
                      height="15px"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        id="Vector"
                        d="M10.0002 5H8.2002C7.08009 5 6.51962 5 6.0918 5.21799C5.71547 5.40973 5.40973 5.71547 5.21799 6.0918C5 6.51962 5 7.08009 5 8.2002V15.8002C5 16.9203 5 17.4801 5.21799 17.9079C5.40973 18.2842 5.71547 18.5905 6.0918 18.7822C6.5192 19 7.07899 19 8.19691 19H15.8031C16.921 19 17.48 19 17.9074 18.7822C18.2837 18.5905 18.5905 18.2839 18.7822 17.9076C19 17.4802 19 16.921 19 15.8031V14M20 9V4M20 4H15M20 4L13 11"
                        stroke="#000000"
                      />
                    </svg>
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => {

                     navigate(`/${i18n.language}/me`);
                    }}
                  >
                    {i18n.t('Navigation.MyStatus')} {/* Translated text for "My Status" */}
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-red-700 hover:bg-red-100"
                    onClick={handleLogout}
                  >
                    {i18n.t('Navigation.Logout')} {/* Translated text for "Logout" */}
                  </button>
                </div>
              )}
            </>
          )}
          {isLoggedIn === false && <LoginButton />}
          <LocaleSwitcher />
        </div>
      </nav>
      <style>{`
        .group:hover .menu {
          display: block;
        }
        .glow-effect {
          box-shadow: 0 0 10px 2px rgba(255, 215, 0, 0.8);
        }
      `}</style>
    </div>
  );
}

function ProvidedNavigation() {
  const location = window.location.pathname;

  return <>{location !== '/verify' && <ProvidedNavigation2 />}</>;
}

export default ProvidedNavigation;
