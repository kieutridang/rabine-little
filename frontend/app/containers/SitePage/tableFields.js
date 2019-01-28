import React from 'react';
import {
  SiteLink,
  SiteName,
  SiteAddress,
} from './StyledComponents';

const renderFunctions = () => (<span>⋮</span>);

const tableFields = [{
  name: 'name',
  playName: 'Site Name',
  sortable: true,
  render({ record }) { // eslint-disable-line
    return (
      <SiteLink
        to={`/sites/${record.id}`}
        key={record.id}
      >
        <SiteName>{record.name}</SiteName>
        <SiteAddress>{record.address}</SiteAddress>
      </SiteLink>
    );
  },
},
{
  name: 'deadline',
  displayName: 'Completed',
  sortable: true,
},
{
  name: 'cost',
  displayName: 'Cost',
  sortable: true,
},
{
  name: 'sqFoot',
  displayName: 'Total SQ.FT.',
  sortable: true,
},
{
  name: 'droneCost',
  displayName: 'Total Repairs',
  sortable: true,
},
{
  name: '',
  displayName: ' ',
  inputFilterable: false,
  sortable: false,
  render: renderFunctions,
}];

export default tableFields;
