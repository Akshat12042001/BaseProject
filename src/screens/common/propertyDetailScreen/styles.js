import {StyleSheet} from 'react-native';
import {COLORS, SCREEN} from '../../../constants';

const IMAGE_HEIGHT = 280;

export default StyleSheet.create({
  screen: {
    backgroundColor: COLORS.SURFACE,
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  gallerySection: {
    height: IMAGE_HEIGHT,
    position: 'relative',
  },
  galleryImage: {
    height: IMAGE_HEIGHT,
    width: SCREEN.WIDTH,
  },
  galleryOverlay: {
    left: 14,
    position: 'absolute',
    right: 14,
    top: 14,
    zIndex: 2,
  },
  galleryActions: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconButton: {
    alignItems: 'center',
    backgroundColor: COLORS.SURFACE,
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  dotsRow: {
    alignItems: 'center',
    bottom: 14,
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    zIndex: 2,
  },
  dot: {
    backgroundColor: 'rgba(255,255,255,0.45)',
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  activeDot: {
    backgroundColor: COLORS.SURFACE,
    width: 18,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 18,
  },
  title: {
    marginBottom: 8,
  },
  ratingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    marginBottom: 10,
  },
  locationRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 18,
  },
  locationText: {
    flexShrink: 1,
  },
  badge: {
    borderColor: COLORS.LOGIN_PRIMARY,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  divider: {
    backgroundColor: COLORS.BORDER_LIGHT,
    height: 1,
    marginVertical: 18,
  },
  highlightsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  highlightItem: {
    marginBottom: 16,
    width: '48%',
  },
  highlightItemFull: {
    width: '100%',
  },
  highlightIconWrap: {
    marginBottom: 8,
  },
  highlightLabel: {
    marginBottom: 4,
  },
  chipRows: {
    gap: 10,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 10,
  },
  chip: {
    alignItems: 'center',
    backgroundColor: COLORS.INVOICE_FORM_MUTED,
    borderRadius: 12,
    flex: 1,
    flexDirection: 'row',
    gap: 10,
    minHeight: 52,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  chipFull: {
    width: '100%',
  },
  chipIcon: {
    alignItems: 'center',
    backgroundColor: COLORS.SURFACE,
    borderRadius: 16,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  chipText: {
    flex: 1,
  },
  sectionTitle: {
    marginBottom: 10,
  },
  bodyText: {
    lineHeight: 22,
  },
  paragraphSpacing: {
    marginTop: 14,
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
  showAllAmenities: {
    marginTop: 4,
  },
  showAllText: {
    textDecorationLine: 'underline',
  },
  centerState: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  stateBackButton: {
    left: 14,
    position: 'absolute',
    top: 14,
    zIndex: 2,
  },
});
