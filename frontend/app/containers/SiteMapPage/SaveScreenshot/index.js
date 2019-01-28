import React from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';

import SlidingPane from 'components/SlidePane';
import { getSelectedLayers } from '../utils';
import { ScreenshotContainer, ScreenshotImage, AddButton } from './styled';

class SaveScreenshot extends React.Component {


  componentDidMount() {
    Modal.setAppElement('#app');
  }

  render() {
    const { isOpen, screenshot, onClose, layer, saveScreenshot } = this.props;

    if (!layer || !screenshot || !isOpen) return null;

    const selectedLayer = getSelectedLayers(layer.data)[0];
    let prefix = '';
    if (selectedLayer) {
      prefix = isNaN(selectedLayer.name) ? '' : 'Repairs';
    } else {
      prefix = 'Property';
    }
    const screenshotURL = URL.createObjectURL(screenshot);
    const screenshotTitle = `${prefix} ${selectedLayer ? selectedLayer.name : ''} Screenshot`;

    return (
      <SlidingPane
        isOpen={isOpen}
        title="Save Screenshot"
        onRequestClose={onClose}
      >
        <h4>{screenshotTitle}</h4>
        <ScreenshotContainer>
          <ScreenshotImage src={screenshotURL} alt="Screenshot" />
        </ScreenshotContainer>
        <AddButton onClick={saveScreenshot}>Save screenshot</AddButton>
        <small>NOTE: This picture will be saved and associated as the {screenshotTitle} for this site.
        You can later replace it with a new one.
        </small>
      </SlidingPane>
    );
  }
}

SaveScreenshot.propTypes = {
  isOpen: PropTypes.bool,
  screenshot: PropTypes.object,
  onClose: PropTypes.func,
  layer: PropTypes.any,
  saveScreenshot: PropTypes.func,
};

export default SaveScreenshot;
