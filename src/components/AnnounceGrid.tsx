'use client';
import { ISold } from './models/sold';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import AnnounceGridDisplay from './AnnounceGridDisplay';
import { API_URL } from '../config';

interface AnnounceGridProps {
  catalogId: number | null;
  brandId: number | null;
}

const AnnounceGrid: React.FC<AnnounceGridProps> = ({ catalogId, brandId }) => {
  const [announces, setAnnounces] = useState<ISold[] | null>(null);

  useEffect(() => {
    const fetchAnnounces = async () => {
      console.log('catalogId:', catalogId);
      console.log('brandId:', brandId);
      if (catalogId && brandId) {
        try {
          const response = await axios.post(
            API_URL +
            '/api/top_announces', {
            catalogId,
            brandId,
          });
          setAnnounces(response.data);
        } catch (error) {
          console.error('Error fetching announces:', error);
        }
      } else {
        setAnnounces(null);
      }
    };
    fetchAnnounces();
  }, [catalogId, brandId]);

  return <AnnounceGridDisplay announces={announces} />;
};

export default AnnounceGrid;