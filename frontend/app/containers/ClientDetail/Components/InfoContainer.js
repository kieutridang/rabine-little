import styled from 'styled-components';
import React from 'react';
import PropTypes from 'prop-types';

const InfoContainerComponent = ({ className, data }) => {
  const { address, contactName, phone, email } = data;
  return (
    <div className={className}>
      <Info title="address">
        {address}
      </Info>
      <Info title="contact name">
        {contactName}
      </Info>
      <Info title="phone">
        {phone}
      </Info>
      <Info title="email">
        {email}
      </Info>
    </div>
  );
};

InfoContainerComponent.propTypes = {
  className: PropTypes.string,
  data: PropTypes.any,
};

export const InfoContainer = styled(InfoContainerComponent)`
  grid-area: info;
  padding: 20px 0 48px 31px;
`;

const InfoComponent = ({ title, className, children }) => (
  <div className={className}>
    <h6>{title}</h6>
    {children}
  </div>
);

InfoComponent.propTypes = {
  className: PropTypes.string,
  children: PropTypes.any,
  title: PropTypes.string,
};

export const Info = styled(InfoComponent) `
  margin-bottom: 20px;
  color: #707277;
  font-size:14px;
  h6 {
    text-transform: uppercase;
    font-weight: bold;
    font-size: 10px;
  }
  &:last-child {
    margin-bottom: 0;
  }
  div, a {
    vertical-align: ${(props) => props.verticalAlign};
  }
`;
