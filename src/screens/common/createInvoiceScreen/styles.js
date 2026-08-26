import {StyleSheet} from 'react-native';
import {COLORS} from '../../../constants';

export default StyleSheet.create({
  flex: {
    flex: 1,
  },
  detailsLoader: {
    alignItems: 'center',
    backgroundColor: COLORS.INVOICE_FORM_BACKGROUND,
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 100,
  },
  scrollContent: {
    backgroundColor: COLORS.INVOICE_FORM_BACKGROUND,
    padding: 10,
    paddingBottom: 122,
  },
  section: {
    backgroundColor: COLORS.SURFACE,
    borderColor: COLORS.BORDER_LIGHT,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 10,
    padding: 12,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  sectionTitle: {
    marginLeft: 7,
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
  addressInput: {
    height: 76,
    paddingTop: 14,
    textAlignVertical: 'top',
  },
  notesInput: {
    height: 112,
    paddingTop: 16,
    textAlignVertical: 'top',
  },
  addItemButton: {
    alignItems: 'center',
    backgroundColor: COLORS.INVOICE_FORM_MUTED,
    borderRadius: 7,
    flexDirection: 'row',
    height: 49,
    justifyContent: 'center',
    marginTop: 12,
  },
  addItemText: {
    marginLeft: 9,
  },
  footer: {
    backgroundColor: COLORS.SURFACE,
    borderColor: COLORS.BORDER_LIGHT,
    borderTopWidth: 1,
    bottom: 0,
    left: 0,
    paddingHorizontal: 11,
    paddingTop: 8,
    position: 'absolute',
    right: 0,
  },
  totalRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 7,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  shareButton: {
    alignItems: 'center',
    backgroundColor: COLORS.SURFACE,
    borderColor: COLORS.INVOICE_FORM_FIELD_BORDER,
    borderRadius: 7,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    height: 47,
    justifyContent: 'center',
  },
  saveButton: {
    alignItems: 'center',
    backgroundColor: COLORS.LOGIN_PRIMARY,
    borderRadius: 7,
    flex: 1,
    flexDirection: 'row',
    height: 47,
    justifyContent: 'center',
  },
  actionButtonText: {
    marginLeft: 7,
  },
  disabledButton: {
    opacity: 0.65,
  },
});
