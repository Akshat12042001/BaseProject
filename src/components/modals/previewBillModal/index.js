import React, {useCallback, useMemo} from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {StyledText} from '../../atoms';
import {CloseIcon} from '../../svgs';
import {COLORS} from '../../../constants';
import {formatCurrencyWithDecimals} from '../../../utils/invoice';
import styles from './styles';

const EMPTY_VALUE = '—';

const displayValue = value => {
  if (value === 0) {
    return '0';
  }

  const text = String(value ?? '').trim();
  return text || EMPTY_VALUE;
};

const MetaRow = ({label, value}) => (
  <View style={styles.metaRow}>
    <StyledText
      color={COLORS.TEXT_MUTED}
      size={12}
      containerStyle={styles.metaLabel}>
      {label}
    </StyledText>
    <StyledText
      size={12}
      variant="medium"
      numberOfLines={2}
      containerStyle={styles.metaValue}>
      {displayValue(value)}
    </StyledText>
  </View>
);

const SummaryRow = ({label, value, emphasize = false}) => (
  <View style={styles.summaryRow}>
    <StyledText
      color={emphasize ? COLORS.TEXT : COLORS.TEXT_MUTED}
      size={emphasize ? 14 : 13}
      variant={emphasize ? 'bold' : 'regular'}>
      {label}
    </StyledText>
    <StyledText variant={emphasize ? 'bold' : 'medium'} size={emphasize ? 14 : 13}>
      {value}
    </StyledText>
  </View>
);

const PreviewBillModal = ({
  isVisible = false,
  isLoading = false,
  data = null,
  onClose,
}) => {
  const {t} = useTranslation();
  const insets = useSafeAreaInsets();

  const handleClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  const preview = useMemo(
    () => ({
      title: data?.title || t('INVOICES.PREVIEW_FALLBACK_TITLE'),
      logoUrl: data?.logoUrl || '',
      businessName: data?.businessName || '',
      invoiceNo: data?.invoiceNo || '',
      to: data?.to || '',
      createdAt: data?.createdAt || '',
      paymentTerms: data?.paymentTerms || '',
      dueDate: data?.dueDate || '',
      amountDue: Number(data?.amountDue) || 0,
      items: Array.isArray(data?.items) ? data.items : [],
      subTotal: Number(data?.subTotal) || 0,
      taxRate: Number(data?.taxRate) || 0,
      gst: Number(data?.gst) || 0,
      discount: data?.discount || null,
      total: Number(data?.total) || 0,
      notes: data?.notes || '',
    }),
    [data, t],
  );

  return (
    <Modal
      isVisible={isVisible}
      onBackButtonPress={handleClose}
      onBackdropPress={handleClose}
      style={styles.modal}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropTransitionOutTiming={0}
      hideModalContentWhileAnimating
      coverScreen
      useNativeDriver>
      <View
        style={[
          styles.container,
          {
            paddingTop: insets.top || 12,
            paddingBottom: insets.bottom || 12,
          },
        ]}>
        <View style={styles.header}>
          <StyledText
            variant="bold"
            size={16}
            numberOfLines={1}
            containerStyle={styles.headerTitle}>
            {preview.title}
          </StyledText>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={t('INVOICES.PREVIEW_CLOSE')}
            hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
            onPress={handleClose}
            style={styles.closeButton}>
            <CloseIcon color={COLORS.GREYSCALE_900} size={14} />
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={COLORS.LOGIN_PRIMARY} size="large" />
          </View>
        ) : (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}>
            <View style={styles.brandRow}>
              <View style={styles.brandBlock}>
                {!!preview.logoUrl && (
                  <Image
                    source={{uri: preview.logoUrl}}
                    style={styles.logo}
                    resizeMode="contain"
                  />
                )}
                {!!preview.businessName && (
                  <StyledText
                    size={13}
                    variant="medium"
                    containerStyle={styles.businessName}>
                    {preview.businessName}
                  </StyledText>
                )}
              </View>
              <View style={styles.invoiceHeading}>
                <StyledText
                  variant="bold"
                  size={22}
                  containerStyle={styles.invoiceLabel}>
                  {t('INVOICES.PREVIEW_INVOICE')}
                </StyledText>
                <StyledText
                  color={COLORS.TEXT_SECONDARY}
                  size={13}
                  containerStyle={styles.invoiceNumber}>
                  # {displayValue(preview.invoiceNo)}
                </StyledText>
              </View>
            </View>

            <View style={styles.metaSection}>
              <View style={styles.billToBlock}>
                <StyledText
                  color={COLORS.TEXT_MUTED}
                  size={10}
                  variant="semiBold"
                  containerStyle={styles.sectionLabel}>
                  {t('INVOICES.PREVIEW_BILL_TO')}
                </StyledText>
                <StyledText variant="bold" size={15}>
                  {displayValue(preview.to)}
                </StyledText>
              </View>

              <View style={styles.metaRight}>
                <MetaRow
                  label={t('INVOICES.PREVIEW_DATE')}
                  value={preview.createdAt}
                />
                <MetaRow
                  label={t('INVOICES.PREVIEW_PAYMENT_TERMS')}
                  value={preview.paymentTerms}
                />
                <MetaRow
                  label={t('INVOICES.PREVIEW_DUE_DATE')}
                  value={preview.dueDate}
                />
                <View style={styles.balanceBlock}>
                  <StyledText color={COLORS.TEXT_MUTED} size={12}>
                    {t('INVOICES.PREVIEW_BALANCE_DUE')}
                  </StyledText>
                  <StyledText
                    variant="bold"
                    size={18}
                    containerStyle={styles.balanceAmount}>
                    {formatCurrencyWithDecimals(preview.amountDue)}
                  </StyledText>
                </View>
              </View>
            </View>

            <View style={styles.tableHeader}>
              <View style={styles.colItem}>
                <StyledText
                  color={COLORS.TEXT_MUTED}
                  size={10}
                  variant="semiBold"
                  containerStyle={styles.tableHeaderText}>
                  {t('INVOICES.PREVIEW_ITEM')}
                </StyledText>
              </View>
              <View style={styles.colQty}>
                <StyledText
                  color={COLORS.TEXT_MUTED}
                  size={10}
                  variant="semiBold"
                  containerStyle={styles.tableHeaderText}>
                  {t('INVOICES.PREVIEW_QUANTITY')}
                </StyledText>
              </View>
              <View style={styles.colRate}>
                <StyledText
                  color={COLORS.TEXT_MUTED}
                  size={10}
                  variant="semiBold"
                  containerStyle={styles.tableHeaderText}>
                  {t('INVOICES.PREVIEW_RATE')}
                </StyledText>
              </View>
              <View style={styles.colAmount}>
                <StyledText
                  color={COLORS.TEXT_MUTED}
                  size={10}
                  variant="semiBold"
                  containerStyle={styles.tableHeaderText}>
                  {t('INVOICES.PREVIEW_AMOUNT')}
                </StyledText>
              </View>
            </View>

            {preview.items.map(item => (
              <View key={item.id} style={styles.tableRow}>
                <View style={styles.colItem}>
                  <StyledText size={13} numberOfLines={3}>
                    {displayValue(item.name)}
                  </StyledText>
                </View>
                <View style={styles.colQty}>
                  <StyledText size={13}>{item.quantity}</StyledText>
                </View>
                <View style={styles.colRate}>
                  <StyledText size={13}>
                    {formatCurrencyWithDecimals(item.rate)}
                  </StyledText>
                </View>
                <View style={styles.colAmount}>
                  <StyledText size={13} variant="bold">
                    {formatCurrencyWithDecimals(item.amount)}
                  </StyledText>
                </View>
              </View>
            ))}

            <View style={styles.summary}>
              <SummaryRow
                label={t('INVOICES.PREVIEW_SUBTOTAL')}
                value={formatCurrencyWithDecimals(preview.subTotal)}
              />
              <SummaryRow
                label={t('INVOICES.PREVIEW_TAX', {rate: preview.taxRate})}
                value={formatCurrencyWithDecimals(preview.gst)}
              />
              {!!preview.discount && (
                <SummaryRow
                  label={t('INVOICES.PREVIEW_DISCOUNT', {
                    rate: preview.discount.rate,
                  })}
                  value={formatCurrencyWithDecimals(preview.discount.price)}
                />
              )}
              <View style={styles.summaryDivider} />
              <SummaryRow
                label={t('INVOICES.PREVIEW_TOTAL')}
                value={formatCurrencyWithDecimals(preview.total)}
                emphasize
              />
              <SummaryRow
                label={t('INVOICES.PREVIEW_BALANCE_DUE')}
                value={formatCurrencyWithDecimals(preview.amountDue)}
                emphasize
              />
            </View>

            {!!String(preview.notes || '').trim() && (
              <View style={styles.notes}>
                <StyledText
                  color={COLORS.TEXT_MUTED}
                  size={10}
                  variant="semiBold"
                  containerStyle={styles.notesLabel}>
                  {t('INVOICES.PREVIEW_NOTES')}
                </StyledText>
                <StyledText
                  color={COLORS.TEXT_SECONDARY}
                  size={13}
                  containerStyle={styles.notesBody}>
                  {preview.notes}
                </StyledText>
              </View>
            )}

            <View style={styles.poweredBy}>
              <StyledText color={COLORS.TEXT_MUTED} size={11}>
                {t('INVOICES.PREVIEW_POWERED_BY')}
              </StyledText>
            </View>
          </ScrollView>
        )}
      </View>
    </Modal>
  );
};

export default PreviewBillModal;
