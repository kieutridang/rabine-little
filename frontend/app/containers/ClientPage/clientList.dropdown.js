// app
import React from 'react';
import PropTypes from 'prop-types';
// vendor
import DropdownMenu from '../../components/DropdownMenu';
import ConfirmDialog from '../../components/Dialog/ConfirmDialog';

const ClientListDropdownMenu = ({ deleteClientRequest, data }) => {
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
          content={`Are you sure to delete client ${name}?`}
          action={deleteClientRequest}
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

ClientListDropdownMenu.propTypes = {
  deleteClientRequest: PropTypes.func,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

export default ClientListDropdownMenu;
