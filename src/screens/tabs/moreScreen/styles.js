import {StyleSheet} from 'react-native';
import {COLORS} from '../../../constants';

export default StyleSheet.create({
  screen: {
    backgroundColor: COLORS.BACKGROUND,
    flex: 1,
  },
  header: {
    backgroundColor: COLORS.PRIMARY_DARK,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  subtitle: {
    marginTop: 4,
  },
  content: {
    paddingHorizontal: 12,
    paddingTop: 14,
  },
  logoutRow: {
    alignItems: 'center',
    backgroundColor: COLORS.SURFACE,
    borderColor: COLORS.BORDER_LIGHT,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  disabledRow: {
    opacity: 0.7,
  },
});
