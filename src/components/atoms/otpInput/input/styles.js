import {StyleSheet} from 'react-native';
import {COLORS, FONTS, SCREEN} from '../../../../constants';

const SIZE = Math.min(SCREEN.WIDTH / 6 - 25, 56);

export default StyleSheet.create({
  container: {
    width: SIZE,
    overflow: 'hidden',
    // marginHorizontal: 3,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1.5,
    justifyContent: 'center',
    height: SIZE,
    backgroundColor: COLORS.SURFACE,
    marginRight: 10,
  },
  textInput: {
    fontSize: 18,
    width: '100%',
    height: '100%',
    textAlign: 'center',
    color: COLORS.GREYSCALE_900,
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: FONTS.bold,
  },
  //   dummyView: {
  //     borderBottomWidth: 1,
  //     width: 8,
  //     position: 'absolute',
  //     borderColor: COLORS.LIGHT_GRAY,
  //   },
});