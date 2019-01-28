function replaceKeysByText(obj, find, replace) {
  return Object.keys(obj).reduce(
    (acc, key) => Object.assign(acc, { [key.replace(find, replace)]: obj[key] }), {});
}

function replaceKeysByTemplates(obj, templates) {
  return Object.keys(obj).reduce(
    (acc, key) => Object.assign(acc, { [templates[key].field]: obj[key] }), {});
}

function getAvailableData(templates) {
  return templates
    ? Object.assign({},
      ...Object.keys(templates)
        .filter((key) => {
          const template = templates[key];
          return !!template
            && !!template.availableData && !!template.availableData.data
            && !!template.availableData.key && !!template.availableData.value;
        })
        .map((key) => {
          const templateData = templates[key].availableData;
          const items = templateData.data;
          const itemKey = templateData.key;
          const itemValue = templateData.value;
          const newTemplate = items.map((item) => ({ [item[itemValue].toLowerCase()]: item[itemKey] }));
          return { [key.toLowerCase()]: Object.assign({}, ...newTemplate) };
        }))
    : null;
}

function replaceByTemplateData(obj, availableData) {
  const keys = Object.keys(obj);
  const replaceObj = {};
  keys.forEach((key) => {
    if (availableData[key.toLocaleLowerCase()]) {
      const updateValue = availableData[key.toLocaleLowerCase()][obj[key].toLocaleLowerCase()];
      replaceObj[key] = updateValue || null;
    }
  });
  return replaceObj;
}

export default {
  replaceKeysByText,
  replaceKeysByTemplates,
  getAvailableData,
  replaceByTemplateData,
};
