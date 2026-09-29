import {StyleSheet} from 'react-native';
import {COLORS} from '../../../constants';

export default StyleSheet.create({
  card: {
    backgroundColor: COLORS.WHITE,
    borderColor: COLORS.BORDER_LIGHT,
    borderRadius: 16,
    borderWidth: 1,
    elevation: 2,
    paddingHorizontal: 14,
    paddingVertical: 14,
    shadowColor: COLORS.INVOICE_SHADOW,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  topRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  homestayIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  topContent: {
    flex: 1,
    minWidth: 0,
    paddingRight: 8,
  },
  homestayTitle: {
    marginBottom: 4,
  },
  guestLine: {
    lineHeight: 18,
  },
  menuButton: {
    alignItems: 'center',
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  bookingSection: {
    flexDirection: 'row',
    marginTop: 14,
  },
  tagIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  bookingContent: {
    flex: 1,
    minWidth: 0,
  },
  dateRange: {
    marginBottom: 4,
  },
  staySummary: {
    lineHeight: 18,
  },
  popoverBackdrop: {
    backgroundColor: 'transparent',
  },
  popover: {
    backgroundColor: COLORS.WHITE,
    borderColor: COLORS.BORDER_LIGHT,
    borderRadius: 14,
    // borderWidth: 1,
    elevation: 8,
    paddingVertical: 6,
    shadowColor: COLORS.INVOICE_SHADOW,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.12,
    shadowRadius: 12,
  },
  menuList: {
    minWidth: 220,
  },
  menuItem: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  menuItemIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    width: 22,
  },
  menuItemLabel: {
    flex: 1,
  },
});
