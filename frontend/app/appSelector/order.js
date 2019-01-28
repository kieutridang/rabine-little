import { createSelector } from 'reselect';
import moment from 'moment';

import { equalMatch } from '../utils/common';

const selectOrder = (state) => state.get('order');
const selectFilters = (state) => state.get('filter');

const makeSelectError = () => createSelector(
  selectOrder,
  (state) => state.get('error') ? state.get('error').message : null
);

const makeSelectOrder = () => createSelector(
  selectOrder,
  (state) => state.get('order')
);

const makeGetOrders = () => createSelector(
  selectOrder,
  selectFilters,
  (orderSelector, filterSelector) => {
    const orders = orderSelector.get('orders');
    const siteNameFilter = filterSelector.get('siteName');
    const startDateFilter = filterSelector.get('startDate');
    const endDateFilter = filterSelector.get('endDate');

    const clientIdFilter = filterSelector.get('clientId');

    const filteredOrders = orders
      ? orders.filter((order) => {
        const deadline = moment(order.deadline);
        const siteNameMatch =
            siteNameFilter && order.name ? order.name.toLowerCase().includes(siteNameFilter.toLowerCase()) : true;
        const siteAddressMatch =
            siteNameFilter && order.address ? order.address.toLowerCase().includes(siteNameFilter.toLowerCase()) : true;
        const startDateMatch = startDateFilter && deadline ? startDateFilter.isSameOrBefore(deadline, 'day') : true;
        const endDateMatch = endDateFilter && deadline ? endDateFilter.isSameOrAfter(deadline, 'day') : true;

        const clientIdMatch = equalMatch(order.clientId, clientIdFilter);

        return (siteNameMatch || siteAddressMatch)
          && startDateMatch
          && endDateMatch
          && clientIdMatch;
      })
      : orders;

    return filteredOrders;
  }
);

const makeGetLoadingState = () => createSelector(
  selectOrder,
  (state) => state.get('isLoading')
);

const makeIsOrderOpen = () => createSelector(
  selectOrder,
  (state) => state.get('isOpen')
);

export {
  makeSelectError,
  makeSelectOrder,
  makeGetOrders,
  makeGetLoadingState,
  makeIsOrderOpen,
};

