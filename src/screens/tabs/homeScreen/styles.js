import {StyleSheet} from 'react-native';
import {COLORS} from '../../../constants';

export default StyleSheet.create({
  screen: {
    backgroundColor: COLORS.BACKGROUND,
    flex: 1,
  },
  header: {
    backgroundColor: COLORS.PRIMARY_DARK,
    paddingBottom: 16,
    paddingHorizontal: 14,
    paddingTop: 8,
  },
  greetingRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  greetingText: {
    flex: 1,
    paddingRight: 12,
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
  greeting: {
    marginTop: 2,
  },
  body: {
    flex: 1,
  },
  content: {
    paddingBottom: 90,
    paddingHorizontal: 14,
    paddingTop: 10,
  },
  quickStatsCard: {
    backgroundColor: COLORS.SURFACE,
    borderColor: COLORS.BORDER_LIGHT,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
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
    marginTop: 8,
  },
  quickStatsRow: {
    alignItems: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickStatsRowSpacing: {
    marginTop: 8,
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
    justifyContent: 'center',
    minHeight: 88,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  quickStatIconWrap: {
    alignItems: 'center',
    borderRadius: 9,
    height: 28,
    justifyContent: 'center',
    marginBottom: 5,
    width: 28,
  },
  quickStatLabel: {
    marginBottom: 2,
    textAlign: 'center',
  },
  quickStatValue: {
    marginBottom: 1,
    textAlign: 'center',
  },
  manageSection: {
    backgroundColor: COLORS.SURFACE,
    borderColor: COLORS.BORDER_LIGHT,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
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
    marginBottom: 8,
    marginTop: 2,
  },
  manageGrid: {
    marginTop: 0,
  },
  manageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  manageRowSpacing: {
    marginTop: 8,
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
    minHeight: 64,
    paddingHorizontal: 7,
    paddingVertical: 7,
  },
  manageToolIconWrap: {
    alignItems: 'center',
    borderRadius: 15,
    height: 30,
    justifyContent: 'center',
    width: 30,
  },
  manageToolCopy: {
    flex: 1,
    marginHorizontal: 5,
  },
  manageToolAction: {
    alignItems: 'center',
    borderRadius: 12,
    height: 24,
    justifyContent: 'center',
    width: 24,
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
