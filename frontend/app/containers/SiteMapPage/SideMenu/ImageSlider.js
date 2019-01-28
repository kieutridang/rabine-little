import React, { Component } from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';

import {
  SideMenuImageSliderIndicator,
  SideMenuImageContentContainer,
  SideMenuImageCounter,
  SideMenuImageSliderItem,
  SideMenuImage,
} from './elements';
import ArrowLeft from '../../../images/icons/keyboard_arrow_left.svg';
import ArrowRight from '../../../images/icons/keyboard_arrow_right.svg';
import ImageItem from './ImageItem';
import LoadingIndicator from '../../../components/LoadingIndicator';
import NoImageAvailable from '../../../images/no-image-available.jpg';

class ImageSlider extends Component {
  state = {
    imageIndex: 0,
  }

  onNextImage = () => this.setState((prevState) => ({ imageIndex: prevState.imageIndex + 1 }));
  onPrevImage = () => this.setState((prevState) => ({ imageIndex: prevState.imageIndex - 1 }));

  render() {
    const { imageIndex } = this.state;
    const { siteRepairPhotos } = this.props;

    const enableColorButton = 'hsla(0, 0%, 100%, 1.0)';
    const disableColorButton = 'hsla(0, 0%, 100%, 0.5)';
    const hasImage = !!siteRepairPhotos && siteRepairPhotos.length !== 0;

    return hasImage ? (
      <SideMenuImageContentContainer>
        <ImageItem
          photo={siteRepairPhotos[imageIndex]}
        />

        <SideMenuImageSliderIndicator>
          <IconButton disabled={imageIndex === 0} onClick={this.onPrevImage}>
            <ArrowLeft color={imageIndex === 0 ? disableColorButton : enableColorButton} />
          </IconButton>
          <SideMenuImageCounter>
            {`${imageIndex + 1} of ${siteRepairPhotos.length}`}
          </SideMenuImageCounter>
          <IconButton disabled={imageIndex === siteRepairPhotos.length - 1} onClick={this.onNextImage}>
            <ArrowRight color={imageIndex === siteRepairPhotos.length - 1 ? disableColorButton : enableColorButton} />
          </IconButton>
        </SideMenuImageSliderIndicator>
      </SideMenuImageContentContainer>
    ) : <NoImage siteRepairPhotos={siteRepairPhotos} />;
  }
}

const NoImage = (siteRepairPhotos) => !siteRepairPhotos ? (
  <LoadingIndicator />
) : (
  <SideMenuImageContentContainer>
    <SideMenuImageSliderItem>
      <SideMenuImage src={NoImageAvailable} title="No image" />
    </SideMenuImageSliderItem>
  </SideMenuImageContentContainer>
);

ImageSlider.propTypes = {
  siteRepairPhotos: PropTypes.array,
};

export default ImageSlider;
