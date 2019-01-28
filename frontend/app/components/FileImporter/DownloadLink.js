import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledLink = styled.a`
`;

class DownloadLink extends Component {
  handleDownloadFile = (event) => {
    const {
      fileName,
      data,
    } = this.props;

    const csvBlob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(csvBlob, fileName);
    } else {
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(csvBlob);
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    event.stopPropagation();
  }

  render() {
    const {
      label,
    } = this.props;

    return (
      <StyledLink href="#" onClick={this.handleDownloadFile}>{ label }</StyledLink>
    );
  }
}

DownloadLink.propTypes = {
  fileName: PropTypes.string,
  label: PropTypes.string,
  data: PropTypes.any,
};

export default DownloadLink;
