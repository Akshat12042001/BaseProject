import React from 'react';
import {ScreenContainer, StyledText} from '../../../components/atoms';
import Config from 'react-native-config';
import {View} from 'react-native';
import styles from './styles';

const WelcomeScreen = () => {
  return (
    <ScreenContainer center>
      <View style={styles.root}>
        <StyledText textAlign="center">{Config.NAME}</StyledText>
      </View>
    </ScreenContainer>
  );
};

export default WelcomeScreen;
