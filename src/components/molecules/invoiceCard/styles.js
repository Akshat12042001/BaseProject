import {StyleSheet} from 'react-native';
import {COLORS, FONTS} from '../../../constants';

export default StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: COLORS.SURFACE,
    borderColor: COLORS.INVOICE_BORDER,
    borderRadius: 11,
    borderWidth: 1,
    flexDirection: 'row',
    height: 67,
    paddingHorizontal: 11,
    shadowColor: COLORS.INVOICE_SHADOW,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: COLORS.INVOICE_AVATAR_BACKGROUND,
    borderRadius: 10,
    height: 36,
    justifyContent: 'center',
    marginRight: 10,
    width: 36,
  },
  avatarText: {
    color: COLORS.INVOICE_AVATAR_TEXT,
    fontFamily: FONTS.bold,
    fontSize: 11,
  },
  details: {
    flex: 1,
    minWidth: 0,
  },
  nameRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 1,
  },
  name: {
    flexShrink: 1,
  },
  badge: {
    borderRadius: 8,
    marginLeft: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  paidBadge: {
    backgroundColor: COLORS.INVOICE_PAID_BACKGROUND,
  },
  draftBadge: {
    backgroundColor: COLORS.INVOICE_DRAFT_BACKGROUND,
  },
  badgeText: {
    fontFamily: FONTS.extraBold,
    fontSize: 8,
  },
  paidBadgeText: {
    color: COLORS.INVOICE_PAID_TEXT,
  },
  draftBadgeText: {
    color: COLORS.INVOICE_DRAFT_TEXT,
  },
  dates: {
    marginBottom: 1,
  },
  amountColumn: {
    alignItems: 'flex-end',
    marginLeft: 8,
  },
  settlement: {
    marginTop: 1,
  },
  dueText: {
    color: COLORS.INVOICE_DUE_TEXT,
    fontFamily: FONTS.medium,
    fontSize: 10,
  },
  settledText: {
    color: COLORS.TEXT_MUTED,
    fontFamily: FONTS.medium,
    fontSize: 10,
  },
});
