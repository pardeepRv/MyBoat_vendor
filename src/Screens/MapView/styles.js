import { StyleSheet, Platform, Dimensions, } from 'react-native';
import colors from './colors';
var deviceWidth = Dimensions.get("window").width;
var deviceHeight = Dimensions.get("window").height;
const style = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    // position: 'relative',
  },
  mapWrapper: {
    flex: 1,
    height: deviceHeight * 0.8,
    overflow: 'hidden',
    
  },
  map: {
    flex: 1,
  },
  marker: {
    height: 48,
    width: 48,
  },
  markerFixed: {
    left: '50%',
    marginLeft: -24,
    marginTop: -48,
    position: 'absolute',
    top: '50%',
    zIndex: 2,
    height: 48,
    width: 48,
  },
  isPanding: {
    marginTop: -60,
  },
  textSearch: {
    alignItems: 'center',
    position: 'absolute',
    flex: 1,
    width: '100%',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexWrap: 'nowrap',
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 80
 },
  text: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    overflow: 'hidden',
    height: 40,
    padding: 8,
    borderWidth: 0,
    backgroundColor: 'white',
    alignItems: 'center',
  },
});

export default style;
