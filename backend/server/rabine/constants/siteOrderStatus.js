const STATUS_MAP = {
  NEW_ORDER: 'NEW_ORDER',
  SENT_FOR_IMAGERY_CAPTURE: 'SENT_FOR_IMAGERY_CAPTURE',
  IMAGERY_CAPTURE_COMPLETE: 'IMAGERY_CAPTURE_COMPLETE',
  ZONE_MAP_COMPLETE: 'ZONE_MAP_COMPLETE',
  SCOPE_COMPLETE: 'SCOPE_COMPLETE',
  QC: 'QC',
  TRANSFERRED_TO_CLIENT_PORTAL: 'TRANSFERRED_TO_CLIENT_PORTAL',
  DELIVERED_TO_CLIENT: 'DELIVERED_TO_CLIENT',
  UNIT_MAP_COMPLETE: 'UNIT_MAP_COMPLETE',
  HVAC_UNIT_DATA_COMPLETE: 'HVAC_UNIT_DATA_COMPLETE',
  HVAC_PER_UNIT_BUDGET_COMPLETE: 'HVAC_PER_UNIT_BUDGET_COMPLETE'
};

const STATUS_READABLE = {
  NEW_ORDER: 'New order',
  SENT_FOR_IMAGERY_CAPTURE: 'Sent for Imagery Capture',
  IMAGERY_CAPTURE_COMPLETE: 'Imagery Capture Complete',
  ZONE_MAP_COMPLETE: 'Zone Map Complete',
  SCOPE_COMPLETE: 'Scope Complete',
  QC: 'QC',
  TRANSFERRED_TO_CLIENT_PORTAL: 'Transferred to Client Portal',
  DELIVERED_TO_CLIENT: 'Delivered to Client',

  UNIT_MAP_COMPLETE: 'Unit Map Complete',
  HVAC_UNIT_DATA_COMPLETE: 'HVAC Unit Data Complete',
  HVAC_PER_UNIT_BUDGET_COMPLETE: 'HVAC per Unit Budget Complete'
};

const getReadableStatus = status => STATUS_READABLE[status];

export {
  STATUS_MAP,
  STATUS_READABLE,
  getReadableStatus
};