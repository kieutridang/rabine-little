import { StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  header: {
    height: 120,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  logoImage: {
    height: '80%',
    width: '30%',
    alignSelf: 'center',
  },
  logoImageLeft: {
    height: '80%',
    width: '30%',
    alignSelf: 'center',
  },
  body: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: '100%',
  },
  sideContainer: {
    width: '50%',
    height: '100%',
    paddingTop: 30,
    paddingBottom: 30,
    paddingHorizontal: 25,
  },
  rightContainer: {
    paddingLeft: 0,
  },
  pictureSide: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  detailSide: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  details: {
    height: '50%',
  },
  subtitle: {
    height: '10%',
    color: '#272727',
    fontSize: 20,
    alignSelf: 'flex-start',
  },
  imageContainer: {
    height: '80%',
    width: '100%',
  },

  pictureSideImage: {
    alignSelf: 'flex-start',
    height: '60%',
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 12,
    bottom: 15,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'grey',
  },
  clientLogoContainer: {
    height: '30%',
  },

  clientLogo: {
    alignSelf: 'flex-end',
    height: 70,
    marginRight: 30,
    width: '50%',
  },

  shortLeftContainer: {
    width: '42%',
    paddingHorizontal: 5,
  },
  longRightContainer: {
    width: '58%',
  },

  screenshotPlaceholder: {
    width: 340,
    height: 340,
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: '#979797',
    borderRadius: 15,
    textAlign: 'center',
  },

  screenshotPlaceholderText: {
    marginTop: 'auto',
    marginBottom: 'auto',
    color: '#979797',
  },

});

export default styles;
