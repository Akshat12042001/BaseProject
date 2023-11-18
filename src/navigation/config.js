import {
  CardStyleInterpolators,
  HeaderStyleInterpolators,
  TransitionSpecs,
} from '@react-navigation/stack';

export default {
  headerShown: false,
  transitionSpec: {
    open: TransitionSpecs.TransitionIOSSpec,
    close: TransitionSpecs.TransitionIOSSpec,
  },
  headerStyleInterpolator: HeaderStyleInterpolators.forSlideLeft,
  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
  gestureEnabled: false,
  // gestureDirection: 'horizontal',
};
