import {StyleSheet} from 'react-native';
import {COLORS, FONTS} from '../../../constants';

export default StyleSheet.create({
  modal: {
    flex: 1,
    margin: 0,
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: COLORS.WHITE,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  dividerContainer: {
    alignItems: 'center',
  },
  divider: {
    height: 5,
    width: 40,
    margin: 5,
    opacity: 0.3,
    marginTop: 8,
    borderRadius: 10,
    backgroundColor: COLORS.GREY_LIGHT,
  },
  titleContainer: {
    marginTop: 13,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: COLORS.BLACK,
    fontSize: 20,
    lineHeight: 28,
    textAlign: 'center',
    fontFamily: FONTS.regular,
  },
  btnContainer: {
    marginTop: 35,
    marginBottom: 50,
    flexDirection: 'row',
    paddingHorizontal: 50,
    justifyContent: 'space-between',
  },
  iconContainer: {
    borderWidth: 1,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'rgba(224, 224, 224, 0.8)',
    backgroundColor: 'rgba(224, 224, 224, 0.1)',
    padding: 10,
  },
  text: {
    fontSize: 15,
    color: COLORS.BLACK,
    textAlign: 'center',
    fontFamily: FONTS.regular,
  },
  textContainer: {
    marginTop: 10,
  },
});