import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Avatar from 'react-avatar';
import MuiChip from '@material-ui/core/Chip';
import styled from 'styled-components';
import { dollarFormatter } from '../../../utils/number/numberUtils';

const InfoContainerComponent = ({ data: {
  project,
  clientName,
  address,
  deadline,
  services,
  rabineS3Folder,
  dronePlan,
} = {} }) => (
  <div>
    {
      project &&
      <Info title="Project">
        { project }
      </Info>
    }
    <Info title="Client Name" verticalAlign={'middle'}>
      <Avatar round name={clientName} size={20} /> <a href="" onClick={(e) => e.preventDefault()}>{clientName}</a>
    </Info>
    <Info title="Address">
      {address}
    </Info>
    <Info title="Deadline">
      {moment(deadline).format('MMM. DD, YYYY')}
    </Info>

    {
      renderServiceChips(services)
    }
    {
      renderServiceCost(services)
    }
    {
      renderDronePlanName(dronePlan)
    }
    {
      renderS3Folder(rabineS3Folder)
    }
  </div>
);

const renderServiceChips = (services) =>
  services && services.length
  ? (
    <Info title="Service type">
      {
        services.map(({ type }) => (
          <Chip label={type} key={`${type}_label`} />
        ))
      }
    </Info>
  )
  : null;

const renderServiceCost = (services) =>
  services && services.length ? services.map(({ type, cost }) => (
    <Info title={`${type} cost`} key={`${type}_cost`}>
      { `$${dollarFormatter(cost, 0)}` }
    </Info>
  )) : null;

const renderDronePlanName = (dronePlan) =>
  dronePlan ? (
    <Info title="Drone deploy plan">
      { dronePlan.name }
    </Info>
  ) : null;

const renderS3Folder = (rabineS3Folder) =>
  rabineS3Folder &&
  <Info title="S3 Folder">
    {rabineS3Folder}
  </Info>;

InfoContainerComponent.propTypes = {
  // className: PropTypes.string,
  data: PropTypes.object,
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

const Chip = styled(MuiChip)`
  color: #ffffff !important;
  font-family: 'Source Sans Pro','Open Sans','Helvetica Neue',Helvetica,Arial,sans-serif !important;
  margin: 0 2px !important;

  &:first-child {
    margin: 0 2px 0 0;
  }

  &:last-child {
    margin: 0 0 0 2px;
  }
`;
