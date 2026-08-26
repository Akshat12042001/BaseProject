import {StyleSheet} from 'react-native';
import {COLORS, FONTS} from '../../../constants';

export default StyleSheet.create({
  container: {
    marginBottom: 15,
    position: 'relative',
    zIndex: 10,
  },
  label: {
    backgroundColor: COLORS.SURFACE,
    left: 10,
    paddingHorizontal: 4,
    position: 'absolute',
    top: 0,
    zIndex: 2,
  },
  inputContainer: {
    backgroundColor: COLORS.SURFACE,
    borderColor: COLORS.INVOICE_FORM_FIELD_BORDER,
    borderRadius: 6,
    borderWidth: 1,
    marginTop: 8,
  },
  focusedInputContainer: {
    borderColor: COLORS.LOGIN_PRIMARY,
  },
  textInput: {
    color: COLORS.GREYSCALE_900,
    fontFamily: FONTS.regular,
    fontSize: 14,
    paddingLeft: 12,
  },
  suggestionsContainer: {
    backgroundColor: COLORS.SURFACE,
    borderColor: COLORS.BORDER_LIGHT,
    borderRadius: 7,
    borderWidth: 1,
  },
  option: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 46,
    paddingHorizontal: 14,
  },
});
