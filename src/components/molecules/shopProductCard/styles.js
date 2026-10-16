import {StyleSheet} from 'react-native';
import {COLORS, FONTS} from '../../../constants';

export default StyleSheet.create({
  container: {
    backgroundColor: COLORS.SURFACE,
    borderColor: COLORS.BORDER_LIGHT,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    width: '100%',
  },
  imageWrap: {
    backgroundColor: COLORS.GREYSCALE_100,
    height: 180,
    width: '100%',
  },
  image: {
    height: '100%',
    width: '100%',
  },
  imagePlaceholder: {
    alignItems: 'center',
    backgroundColor: '#EDF4EF',
    flex: 1,
    justifyContent: 'center',
  },
  discountBadge: {
    backgroundColor: COLORS.RED_ERROR,
    borderRadius: 999,
    left: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    position: 'absolute',
    top: 10,
  },
  content: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  categoryTag: {
    alignSelf: 'flex-start',
    borderColor: COLORS.LOGIN_PRIMARY,
    borderRadius: 999,
    borderWidth: 1,
    marginBottom: 8,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  title: {
    marginBottom: 6,
  },
  description: {
    lineHeight: 18,
    marginBottom: 10,
  },
  priceRow: {
    alignItems: 'baseline',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  currentPrice: {
    marginRight: 8,
  },
  originalPrice: {
    marginRight: 8,
    textDecorationLine: 'line-through',
  },
  taxNote: {
    fontFamily: FONTS.regular,
  },
});
