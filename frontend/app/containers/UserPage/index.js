import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ContentWrapper from '../../components/Content/ContentWrapper';
import ContentData from '../../components/Content/ContentData';
import { actions } from '../../appReducer/user.reducer';
import UserHeader from './userHeader';
import UserList from './userList.container';
import InviteUserPane from './inviteUserPane.container';

class UserPage extends React.Component {

  onInviteUserHandler = () => this.props.showInviteUser();
  render() {
    return (
      <ContentWrapper>
        <UserHeader openInviteUserPane={this.onInviteUserHandler} />
        <ContentData>
          <UserList />
        </ContentData>
        <InviteUserPane />
      </ContentWrapper>
    );
  }
}

UserPage.propTypes = {
  showInviteUser: PropTypes.func,
};

const mapDispatchToProps = (dispatch) => ({
  showInviteUser: () => dispatch(actions.showInviteUser()),
});

export default connect(
  null,
  mapDispatchToProps
)(UserPage);
