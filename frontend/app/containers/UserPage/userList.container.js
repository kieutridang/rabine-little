// vendor
import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import moment from 'moment';
import { makeGetAllUsers } from '../../appSelector/user';
import FilterableTable from '../../components/FilterTable';
import { actions } from '../../appReducer/user.reducer';
import { USER_USER } from '../../constants';

const renderFunctions = () => <span>⋮</span>;

const renderUserType = (props) => {
  const { userType } = props.record;
  return userType || USER_USER;
};

const renderLoginTime = (props) => {
  const { lastLogin } = props.record;
  return lastLogin || moment().format('MM/DD/YY hh:mm a');
};

const fields = [
  { name: 'fullName', displayName: 'Name', inputFilterable: true, sortable: true },
  { name: 'username', displayName: 'Email', inputFilterable: true, sortable: true },
  { name: 'userType', displayName: 'User Type', inputFilterable: true, sortable: true, render: renderUserType },
  { name: 'clientTitle', displayName: 'Title', inputFilterable: true, sortable: true },
  { name: 'company', displayName: 'Client', inputFilterable: true, sortable: true },
  { name: 'sitesAssigned', displayName: 'Sites Assigned', inputFilterable: true, sortable: true },
  { name: 'lastLogin', displayName: 'Last Login', inputFilterable: true, sortable: true, render: renderLoginTime },
  { name: '', displayName: ' ', inputFilterable: false, sortable: false, render: renderFunctions },
];

class UserListContainer extends React.Component {
  componentDidMount() {
    this.props.getUsersRequest();
    this.props.getInvitedUserRequest();
  }

  render() {
    const { users = [] } = this.props;
    const data = users;

    return (
      <FilterableTable
        namespace="People"
        initialSort="name"
        data={data}
        fields={fields}
        noRecordsMessage="There are no user to display"
        noFilteredRecordsMessage="No user data match your filters!"
        topPagerVisible={false}
        headerVisible={false}
      />
    );
  }
}

UserListContainer.propTypes = {
  getUsersRequest: PropTypes.func,
  getInvitedUserRequest: PropTypes.func,
  users: PropTypes.arrayOf(PropTypes.object),
};

const mapStateToProps = createStructuredSelector({
  users: makeGetAllUsers(),
});

const mapDispatchToProps = (dispatch) => ({
  getUsersRequest: (filter) => dispatch(actions.getUsersRequest(filter)),
  getInvitedUserRequest: (filter) => dispatch(actions.getInvitedUsersRequest(filter)),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default compose(withConnect)(UserListContainer);
