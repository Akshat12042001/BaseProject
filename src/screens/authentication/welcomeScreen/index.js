import React from 'react';
import {ScreenContainer, StyledText} from '../../../components/atoms';
import Config from 'react-native-config';

const WelcomeScreen = () => {
  return (
    <ScreenContainer center>
      <StyledText>{Config.NAME}</StyledText>
    </ScreenContainer>
  );
};

export default WelcomeScreen;
