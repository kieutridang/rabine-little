// app
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// vendor
import { actions } from '../../../appReducer/site.reducer';
import DropdownMenu from '../../../components/DropdownMenu';
import ConfirmDialog from '../../../components/Dialog/ConfirmDialog';

const SiteListDropdownMenu = ({ deleteSiteRequest, data }) => {
  const { id, name } = data;
  const options = [
    {
      key: `delete_${id}`,
      title: 'Delete',
      renderItem: (component, callback) => (
        <ConfirmDialog
          key={`delete_${id}`}
          title="Confirm"
          buttonText="Delete"
          content={`Are you sure to delete site ${name}?`}
          action={deleteSiteRequest}
          params={[id]}
          component={component}
          callback={callback}
        />
      ),
    },
  ];

  return (
    <DropdownMenu options={options} />
  );
};

SiteListDropdownMenu.propTypes = {
  deleteSiteRequest: PropTypes.func,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

const mapDispatchToProps = (dispatch) => ({
  deleteSiteRequest: (siteId) => dispatch(actions.deleteSiteRequest(siteId)),
});

const withConnect = connect(null, mapDispatchToProps);

export default withConnect(SiteListDropdownMenu);
