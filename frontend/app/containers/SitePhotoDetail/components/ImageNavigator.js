// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import debounce from 'lodash/debounce';
import ImageLoading from 'react-image-lazy-progressive-load-with-progress-bar';
import IncognitoImage from '../../../images/incognito.jpg';

import {
  PhotoCarouselWrapper,
  PhotoCarousel,
  PhotoCarouselControls,
  PhotoCarouselItem,
} from './StyledComponents';

export type ImageNavigatorProps = {
  siteId: string,
  areaId: string,
  photos: Array,
  currentPhotoIndex: string,
  prevPhotoId: string,
  nextPhotoId: string,
};

class ImageNavigatorContainer extends React.Component<ImageNavigatorProps, void> {
  componentWillMount() {
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown.bind(this));
  }

  getPhotoUrl = (photoId) => {
    const { siteId, areaId, isShared, token } = this.props;

    const baseUrl = `${siteId}/areas/${areaId}/media/${photoId}`;
    const authUrl = `/sites/${baseUrl}`;
    const sharedUrl = `/shared/${baseUrl}/${token}`;

    const url = isShared ? sharedUrl : authUrl;
    return url;
  };

  handleKeyDown(e) {
    const { nextPhotoId, prevPhotoId, isEditing } = this.props;
    if (isEditing) return;
    if (e.keyCode === 39 && nextPhotoId !== null) this.changePhoto(nextPhotoId);
    if (e.keyCode === 37 && prevPhotoId !== null) this.changePhoto(prevPhotoId);
  }

  handleClick = (photoId) => (e) => {
    this.changePhoto(photoId);
    e.preventDefault();
  }

  changePhoto = debounce((photoId) => {
    const { history, updatePhotoId } = this.props;

    if (typeof updatePhotoId !== 'undefined') {
      return updatePhotoId(photoId);
    }

    const url = this.getPhotoUrl(photoId);
    return history.push(url);
  }, 50)

  renderPhotoCarousel = () => {
    const SHOWING = 9;

    const { areaDetail, currentPhotoIndex } = this.props;
    const { photos = [] } = areaDetail;

    const currentPhoto = photos[currentPhotoIndex];
    const half = Math.floor(SHOWING / 2);
    const relevantPhotos = photos.length > SHOWING
      ? photos.slice(currentPhotoIndex - half, currentPhotoIndex + (half + 1))
      : photos;

    const renderFn = (photo) => {
      const className = currentPhoto.id === photo.id ? 'active' : '';
      return (
        <PhotoCarouselItem key={`${photo.id}_thumb`} onClick={() => this.changePhoto(photo.id)} className={className}>
          <ImageLoading
            preview={IncognitoImage}
            src={photo.thumbnailUrl}
            width={148}
            height={86}
            lazyLoadScreenOffSet={10}
            transitionTime={0.1}
            spinnerSize={25}
            blur={3}
          />
        </PhotoCarouselItem>
      );
    };

    return (
      <PhotoCarousel>
        {relevantPhotos.map(renderFn)}
      </PhotoCarousel>
    );
  }

  renderPhotoCarouselControls() {
    const { prevPhotoId, photos, currentPhotoIndex, nextPhotoId } = this.props;
    const prevPhotoUrl = this.getPhotoUrl(prevPhotoId);
    const nextPhotoUrl = this.getPhotoUrl(nextPhotoId);

    return (
      <PhotoCarouselControls>
        <Link
          onClick={this.handleClick(prevPhotoId)}
          to={prevPhotoUrl}
        >
          <i className="fa fa-angle-left" />
        </Link>
        <span>
          {currentPhotoIndex + 1} of {photos.length}
        </span>
        <Link
          disabled={nextPhotoId == null}
          onClick={this.handleClick(nextPhotoId)}
          to={nextPhotoUrl}
        >
          <i className="fa fa-angle-right" />
        </Link>
      </PhotoCarouselControls>
    );
  }

  render() {
    return (
      <PhotoCarouselWrapper>
        {this.renderPhotoCarouselControls()}
        {this.renderPhotoCarousel()}
      </PhotoCarouselWrapper>
    );
  }
}

ImageNavigatorContainer.propTypes = {
  updatePhotoId: PropTypes.func,
  siteId: PropTypes.string.isRequired,
  areaId: PropTypes.string.isRequired,
  token: PropTypes.string,
  isShared: PropTypes.bool,
  prevPhotoId: PropTypes.string,
  photos: PropTypes.array.isRequired,
  currentPhotoIndex: PropTypes.number.isRequired,
  nextPhotoId: PropTypes.string,
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  isEditing: PropTypes.bool,
  areaDetail: PropTypes.object,
};

export default withRouter(ImageNavigatorContainer);
