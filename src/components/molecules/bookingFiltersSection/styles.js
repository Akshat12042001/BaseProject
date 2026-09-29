import {StyleSheet} from 'react-native';
import {COLORS} from '../../../constants';

export default StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  filterCard: {
    backgroundColor: COLORS.WHITE,
    borderColor: COLORS.BORDER_LIGHT,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingTop: 4,
    paddingBottom: 8,
  },
  searchField: {
    marginBottom: 0,
  },
  dateRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  dateField: {
    flex: 1,
  },
  toggleSection: {
    marginTop: 12,
  },
  toggleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  toggleGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  toggleButton: {
    borderColor: COLORS.INVOICE_FORM_FIELD_BORDER,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  toggleButtonActive: {
    backgroundColor: COLORS.LOGIN_PRIMARY,
    borderColor: COLORS.LOGIN_PRIMARY,
  },
  toggleHint: {
    flex: 1,
    minWidth: 160,
  },
});
