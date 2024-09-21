'use client';
import { ISold } from './models/sold';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import AnnounceGridDisplay from './AnnounceGridDisplay';
import { API_URL } from '../config';

interface AnnounceGridProps {
  catalogId: number | null;
  brandId: number | null;
}

const AnnounceGrid: React.FC<AnnounceGridProps> = ({ catalogId, brandId }) => {
  const [announces, setAnnounces] = useState<ISold[] | null>(null);
  let loading = useRef(false);

  useEffect(() => {

    
    const fetchAnnounces = async () => {
      console.log('catalogId:', catalogId);
      console.log('brandId:', brandId);


        loading.current = true;

        try {

          const response = await axios.post(
            API_URL +
            '/api/top_announces', {
              catalogId: catalogId? catalogId : undefined,
              brandId: brandId? brandId : undefined,
          },
        
          {
            withCredentials: true,
          }
        );


          setAnnounces(response.data);
          
        } catch (error) {
          console.error('Error fetching announces:', error);

        setAnnounces(null);
        }
     
      
      loading.current = false;
    };

    if (!loading.current && catalogId !== null && brandId !== null) {
      
      fetchAnnounces();
    }

  }, [catalogId, brandId]);

  return <>
  
  {loading &&           <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
          </div>
          }
  {!loading && <AnnounceGridDisplay announces={announces} />}
  </>
};

export default AnnounceGrid;