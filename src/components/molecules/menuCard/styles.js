import {StyleSheet} from 'react-native';
import {COLORS} from '../../../constants';

export default StyleSheet.create({
  card: {
    backgroundColor: COLORS.SURFACE,
    borderColor: COLORS.INVOICE_BORDER,
    borderRadius: 11,
    borderWidth: 1,
    elevation: 2,
    flexDirection: 'row',
    minHeight: 80,
    paddingHorizontal: 10,
    paddingVertical: 10,
    shadowColor: COLORS.INVOICE_SHADOW,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  templateImage: {
    borderColor: COLORS.MENU_PREVIEW_BORDER,
    borderRadius: 6,
    borderWidth: 1,
    height: 60,
    marginTop: 2,
    width: 48,
  },
  details: {
    flex: 1,
    marginLeft: 11,
    minWidth: 0,
    paddingRight: 4,
  },
  titleRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  title: {
    flex: 1,
    marginBottom: 2,
    marginRight: 4,
  },
  description: {
    marginBottom: 8,
  },
  activeRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  activeLabel: {
    marginRight: 8,
  },
  updatedRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 6,
  },
  updatedText: {
    marginLeft: 4,
  },
  menuButton: {
    alignItems: 'center',
    height: 28,
    justifyContent: 'center',
    marginTop: -2,
    width: 28,
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
    minWidth: 200,
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
