// app
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
// vendor
import DropdownMenu from '../../components/DropdownMenu';
import ConfirmDialog from '../../components/Dialog/ConfirmDialog';
import { actions as siteRepairActions } from '../../appReducer/siteRepairs.reducer';
import { selectFeatureType } from '../../appSelector/siteRepairs';

const SiteRepairListDropdownMenu = (props) => {
  const { deleteSiteRepair, node, viewSiteRepair, featureType } = props;
  const { data } = node;
  if (data) {
    const { id, title, zone, isManually } = data;
    if (featureType) {
      data.featureType = featureType;
    }
    const buttonText = isManually ? 'Delete' : 'View';
    const action = isManually ? deleteSiteRepair : viewSiteRepair;
    const content = isManually ? `Are you sure to delete site repair ${title}, ${zone}?` : null;
    const options = [{
      key: `delete_${id}`,
      title: 'Delete',
      renderItem: (component, callback) => (
        <ConfirmDialog
          key={`delete_${id}`}
          title="Confirm"
          buttonText={buttonText}
          content={content}
          action={action}
          params={[data]}
          component={component}
          callback={callback}
        />
      ),
    }];

    return (<DropdownMenu options={options} />);
  }

  return null;
};

SiteRepairListDropdownMenu.propTypes = {
  deleteSiteRepair: PropTypes.func,
  viewSiteRepair: PropTypes.func,
  node: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  featureType: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  featureType: selectFeatureType(),
});

const mapDispatchToProps = (dispatch) => ({
  deleteSiteRepair: (payload) => dispatch(siteRepairActions.deleteSiteRepair(payload)),
  viewSiteRepair: (payload) => dispatch(push(`/sites/${payload.siteId}/map/feature/${payload.id}`)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SiteRepairListDropdownMenu);
