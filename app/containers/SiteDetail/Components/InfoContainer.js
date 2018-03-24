import styled from 'styled-components';
import React, { PropTypes } from 'react';
import moment from 'moment';
import Avatar from 'react-avatar';

const InfoContainerComponent = ({ className, data }) => (
  <div className={className}>
    <Info title="client name" verticalAlign={'middle'}>
      <Avatar round name={data.name} size={20} /> <a href="" onClick={(e) => e.preventDefault()}>{data.name}</a>
    </Info>
    <Info title="address">
      {data.address}
    </Info>
    <Info title="deadline">
      {moment(data.deadline).format('MMM. DD, YYYY')}
    </Info>
    <Info title="site type">
      {data.type}
    </Info>
    <Info title="cost">
      {data.cost}
    </Info>
    <Info title="drone cost">
      {data.droneCost}
    </Info>
    <Info title="drone partner">
      <a href="" onClick={(e) => e.preventDefault()}>{data.dronePartnerName}</a>
    </Info>
    <Info title="square foot">
      {data.sqFoot}
    </Info>
  </div>
);

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
