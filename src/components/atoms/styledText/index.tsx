import React from 'react';
import {View, Text, StyleProp, TextStyle, ViewStyle} from 'react-native';
import {COLORS, FONTS, FONT_SIZE} from '../../../constants';

interface StyleTextProps {
  children: React.ReactNode;
  variant?: keyof typeof FONTS;
  size?: number;
  color?: string;
  textAlign?: 'left' | 'right' | 'center';
  textStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  onLayout?: () => void;
  lineHeight?: number;
  onPress?: () => void;
}

const StyledText: React.FC<StyleTextProps> = ({
  children,
  onLayout,
  variant = 'regular',
  size = FONT_SIZE.MD,
  color = COLORS.PRIMARY,
  lineHeight,
  textStyle,
  textAlign = 'left',
  onPress = undefined,
  containerStyle,
  ...props
}) => {
  const style = {
    fontFamily: FONTS[variant],
    color: color,
    fontSize: size,
    lineHeight,
    textAlign,
  };

  return (
    <View onLayout={onLayout} style={containerStyle}>
      <Text onPress={onPress} style={[style, textStyle]} {...props}>
        {children}
      </Text>
    </View>
  );
};

export default StyledText;
