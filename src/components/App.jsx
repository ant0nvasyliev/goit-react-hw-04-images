import { useState, useEffect } from 'react';
import { SearchBar } from './Searchbar/Searchbar';
import * as API from './api';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Loader } from './Loader/Loader';
import { Button } from './Button/Button';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppWrapper } from './App.styled';

export const App = () => {
  const [searchName, setSearchName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const addImages = async () => {
      setIsLoading(true);

      try {
        const data = await API.getImages(searchName, currentPage);

        if (data.hits.length === 0) {
          toast.dismiss();
          toast.info('Зображень не знайдено.', {
            position: toast.POSITION.TOP_RIGHT,
          });
          return;
        }

        setTotalPages(data.total_pages);
        const normalizedImages = API.normalizedImages(data.hits);

        setImages(prevImages => [...prevImages, ...normalizedImages]);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (searchName === '') return;
    addImages();
  }, [searchName, currentPage]);

  const loadMore = () => {
    setCurrentPage(currentPage + 1);
  };

  const handleSubmit = query => {
    if (query.trim() === '') {
      toast.info('enter a search query.', {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }

    setSearchName(`${Date.now()}/${query}`);
    setImages([]);
    setCurrentPage(1);
  };

  const resetGallery = () => {
    setImages([]);
  };

  return (
    <AppWrapper>
      <ToastContainer transition={Slide} />
      <SearchBar onSubmit={handleSubmit} onReset={resetGallery} />
      {isLoading && <Loader />}
      {images.length === 0 && (
        <p
          style={{
            padding: 100,
            textAlign: 'center',
          }}
        >
          Немає зображень для відображення.
        </p>
      )}
      {images.length > 0 && <ImageGallery images={images} />}
      {images.length > 0 && totalPages !== currentPage && !isLoading && (
        <Button onClick={loadMore} />
      )}
    </AppWrapper>
  );
};

export default App;
