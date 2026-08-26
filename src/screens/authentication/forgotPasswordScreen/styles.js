import {StyleSheet} from 'react-native';
import {COLORS} from '../../../constants';

export default StyleSheet.create({
  screen: {
    backgroundColor: COLORS.LOGIN_BACKGROUND,
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingBottom: 28,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    paddingTop: 32,
  },
  logo: {
    height: 75,
    width: '100%',
  },
  title: {
    marginTop: 10,
  },
  description: {
    marginTop: 10,
    maxWidth: 540,
  },
  form: {
    marginTop: 44,
  },
  resetButton: {
    borderRadius: 7,
    height: 50,
    marginTop: 10,
    paddingVertical: 0,
  },
  signInRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 34,
  },
});
