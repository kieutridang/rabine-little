import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import BackImage from '../../../images/left-arrow.svg';
import Box from '../../../components/Box';

const StyledTitle = styled.div`
  opacity: 0.8;
  font-size: 18px;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: ${(p) => p.color || '#444444'};
`;

const StyledGoBack = styled.div`
  margin-right: 15px;
  cursor: pointer;
  svg {
    width: 16px;
    height: 16px;
  }
  &:hover {
    margin-left: 5px;
    margin-right: 20px;
  }
  transition: all .5s ease-in-out;
`;

const SiteNavTitle = ({ title, onGoBack, color }) => (
  <Box
    fill="all"
    alignItems="center"
    direction="row"
  >
    <StyledGoBack
      onClick={onGoBack}
    >
      <BackImage />
    </StyledGoBack>

    <StyledTitle color={color}>
      {title}
    </StyledTitle>
  </Box>
);

SiteNavTitle.propTypes = {
  title: PropTypes.string,
  color: PropTypes.string,
  onGoBack: PropTypes.func,
};

export default SiteNavTitle;
