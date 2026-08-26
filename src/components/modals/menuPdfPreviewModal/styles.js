import {StyleSheet} from 'react-native';
import {COLORS, SCREEN} from '../../../constants';

export default StyleSheet.create({
  modal: {
    margin: 0,
  },
  container: {
    backgroundColor: COLORS.SURFACE,
    flex: 1,
  },
  header: {
    alignItems: 'center',
    borderBottomColor: COLORS.BORDER_LIGHT,
    borderBottomWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  backButton: {
    alignItems: 'center',
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  title: {
    flex: 1,
    marginHorizontal: 8,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 36,
  },
  pdf: {
    flex: 1,
    height: SCREEN.HEIGHT,
    width: SCREEN.WIDTH,
  },
});
