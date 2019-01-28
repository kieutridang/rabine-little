import React from 'react';
import PropTypes from 'prop-types';
import Modal from '@material-ui/core/Modal';

import {
  SideMenuImageSliderItem,
  SideMenuImage,
  SideMenuImageZoomButton,
  SideMenuZoomImageContainer,
} from './elements';
import FullscreenIcon from '../../../images/icons/fullscreen.svg';

class ImageItem extends React.Component {
  state = {
    showFullSize: false,
  }

  showFullSizeImage = () => this.setState({ showFullSize: true });
  closeFullSizeImage = () => this.setState({ showFullSize: false });

  render() {
    const { photo } = this.props;
    const { showFullSize } = this.state;

    return (
      <SideMenuImageSliderItem>
        <SideMenuImage src={photo.thumbnailUrl} title={photo.title} />
        <SideMenuImageZoomButton onClick={this.showFullSizeImage}>
          <FullscreenIcon color="#ffffff" width={12} height={12} />
        </SideMenuImageZoomButton>

        <Modal
          open={showFullSize}
          onClose={this.closeFullSizeImage}
          aria-labelledby="site-detail-info-title"
          aria-describedby="site-detail-info-description"
        >
          <SideMenuZoomImageContainer src={photo.url} />
        </Modal>
      </SideMenuImageSliderItem>
    );
  }
}

ImageItem.propTypes = {
  photo: PropTypes.object,
};

export default ImageItem;
