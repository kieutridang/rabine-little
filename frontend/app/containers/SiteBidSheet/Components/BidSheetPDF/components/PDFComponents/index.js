
import React from 'react';
import PropTypes from 'prop-types';
import { Text, View } from '@react-pdf/renderer';

import styles from './style';

export const Subtitle = ({ children, ...props }) => (
  <Text style={styles.subtitle} {...props}>
    {children}
  </Text>
);

export const Info = ({ children, label, ...wrapProps, ...labelProps, ...textProps }) => (
  <View style={styles.infoWrap} {...wrapProps}>
    <Text style={styles.infoLabel} {...labelProps}>
      {label}
    </Text>
    <Text style={styles.infoText} {...textProps}>
      {children}
    </Text>
  </View>
);

export const Table = ({ children, ...props }) => (
  <View style={styles.table} {...props}>
    {children}
  </View>
);

export const Row = ({ children, ...props }) => (
  <View style={[styles.tableRow]} {...props}>
    {children}
  </View>
);

export const HeaderRow = ({ children, ...props }) => (
  <View style={styles.headerRow} {...props}>
    {children}
  </View>
);

export const HeaderCell = ({ children, grow }) => (
  <View style={[styles.headerCell, { flexGrow: grow }]}>
    <Text style={styles.headerCellText}>
      { children }
    </Text>
  </View>
);

export const Color = ({ color }) => (
  <View style={[styles.colorView, { backgroundColor: color }]}>
  </View>
);

export const Cell = ({ children, color, grow }) => (
  <View style={[styles.tableCell, { flexGrow: grow }]}>
    {!color
      ? <Text style={styles.tableCellText}>
        {children}
      </Text> : <Color color={color} />
    }
  </View>
);

Subtitle.propTypes = {
  children: PropTypes.any,
};

Info.propTypes = {
  children: PropTypes.any,
  label: PropTypes.string,
};

Table.propTypes = {
  children: PropTypes.any,
};

HeaderRow.propTypes = {
  children: PropTypes.any,
};

HeaderCell.propTypes = {
  children: PropTypes.any,
  grow: PropTypes.number,
};

Row.propTypes = {
  children: PropTypes.any,
};

Cell.propTypes = {
  children: PropTypes.any,
  color: PropTypes.string,
  grow: PropTypes.number,
};

Row.propTypes = {
  children: PropTypes.any,
};

Color.propTypes = {
  color: PropTypes.string,
};

