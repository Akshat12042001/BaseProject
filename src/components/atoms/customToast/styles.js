import {StyleSheet} from 'react-native';
import {COLORS, FONTS} from '../../../constants';

const styles = StyleSheet.create({
  customToast: {
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 12,
    width: '90%',
    marginTop:40
  },
  successToast: {
    backgroundColor: COLORS.TOAST_SUCCESS_BACKGROUND,
    borderColor: COLORS.TOAST_SUCCESS_BORDER,
  },
  errorToast: {
    backgroundColor: COLORS.TOAST_ERROR_BACKGROUND,
    borderColor: COLORS.TOAST_ERROR_BORDER,
  },
  statusIndicator: {
    borderRadius: 3,
    height: 32,
    width: 4,
  },
  successIndicator: {
    backgroundColor: COLORS.TOAST_SUCCESS_BORDER,
  },
  errorIndicator: {
    backgroundColor: COLORS.TOAST_ERROR_BORDER,
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  customTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: 14,
  },
  successTitle: {
    color: COLORS.TOAST_SUCCESS_TEXT,
  },
  errorTitle: {
    color: COLORS.TOAST_ERROR_TEXT,
  },
  customMessage: {
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONTS.regular,
    fontSize: 13,
    marginTop: 3,
  },
});
export default styles;
