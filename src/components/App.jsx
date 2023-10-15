import { Component } from 'react';
import SearchBar from './Searchbar/Searchbar'; 
import * as API from './api'; 
import { ImageGallery } from './ImageGallery/ImageGallery'; 
import { Loader } from './Loader/Loader'; 
import { Button } from './Button/Button'; 
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppWrapper } from './App.styled';

export default class App extends Component {
  state = {
    searchName: '', // Запит для пошуку
    images: [], // Зображення
    currentPage: 1, // Поточний номер сторінки
    error: null, // Помилка
    isLoading: false, // Індикатор завантаження зображень
    totalPages: 0, // Загальна кількість сторінок
  };

  componentDidUpdate(_, prevState) {
    // Перевіряємо, чи змінився запит або номер сторінки
    if (
      prevState.searchName !== this.state.searchName ||
      prevState.currentPage !== this.state.currentPage
    ) {
      this.addImages(); // Отримуємо та додаємо зображення до стану
    }
  }

  // Завантажити більше зображень, збільшуючи номер поточної сторінки
  loadMore = () => {
    this.setState(prevState => ({
      currentPage: prevState.currentPage + 1,
    }));
  };

  // Обробка подання форми від компонента SearchBar
  handleSubmit = query => {
    if (query.trim() === '') {
      // Перевіряємо, чи форма не пуста
      toast.info('enter a search query.', {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }
  
    this.setState({
      searchName: `${Date.now()}/${query}`,
      images: [],
      currentPage: 1,
    });
  };

// Функція для оновлення стану images (скидання галереї)
  resetGallery = () => {
    this.setState({ images: [] });
  };

  // Метод для додавання зображень
  addImages = async () => {
    const { searchName, currentPage } = this.state;
    try {
      this.setState({ isLoading: true }); // Встановлюємо прапорець завантаження

      // API-запит до Pixabay
      const data = await API.getImages(searchName, currentPage);

      if (data.hits.length === 0) {
        // Видаляємо попередні нотифікації
        toast.dismiss();
    
        // Виводимо нову нотифікацію про відсутність зображень
        toast.info('Image was not found...', {
          position: toast.POSITION.TOP_RIGHT,
        });
        return;
      }

      const normalizedImages = API.normalizedImages(data.hits);

      this.setState(state => ({
        images: [...state.images, ...normalizedImages], // Додаємо нові зображення
        isLoading: false, // Вимикаємо прапорець завантаження
        error: '', // Очищаємо повідомлення про помилку
      }));
    } catch (error) {
      this.setState({ error: 'error' }); // Встановлюємо повідомлення про помилку
    } 
    finally {
      this.setState({ isLoading: false }); // Вимикаємо прапорець завантаження незалежно від результату
    }
  };

  render() {
    const { images, isLoading, currentPage, totalPages } = this.state;

    return (
      <AppWrapper>
        <ToastContainer transition={Slide} /> 
        <SearchBar onSubmit={this.handleSubmit} onReset={this.resetGallery} /> 
        {images.length > 0 ? (
          <ImageGallery images={images} />
        ) : (
          <p
            style={{
              padding: 100,
              textAlign: 'center',
            }}
          >
            empty
          </p>
        )}
        {isLoading && <Loader />}
        {images.length > 0 && totalPages !== currentPage && !isLoading && (
          <Button onClick={this.loadMore} />
        )}
      </AppWrapper>
    );
  }
}
