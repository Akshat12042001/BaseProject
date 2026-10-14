import React, {useCallback, useState} from 'react';
import {Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Dropdown} from 'react-native-element-dropdown';
import {StyledText} from '../../../components/atoms';
import {COLORS} from '../../../constants';
import styles from './styles';

const ListingSelect = ({
  items,
  label,
  required = false,
  placeholder,
  value,
  error,
  onBlur,
  onSelectItem,
  containerStyle,
  valueField = 'title',
  disabled = false,
}) => {
  const {t} = useTranslation();
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    onBlur?.();
  }, [onBlur]);

  const handleChange = useCallback(
    item => {
      if (item) {
        onSelectItem(item);
      }
    },
    [onSelectItem],
  );

  const labelColor = error
    ? COLORS.RED_ERROR
    : isFocused
    ? COLORS.LOGIN_PRIMARY
    : COLORS.GREYSCALE_500;

  return (
    <View style={[styles.dropdown, containerStyle]}>
      <StyledText
        color={labelColor}
        size={12}
        containerStyle={styles.dropdownLabel}>
        {label}
        {required ? <Text style={styles.requiredMark}> **</Text> : null}
      </StyledText>
      <Dropdown
        data={items}
        labelField="title"
        valueField={valueField}
        placeholder={placeholder}
        value={value}
        disable={disabled}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        maxHeight={220}
        dropdownPosition="auto"
        style={[
          styles.dropdownField,
          isFocused && styles.dropdownFieldFocused,
          !!error && styles.dropdownFieldError,
        ]}
        placeholderStyle={styles.dropdownPlaceholder}
        selectedTextStyle={styles.dropdownSelectedText}
        selectedTextProps={{numberOfLines: 1}}
        itemTextStyle={styles.dropdownItemText}
        containerStyle={styles.dropdownList}
        activeColor={COLORS.GREYSCALE_100}
      />
      {!!error && (
        <StyledText
          size={12}
          color={COLORS.RED_ERROR}
          containerStyle={styles.dropdownError}>
          *{t(error)}
        </StyledText>
      )}
    </View>
  );
};

export default React.memo(ListingSelect);
