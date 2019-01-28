import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Avatar from 'react-avatar';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import styled from 'styled-components';

import { dollarFormatter } from '../../../utils/number/numberUtils';
const ShareLinkWrapper = styled.div`
  display: flex;
`;

const ShareLinkInput = styled.input`
  width: 70%;
  height: 2.4rem;
  padding: 0 0.6rem;
  background: hsla(200, 16%, 96%, 1.0);
  border: 1px solid hsla(240, 7%, 94%, 1.0);
  border-radius: 4px;
  color: hsla(0, 0%, 0%, 0.8);
`;

const ShareLinkButton = styled.button`
  width: 25%;
  margin-left: 0.4rem;
  margin-right: 0.5rem;
  padding: 0 0.8rem;
  background: hsla(0, 0%, 95%, 1.0);
  border: 1px solid hsla(0, 0%, 50%, 0.3);
  border-radius: 4px;

  color: hsla(0, 0%, 0%, 0.8);
  cursor: pointer;

  &:hover {
    background: hsla(0, 0%, 100%, 1.0);
  }

  &.success {
    color: hsla(157, 41%, 49%, 1.0);
  }
`;

const SyncButton = styled.button`
  width: 25%;
  margin-left: 0.4rem;
  margin-right: 0.5rem;
  padding: 0 0.8rem;
  background: hsla(0, 0%, 95%, 1.0);
  border: 1px solid hsla(0, 0%, 50%, 0.3);
  border-radius: 4px;

  color: hsla(157, 41%, 49%, 1.0);
  cursor: pointer;

  &:hover {
    background: hsla(0, 0%, 100%, 1.0);
  }
`;


const ShareLinkLoader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  height: 2.4rem;

  background: hsla(0, 0%, 50%, 1.0);
  border-radius: 4px;

  opacity: 0;
  visibility: hidden;
  transition: all 120ms ease;

  cursor: not-allowed;

  &.active {
    opacity: 0.98;
    visibility: visible;
  }
`;

const InfoContainerComponent = ({
  className,
  data,

  isMapShareLinkError,
  mapShareLinkUrl,
  isMapShareLinkCopied,
  mapShareLinkCopied,

  isPhotosShareLinkError,
  photosShareLinkUrl,
  isPhotosShareLinkCopied,
  photosShareLinkCopied,
  syncFolder,
  syncS3IsLoading,
}) => {
  const {
    name,
    clientName,
    address,
    deadline,
    type,
    cost,
    droneCost,
    dronePartnerName,
    sqFoot,
    rabineS3Folder,
  } = data;

  return (
    <div className={className}>
      <Info title="site name">
        {name}
      </Info>
      <Info title="client name" verticalAlign={'middle'}>
        <Avatar round name={clientName} size={20} /> <a href="" onClick={(e) => e.preventDefault()}>{clientName}</a>
      </Info>
      <Info title="address">
        {address}
      </Info>
      <Info title="deadline">
        {moment(deadline).format('MMM. DD, YYYY')}
      </Info>
      <Info title="site type">
        {type}
      </Info>
      {
        cost &&
        <Info title="cost">
          {`$${dollarFormatter(cost, 0)}`}
        </Info>
      }
      {
        droneCost &&
        <Info title="drone cost">
          {`$${dollarFormatter(droneCost, 0)}`}
        </Info>
      }
      {
        dronePartnerName &&
        <Info title="drone partner">
          <a href="" onClick={(e) => e.preventDefault()}>{dronePartnerName}</a>
        </Info>
      }
      {
        sqFoot &&
        <Info title="square foot">
          {sqFoot}
        </Info>
      }
      {
        rabineS3Folder &&
        <Info title="S3 Folder">
          {rabineS3Folder}
          <SyncButton disabled={syncS3IsLoading} onClick={syncFolder}>
            { syncS3IsLoading ? 'Syncing...' : 'Sync' }
          </SyncButton>
        </Info>
      }

      <Info title="map share link">
        <ShareLinkLoader className={(!mapShareLinkUrl || isMapShareLinkError) && 'active'}>
          {isMapShareLinkError ? 'Error' : 'Generating..'}
        </ShareLinkLoader>
        {mapShareLinkUrl && (
          <ShareLinkWrapper>
            <ShareLinkInput type="text" readOnly value={mapShareLinkUrl} />
            <CopyToClipboard
              text={mapShareLinkUrl}
              onCopy={() => mapShareLinkCopied()}
            >
              <ShareLinkButton className={isMapShareLinkCopied && 'success'}>
                {isMapShareLinkCopied ? 'Copied' : 'Copy'}
              </ShareLinkButton>
            </CopyToClipboard>
          </ShareLinkWrapper>)}
      </Info>
      <Info title="photos share link">
        <ShareLinkLoader className={(!photosShareLinkUrl || isPhotosShareLinkError) && 'active'}>
          {isPhotosShareLinkError ? 'Error' : 'Generating..'}
        </ShareLinkLoader>
        {photosShareLinkUrl && (
          <ShareLinkWrapper>
            <ShareLinkInput type="text" readOnly value={photosShareLinkUrl} />
            <CopyToClipboard
              text={photosShareLinkUrl}
              onCopy={() => photosShareLinkCopied()}
            >
              <ShareLinkButton className={isPhotosShareLinkCopied && 'success'}>
                {isPhotosShareLinkCopied ? 'Copied' : 'Copy'}
              </ShareLinkButton>
            </CopyToClipboard>
          </ShareLinkWrapper>)}
      </Info>
    </div>
  );
};

InfoContainerComponent.propTypes = {
  className: PropTypes.string,
  data: PropTypes.object,

  isMapShareLinkError: PropTypes.bool.isRequired,
  isMapShareLinkCopied: PropTypes.bool.isRequired,
  mapShareLinkUrl: PropTypes.string.isRequired,
  mapShareLinkCopied: PropTypes.func.isRequired,

  isPhotosShareLinkError: PropTypes.bool.isRequired,
  isPhotosShareLinkCopied: PropTypes.bool.isRequired,
  photosShareLinkUrl: PropTypes.string.isRequired,
  photosShareLinkCopied: PropTypes.func.isRequired,
  syncFolder: PropTypes.func.isRequired,
  syncS3IsLoading: PropTypes.bool,
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
