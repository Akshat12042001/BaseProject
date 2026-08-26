import {StyleSheet} from 'react-native';
import {COLORS} from '../../../constants';

export default StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: COLORS.SURFACE,
    borderColor: COLORS.INVOICE_BORDER,
    borderRadius: 11,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 80,
    paddingHorizontal: 10,
    paddingVertical: 10,
    shadowColor: COLORS.INVOICE_SHADOW,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  templateImage: {
    borderColor: COLORS.MENU_PREVIEW_BORDER,
    borderRadius: 6,
    borderWidth: 1,
    height: 60,
    width: 48,
  },
  details: {
    flex: 1,
    marginLeft: 11,
    minWidth: 0,
  },
  title: {
    marginBottom: 2,
  },
  updatedRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 4,
  },
  updatedText: {
    marginLeft: 4,
  },
  chevron: {
    marginLeft: 8,
  },
});
