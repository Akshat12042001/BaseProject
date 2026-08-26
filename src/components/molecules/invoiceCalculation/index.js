import React from 'react';
import {View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Input, StyledText} from '../../atoms';
import {COLORS} from '../../../constants';
import {formatCurrencyWithDecimals} from '../../../utils/invoice';
import styles from './styles';

const CurrencyIcon = () => (
  <StyledText color={COLORS.TEXT_SECONDARY} size={16}>
    ₹
  </StyledText>
);

const InvoiceCalculation = ({
  subtotal,
  taxRate,
  taxAmount,
  discountRate,
  discountAmount,
  amountPaid,
  balanceDue,
  onTaxRateChange,
  onDiscountRateChange,
  onAmountPaidChange,
}) => {
  const {t} = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.summaryRow}>
        <StyledText size={14}>{t('CREATE_INVOICE.SUBTOTAL')}</StyledText>
        <StyledText variant="semiBold" size={15}>
          {formatCurrencyWithDecimals(subtotal)}
        </StyledText>
      </View>

      <View style={styles.taxRow}>
        <StyledText size={14} containerStyle={styles.taxLabel}>
          {t('CREATE_INVOICE.TAX')}
        </StyledText>
        <Input
          value={taxRate}
          onChangeText={onTaxRateChange}
          keyboardType="decimal-pad"
          rightIcon={
            <StyledText color={COLORS.TEXT_SECONDARY} size={16}>
              %
            </StyledText>
          }
          containerStyles={styles.taxInput}
          borderColor={COLORS.INVOICE_FORM_FIELD_BORDER}
          focusedBorderColor={COLORS.LOGIN_PRIMARY}
        />
        <StyledText
          variant="semiBold"
          size={15}
          containerStyle={styles.taxAmount}>
          {formatCurrencyWithDecimals(taxAmount)}
        </StyledText>
      </View>

      <View style={styles.taxRow}>
        <StyledText size={14} containerStyle={styles.taxLabel}>
          {t('CREATE_INVOICE.DISCOUNT')}
        </StyledText>
        <Input
          value={discountRate}
          onChangeText={onDiscountRateChange}
          keyboardType="decimal-pad"
          rightIcon={
            <StyledText color={COLORS.TEXT_SECONDARY} size={16}>
              %
            </StyledText>
          }
          containerStyles={styles.taxInput}
          borderColor={COLORS.INVOICE_FORM_FIELD_BORDER}
          focusedBorderColor={COLORS.LOGIN_PRIMARY}
        />
        <StyledText
          variant="semiBold"
          size={15}
          containerStyle={styles.taxAmount}>
          {formatCurrencyWithDecimals(discountAmount)}
        </StyledText>
      </View>

      <View style={styles.divider} />
      <View style={styles.paidRow}>
        <StyledText size={14}>{t('CREATE_INVOICE.AMOUNT_PAID')}</StyledText>
        <Input
          value={amountPaid}
          onChangeText={onAmountPaidChange}
          keyboardType="decimal-pad"
          leftIcon={<CurrencyIcon />}
          containerStyles={styles.paidInput}
          borderColor={COLORS.INVOICE_FORM_FIELD_BORDER}
          focusedBorderColor={COLORS.LOGIN_PRIMARY}
        />
      </View>
      <View style={styles.divider} />
      <View style={styles.balanceRow}>
        <StyledText variant="bold" size={20}>
          {t('CREATE_INVOICE.BALANCE_DUE')}
        </StyledText>
        <StyledText variant="bold" size={20}>
          {formatCurrencyWithDecimals(balanceDue)}
        </StyledText>
      </View>
    </View>
  );
};

export default React.memo(InvoiceCalculation);
