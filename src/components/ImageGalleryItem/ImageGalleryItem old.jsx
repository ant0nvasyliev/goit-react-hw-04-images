import React, { Component } from 'react';
import { GalleryListItem, GalleryListImage } from './ImageGalleryItem.styled';
import { CustomModal } from '../Modal/Modal';

export class ImageGalleryItem extends Component {
  state = {
    isModalOpen: false,
    isLoadingImage: false,
  };

  openModal = () => {
    this.setState({ isModalOpen: true, isLoadingImage: true });

    const largeImage = new Image();
    largeImage.onload = () => {
      this.setState({ isLoadingImage: false });
    };
    largeImage.onerror = () => {
      this.setState({ isLoadingImage: false });
      console.error('Error loading image');
    };
    largeImage.src = this.props.image.largeImageURL;
  };

  closeModal = () => this.setState({ isModalOpen: false });

  render() {
    const { image } = this.props;
    const { isLoadingImage, isModalOpen } = this.state;

    return (
      <>
        <GalleryListItem>
          <GalleryListImage
            onClick={this.openModal}
            src={image.webformatURL}
            alt={''}
          />
          <CustomModal
            isOpen={isModalOpen}
            onRequestClose={this.closeModal}
            isLoadingImage={isLoadingImage}
            imageURL={image.largeImageURL}
          />
        </GalleryListItem>
      </>
    );
  }
}
