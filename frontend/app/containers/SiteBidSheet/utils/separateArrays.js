import cloneDeep from 'lodash/cloneDeep';

const separate = (data, maxNumber) => {
  const chunkArray = [];
  const array = cloneDeep(data);
  if (array.length > maxNumber) {
    while (array.length > maxNumber) {
      if ((array.length - maxNumber) > maxNumber) {
        chunkArray.push(array.splice(array.length - maxNumber - 1, maxNumber));
      } else {
        chunkArray.push(array.splice(maxNumber, array.length));
      }
    }
    chunkArray.unshift(array);
    return chunkArray;
  }
  chunkArray.push(array);

  return chunkArray;
};

export default separate;
