import {StyleSheet} from 'react-native';
import {COLORS, FONTS} from '../../../constants';

export default StyleSheet.create({
  card: {
    backgroundColor: COLORS.WHITE,
    borderColor: COLORS.BORDER_LIGHT,
    borderRadius: 16,
    borderWidth: 1,
    elevation: 2,
    overflow: 'hidden',
    paddingHorizontal: 14,
    paddingVertical: 14,
    shadowColor: COLORS.INVOICE_SHADOW,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  accent: {
    backgroundColor: COLORS.LOGIN_PRIMARY,
    bottom: 0,
    left: 0,
    opacity: 0.85,
    position: 'absolute',
    top: 0,
    width: 3,
  },
  content: {
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: COLORS.INVOICE_AVATAR_BACKGROUND,
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    marginRight: 12,
    width: 44,
  },
  details: {
    flex: 1,
    minWidth: 0,
    paddingRight: 8,
  },
  nameRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 4,
  },
  name: {
    flexShrink: 1,
  },
  badge: {
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  paidBadge: {
    backgroundColor: COLORS.INVOICE_PAID_BACKGROUND,
  },
  draftBadge: {
    backgroundColor: COLORS.INVOICE_DRAFT_BACKGROUND,
  },
  dates: {
    marginBottom: 3,
  },
  amountColumn: {
    alignItems: 'flex-end',
  },
  menuButton: {
    alignItems: 'center',
    height: 22,
    justifyContent: 'center',
    marginBottom: 4,
    width: 28,
  },
  amount: {
    marginBottom: 4,
  },
  dueText: {
    color: COLORS.INVOICE_DUE_TEXT,
    fontFamily: FONTS.semiBold,
    fontSize: 11,
  },
  settledText: {
    color: COLORS.TEXT_MUTED,
    fontFamily: FONTS.medium,
    fontSize: 11,
  },
  popoverBackdrop: {
    backgroundColor: 'transparent',
  },
  popover: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 14,
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
