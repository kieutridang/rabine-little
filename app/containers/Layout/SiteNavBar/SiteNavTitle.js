import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import BackImage from '../../../images/left-arrow.svg';
import Box from '../../../components/Box';

const StyledTitle = styled.div`
  opacity: 0.5;
  font-size: 18px;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: #373737;
`;

const StyledGoBack = styled.div`
  margin-right: 15px;
  margin-left: 10px;
  cursor: pointer;
  svg {
    width: 14px;
    height: 14px;
  }
  &:hover {
    margin-left: 5px;
    margin-right: 20px;
  }
  transition: all .5s ease-in-out;
`;

const SiteNavTitle = ({ title, onGoBack }) => (
  <Box
    fill
    direction="row"
    padding={{
      top: '16px',
    }}
  >
    <StyledGoBack
      onClick={onGoBack}
    >
      <BackImage />
    </StyledGoBack>

    <StyledTitle>
      {title}
    </StyledTitle>
  </Box>
);

SiteNavTitle.propTypes = {
  title: PropTypes.string,
  onGoBack: PropTypes.func,
};

export default SiteNavTitle;
