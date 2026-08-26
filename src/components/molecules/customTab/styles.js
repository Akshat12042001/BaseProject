import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  /** Row inside the pill — equal-width tabs */
  tabRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    width: '100%',
  },
  tabHit: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    minHeight: 48,
  },
  tabColumn: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  /** Keeps icon row baseline aligned when dot is hidden */
  dotSlot: {
    marginTop: 6,
    height: 6,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  activeDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
});
