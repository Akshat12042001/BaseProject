import {StyleSheet} from 'react-native';
import {COLORS} from '../../../constants';

export default StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContent: {
    backgroundColor: COLORS.LOGIN_BACKGROUND,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 120,
  },
  section: {
    marginBottom: 10,
  },
  sectionLabel: {
    letterSpacing: 0.4,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  requiredMark: {
    color: COLORS.RED_ERROR,
  },
  fieldsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  dateField: {
    flex: 1,
  },
  lastField: {
    marginBottom: 0,
  },
  guestsCard: {
    borderColor: COLORS.INVOICE_FORM_FIELD_BORDER,
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  guestRow: {
    alignItems: 'center',
    borderBottomColor: COLORS.INVOICE_FORM_FIELD_BORDER,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  guestRowLast: {
    borderBottomWidth: 0,
  },
  guestRowText: {
    flex: 1,
    paddingRight: 12,
  },
  guestSubtitle: {
    marginTop: 4,
  },
  stepper: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
  },
  stepperButton: {
    alignItems: 'center',
    borderColor: COLORS.LOGIN_PRIMARY,
    borderRadius: 18,
    borderWidth: 1,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  stepperButtonDisabled: {
    borderColor: COLORS.INVOICE_FORM_FIELD_BORDER,
    opacity: 0.45,
  },
  stepperValue: {
    minWidth: 16,
    textAlign: 'center',
  },
  checkboxRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  checkbox: {
    alignItems: 'center',
    borderColor: COLORS.LOGIN_PRIMARY,
    borderRadius: 4,
    borderWidth: 1.5,
    height: 22,
    justifyContent: 'center',
    width: 22,
  },
  checkboxChecked: {
    backgroundColor: COLORS.LOGIN_PRIMARY,
    borderColor: COLORS.LOGIN_PRIMARY,
  },
  currencyPrefix: {
    marginTop: 2,
  },
  noteCard: {
    borderColor: COLORS.INVOICE_FORM_FIELD_BORDER,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  noteParagraph: {
    marginBottom: 10,
  },
  footer: {
    backgroundColor: COLORS.SURFACE,
    borderColor: COLORS.BORDER_LIGHT,
    borderTopWidth: 1,
    bottom: 0,
    left: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    position: 'absolute',
    right: 0,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelButton: {
    alignItems: 'center',
    borderColor: COLORS.LOGIN_PRIMARY,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 14,
  },
  createButton: {
    alignItems: 'center',
    backgroundColor: COLORS.LOGIN_PRIMARY,
    borderRadius: 8,
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 14,
  },
  disabledButton: {
    opacity: 0.65,
  },
});
