import {StyleSheet} from 'react-native';
import {COLORS, SCREEN} from '../../../constants';

const MODAL_MAX_HEIGHT = SCREEN.HEIGHT * 0.85;

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
    paddingBottom: 8,
    paddingHorizontal: 20,
    paddingTop: 14,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  sliderContainer: {
    height: 28,
    justifyContent: 'center',
    marginBottom: 10,
  },
  sliderTrack: {
    borderRadius: 999,
    height: 6,
    left: 0,
    position: 'absolute',
    right: 0,
  },
  sliderActiveTrack: {
    borderRadius: 999,
    height: 6,
    position: 'absolute',
  },
  sliderThumb: {
    borderColor: COLORS.WHITE,
    borderRadius: 11,
    borderWidth: 2,
    elevation: 2,
    height: 22,
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.15,
    shadowRadius: 2,
    top: 3,
    width: 22,
  },
  priceRangeText: {
    marginTop: 2,
  },
  categoryRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 16,
  },
  checkbox: {
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
    borderColor: '#C8C8C8',
    borderRadius: 3,
    borderWidth: 1.5,
    height: 18,
    justifyContent: 'center',
    marginRight: 12,
    width: 18,
  },
  checkboxSelected: {
    borderColor: COLORS.LOGIN_PRIMARY,
  },
  footer: {
    borderTopColor: COLORS.BORDER_LIGHT,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  clearButton: {
    backgroundColor: COLORS.WHITE,
    borderColor: COLORS.BORDER,
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
  },
  applyButton: {
    flex: 1,
  },
});
