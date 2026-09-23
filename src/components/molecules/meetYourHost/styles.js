import {StyleSheet} from 'react-native';
import {COLORS} from '../../../constants';

export default StyleSheet.create({
  section: {
    marginTop: 4,
  },
  sectionTitle: {
    marginBottom: 14,
  },
  card: {
    backgroundColor: COLORS.SURFACE,
    borderColor: COLORS.BORDER_LIGHT,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  cardHeader: {
    height: 72,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  avatarSection: {
    alignItems: 'center',
    marginTop: 24,
  },
  avatarWrap: {
    position: 'relative',
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: COLORS.LOGIN_PRIMARY,
    borderColor: COLORS.SURFACE,
    borderRadius: 40,
    borderWidth: 4,
    height: 80,
    justifyContent: 'center',
    width: 80,
  },
  avatarImage: {
    borderColor: COLORS.SURFACE,
    borderRadius: 40,
    borderWidth: 4,
    height: 80,
    width: 80,
  },
  verifiedBadge: {
    alignItems: 'center',
    backgroundColor: COLORS.LOGIN_PRIMARY,
    borderColor: COLORS.SURFACE,
    borderRadius: 12,
    borderWidth: 2,
    bottom: 2,
    height: 24,
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
    width: 24,
  },
  verifiedRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    marginTop: 12,
  },
  hostName: {
    marginTop: 8,
    textAlign: 'center',
  },
  languagesBox: {
    alignItems: 'center',
    backgroundColor: COLORS.SURFACE,
    borderColor: COLORS.BORDER_LIGHT,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 8,
    marginTop: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  languagesIconWrap: {
    alignItems: 'center',
    backgroundColor: '#E8F3E6',
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  languagesContent: {
    flex: 1,
  },
  tagline: {
    lineHeight: 20,
    marginTop: 16,
    textAlign: 'center',
  },
});
