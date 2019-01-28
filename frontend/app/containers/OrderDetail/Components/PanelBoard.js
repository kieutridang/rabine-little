import React from 'react';
import PropTypes from 'prop-types';

import { DetailInfo } from '.';
import Panel from './Panel';
import {
  pavementOptions,
  roofingOptions,
  hvacOptions,
  landscapingOptions,
} from '../../Common/Options';
import LoadingIndicator from '../../../components/LoadingIndicator';

const PanelBoard = ({
  isDetailLoading,
  detailData,
  openEdit,
  editOrderDetail,
}) => (
  <DetailInfo>
    <Panel
      title="Details"
      isDetailLoading={isDetailLoading}
      detailData={detailData}
      enableEdit
      openEdit={openEdit}
      panelType="detail"
    />

    {
      isDetailLoading && <LoadingIndicator />
    }
    {
      detailData && !isDetailLoading &&
      renderServicePanels(detailData, editOrderDetail)
    }
  </DetailInfo>
);

const renderServicePanels = ({
    _id: orderId,
    siteId,
    services,
  },
  editOrderDetail,
) => {
  const servicePanels = Object.keys(serviceOptions).map((optionKey) => {
    const options = serviceOptions[optionKey];
    const service = services && services.length
      ? services
        .filter(({ type }) => type === optionKey)
        .reduce((accu, cur) => {
          accu = cur; // eslint-disable-line
          return accu;
        }, {})
      : {};

    return (
      <Panel
        subtitle
        key={optionKey}
        title={optionKey}
        type={optionKey}
        siteId={siteId}
        options={options}
        panelType="option"
        status={service.status}
        orderId={orderId}
        editOrderDetail={editOrderDetail}
      />
    );
  });

  return servicePanels;
};


const serviceOptions = {
  Pavement: pavementOptions,
  Roofing: roofingOptions,
  HVAC: hvacOptions,
  Landscaping: landscapingOptions,
};

PanelBoard.propTypes = {
  isDetailLoading: PropTypes.bool,
  detailData: PropTypes.object,
  openEdit: PropTypes.func,
  editOrderDetail: PropTypes.func,
};

export default PanelBoard;
