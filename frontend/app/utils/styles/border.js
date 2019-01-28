import { css } from 'styled-components';

export const borderStyle = (border) => {
  const styles = [];

  if (typeof border === 'object') {
    const color = border.color || '#dde0e2';
    const borderSize = border.size || '1px';
    const side = border.side || 'all';
    const lineStyle = border.style || 'solid';
    const borderValue = `${lineStyle} ${borderSize} ${color}`;

    if (side === 'top' || side === 'bottom' || side === 'left' || side === 'right') {
      styles.push(css`
        border-${side}: ${borderValue};
      `);
    } else if (side === 'vertical') {
      styles.push(css`
        border-top: ${borderValue};
        border-bottom: ${borderValue};
      `);
    } else if (side === 'horizontal') {
      styles.push(css`
        border-left: ${borderValue};
        border-right: ${borderValue};
      `);
    } else {
      styles.push(css`border: ${borderValue};`);
    }
  } else if (typeof border === 'string') {
    styles.push(css`border: ${border};`);
  }

  return styles;
};
