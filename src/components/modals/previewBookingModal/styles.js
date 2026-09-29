import {StyleSheet} from 'react-native';
import {COLORS, SCREEN} from '../../../constants';

const NOTE_BACKGROUND = '#FFFBEB';
const NOTE_BORDER = '#F6D9A8';
const NOTE_ACCENT = '#D97706';

export default StyleSheet.create({
  modal: {
    flex: 1,
    margin: 0,
  },
  container: {
    backgroundColor: COLORS.WHITE,
    flex: 1,
  },
  header: {
    alignItems: 'center',
    borderBottomColor: COLORS.GREYSCALE_200,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerTitle: {
    flex: 1,
    marginRight: 12,
  },
  closeButton: {
    alignItems: 'center',
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  loadingContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 28,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  logoWrapper: {
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 8,
  },
  logo: {
    height: 36,
    width: 140,
  },
  propertyCard: {
    backgroundColor: COLORS.GREYSCALE_100,
    borderColor: COLORS.BORDER_LIGHT,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    overflow: 'hidden',
  },
  propertyImage: {
    backgroundColor: COLORS.BORDER_LIGHT,
    height: SCREEN.WIDTH * 0.52,
    width: '100%',
  },
  propertyBody: {
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  sectionLabel: {
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  propertyTitle: {
    marginBottom: 6,
  },
  propertyAddress: {
    lineHeight: 20,
    marginBottom: 14,
  },
  specsCard: {
    backgroundColor: COLORS.WHITE,
    borderColor: COLORS.BORDER_LIGHT,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  specRow: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  specRowBorder: {
    borderBottomColor: COLORS.BORDER_LIGHT,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  specLabel: {
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  detailsCard: {
    backgroundColor: COLORS.GREYSCALE_100,
    borderColor: COLORS.BORDER_LIGHT,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  detailsCardTitle: {
    letterSpacing: 0.6,
    marginBottom: 14,
  },
  detailField: {
    marginBottom: 14,
  },
  detailFieldLast: {
    marginBottom: 0,
  },
  detailLabel: {
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  sectionBlock: {
    marginBottom: 16,
    marginTop: 4,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  sectionAccent: {
    backgroundColor: COLORS.GREYSCALE_900,
    borderRadius: 2,
    height: 16,
    width: 3,
  },
  stayCard: {
    backgroundColor: COLORS.WHITE,
    borderColor: COLORS.BORDER_LIGHT,
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  stayRow: {
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  stayRowBorder: {
    borderBottomColor: COLORS.BORDER_LIGHT,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  stayLabel: {
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  stayTime: {
    marginTop: 2,
  },
  stayListItem: {
    marginTop: 2,
  },
  pricingCard: {
    backgroundColor: COLORS.WHITE,
    borderColor: COLORS.BORDER_LIGHT,
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  pricingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  pricingRowBorder: {
    borderBottomColor: COLORS.BORDER_LIGHT,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  pricingLabel: {
    flex: 1,
    marginRight: 12,
  },
  noteCard: {
    backgroundColor: NOTE_BACKGROUND,
    borderColor: NOTE_BORDER,
    borderLeftColor: NOTE_ACCENT,
    borderLeftWidth: 4,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
    marginTop: 4,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  noteTitle: {
    marginBottom: 8,
  },
  noteLine: {
    lineHeight: 20,
    marginBottom: 6,
  },
  noteClosing: {
    lineHeight: 20,
    marginTop: 4,
  },
  poweredBy: {
    marginBottom: 8,
    marginTop: 4,
  },
});
