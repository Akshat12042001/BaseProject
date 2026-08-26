import {StyleSheet} from 'react-native';
import {COLORS} from '../../../constants';

const styles = StyleSheet.create({
  screen: {
    backgroundColor: COLORS.LOGIN_BACKGROUND,
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 28,
    paddingHorizontal: 18,
  },
  header: {
    paddingTop: 40,
  },
  logo: {
    height: 75,
    width: '100%',
  },
  titleSpacing: {
    paddingVertical: 10,
  },
  methodLabel: {
    marginTop: 6,
  },
  methodSelector: {
    backgroundColor: COLORS.LOGIN_SEGMENT_BACKGROUND,
    borderRadius: 25,
    flexDirection: 'row',
    height: 50,
    marginTop: 15,
    padding: 3,
  },
  methodOption: {
    alignItems: 'center',
    borderRadius: 16,
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  activeMethod: {
    backgroundColor: COLORS.LOGIN_PRIMARY,
  },
  form: {
    marginTop: 24,
  },
  forgotPasswordRow: {
    alignItems: 'flex-end',
    marginTop: 10,
  },
  loginButton: {
    borderRadius: 7,
    height: 53,
    marginTop: 20,
    paddingVertical: 0,
  },
});

export default styles;