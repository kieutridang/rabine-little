import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import './style.css';

const SyncPhotoStatus = styled.div`
  flex: 1;
  padding: 0px;
  .progress {
    border-radius: 3px;
    background-color: #e1f7e1;
    height: 5px;
    position: relative;
    width: 100%;
    margin-left: -8px;
    margin-bottom: -10px;
    width: 100%;
  }
  .progress-bar {
    width: ${(props) => `${(props.synced * 100) / props.total}%`};  
    background: #4fdb5f;
    background-size: 100% 5px;
    height: 100%;
    position: relative;
    border-radius: 3px;
    opacity: 1.0;
  }
`;

//

const SyncPhotoIndicator = ({ total, synced }) => (
  <SyncPhotoStatus className="sync-status" total={total} synced={synced}>
    <div className="progress">
      <div className="progress-bar" />
    </div>
  </SyncPhotoStatus>
);

SyncPhotoIndicator.propTypes = {
  total: PropTypes.number,
  synced: PropTypes.number,
};

const Msg = ({ title, content, total, synced }) => (
  <div>
    <div className="toast-title">{ title } </div>
    <div className="toast-content">{ content }</div>
    <SyncPhotoIndicator total={total} synced={synced} />
  </div>
);

Msg.propTypes = {
  content: PropTypes.string,
  title: PropTypes.string,
  total: PropTypes.number,
  synced: PropTypes.number,
};

export default Msg;
