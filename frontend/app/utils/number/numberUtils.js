export const dollarFormatter = (num, decimalPoint = 2) => num.toFixed(decimalPoint).replace(/./g, (c, i, a) => i && c !== '.' && ((a.length - i) % 3 === 0) ? `,${c}` : c);

export const currencyFormat2Number = (value) => value ? parseFloat(value.replace('$', '').replace(',', '').trim()) : 0.00;

export const toFeet = (metric) => {
  const src = metric.split(' ');
  const value = src[0];
  const unit = src[1];

  switch (unit) {
    case 'm²':
      return value * 10.7639;
    case 'ha':
      return value * 107639;
    case 'km':
      return value * 3280.84;
    default: // metres
      return value * 3.28084;
  }
};

export const limitDecimals = (value) => value.toFixed(LIMIT_DECIMALS);

export const LIMIT_DECIMALS = 0;
