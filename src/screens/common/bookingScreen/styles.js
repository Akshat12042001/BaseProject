import {StyleSheet} from 'react-native';
import {COLORS} from '../../../constants';

export default StyleSheet.create({
  flex: {
    backgroundColor: COLORS.WHITE,
    flex: 1,
  },
  list: {
    backgroundColor: COLORS.WHITE,
    flex: 1,
  },
  listContent: {
    backgroundColor: COLORS.WHITE,
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  separator: {
    height: 12,
  },
  skeletonContainer: {
    paddingTop: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 240,
    paddingHorizontal: 0,
    paddingTop: 8,
  },
  emptyCard: {
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
    borderColor: COLORS.BORDER_LIGHT,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 24,
    paddingVertical: 36,
    width: '100%',
  },
  emptyIcon: {
    backgroundColor: COLORS.SKELETON_BONE,
    borderRadius: 28,
    height: 56,
    marginBottom: 18,
    width: 56,
  },
  emptyTitle: {
    marginBottom: 8,
  },
  emptyDescription: {
    lineHeight: 20,
    maxWidth: 300,
  },
  emptyErrorText: {
    paddingHorizontal: 24,
  },
  paginationLoader: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  headerIconButton: {
    alignItems: 'center',
    backgroundColor: COLORS.HEADER_BORDER,
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  sharingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.72)',
    justifyContent: 'center',
    zIndex: 20,
  },
  sharingText: {
    marginTop: 12,
  },
});
