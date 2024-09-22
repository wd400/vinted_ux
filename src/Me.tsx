// src/pages/Me.tsx
import React, { useEffect, useState } from 'react';
import ProStatus from './components/ProStatus';
import { useTranslation } from 'react-i18next';
import { t } from 'i18next';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from './config';
import authUtils from './utils/auth';

const MePage = () => {
  const { lang } = useParams<{ lang: string }>();
  const { i18n } = useTranslation();
  const [isPro, setIsPro] = useState<boolean | null>(null);

  const [discordAssociation, setDiscordAssociation] = useState<boolean | null>(null);



  React.useEffect(() => {
    if (lang && i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);



  const fetchDiscordAssociation = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/discord`,
        {
          withCredentials: true,
        });
      console.log(response.data);
      if (response.data.discordId) {
        setDiscordAssociation(true);
      } else {
        setDiscordAssociation(false);
      }
    } catch (error) {
      console.error('Error fetching Discord association:', error);
    }
  };




  useEffect(() => {

      //https://discord.com/oauth2/authorize?client_id=1287105058042810428&response_type=code&redirect_uri=https%3A%2F%2Fvinted.loveresell.com%2Fdiscord&scope=identify+guilds.join
  // code=30GThmkrp021Uu3k9HEMGLfjgQtTnB

  // get code from the url and exchange it for an access token if specified
const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get('code');
if (code) {
  console.log('code:', code);

  // exchange the code for an access token in browser

  // request to /discord_token with the code
  fetch(API_URL + '/api/discord_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code }),
    credentials: 'include',
  }).then((response) => {
    if (response.ok) {
      return response.json();
    }
    throw new Error('Network response was not ok.');
  }
  ).then((data) => {
    console.log(data);
    // redirect to the me page
    
    setDiscordAssociation(true);
    // open the guild in a new tab
    window.open(`https://discord.com/channels/${data.guild_id}`, '_blank');


  }
  ).catch((error) => {
    console.error('There has been a problem with your fetch operation:', error);
  }
  );
}


  



    authUtils.useSession().then((session) => {
      setIsPro(session.is_pro);

       if (session.status === 'authenticated') {

        // retrieve the user's discord association
        fetchDiscordAssociation();

       }



    });
  }, []);






  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{t('AccountPage.title')}</h1>
      <ProStatus 
      isPro={isPro}
      />

{
  discordAssociation !== null && (
    <div className="p-6 bg-secondaryLight rounded-lg shadow-lg text-center">
      {discordAssociation ? (
        <p className="text-primary text-xl font-semibold mb-4">{t('AccountPage.discord_associated')}</p>
      ) : (
       
        <a
        rel="noreferrer" 
       // onClick={handleDiscordAssociation}
       href="https://discord.com/oauth2/authorize?client_id=1287105058042810428&response_type=code&redirect_uri=https%3A%2F%2Fvinted.loveresell.com%2Fdiscord&scope=identify+guilds.join"
        target="_blank"
        className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700"
      >
        {t('AccountPage.associate_discord')}
      </a>

      )}
    </div>
  )
}


    </div>
  );
};

export default MePage;