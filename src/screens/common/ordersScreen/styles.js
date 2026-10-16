import {StyleSheet} from 'react-native';
import {COLORS, SCREEN} from '../../../constants';

const TABLE_SIDE_INSET = 12;

const SUMMARY_GAP = 10;
const SUMMARY_HORIZONTAL_PADDING = 12;
const SUMMARY_CARD_WIDTH =
  (SCREEN.WIDTH - SUMMARY_HORIZONTAL_PADDING * 2 - SUMMARY_GAP) / 2;

export default StyleSheet.create({
  screen: {
    backgroundColor: COLORS.BACKGROUND,
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingBottom: 20,
    paddingTop: 14,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SUMMARY_GAP,
    paddingHorizontal: SUMMARY_HORIZONTAL_PADDING,
  },
  summaryCard: {
    backgroundColor: COLORS.WHITE,
    borderColor: COLORS.BORDER_LIGHT,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
    width: SUMMARY_CARD_WIDTH,
  },
  summaryHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryValue: {
    marginTop: 2,
  },
  filtersScroll: {
    marginTop: 16,
    maxHeight: 44,
  },
  filtersContent: {
    gap: 8,
    paddingHorizontal: 12,
  },
  filterChip: {
    backgroundColor: COLORS.WHITE,
    borderColor: COLORS.BORDER,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  filterChipActive: {
    backgroundColor: COLORS.PRIMARY_DARK,
    borderColor: COLORS.PRIMARY_DARK,
  },
  filterChipFailedActive: {
    backgroundColor: COLORS.RED_ERROR,
    borderColor: COLORS.RED_ERROR,
  },
  tableCard: {
    backgroundColor: COLORS.WHITE,
    borderColor: COLORS.BORDER_LIGHT,
    borderRadius: 14,
    borderWidth: 1,
    flex: 1,
    marginHorizontal: 12,
    marginTop: 16,
    minHeight: 280,
    overflow: 'hidden',
  },
  tableVerticalScroll: {
    flex: 1,
  },
  tableContent: {
    minWidth: 980,
  },
  tableHeader: {
    backgroundColor: COLORS.GREYSCALE_100,
    borderBottomColor: COLORS.BORDER_LIGHT,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  tableHeaderText: {
    letterSpacing: 0.2,
  },
  tableRow: {
    alignItems: 'center',
    borderBottomColor: COLORS.BORDER_LIGHT,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: 16,
  },
  colOrder: {
    justifyContent: 'center',
    paddingRight: 10,
    width: 150,
  },
  colDate: {
    justifyContent: 'center',
    paddingRight: 10,
    width: 120,
  },
  colItems: {
    justifyContent: 'center',
    paddingRight: 10,
    width: 70,
  },
  colMoney: {
    justifyContent: 'center',
    paddingRight: 10,
    width: 100,
  },
  colPayment: {
    justifyContent: 'center',
    paddingRight: 10,
    width: 110,
  },
  colActions: {
    justifyContent: 'center',
    width: 160,
  },
  orderIdSecondary: {
    marginTop: 2,
  },
  paymentBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#F7E7A5',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: '#2F6FED',
    borderRadius: 10,
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 220,
    paddingHorizontal: 20,
    paddingVertical: 48,
    width: SCREEN.WIDTH - TABLE_SIDE_INSET * 2 - 2,
  },
  emptyTitle: {
    marginBottom: 6,
    marginTop: 14,
  },
  summarySkeletonCard: {
    backgroundColor: COLORS.SKELETON_BONE,
    borderRadius: 14,
    height: 92,
    width: SUMMARY_CARD_WIDTH,
  },
  filterSkeletonChip: {
    backgroundColor: COLORS.SKELETON_BONE,
    borderRadius: 999,
    height: 36,
    width: 88,
  },
  tableSkeletonContent: {
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  tableSkeletonRow: {
    backgroundColor: COLORS.SKELETON_BONE,
    borderRadius: 8,
    height: 52,
    marginBottom: 10,
    width: '100%',
  },
  footerLoader: {
    alignItems: 'center',
    minWidth: 280,
    paddingVertical: 16,
  },
});
