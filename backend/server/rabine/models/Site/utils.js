const findChangedFields = (older = {}, newer = {}) => {
  const changedFields = {
    old: {},
    new: {}
  };

  if (newer.name && newer.name !== older.name) {
    changedFields.old.name = older.name ? older.name : null;
    changedFields.new.name = newer.name;
  }

  if (newer.title && newer.title !== older.title) {
    changedFields.old.title = older.title ? older.title : null;
    changedFields.new.title = newer.title;
  }

  if (newer.color && newer.color !== older.color) {
    changedFields.old.color = older.color ? older.color : null;
    changedFields.new.color = newer.color;
  }

  // zone fields: pci, surface type, trafficType
  if (newer.pci && newer.pci !== older.pci) {
    changedFields.old.pci = older.pci ? older.pci : null;
    changedFields.new.pci = newer.pci;
  }
  if (newer.surfaceType && newer.surfaceType !== older.surfaceType) {
    changedFields.old.surfaceType = older.surfaceType ? older.surfaceType : null;
    changedFields.new.surfaceType = newer.surfaceType;
  }
  if (newer.trafficType && newer.trafficType !== older.trafficType) {
    changedFields.old.trafficType = older.trafficType ? older.trafficType : null;
    changedFields.new.trafficType = newer.trafficType;
  }

  // repair fields: repair type, layer (year), zone
  if (newer.repairType && newer.repairType !== older.repairType) {
    changedFields.old.repairType = older.repairType ? older.repairType : null;
    changedFields.new.repairType = newer.repairType;
  }
  if (newer.restripeAffectedArea && newer.restripeAffectedArea !== older.restripeAffectedArea) {
    changedFields.old.restripeAffectedArea =
      older.restripeAffectedArea ? older.restripeAffectedArea : null;
    changedFields.new.restripeAffectedArea = newer.restripeAffectedArea;
  }
  if (newer.fillAsphaltCrack && newer.fillAsphaltCrack !== older.fillAsphaltCrack) {
    changedFields.old.fillAsphaltCrack = older.fillAsphaltCrack ? older.fillAsphaltCrack : null;
    changedFields.new.fillAsphaltCrack = newer.fillAsphaltCrack;
  }
  if (newer.overrideSF && newer.overrideSF !== older.overrideSF) {
    changedFields.old.overrideSF = older.overrideSF ? older.overrideSF : null;
    changedFields.new.overrideSF = newer.overrideSF;
  }

  if (newer.inputArea && newer.inputArea !== older.inputArea) {
    changedFields.old.inputArea = older.inputArea ? older.inputArea : null;
    changedFields.new.inputArea = newer.inputArea;
  }
  if (newer.inputAsphalt && newer.inputAsphalt !== older.inputAsphalt) {
    changedFields.old.inputAsphalt = older.inputAsphalt ? older.inputAsphalt : null;
    changedFields.new.inputAsphalt = newer.inputAsphalt;
  }
  if (newer.inputOverrideSF && newer.inputOverrideSF !== older.inputOverrideSF) {
    changedFields.old.inputOverrideSF = older.inputOverrideSF ? older.inputOverrideSF : null;
    changedFields.new.inputOverrideSF = newer.inputOverrideSF;
  }

  if (
    newer.layerId
    && older.layerId
    && newer.layerId.toString() !== older.layerId.toString()
  ) {
    changedFields.old.layerId = older.layerId ? older.layerId : null;
    changedFields.new.layerId = newer.layerId;
  }
  if (
    newer.zoneId
    && older.zoneId
    && newer.zoneId.toString() !== older.zoneId.toString()
  ) {
    changedFields.old.zoneId = older.zoneId ? older.zoneId : null;
    changedFields.new.zoneId = newer.zoneId;
  }

  return changedFields;
};

module.exports = {
  findChangedFields
};

export default {
  findChangedFields
};
