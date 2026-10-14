import {StyleSheet} from 'react-native';
import {COLORS} from '../../../constants';

export default StyleSheet.create({
  list: {
    backgroundColor: COLORS.GREYSCALE_100,
    flex: 1,
  },
  listContent: {
    paddingBottom: 24,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  separator: {
    height: 12,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 48,
  },
});
