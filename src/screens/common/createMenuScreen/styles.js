import {StyleSheet} from 'react-native';
import {COLORS} from '../../../constants';

export default StyleSheet.create({
  flex: {
    flex: 1,
  },
  headerIconButton: {
    alignItems: 'center',
    backgroundColor: COLORS.HEADER_BORDER,
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  scrollContent: {
    backgroundColor: COLORS.INVOICE_FORM_BACKGROUND,
    padding: 10,
    paddingBottom: 110,
  },
  templateSection: {
    marginBottom: 10,
  },
  templateHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  templateList: {
    gap: 10,
    paddingRight: 10,
  },
  templateCard: {
    borderColor: 'transparent',
    borderRadius: 10,
    borderWidth: 2,
    overflow: 'hidden',
  },
  templateCardSelected: {
    borderColor: COLORS.LOGIN_PRIMARY,
  },
  templateImage: {
    height: 108,
    width: 78,
  },
  section: {
    backgroundColor: COLORS.SURFACE,
    borderColor: COLORS.BORDER_LIGHT,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 10,
    padding: 12,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  logoRow: {
    alignItems: 'center',
    backgroundColor: COLORS.INVOICE_FORM_MUTED,
    borderRadius: 8,
    flexDirection: 'row',
    marginBottom: 14,
    minHeight: 62,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  logoPlaceholder: {
    alignItems: 'center',
    backgroundColor: COLORS.SURFACE,
    borderColor: COLORS.BORDER_LIGHT,
    borderRadius: 6,
    borderWidth: 1,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  logoCopy: {
    flex: 1,
    marginHorizontal: 10,
  },
  logoSubtitle: {
    marginTop: 2,
  },
  fieldsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  halfField: {
    flex: 1,
  },
  lastField: {
    marginBottom: 0,
  },
  footer: {
    backgroundColor: COLORS.SURFACE,
    borderColor: COLORS.BORDER_LIGHT,
    borderTopWidth: 1,
    bottom: 0,
    elevation: 8,
    left: 0,
    paddingHorizontal: 11,
    paddingTop: 8,
    position: 'absolute',
    right: 0,
    zIndex: 20,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  saveButton: {
    alignItems: 'center',
    backgroundColor: COLORS.LOGIN_PRIMARY,
    borderRadius: 7,
    flex: 1,
    height: 47,
    justifyContent: 'center',
  },
  shareButton: {
    alignItems: 'center',
    backgroundColor: COLORS.SURFACE,
    borderColor: COLORS.INVOICE_FORM_FIELD_BORDER,
    borderRadius: 7,
    borderWidth: 1,
    height: 47,
    justifyContent: 'center',
    width: 47,
  },
  disabledButton: {
    opacity: 0.65,
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
  logoImage: {
    borderRadius: 6,
    height: 42,
    width: 42,
  },
});
