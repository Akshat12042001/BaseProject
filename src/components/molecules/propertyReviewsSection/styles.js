import {StyleSheet} from 'react-native';
import {COLORS} from '../../../constants';

export default StyleSheet.create({
  section: {
    marginTop: 4,
  },
  sectionTitle: {
    marginBottom: 6,
  },
  sectionSubtitle: {
    lineHeight: 20,
    marginBottom: 16,
  },
  summaryCard: {
    backgroundColor: COLORS.SURFACE,
    borderColor: COLORS.BORDER_LIGHT,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 16,
    overflow: 'hidden',
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 16,
  },
  summaryDivider: {
    backgroundColor: COLORS.BORDER_LIGHT,
    width: 1,
  },
  summaryValue: {
    marginTop: 6,
  },
  ratingDash: {
    backgroundColor: '#E57373',
    borderRadius: 2,
    height: 3,
    marginTop: 14,
    width: 28,
  },
  tabSwitcher: {
    backgroundColor: COLORS.SURFACE,
    borderColor: COLORS.BORDER_LIGHT,
    borderRadius: 24,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 16,
    overflow: 'hidden',
    padding: 4,
  },
  tabButton: {
    alignItems: 'center',
    borderRadius: 20,
    flex: 1,
    justifyContent: 'center',
    minHeight: 40,
    paddingHorizontal: 12,
  },
  tabButtonActive: {
    backgroundColor: COLORS.LOGIN_PRIMARY,
  },
  loadingState: {
    alignItems: 'center',
    backgroundColor: COLORS.INVOICE_FORM_MUTED,
    borderRadius: 14,
    paddingVertical: 48,
  },
  emptyState: {
    alignItems: 'center',
    backgroundColor: COLORS.INVOICE_FORM_MUTED,
    borderRadius: 14,
    paddingHorizontal: 24,
    paddingVertical: 36,
  },
  emptyIcon: {
    backgroundColor: COLORS.BORDER_LIGHT,
    borderRadius: 40,
    height: 80,
    marginBottom: 20,
    width: 80,
  },
  emptyTitle: {
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    lineHeight: 20,
    textAlign: 'center',
  },
  reviewCard: {
    backgroundColor: COLORS.SURFACE,
    borderColor: COLORS.BORDER_LIGHT,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
    padding: 16,
  },
  reviewHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  reviewRatingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  reviewComment: {
    lineHeight: 20,
  },
});
