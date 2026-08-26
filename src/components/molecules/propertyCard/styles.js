import {StyleSheet} from 'react-native';
import {COLORS, FONTS, SCREEN} from '../../../constants';

export default StyleSheet.create({
  container: {
    backgroundColor: COLORS.SURFACE,
    borderColor: COLORS.BORDER_LIGHT,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    width: '100%',
  },
  compactContainer: {
    width: SCREEN.WIDTH / 2 - 14,
    height: 185,
  },
  image: {
    alignItems: 'center',
    backgroundColor: '#EDF4EF',
    height: 180,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  compactImage: {
    height: 100,
  },
  imageAsset: {
    height: '100%',
    width: '100%',
  },
  stripe: {
    backgroundColor: '#DCE9DF',
    height: 10,
    position: 'absolute',
    transform: [{rotate: '-45deg'}],
    width: 220,
  },
  placeholder: {
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderRadius: 4,
    bottom: 8,
    left: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
    position: 'absolute',
  },
  placeholderText: {
    color: COLORS.TEXT_MUTED,
    fontFamily: FONTS.medium,
    fontSize: 8,
    letterSpacing: 0.4,
  },
  statusBadge: {
    borderRadius: 4,
    left: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    position: 'absolute',
    top: 10,
  },
  draftBadge: {
    backgroundColor: COLORS.INVOICE_DRAFT_BACKGROUND,
  },
  activeBadge: {
    backgroundColor: COLORS.INVOICE_PAID_BACKGROUND,
  },
  menuButton: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  menuIcon: {
    alignItems: 'center',
    backgroundColor: COLORS.SURFACE,
    borderRadius: 16,
    height: 32,
    justifyContent: 'center',
    transform: [{rotate: '90deg'}],
    width: 32,
  },
  content: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  locationRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 6,
  },
  locationText: {
    marginLeft: 4,
  },
  title: {
    marginBottom: 8,
  },
  featuresRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    marginBottom: 8,
  },
  feature: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  featureText: {
    marginLeft: 4,
  },
  cancellation: {
    marginBottom: 10,
  },
  priceRow: {
    alignItems: 'baseline',
    flexDirection: 'row',
    gap: 4,
  },
});
