import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Document as DocumentRenderer, Page as PageRenderer, setOptions } from 'react-pdf';
import { PDFRenderer, createElement, pdf, Font } from '@react-pdf/renderer';
import debounce from 'lodash/debounce';
import { doc } from './template';

import {
  Wrapper,
  DocumentWrapper,
} from './styled';

import './styles.css';

setOptions({
  workerSrc: '/js/pdf.worker.js',
});

Font.registerEmojiSource({
  format: 'png',
  url: 'https://twemoji.maxcdn.com/2/72x72/',
});

class BidSheetPDF extends Component {

  state ={
    numPages: null,
    currentPage: 1,
    document: null,
    toggledYears: [],
  }

  componentDidMount() {
    this.renderPDF(this.props.code);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.pdfDocument !== this.state.document) return;
    if (nextProps.toggledYears.length !== this.state.toggledYears.length) {
      this.renderPDF(doc(
        nextProps.values.textValues,
        nextProps.values.color,
        nextProps.values.checkboxValues.zones,
        nextProps.values.checkboxValues.repairs,
        nextProps.clientLogo,
        nextProps.logoPermitted,
        nextProps.siteDetail,
        nextProps.zones,
        nextProps.repairs,
        nextProps.toggledYears,
        nextProps.zoneMapScreenshot,
        nextProps.screenshotRepairs,
        nextProps.propertyScreenshot
      ));
      this.setState({ toggledYears: nextProps.toggledYears });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.pdfDocument !== nextState.document) {
      return false;
    }
    return true;
  }

  onDocumentLoad = ({ numPages }) => {
    const { currentPage } = this.state;
    this.setState({
      numPages,
      currentPage: Math.min(currentPage, numPages),
    });
  };

  needReRender = () => this.state.toggledYears;

  renderPDF = debounce((code) => {
    const container = createElement('ROOT');
    const mountNode = PDFRenderer.createContainer(container);
    PDFRenderer.updateContainer(code, mountNode, this);
    pdf(container)
        .toBlob()
        .then((blob) => {
          const url = URL.createObjectURL(blob);
          this.props.handleDocumentLoad(url);
          this.setState({ document: url });
        });
  }, 500);

  render() {
    const { numPages } = this.state;

    if (!this.state.document) {
      return null;
    }

    const pages = [];
    for (let i = 1; i <= numPages; i += 1) {
      pages.push((<PageRenderer key={i} pageNumber={i} scale={1.1} />));
    }

    return (
      <Wrapper>
        <DocumentWrapper>
          <DocumentRenderer
            file={this.state.document}
            onLoadSuccess={this.onDocumentLoad}
            className="pdf-document"
          >
            {pages}
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
  pdfDocument: PropTypes.string,
  handleDocumentLoad: PropTypes.func,
  siteDetail: PropTypes.object,
  zones: PropTypes.any,
  repairs: PropTypes.any,
  toggledYears: PropTypes.array,
  zoneMapScreenshot: PropTypes.object,
  screenshotRepairs: PropTypes.object,
  propertyScreenshot: PropTypes.object,
};

export default BidSheetPDF;

