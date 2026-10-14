import {StyleSheet} from 'react-native';
import {COLORS, FONTS, SCREEN} from '../../../constants';

export default StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0,0,0,0.45)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdropPressable: {
    flex: 1,
  },
  container: {
    backgroundColor: COLORS.WHITE,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: SCREEN.HEIGHT * 0.92,
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
    paddingBottom: 4,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  headerSpacer: {
    width: 36,
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
  body: {
    paddingBottom: 16,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  subtitle: {
    lineHeight: 20,
    marginBottom: 14,
  },
  searchRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: COLORS.WHITE,
    borderColor: COLORS.LOGIN_INPUT_BORDER,
    borderRadius: 8,
    borderWidth: 1,
    color: COLORS.GREYSCALE_900,
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: 14,
    height: 48,
    paddingHorizontal: 14,
  },
  searchButton: {
    alignItems: 'center',
    backgroundColor: COLORS.GREYSCALE_200,
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    minWidth: 84,
    paddingHorizontal: 14,
  },
  searchButtonActive: {
    backgroundColor: COLORS.LOGIN_PRIMARY,
  },
  coordRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  coordField: {
    flex: 1,
  },
  coordLabel: {
    marginBottom: 6,
  },
  coordInput: {
    backgroundColor: COLORS.WHITE,
    borderColor: COLORS.LOGIN_INPUT_BORDER,
    borderRadius: 8,
    borderWidth: 1,
    color: COLORS.GREYSCALE_900,
    fontFamily: FONTS.regular,
    fontSize: 14,
    height: 44,
    paddingHorizontal: 12,
  },
  coordinatesText: {
    marginBottom: 12,
    marginTop: 4,
  },
  useButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: COLORS.LOGIN_PRIMARY,
    borderRadius: 8,
    marginBottom: 12,
    minWidth: 160,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  useButtonDisabled: {
    opacity: 0.7,
  },
  mapWrap: {
    alignSelf: 'center',
    backgroundColor: COLORS.GREYSCALE_100,
    borderColor: COLORS.BORDER_LIGHT,
    borderRadius: 12,
    borderWidth: 1,
  },
  mapLoading: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchError: {
    marginBottom: 8,
  },
});
