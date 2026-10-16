import {StyleSheet} from 'react-native';
import {COLORS} from '../../../constants';

export default StyleSheet.create({
  headerActions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  headerIconButton: {
    alignItems: 'center',
    backgroundColor: COLORS.HEADER_BORDER,
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  filterDot: {
    backgroundColor: COLORS.RED_ERROR,
    borderRadius: 5,
    height: 10,
    position: 'absolute',
    right: 6,
    top: 6,
    width: 10,
  },
  cartBadge: {
    alignItems: 'center',
    backgroundColor: COLORS.LOGIN_PRIMARY,
    borderRadius: 9,
    minWidth: 18,
    paddingHorizontal: 4,
    paddingVertical: 1,
    position: 'absolute',
    right: -2,
    top: -2,
  },
  cartBadgeText: {
    color: COLORS.WHITE,
    fontSize: 9,
    fontWeight: '700',
    lineHeight: 12,
  },
  listContent: {
    paddingBottom: 24,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  listSeparator: {
    height: 12,
  },
  emptyList: {
    flexGrow: 1,
  },
  emptyState: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 48,
  },
  skeletonContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  footerLoader: {
    alignItems: 'center',
    paddingVertical: 16,
  },
});
