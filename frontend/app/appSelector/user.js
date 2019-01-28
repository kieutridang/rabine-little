import { createSelector } from 'reselect';

const selectUser = (state) => state.get('user');

const selectFilters = (state) => state.get('filter');

const makeSelectError = () => createSelector(
  selectUser,
  (state) => (state.get('error') ? state.get('error').message : null)
);

const makeSelectUser = () => createSelector(
  selectUser,
  (state) => state.get('user')
);

const makeSelectClients = () => createSelector(
  selectUser,
  (state) => state.get('clients')
);

const makeGetUsers = () => createSelector(
  selectUser,
  (state) => state.get('users')
);

const makeGetUsersWithFilters = () => createSelector(
  selectUser,
  selectFilters,
  (userSelector, filterSelector) => {
    const users = userSelector.get('users') || [];
    const userNameFilter = filterSelector.get('userName');

    const filteredUsers = users ? users.filter((user) => {
      const userNameMatch = userNameFilter ?
        user.name.toLowerCase().includes(userNameFilter.toLowerCase()) : true;
      return userNameMatch;
    }) : users;

    return filteredUsers;
  }
);

const makeGetAllUsers = () => createSelector(
  selectUser,
  selectFilters,
  (userSelector, filterSelector) => {
    const users = userSelector.get('users') || [];
    const invitedUsers = userSelector.get('invitedUsers') || [];
    const userNameFilter = filterSelector.get('userName');
    const allUsers = users.concat(invitedUsers);

    const filteredUsers = allUsers ? allUsers.filter((user) => {
      const userNameMatch = userNameFilter ?
        user.name.toLowerCase().includes(userNameFilter.toLowerCase()) : true;
      return userNameMatch;
    }) : allUsers;

    return filteredUsers;
  }
);

const makeIsUserOpen = () => createSelector(
  selectUser,
  (state) => state.get('isOpen')
);

const makeGetToken = () => createSelector(
  selectUser,
  (state) => state.get('token')
);

export {
    makeSelectError,
    makeSelectUser,
    makeSelectClients,
    makeIsUserOpen,
    makeGetUsers,
    makeGetAllUsers,
    makeGetUsersWithFilters,
    makeGetToken,
};
