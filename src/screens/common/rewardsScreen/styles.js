import {StyleSheet} from 'react-native';
import {COLORS, FONTS} from '../../../constants';

export default StyleSheet.create({
  screen: {
    backgroundColor: COLORS.BACKGROUND,
    flex: 1,
  },
  summarySkeleton: {
    paddingHorizontal: 12,
    paddingTop: 14,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 8,
  },
  summaryCard: {
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
    borderColor: COLORS.BORDER_LIGHT,
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
    minWidth: 0,
    paddingHorizontal: 6,
    paddingVertical: 12,
  },
  summaryIconWrap: {
    alignItems: 'center',
    borderRadius: 10,
    height: 34,
    justifyContent: 'center',
    marginBottom: 8,
    width: 34,
  },
  summaryLabel: {
    marginBottom: 4,
    textAlign: 'center',
  },
  summaryValue: {
    textAlign: 'center',
  },
  filterRow: {
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingTop: 14,
    paddingBottom: 10,
    zIndex: 20,
  },
  dropdown: {
    position: 'relative',
    width: 168,
    zIndex: 20,
  },
  dropdownLabel: {
    backgroundColor: COLORS.BACKGROUND,
    left: 10,
    paddingHorizontal: 4,
    position: 'absolute',
    top: 0,
    zIndex: 2,
  },
  dropdownField: {
    backgroundColor: COLORS.WHITE,
    borderColor: COLORS.LOGIN_INPUT_BORDER,
    borderRadius: 8,
    borderWidth: 1,
    height: 44,
    marginTop: 8,
    paddingHorizontal: 12,
  },
  dropdownFieldFocused: {
    borderColor: COLORS.LOGIN_PRIMARY,
  },
  dropdownPlaceholder: {
    color: COLORS.GREYSCALE_500,
    fontFamily: FONTS.regular,
    fontSize: 13,
  },
  dropdownSelectedText: {
    color: COLORS.GREYSCALE_900,
    fontFamily: FONTS.medium,
    fontSize: 13,
  },
  dropdownItemText: {
    color: COLORS.GREYSCALE_900,
    fontFamily: FONTS.regular,
    fontSize: 13,
  },
  dropdownList: {
    backgroundColor: COLORS.WHITE,
    borderColor: COLORS.BORDER_LIGHT,
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  tableCard: {
    backgroundColor: COLORS.WHITE,
    borderColor: COLORS.BORDER_LIGHT,
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
    marginBottom: 12,
    marginHorizontal: 12,
    overflow: 'hidden',
  },
  tableSkeleton: {
    paddingHorizontal: 12,
    paddingTop: 14,
  },
  tableVerticalScroll: {
    flex: 1,
  },
  tableContent: {
    minWidth: 720,
  },
  tableHeader: {
    backgroundColor: COLORS.GREYSCALE_100,
    borderBottomColor: COLORS.BORDER_LIGHT,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  tableHeaderText: {
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  tableRow: {
    borderBottomColor: COLORS.BORDER_LIGHT,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  colDate: {
    justifyContent: 'center',
    paddingRight: 8,
    width: 150,
  },
  colType: {
    justifyContent: 'center',
    paddingRight: 8,
    width: 110,
  },
  colPoints: {
    justifyContent: 'center',
    paddingRight: 8,
    width: 70,
  },
  colDescription: {
    flexGrow: 1,
    justifyContent: 'center',
    minWidth: 160,
    paddingRight: 8,
  },
  colExpiry: {
    justifyContent: 'center',
    paddingRight: 8,
    width: 100,
  },
  colBalance: {
    justifyContent: 'center',
    width: 90,
  },
  typeBadge: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 6,
    minWidth: 78,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 280,
    paddingHorizontal: 20,
    paddingVertical: 48,
  },
});
