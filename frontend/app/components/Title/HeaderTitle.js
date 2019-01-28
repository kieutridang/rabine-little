// vendor
import React from 'react';
import PropTypes from 'prop-types';

// app
import Box from '../Box/index';
import { StyledHeaderTitle, StyledHeaderSubTitle } from './StyledTitle';

const HeaderTitle = ({ title, subtitle }) => (
  <Box
    direction="column"
    flex="grow"
  >
    <StyledHeaderTitle>
      { title }
    </StyledHeaderTitle>

    <StyledHeaderSubTitle>
      { subtitle }
    </StyledHeaderSubTitle>
  </Box>
);

HeaderTitle.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
};

HeaderTitle.defaultProps = {
  title: '',
};

export default HeaderTitle;
