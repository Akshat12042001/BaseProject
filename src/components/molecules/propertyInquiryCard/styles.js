import {StyleSheet} from 'react-native';
import {COLORS} from '../../../constants';

export default StyleSheet.create({
  card: {
    borderColor: COLORS.BORDER_LIGHT,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 6,
    padding: 14,
  },
  priceRow: {
    alignItems: 'baseline',
    flexDirection: 'row',
    gap: 4,
    marginBottom: 14,
  },
  fieldLabel: {
    letterSpacing: 0.4,
    marginBottom: 6,
  },
  field: {
    borderColor: COLORS.BORDER_LIGHT,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  guestsLabel: {
    letterSpacing: 0.4,
    marginBottom: 10,
    marginTop: 4,
  },
  guestRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  guestText: {
    flex: 1,
    paddingRight: 12,
  },
  guestHint: {
    marginTop: 2,
  },
  stepper: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
  },
  stepperButton: {
    alignItems: 'center',
    borderColor: COLORS.BORDER_LIGHT,
    borderRadius: 18,
    borderWidth: 1,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  stepperButtonActive: {
    borderColor: COLORS.LOGIN_PRIMARY,
  },
  stepperValue: {
    minWidth: 16,
    textAlign: 'center',
  },
  chatButton: {
    alignItems: 'center',
    backgroundColor: COLORS.LOGIN_PRIMARY,
    borderRadius: 8,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    marginTop: 4,
    minHeight: 48,
  },
});
