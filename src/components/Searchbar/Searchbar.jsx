import { useState } from 'react';
import {
  SearchbarHeader,
  SearchForm,
  SearchFormButton,
  SearchFormInput,
  ResetButton,
  OnTopButton,
} from './Searchbar.styled';
import { BiSearchAlt } from 'react-icons/bi';
import 'react-toastify/dist/ReactToastify.css';

export const SearchBar = props => {
  const [inputValue, setInputValue] = useState('');

  const handleChange = event => {
    setInputValue(event.target.value);
  };

  const handleSubmit = event => {
    event.preventDefault();
    props.onSubmit(inputValue);
    setInputValue('');
  };

  const handleReset = () => {
    props.onReset();
  };

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // Плавний скрол
    });
  };

  return (
    <SearchbarHeader>
      <SearchForm onSubmit={handleSubmit}>
        <SearchFormButton type="submit">
          <span>
            <BiSearchAlt size={25} />
          </span>
        </SearchFormButton>
        <SearchFormInput
          className="input"
          type="text"
          autoFocus
          placeholder="search here"
          value={inputValue}
          onChange={handleChange}
        />
      </SearchForm>
      <ResetButton type="button" onClick={handleReset}>
        reset
      </ResetButton>
      <OnTopButton type="button" onClick={handleScrollToTop}>
        up
      </OnTopButton>
    </SearchbarHeader>
  );
};
