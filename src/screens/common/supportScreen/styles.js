import {StyleSheet} from 'react-native';
import {COLORS} from '../../../constants';

export default StyleSheet.create({
  screen: {
    backgroundColor: COLORS.GREYSCALE_100,
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
    paddingHorizontal: 20,
    paddingTop: 28,
  },
  heading: {
    alignSelf: 'stretch',
    marginBottom: 10,
  },
  description: {
    alignSelf: 'stretch',
    marginBottom: 28,
  },
  card: {
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
    borderColor: COLORS.GREYSCALE_200,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 20,
    paddingVertical: 28,
  },
  iconWrap: {
    alignItems: 'center',
    backgroundColor: COLORS.INVOICE_FORM_BADGE,
    borderRadius: 14,
    height: 56,
    justifyContent: 'center',
    marginBottom: 16,
    width: 56,
  },
  cardTitle: {
    alignSelf: 'stretch',
    marginBottom: 8,
  },
  cardDescription: {
    alignSelf: 'stretch',
    marginBottom: 16,
  },
  availability: {
    alignItems: 'center',
    backgroundColor: COLORS.INVOICE_PAID_BACKGROUND,
    borderRadius: 20,
    flexDirection: 'row',
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  availabilityText: {
    marginLeft: 6,
  },
  contact: {
    alignSelf: 'stretch',
    marginBottom: 20,
  },
  actionButton: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: COLORS.LOGIN_PRIMARY,
    borderRadius: 10,
    flexDirection: 'row',
    height: 48,
    justifyContent: 'center',
  },
  actionLabel: {
    marginLeft: 8,
  },
  footer: {
    alignSelf: 'stretch',
    marginTop: 8,
  },
});
