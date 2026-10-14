import {StyleSheet} from 'react-native';
import {COLORS} from '../../../constants';

const BADGE_RED = '#EF3B3B';

export default StyleSheet.create({
  card: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'visible',
  },
  cardUnread: {
    borderColor: COLORS.LOGIN_PRIMARY,
    borderLeftWidth: 5,
  },
  cardRead: {
    borderColor: COLORS.GREYSCALE_200,
  },
  unreadDot: {
    backgroundColor: BADGE_RED,
    borderRadius: 5,
    height: 10,
    left: 2,
    position: 'absolute',
    top: 8,
    width: 10,
    zIndex: 2,
  },
  content: {
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  senderRow: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    marginRight: 12,
  },
  newBadge: {
    backgroundColor: BADGE_RED,
    borderRadius: 6,
    marginRight: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  sender: {
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  title: {
    marginTop: 14,
  },
  divider: {
    backgroundColor: COLORS.GREYSCALE_200,
    height: StyleSheet.hairlineWidth,
    marginTop: 14,
  },
  readRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 12,
  },
  readDot: {
    backgroundColor: COLORS.LOGIN_PRIMARY,
    borderRadius: 4,
    height: 8,
    marginRight: 8,
    width: 8,
  },
});
