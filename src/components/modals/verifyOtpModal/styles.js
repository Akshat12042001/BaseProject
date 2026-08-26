import {StyleSheet} from 'react-native';
import {COLORS} from '../../../constants';

const styles = StyleSheet.create({
  modal: {
    alignItems: 'center',
    justifyContent: 'center',
    // margin: 14,
  },
  container: {
    backgroundColor: COLORS.SURFACE,
    borderRadius: 14,
    paddingBottom: 24,
    paddingHorizontal: 14,
    paddingTop: 26,
    width: '100%',
  },
  description: {
    marginTop: 16,
  },
  email: {
    marginTop: 4,
  },
  otpContainer: {
    marginTop: 28,
  },
  verifyButton: {
    borderRadius: 6,
    height: 49,
    marginTop: 7,
    paddingVertical: 0,
  },
  resendRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 28,
  },
});

export default styles;