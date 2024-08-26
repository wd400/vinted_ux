'use client';

import { IPhoto } from './models/sold';
import { useState } from 'react';
import Modal from './Modal';
import { useTranslation } from 'react-i18next';

type ImageGalleryProps = {
  images: IPhoto[];
};

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showAll, setShowAll] = useState<boolean>(false);

  const { t } = useTranslation();

  const openModal = (image: string) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  return (
    <div>
      <div className="flex flex-wrap justify-center">
        {(showAll ? images : images.slice(0, 3)).map((image, index) => (
          <img
            key={index}
            alt={`${index}`}
            className="m-2 h-32 w-32 object-cover cursor-pointer rounded hover:shadow-lg"
            src={`${image.url}`}
            onClick={() => openModal(image.url)}
            loading="lazy"
          />
        ))}
      </div>
      {images.length > 3 && (
        <p
          onClick={toggleShowAll}
          className="text-primary hover:underline"
        >
          {showAll ? t('ImageGallery.show_less') : t('ImageGallery.show_more')}
        </p>
      )}

      <Modal isOpen={selectedImage !== null} onClose={closeModal} image={selectedImage!} />
    </div>
  );
}
