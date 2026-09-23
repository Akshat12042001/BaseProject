import {StyleSheet} from 'react-native';
import {COLORS} from '../../../constants';

export default StyleSheet.create({
  screen: {
    backgroundColor: COLORS.BACKGROUND,
    flex: 1,
  },
  header: {
    backgroundColor: COLORS.PRIMARY_DARK,
    paddingBottom: 24,
    paddingHorizontal: 14,
    paddingTop: 8,
  },
  brandRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  notification: {
    alignItems: 'center',
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 18,
    borderWidth: 1,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  date: {
    marginTop: 15,
  },
  greeting: {
    marginTop: 4,
  },
  body: {
    flex: 1,
  },
  content: {
    paddingBottom: 90,
    paddingHorizontal: 14,
    paddingTop: 12,
  },
  quickStatsCard: {
    backgroundColor: COLORS.SURFACE,
    borderColor: COLORS.BORDER_LIGHT,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: '#152B1A',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  quickStatsTitle: {
    letterSpacing: 0.4,
  },
  quickStatsGrid: {
    marginTop: 12,
  },
  quickStatsRow: {
    alignItems: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickStatsRowSpacing: {
    marginTop: 10,
  },
  quickStatWrapper: {
    width: '48%',
  },
  quickStatCard: {
    alignItems: 'center',
    backgroundColor: COLORS.SURFACE,
    borderColor: COLORS.BORDER_LIGHT,
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'space-between',
    minHeight: 118,
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  quickStatContent: {
    alignItems: 'center',
    width: '100%',
  },
  quickStatIconWrap: {
    alignItems: 'center',
    borderRadius: 10,
    height: 34,
    justifyContent: 'center',
    marginBottom: 8,
    width: 34,
  },
  quickStatLabel: {
    marginBottom: 4,
    textAlign: 'center',
  },
  quickStatValue: {
    marginBottom: 2,
    textAlign: 'center',
  },
  redeemButton: {
    alignItems: 'center',
    backgroundColor: '#FBF4DF',
    borderRadius: 14,
    flexDirection: 'row',
    gap: 4,
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  redeemSpacer: {
    height: 28,
    marginTop: 8,
  },
  manageSection: {
    backgroundColor: COLORS.SURFACE,
    borderColor: COLORS.BORDER_LIGHT,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    shadowColor: '#152B1A',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  manageTitle: {
    letterSpacing: 0.4,
  },
  manageSubtitle: {
    marginBottom: 12,
    marginTop: 4,
  },
  manageGrid: {
    marginTop: 2,
  },
  manageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  manageRowSpacing: {
    marginTop: 10,
  },
  manageToolWrapper: {
    width: '48%',
  },
  manageToolCard: {
    alignItems: 'center',
    backgroundColor: COLORS.SURFACE,
    borderColor: COLORS.BORDER_LIGHT,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 88,
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  manageToolIconWrap: {
    alignItems: 'center',
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  manageToolCopy: {
    flex: 1,
    marginHorizontal: 6,
  },
  manageToolAction: {
    alignItems: 'center',
    borderRadius: 14,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 16,
  },
  propertyList: {
    gap: 10,
    paddingRight: 14,
    paddingBottom: 40,
  },
  statsSkeletonContainer: {
    width: '100%',
  },
  propertiesSkeletonContainer: {
    overflow: 'hidden',
    width: '100%',
  },
  emptyProperties: {
    alignItems: 'center',
    backgroundColor: COLORS.SURFACE,
    borderColor: COLORS.BORDER_LIGHT,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 100,
    width: '100%',
  },
});
