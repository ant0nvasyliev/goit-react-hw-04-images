import { useState } from 'react';
import { GalleryListItem, GalleryListImage } from './ImageGalleryItem.styled';
import { CustomModal } from '../Modal/Modal';

export const ImageGalleryItem = ({
  image: { webformatURL, largeImageURL },
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  // Відкриття модалки
  const openModal = () => {
    setIsModalOpen(true);
    setIsLoadingImage(true);
    const largeImage = new Image();
    largeImage.onload = () => {
      setIsLoadingImage(false);
    };
    largeImage.onerror = () => {
      setIsLoadingImage(false);
      console.error('Error loading image');
    };
    largeImage.src = largeImageURL;
  };
  // Закриття модалки
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <GalleryListItem>
        <GalleryListImage onClick={openModal} src={webformatURL} alt={''} />
        <CustomModal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          isLoadingImage={isLoadingImage}
          imageURL={largeImageURL}
        />
      </GalleryListItem>
    </>
  );
};
