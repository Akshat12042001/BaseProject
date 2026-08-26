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
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  newButton: {
    alignItems: 'center',
    backgroundColor: COLORS.SURFACE,
    borderRadius: 17,
    flexDirection: 'row',
    gap: 4,
    height: 34,
    justifyContent: 'center',
    paddingHorizontal: 13,
  },
  subtitle: {
    marginTop: 1,
  },
  list: {
    paddingBottom: 90,
    paddingHorizontal: 12,
    paddingTop: 14,
  },
  separator: {
    height: 12,
  },
  emptyList: {
    flexGrow: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 160,
    paddingHorizontal: 20,
  },
});
