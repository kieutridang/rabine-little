import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Document as DocumentRenderer, Page as PageRenderer, setOptions } from 'react-pdf';
import { PDFRenderer, createElement, pdf, Font } from '@react-pdf/renderer';
import debounce from 'lodash/debounce';

import { doc } from './template';
import { Wrapper, DocumentWrapper } from './styled';

setOptions({ workerSrc: '/js/pdf.worker.js' });

Font.registerEmojiSource({
  format: 'png',
  url: 'https://twemoji.maxcdn.com/2/72x72/',
});

class BidSheetPDF extends Component {
  state ={
    numPages: null,
    currentPage: 1,
    document: null,
  };

  componentDidMount() {
    this.renderPDF(this.props.code);
  }

  componentWillReceiveProps(nextProps) {
    this.renderPDF(doc(
        nextProps.values.textValues,
        nextProps.values.color,
        nextProps.values.checkboxValues.zones,
        nextProps.values.checkboxValues.repairs,
        nextProps.clientLogo,
        nextProps.logoPermitted,
    ));
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.document !== this.state.document) {
      return true;
    }

    return false;
  }

  onDocumentLoad = ({ numPages }) => {
    const { currentPage } = this.state;

    this.setState({
      numPages,
      currentPage: Math.min(currentPage, numPages),
    });
  };

  renderPDF = debounce((code) => {
    const container = createElement('ROOT');
    const mountNode = PDFRenderer.createContainer(container);

    PDFRenderer.updateContainer(code, mountNode, this);

    pdf(container).toBlob()
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        this.setState({ document: url });
      })
      .catch((err) => console.log(err));  // eslint-disable-line no-console
  }, 500);

  render() {
    if (!this.state.document) {
      return null;
    }

    const { currentStep } = this.props; // get current step of stepper
    const currentPage = currentStep + 1; // set current page of pdf

    return (
      <Wrapper>
        <DocumentWrapper>
          <DocumentRenderer
            file={this.state.document}
            onLoadSuccess={this.onDocumentLoad}
          >
            <PageRenderer pageNumber={currentPage} />
          </DocumentRenderer>
        </DocumentWrapper>
      </Wrapper>
    );
  }
}

BidSheetPDF.propTypes = {
  code: PropTypes.any,
  values: PropTypes.any,
  clientLogo: PropTypes.object,
  logoPermitted: PropTypes.bool,
  currentStep: PropTypes.number,
};

export default BidSheetPDF;
