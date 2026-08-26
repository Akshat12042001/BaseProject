import React, {useCallback, useMemo, useState} from 'react';
import {View} from 'react-native';
import {AutocompleteDropdown} from 'react-native-autocomplete-dropdown';
import {StyledText} from '../../atoms';
import {COLORS} from '../../../constants';
import {formatCurrency} from '../../../utils/invoice';
import styles from './styles';

const InvoiceItemDropdown = ({
  items,
  label,
  placeholder,
  value,
  isLoading,
  showAmount = true,
  onChangeText,
  onSelectItem,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const textInputProps = useMemo(
    () => ({
      autoCapitalize: 'sentences',
      autoCorrect: false,
      placeholder,
      placeholderTextColor: COLORS.GREYSCALE_500,
      style: styles.textInput,
    }),
    [placeholder],
  );

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  const handleSelectItem = useCallback(
    item => {
      if (item) {
        onSelectItem(item);
      }
    },
    [onSelectItem],
  );

  const handleController = useCallback(
    controller => {
      controller?.setInputText(value || '');
    },
    [value],
  );

  const renderItem = useCallback(
    item => (
      <View style={styles.option}>
        <StyledText size={14}>{item.title}</StyledText>
        {showAmount && (
          <StyledText variant="bold" size={14}>
            {formatCurrency(item.amount)}
          </StyledText>
        )}
      </View>
    ),
    [showAmount],
  );

  return (
    <View style={styles.container}>
      <StyledText
        color={isFocused ? COLORS.LOGIN_PRIMARY : COLORS.GREYSCALE_500}
        size={12}
        containerStyle={styles.label}>
        {label}
      </StyledText>
      <AutocompleteDropdown
        dataSet={items}
        controller={handleController}
        loading={isLoading}
        editable
        clearOnFocus={false}
        closeOnBlur
        closeOnSubmit={false}
        showChevron={false}
        showClear={false}
        inputHeight={54}
        suggestionsListMaxHeight={160}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChangeText={onChangeText}
        onSelectItem={handleSelectItem}
        renderItem={renderItem}
        textInputProps={textInputProps}
        inputContainerStyle={[
          styles.inputContainer,
          isFocused && styles.focusedInputContainer,
        ]}
        suggestionsListContainerStyle={styles.suggestionsContainer}
        EmptyResultComponent={<View />}
      />
    </View>
  );
};

export default React.memo(InvoiceItemDropdown);
