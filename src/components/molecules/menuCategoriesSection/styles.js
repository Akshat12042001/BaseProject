import {StyleSheet} from 'react-native';
import {COLORS} from '../../../constants';

export default StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  header: {
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  subtitle: {
    marginTop: 4,
  },
  categoryCard: {
    backgroundColor: COLORS.SURFACE,
    borderColor: COLORS.BORDER_LIGHT,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 10,
    padding: 12,
  },
  categoryHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 8,
  },
  categoryInput: {
    flex: 1,
    marginBottom: 0,
  },
  categoryActions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
    marginTop: 8,
  },
  iconButton: {
    alignItems: 'center',
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  suggestedSection: {
    marginTop: 12,
  },
  suggestedLabel: {
    marginBottom: 8,
  },
  suggestedList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  suggestedChip: {
    backgroundColor: COLORS.SURFACE,
    borderColor: COLORS.BORDER_LIGHT,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  itemCard: {
    backgroundColor: COLORS.INVOICE_FORM_BACKGROUND,
    borderColor: COLORS.BORDER_LIGHT,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 12,
    padding: 10,
  },
  itemFieldsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  itemNameField: {
    flex: 1,
    marginBottom: 0,
  },
  priceField: {
    marginBottom: 0,
    width: 108,
  },
  itemMetaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  toggleGroup: {
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    flexWrap: 'wrap',
    gap: 12,
  },
  toggleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  itemActions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  outlineButton: {
    alignItems: 'center',
    alignSelf: 'flex-end',
    borderColor: COLORS.LOGIN_PRIMARY,
    borderRadius: 7,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  addCategoryButton: {
    alignSelf: 'flex-end',
    marginTop: 2,
  },
});
