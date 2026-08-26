import {StyleSheet} from 'react-native';
import {COLORS} from '../../../constants';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 17,
  },
  errorContainer: {
    marginTop: -8,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
    marginBottom: 40,
  },
  errorText: {
    color: COLORS.BLACK,
    fontSize: 12,
    marginLeft: 5,
    lineHeight: 16,
  },
});