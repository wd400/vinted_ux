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
  const [loading, setLoading] = useState(false); // Changed to useState
  const [abortController, setAbortController] = useState<AbortController | null>(null); // To handle cancellation

  useEffect(() => {
    // Function to fetch announces
    const fetchAnnounces = async () => {
      if (catalogId === null && brandId === null) return;

      console.log('catalogId:', catalogId);
      console.log('brandId:', brandId);

      setLoading(true);

      // Abort any ongoing requests before making a new one
      if (abortController) {
        abortController.abort();
      }

      const controller = new AbortController();
      setAbortController(controller);

      try {
        const response = await axios.post(
          `${API_URL}/api/top_announces`,
          {
            catalogId: catalogId || undefined,
            brandId: brandId || undefined,
          },
          {
            signal: controller.signal, // Attach the abort signal to the request
            withCredentials: true,
          }
        );

        setAnnounces(response.data);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled:', error.message);
        } else {
          console.error('Error fetching announces:', error);
          setAnnounces(null);
        }
      } finally {
        setLoading(false); // Ensure loading state is set to false
      }
    };

    fetchAnnounces();

    // Clean up the abort controller on component unmount or params change
    return () => {
      if (abortController) {
        abortController.abort();
      }
    };
  }, [catalogId, brandId, abortController]);

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
