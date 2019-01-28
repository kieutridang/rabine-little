const OPTIMAL_REPAIR_NAME = 'OPTIMAL';
const OPTIONAL_REPAIR_NAME = 'OPTIONAL';

const sortYears = (years) => {
  years.sort((a, b) => {
    let comparision = 0;
    if (
        a.charAt(0).toUpperCase() === OPTIMAL_REPAIR_NAME.charAt(0)
        && b.charAt(0).toUpperCase() !== OPTIONAL_REPAIR_NAME.charAt(0)
      ) {
      const [year] = a.split(':');
      const trimmedYear = year.trim();
      if (trimmedYear > b) comparision = 1;
      if (trimmedYear < b) comparision = -1;
      if (trimmedYear === b) comparision = 0;
    } else if (
        b.charAt(0).toUpperCase() === OPTIMAL_REPAIR_NAME.charAt(0)
        && a.charAt(0).toUpperCase() !== OPTIONAL_REPAIR_NAME.charAt(0)
      ) {
      const [year] = b.split(':');
      const trimmedYear = year.trim();

      if (trimmedYear > a) comparision = -1;
      if (trimmedYear < a) comparision = 1;
      if (trimmedYear === a) comparision = 0;
    } else {
      comparision = a > b;
    }

    return comparision;
  });
};

export default sortYears;
