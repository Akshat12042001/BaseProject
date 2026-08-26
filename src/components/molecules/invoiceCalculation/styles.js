import {StyleSheet} from 'react-native';
import {COLORS} from '../../../constants';

export default StyleSheet.create({
  container: {
    backgroundColor: COLORS.SURFACE,
    borderColor: COLORS.BORDER_LIGHT,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 10,
    padding: 12,
  },
  summaryRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  taxRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  taxLabel: {
    flex: 1,
  },
  taxInput: {
    flex: 0.75,
    marginBottom: 15,
  },
  taxAmount: {
    alignItems: 'flex-end',
    flex: 1,
  },
  fieldsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  adjustmentField: {
    flex: 1,
  },
  lastField: {
    marginBottom: 0,
  },
  divider: {
    backgroundColor: COLORS.BORDER_LIGHT,
    height: 1,
    marginVertical: 18,
  },
  paidRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paidInput: {
    marginBottom: 0,
    width: '48%',
  },
  balanceRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
