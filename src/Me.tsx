// src/pages/Me.tsx
import React, { useEffect, useState } from 'react';
import ProStatus from './components/ProStatus';
import { useTranslation } from 'react-i18next';
import { t } from 'i18next';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL, guild_id } from './config';
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


{
  discordAssociation !== null && (
    <div className="p-6 bg-secondaryLight rounded-lg shadow-lg text-center">
      {discordAssociation ? ( <a 
        
       href={`https://discord.com/channels/${guild_id}`}
        target="_blank"

        className="text-primary text-xl font-semibold mb-4" rel="noreferrer">{t('AccountPage.discord_associated')}</a>
      ) : (
       
        // color #7289da
        <a
        rel="noreferrer" 
       // onClick={handleDiscordAssociation}
       href="https://discord.com/oauth2/authorize?client_id=1287105058042810428&response_type=code&redirect_uri=https%3A%2F%2Fvinted.loveresell.com%2Fdiscord&scope=identify+guilds.join"
        target="_blank"
        className="px-4 py-2 rounded-md text-white bg-discord font-semibold" 
      >
        {t('AccountPage.associate_discord')}
      </a>

      )}
    </div>
  )
}

<ProStatus 
      isPro={isPro}
      />


    </div>
  );
};

export default MePage;