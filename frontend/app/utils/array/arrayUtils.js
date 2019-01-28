import _ from 'lodash';

const merge2Arrays = (array1, array2) => {
  const resultArray = [];
  const arr = array1.concat(array2);
  let len = arr.length;
  const assoc = {};

  while (len) {
    const item = arr[len];

    if (!assoc[item]) {
      resultArray.unshift(item);
      assoc[item] = true;
    }

    len -= 1;
  }

  return resultArray;
};

const addData2Arr = (data) => (arr) =>
  new Promise((resolve) => {
    arr.push(data);
    resolve(arr);
  });

// check exist
function existy(x) { return x != null; }

// concaternate params into one array
// take the first element in arguments
// check first element exist
// concat first element with the rest args
function cat() {
  const head = _.head(arguments); // eslint-disable-line
  if (existy(head)) {
    return head.concat(head, _.drop(arguments)); // eslint-disable-line
  }
  return [];
}

function construct(head, tail) {
  return cat([head], _.toArray(tail));
}

export const select = (table, fields) =>
  _.map(table, (row) => _.pick.apply(null, construct(row, fields)));

// rename names in object
function rename(obj, newNames) {
  return _.reduce(
    newNames,
    (o, newKey, oldKey) => {
      if (_.has(obj, oldKey)) {
        o[newKey] = obj[oldKey]; // eslint-disable-line
      } else {
        o[newKey] = null; // eslint-disable-line
      }
      return o;
    },
    _.omit.apply(null, construct(obj, _.keys(newNames)))
  );
}

// give alias for object keys
export const alias = (table, newNames) => _.map(table, (obj) => rename(obj, newNames));

export default {
  merge2Arrays,
  addData2Arr,
  alias,
  select,
};

