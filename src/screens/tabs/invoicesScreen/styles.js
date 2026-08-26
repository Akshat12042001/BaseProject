import {StyleSheet} from 'react-native';
import {COLORS} from '../../../constants';

export default StyleSheet.create({
  screen: {
    backgroundColor: COLORS.BACKGROUND,
    flex: 1,
  },
  header: {
    backgroundColor: COLORS.PRIMARY_DARK,
    paddingBottom: 20,
    paddingHorizontal: 12,
  },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 9,
  },
  refreshButton: {
    alignItems: 'center',
    borderColor: COLORS.HEADER_BORDER,
    borderRadius: 16,
    borderWidth: 1,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  newButton: {
    alignItems: 'center',
    backgroundColor: COLORS.SURFACE,
    borderRadius: 16,
    flexDirection: 'row',
    gap: 4,
    height: 32,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  summaryRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 5,
  },
  summary: {
    // width: 83,
  },
  summaryDivider: {
    backgroundColor: COLORS.HEADER_DIVIDER,
    height: 33,
    marginHorizontal: 11,
    width: 1,
  },
  list: {
    paddingBottom: 90,
    paddingHorizontal: 9,
    paddingTop: 14,
  },
  separator: {
    height: 9,
  },
  paginationLoader: {
    alignItems: 'center',
    paddingVertical: 18,
  },
  skeletonContainer: {
    width: '100%',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 180,
    paddingHorizontal: 24,
  },
});
