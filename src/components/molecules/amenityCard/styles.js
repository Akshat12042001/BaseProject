import {StyleSheet} from 'react-native';
import {COLORS} from '../../../constants';

export default StyleSheet.create({
  card: {
    alignItems: 'center',
    borderRadius: 28,
    borderWidth: 1.5,
    flexDirection: 'row',
    marginBottom: 10,
    minHeight: 56,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  cardSelected: {
    backgroundColor: COLORS.GREYSCALE_100,
    borderColor: COLORS.LOGIN_PRIMARY,
  },
  cardIdle: {
    backgroundColor: COLORS.WHITE,
    borderColor: COLORS.GREYSCALE_200,
  },
  iconWrap: {
    alignItems: 'center',
    backgroundColor: COLORS.GREYSCALE_200,
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  iconWrapSelected: {
    backgroundColor: COLORS.LOGIN_PRIMARY,
  },
  title: {
    flex: 1,
    marginHorizontal: 12,
  },
  check: {
    alignItems: 'center',
    borderColor: COLORS.LOGIN_PRIMARY,
    borderRadius: 12,
    borderWidth: 1.5,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  checkSpacer: {
    width: 24,
  },
});
