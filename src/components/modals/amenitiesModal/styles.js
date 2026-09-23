import {StyleSheet} from 'react-native';
import {COLORS, SCREEN} from '../../../constants';

const MODAL_MAX_HEIGHT = SCREEN.HEIGHT * 0.75;

export default StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    backgroundColor: COLORS.SURFACE,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: MODAL_MAX_HEIGHT,
    paddingBottom: 24,
  },
  handleContainer: {
    alignItems: 'center',
    paddingTop: 10,
  },
  handle: {
    backgroundColor: COLORS.BORDER_LIGHT,
    borderRadius: 10,
    height: 5,
    width: 40,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  closeButton: {
    alignItems: 'center',
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  title: {
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 36,
  },
  listContent: {
    paddingBottom: 8,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  amenityRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
    marginBottom: 16,
  },
  amenityIcon: {
    alignItems: 'center',
    borderColor: COLORS.BORDER_LIGHT,
    borderRadius: 18,
    borderWidth: 1,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
});
