export const makeSiteImportTemplate = ({
  clients,
  dronePlans,
  statusOptions,
  typeOptions,
  s3Folders,
}) => ({
  'Site Name': {
    field: 'name',
  },
  Client: {
    field: 'clientId',
    availableData: {
      data: clients,
      key: 'id',
      value: 'name',
    },
  },
  'Drone Deploy Plan': {
    field: 'dronePlanId',
    availableData: {
      data: dronePlans,
      key: 'id',
      value: 'name',
    },
  },
  Status: {
    field: 'status',
    availableData: {
      data: statusOptions,
      key: 'value',
      value: 'text',
    },
  },
  'S3 Folder': {
    field: 'rabineS3Folder',
    availableData: {
      data: s3Folders,
      key: 'id',
      value: 'name',
    },
  },
  Address: {
    field: 'address',
  },
  Deadline: {
    field: 'deadline',
  },
  'Site Type': {
    field: 'type',
    availableData: {
      data: typeOptions,
      key: 'value',
      value: 'text',
    },
  },
  Cost: {
    field: 'cost',
  },
});

export const templateFile = [
  {
    'Site Name': 'Site Name 1',
    Client: 'Realty Income',
    'Drone Deploy Plan': '',
    Status: 'New Order',
    'S3 Folder': '',
    Address: 'AZ, USA',
    Deadline: '2018-06-22',
    'Site Type': 'Paving',
    Cost: '2000',
  },
  {
    'Site Name': 'Site Name 2',
    Client: 'Realty Income',
    'Drone Deploy Plan': '',
    Status: 'QC',
    'S3 Folder': '',
    Address: 'AZ, USA',
    Deadline: '2018-07-23',
    'Site Type': 'Roof',
    Cost: '3000',
  },
  {
    'Site Name': 'Site Name 3',
    Client: 'Realty Income',
    'Drone Deploy Plan': '',
    Status: 'Delivered to Client',
    'S3 Folder': '',
    Address: 'AZ, USA',
    Deadline: '2018-12-25',
    'Site Type': 'Other',
    Cost: '4000',
  },
];
