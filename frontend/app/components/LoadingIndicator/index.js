import React from 'react';
import Spinner from 'react-spinkit';
import Wrapper from './Wrapper';

const LoadingIndicator = () => (
  <Wrapper>
    <Spinner name="line-scale" color="#ACAEB0" fadeIn="none" />
  </Wrapper>
);

export default LoadingIndicator;
