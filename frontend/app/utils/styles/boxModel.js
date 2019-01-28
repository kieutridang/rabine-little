import { css } from 'styled-components';

export const marginStyle = (margin) => {
  const styles = [];

  if (typeof margin === 'object') {
    if (margin.top) {
      styles.push(css`margin-top: ${margin.top};`);
    }
    if (margin.bottom) {
      styles.push(css`margin-bottom: ${margin.bottom};`);
    }
    if (margin.left) {
      styles.push(css`margin-left: ${margin.left};`);
    }
    if (margin.right) {
      styles.push(css`margin-right: ${margin.right};`);
    }
    if (margin.horizontal) {
      styles.push(css`margin-left: ${margin.horizontal};`);
      styles.push(css`margin-right: ${margin.horizontal};`);
    }
    if (margin.vertical) {
      styles.push(css`margin-top: ${margin.vertical};`);
      styles.push(css`margin-bottom: ${margin.vertical};`);
    }
  }

  return styles;
};

export const paddingStyle = (padding) => {
  const styles = [];

  if (typeof padding === 'object') {
    if (padding.top) {
      styles.push(css`padding-top: ${padding.top};`);
    }
    if (padding.bottom) {
      styles.push(css`padding-bottom: ${padding.bottom};`);
    }
    if (padding.left) {
      styles.push(css`padding-left: ${padding.left};`);
    }
    if (padding.right) {
      styles.push(css`padding-right: ${padding.right};`);
    }
    if (padding.horizontal) {
      styles.push(css`padding-left: ${padding.horizontal};`);
      styles.push(css`padding-right: ${padding.horizontal};`);
    }
    if (padding.vertical) {
      styles.push(css`padding-top: ${padding.vertical};`);
      styles.push(css`padding-bottom: ${padding.vertical};`);
    }
  }

  return styles;
};
