import {StyleSheet} from 'react-native';
import {COLORS} from '../../../constants';

export default StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: COLORS.PRIMARY_DARK,
    flexDirection: 'row',
    paddingBottom: 13,
    paddingHorizontal: 14,
  },
  backButton: {
    alignItems: 'center',
    backgroundColor: COLORS.HEADER_BORDER,
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  badge: {
    backgroundColor: COLORS.INVOICE_FORM_BADGE,
    borderRadius: 10,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
});
