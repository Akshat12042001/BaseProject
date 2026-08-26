import React, {useCallback} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Input, StyledText} from '../../atoms';
import {TrashIcon} from '../../svgs';
import {COLORS} from '../../../constants';
import {formatCurrency} from '../../../utils/invoice';
import InvoiceItemDropdown from '../invoiceItemDropdown';
import styles from './styles';

const InvoiceLineItem = ({
  index,
  item,
  itemOptions,
  isItemOptionsLoading,
  onChange,
  onRemove,
}) => {
  const {t} = useTranslation();
  const total = (Number(item.quantity) || 0) * (Number(item.amount) || 0);

  const handleNameChange = useCallback(
    value => onChange(item.id, 'name', value),
    [item.id, onChange],
  );

  const handleQuantityChange = useCallback(
    value => onChange(item.id, 'quantity', value.replace(/[^0-9]/g, '')),
    [item.id, onChange],
  );

  const handleItemSelect = useCallback(
    selectedItem => {
      onChange(item.id, 'name', selectedItem.title);
      onChange(item.id, 'amount', String(selectedItem.amount));
    },
    [item.id, onChange],
  );

  const handleAmountChange = useCallback(
    value => onChange(item.id, 'amount', value.replace(/[^0-9.]/g, '')),
    [item.id, onChange],
  );

  const handleRemove = useCallback(
    () => onRemove(item.id),
    [item.id, onRemove],
  );

  return (
    <View style={styles.container}>
      <StyledText color={COLORS.TEXT_SECONDARY} size={13}>
        {t('CREATE_INVOICE.ITEM_NUMBER', {number: index + 1})}
      </StyledText>
      <InvoiceItemDropdown
        label={t('CREATE_INVOICE.ITEM')}
        placeholder={t('CREATE_INVOICE.ITEM_PLACEHOLDER')}
        items={itemOptions}
        value={item.name}
        isLoading={isItemOptionsLoading}
        onChangeText={handleNameChange}
        onSelectItem={handleItemSelect}
      />
      <View style={styles.valueRow}>
        <Input
          label={t('CREATE_INVOICE.QUANTITY')}
          value={item.quantity}
          onChangeText={handleQuantityChange}
          keyboardType="number-pad"
          containerStyles={styles.quantityField}
          borderColor={COLORS.INVOICE_FORM_FIELD_BORDER}
          focusedBorderColor={COLORS.LOGIN_PRIMARY}
        />
        <Input
          label={t('CREATE_INVOICE.AMOUNT')}
          value={item.amount}
          onChangeText={handleAmountChange}
          keyboardType="decimal-pad"
          leftIcon={
            <StyledText color={COLORS.TEXT_SECONDARY} size={16}>
              ₹
            </StyledText>
          }
          containerStyles={styles.amountField}
          borderColor={COLORS.INVOICE_FORM_FIELD_BORDER}
          focusedBorderColor={COLORS.LOGIN_PRIMARY}
        />
      </View>
      <View style={styles.footer}>
        <StyledText variant="bold" size={16}>
          {t('CREATE_INVOICE.LINE_TOTAL', {
            amount: formatCurrency(total),
          })}
        </StyledText>
        <TouchableOpacity
          accessibilityLabel={t('CREATE_INVOICE.DELETE_ITEM')}
          style={styles.deleteButton}
          onPress={handleRemove}>
          <TrashIcon />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default React.memo(InvoiceLineItem);
