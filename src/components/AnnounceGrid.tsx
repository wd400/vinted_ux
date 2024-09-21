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
  const [loading, setLoading] = useState<boolean>(false); // Use useState for loading

  useEffect(() => {
    let cancelRequest = false; // For canceling previous request

    const fetchAnnounces = async () => {
      console.log('catalogId:', catalogId);
      console.log('brandId:', brandId);

      setLoading(true);

      try {
        const response = await axios.post(
          `${API_URL}/api/top_announces`, 
          {
            catalogId: catalogId ?? undefined,
            brandId: brandId ?? undefined,
          },
          {
            withCredentials: true,
          }
        );

        if (!cancelRequest) { // Only update state if the request was not canceled
          setAnnounces(response.data);
          setLoading(false);
        }

      } catch (error) {
        if (!cancelRequest) { // Handle errors only if not canceled
          console.error('Error fetching announces:', error);
          setAnnounces(null);
          setLoading(false);
        }
      }
    };

    // Trigger the API call if either catalogId or brandId is not null
    if (catalogId !== null || brandId !== null) {
      fetchAnnounces();
    }

    // Cleanup function to cancel the ongoing request
    return () => {
      cancelRequest = true; // Cancel the ongoing request on param change or unmount
    };
  }, [catalogId, brandId]);

  return (
    <>
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}
      {!loading && <AnnounceGridDisplay announces={announces} />}
    </>
  );
};

export default AnnounceGrid;
