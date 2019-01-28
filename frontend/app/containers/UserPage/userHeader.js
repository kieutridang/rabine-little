import React from 'react';
import PropTypes from 'prop-types';
import Input from '../../components/Input';
import Button from '../../components/Button';
import SearchIcon from '../../images/search.png';
import HeaderTitle from '../../components/Title/HeaderTitle';
import ContentHeader from '../../components/Content/ContentHeader';
import ContentForm from '../../components/Content/ContentForm';

const UserHeader = (props) => (
  <ContentHeader>
    <HeaderTitle title="USERS" subtitle="6 users" />

    <ContentForm>
      <Input
        id="name"
        name="name"
        width="13.75rem"
        height="2.5rem"
        placeholder="Search Users"
        icon={SearchIcon}
        margin={{
          right: '13px',
        }}
      />
      <Button
        width="8.4375rem"
        height="2.5rem"
        color="primary"
        label="ADD NEW USER"
        onClick={props.openInviteUserPane}
      />
    </ContentForm>
  </ContentHeader>
);
UserHeader.propTypes = {
  openInviteUserPane: PropTypes.func,
};
export default UserHeader;
