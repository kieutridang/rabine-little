import { StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  subtitle: {
    height: '10%',
    color: '#272727',
    fontSize: 20,
    alignSelf: 'flex-start',
  },

  infoWrap: {
    marginBottom: '27px',
    textAlign: 'left',
    color: 'gray',
    lineHeight: 1.5,
  },

  infoLabel: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: '1.2px',
    fontSize: 12,
  },

  infoText: {
    fontSize: 16,
  },

  table: {
    display: 'flex',
    flexDirection: 'column',
    padding: 0,
  },

  tableRow: {
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: 40,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#efefef',
  },

  headerRow: {
    backgroundColor: '#f8f8f8',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: 40,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#efefef',
  },

  headerCellText: {
    fontSize: 10,
    textTransform: 'uppercase',
    textAlign: 'center',
    color: 'gray',
  },

  headerCell: {
    flex: 1,
    listStyle: 'none',
    overflow: 'hidden',
    alignSelf: 'center',
  },

  tableCellText: {
    fontSize: 10,
    textAlign: 'center',
  },

  tableCell: {
    flex: 1,
    listStyle: 'none',
    overflow: 'hidden',
    alignSelf: 'center',
  },

  colorView: {
    textAlign: 'center',
    margin: 'auto',
    width: 39,
    height: 12,
  },
});

export default styles;
