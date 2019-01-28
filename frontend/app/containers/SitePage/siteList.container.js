// vendor
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Spinner from 'react-spinkit';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';
import FilterableTable from 'react-filterable-table';

import { makeGetSitesWithFilters, makeGetLoadingState } from '../../appSelector/site';
import LoadingIndicator from '../../components/LoadingIndicator';
import { actions } from '../../appReducer/site.reducer';
import { dollarFormatter } from '../../utils/number/numberUtils';
import SiteListDropdownMenu from './SiteList/siteList.dropdown';
import { Checkbox, SiteSnackbarNumber } from './StyledComponents';
import CheckboxIcon from '../../images/icons/fill_checkbox.svg';
import SiteCheckAll from './SiteCheckAll';
import apiRepairs from '../../appApi/repairs';
import { statusOptions } from '../Common/Options';
import { downloadBlobFile, destroyDownloadResource } from '../../utils/files/fileUtils';

// this should be moved to new file later
const MOMENT_FORMAT = { MMM_DD_YYYY: 'MMM DD, YYYY' };

const renderFunctions = (props) => <SiteListDropdownMenu {...props} />;

const renderName = (props) => {
  const id = props.record.id;
  return (<Link to={`sites/${id}/design`}>{props.record.name}</Link>);
};

const renderDeadline = (props) => {
  const rawDeadline = props.record.deadline;
  const deadline = rawDeadline ? moment(rawDeadline).format(MOMENT_FORMAT.MMM_DD_YYYY).toString() : '';
  return (<div>{ deadline }</div>);
};

const renderCost = (props) => {
  const rawCost = props.record.cost;
  const cost = rawCost ? `$${dollarFormatter(rawCost, 0)}` : '';
  return (<div>{cost}</div>);
};

const renderDroneCost = (props) => {
  const rawCost = props.record.droneCost;
  const cost = rawCost ? `$${dollarFormatter(rawCost, 0)}` : '';
  return (<div>{cost}</div>);
};

const renderCheckbox = (props) => {
  const { record: { id }, checked, onSelectRow } = props;
  const onChange = () => {
    if (onSelectRow) onSelectRow(id);
  };

  return (
    <Checkbox
      name={id}
      id={id}
      onChange={onChange}
      checked={checked}
      checkedIcon={<CheckboxIcon />}
      className="Site__Checkbox"
    />
  );
};

const recordType = PropTypes.shape({
  id: PropTypes.string,
  droneCost: PropTypes.number,
  cost: PropTypes.number,
  deadline: PropTypes.string,
});

renderFunctions.propTypes = {
  record: recordType,
  deleteSiteRequest: PropTypes.func,
};
renderDroneCost.propTypes = { record: recordType };
renderDeadline.propTypes = { record: recordType };
renderName.propTypes = { record: recordType };
renderCost.propTypes = { record: recordType };
renderCheckbox.propTypes = {
  record: recordType,
  checked: PropTypes.bool,
  onSelectRow: PropTypes.func,
};

class SiteListContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedIds: [],
      checkedAll: false,
      activateCheckAll: false,
      downloadingRepairs: false,
    };

    this.fields = [
      {
        name: 'id',
        displayName: '',
        sortable: false,
        render: (tableProps) => renderCheckbox({
          ...tableProps,
          checked: this.state.selectedIds.findIndex((selectedId) => selectedId === tableProps.record.id) !== -1,
          onSelectRow: this.handleSelectRecord,
        }),
      },
      { name: 'name', displayName: 'Site Name', sortable: true, render: renderName },
      { name: 'address', displayName: 'Address', sortable: true },
      { name: 'deadline', displayName: 'Deadline', sortable: true, render: renderDeadline },
      { name: 'cost', displayName: 'Cost', sortable: true, render: renderCost },
      { name: 'status', displayName: 'Status', sortable: true, render: this.renderStatus },
      { name: 'droneCost', displayName: 'Total Repairs', sortable: true, render: renderDroneCost },
      {
        name: '',
        displayName: ' ',
        inputFilterable: false,
        sortable: false,
        render: (prop) => renderFunctions({
          ...prop,
          deleteSiteRequest: this.props.deleteSiteRequest,
        }),
      },
    ];
  }

  componentWillMount() {
    this.props.getSitesRequest();
  }

  componentDidUpdate() {
    if (this.currentSort && this.table && this.table.state.sort !== this.currentSort) {
      this.table.updateSort(this.currentSort);
    }
    if (this.currentPage && this.table && this.table.state.page !== this.currentPage) {
      this.table.updatePage(this.currentPage);
    }
  }

  setTableRef = (ref) => {
    this.table = ref;
    this.setState({ activateCheckAll: true });
  };

  handleSelectRecord = (id) => {
    const { selectedIds } = this.state;
    const index = selectedIds.findIndex((selectedId) => selectedId === id);

    this.currentPage = this.table.state.page;
    this.currentSort = this.table.state.sort;

    if (index === -1) {
      this.setState({ selectedIds: [...selectedIds, id] });
    } else {
      const newSelectedIds = [...selectedIds];
      newSelectedIds.splice(index, 1);
      this.setState({ selectedIds: [...newSelectedIds] });
    }
  };

  handleCheckAll = () => {
    const { checkedAll } = this.state;
    const { sites } = this.props;

    const ids = checkedAll ? [] : [...sites].map((site) => site.id);
    this.setState((prevState) => ({ checkedAll: !prevState.checkedAll, selectedIds: [...ids] }));
  };

  handleExportRepairs = () => {
    const { selectedIds } = this.state;
    const url = apiRepairs.getDownloadRepairsBySiteIdsUrl(selectedIds);

    this.setState(() => ({ downloadingRepairs: true }));
    apiRepairs.downloadRepairFile(url)
      .then((blob) => downloadBlobFile(blob, 'site_repairs.csv'))
      .then((payload) => destroyDownloadResource(payload))
      .finally(() => this.setState({ downloadingRepairs: false }));
  };

  renderCheckAll = () => (
    <SiteCheckAll>
      <Checkbox
        name="checkAll"
        id="checkAll"
        checked={this.state.checkedAll}
        onChange={this.handleCheckAll}
        checkedIcon={<CheckboxIcon />}
        className="Site__Checkbox"
      />
    </SiteCheckAll>
  );

  renderStatus = (props) => {
    const siteStatus = props.record.status;
    const statusIndex = statusOptions.findIndex((obj) => obj.value === siteStatus);
    return (<div>{statusIndex !== -1 ? statusOptions[statusIndex].text : siteStatus}</div>);
  };

  render() {
    const { sites, isLoading, getSitesRequest } = this.props;
    const { selectedIds, activateCheckAll, downloadingRepairs } = this.state;
    const data = [...sites];

    return isLoading ? <LoadingIndicator /> :
      (<div>
        <FilterableTable
          ref={this.setTableRef}
          namespace="site"
          initialSort="name"
          data={data}
          fields={this.fields}
          noRecordsMessage="There are no data to display"
          noFilteredRecordsMessage="No data match your filter!"
          topPagerVisible={false}
          headerVisible={false}
          getSitesRequest={getSitesRequest}
        />

        {
          activateCheckAll && this.renderCheckAll()
        }

        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          open={!!selectedIds.length}
          ContentProps={{
            'aria-describedby': 'message-id',
            className: 'Site__Snackbar',
          }}
          message={
            <SiteSnackbarNumber id="message-id">
              {selectedIds.length} Site{selectedIds.length > 1 && 's'} Selected
            </SiteSnackbarNumber>
          }
          action={
            !downloadingRepairs
            ? <Button
              color="inherit"
              size="small"
              className="Site__Snackbar-Button"
              onClick={this.handleExportRepairs}
              disabled={!selectedIds.length}
            >
              Export Repairs
            </Button>
            : <Spinner name="circle" />
          }
        />
      </div>
    );
  }
}

SiteListContainer.propTypes = {
  getSitesRequest: PropTypes.func,
  deleteSiteRequest: PropTypes.func,
  isLoading: PropTypes.bool,
  sites: PropTypes.arrayOf(PropTypes.object),
};

SiteListContainer.defaultProps = {
  sites: [],
};

const mapStateToProps = createStructuredSelector({
  sites: makeGetSitesWithFilters(),
  isLoading: makeGetLoadingState(),
});

const mapDispatchToProps = (dispatch) => ({
  getSitesRequest: (filter) => dispatch(actions.getSitesRequest(filter)),
  deleteSiteRequest: (siteId) => dispatch(actions.deleteSiteRequest(siteId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SiteListContainer);
