import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {ActivityIndicator, TouchableOpacity, View} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import {Input, ScreenContainer, StyledText} from '../../../components/atoms';
import {
  InvoiceCalculation,
  InvoiceItemDropdown,
  InvoiceLineItem,
  ScreenHeader,
} from '../../../components/molecules';
import {
  BuildingIcon,
  CalendarIcon,
  ListIcon,
  PlusIcon,
  UploadIcon,
  UserOutlineIcon,
} from '../../../components/svgs';
import {COLORS} from '../../../constants';
import {
  makeCreateBillRequest,
  makeGetBillDetailsRequest,
  makeGetFoodMenuRequest,
  makeUpdateBillRequest,
} from '../../../api/common';
import {
  buildInvoicePayload,
  formatBillDetails,
  formatCurrencyWithDecimals,
  formatActiveProperties,
  formatFoodMenuItems,
} from '../../../utils/invoice';
import {errorToast, successToast} from '../../../utils/alerts';
import {shareInvoice} from '../../../utils/shareInvoice';
import styles from './styles';
import {useGetMyPropertiesQuery} from '../../../redux/tabs/api';

const sanitizeDecimal = value => {
  const sanitizedValue = value.replace(/[^0-9.]/g, '');
  const [wholeNumber, ...decimalParts] = sanitizedValue.split('.');
  return decimalParts.length
    ? `${wholeNumber}.${decimalParts.join('')}`
    : wholeNumber;
};

const DATE_FIELD = {
  CHECK_IN: 'checkIn',
  CHECK_OUT: 'checkOut',
};

const formatDate = date => (date ? moment(date).format('DD/MM/YYYY') : '');

const createLineItem = id => ({
  id: String(id),
  name: '',
  quantity: '',
  amount: '',
});

const SectionHeader = ({icon, title, trailing}) => (
  <View style={styles.sectionHeader}>
    <View style={styles.sectionTitleRow}>
      {icon}
      <StyledText variant="semiBold" size={13} containerStyle={styles.sectionTitle}>
        {title}
      </StyledText>
    </View>
    {trailing}
  </View>
);

const CreateInvoiceScreen = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();
  const billId = route.params?.billId;
  const insets = useSafeAreaInsets();
  const user = useSelector(state => state.auth.user);
  const nextItemId = useRef(2);
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [activeDateField, setActiveDateField] = useState(null);
  const [invoiceStatus, setInvoiceStatus] = useState('');
  const [invoiceMetadata, setInvoiceMetadata] = useState({});
  const [paymentTerms, setPaymentTerms] = useState('');
  const [fromAddress, setFromAddress] = useState('');
  const [selectedFromPropertyId, setSelectedFromPropertyId] = useState(null);
  const [billTo, setBillTo] = useState('');
  const [taxRate, setTaxRate] = useState('');
  const [discountRate, setDiscountRate] = useState('');
  const [amountPaid, setAmountPaid] = useState('');
  const [notes, setNotes] = useState('');
  const [lineItems, setLineItems] = useState([createLineItem(1)]);
  const [itemOptions, setItemOptions] = useState([]);
  const [isFoodMenuLoading, setIsFoodMenuLoading] = useState(true);
  const [isBillDetailsLoading, setIsBillDetailsLoading] = useState(!!billId);
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);
  const [isSharingInvoice, setIsSharingInvoice] = useState(false);
  const {data: propertiesData, isLoading: isPropertiesLoading} =
    useGetMyPropertiesQuery({page: 1, limit: 100});

  const propertyOptions = useMemo(
    () => formatActiveProperties(propertiesData),
    [propertiesData],
  );

  const fromDisplayValue = useMemo(() => {
    if (selectedFromPropertyId) {
      return (
        propertyOptions.find(property => property.id === selectedFromPropertyId)
          ?.title || fromAddress
      );
    }

    return fromAddress;
  }, [fromAddress, propertyOptions, selectedFromPropertyId]);

  useEffect(() => {
    let isMounted = true;

    const fetchFoodMenu = async () => {
      try {
        const response = await makeGetFoodMenuRequest();
        if (isMounted) {
          setItemOptions(formatFoodMenuItems(response));
        }
      } catch {
        if (isMounted) {
          setItemOptions([]);
        }
      } finally {
        if (isMounted) {
          setIsFoodMenuLoading(false);
        }
      }
    };

    fetchFoodMenu();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!billId) {
      return undefined;
    }

    let isMounted = true;

    const fetchBillDetails = async () => {
      try {
        setIsBillDetailsLoading(true);
        const response = await makeGetBillDetailsRequest(billId);
        if (!isMounted) {
          return;
        }

        const details = formatBillDetails(response);
        setInvoiceStatus(details.status);
        setInvoiceMetadata(details.metadata);
        setCheckIn(details.checkIn);
        setCheckOut(details.checkOut);
        setPaymentTerms(details.paymentTerms);
        setFromAddress(details.from);
        setSelectedFromPropertyId(null);
        setBillTo(details.to);
        setTaxRate(details.taxRate);
        setDiscountRate(details.discountRate);
        setAmountPaid(details.amountPaid);
        setNotes(details.notes);
        setLineItems(
          details.lineItems.length ? details.lineItems : [createLineItem(1)],
        );
        nextItemId.current = details.lineItems.length + 1;
      } catch {
        // APIClient displays the server error toast.
      } finally {
        if (isMounted) {
          setIsBillDetailsLoading(false);
        }
      }
    };

    fetchBillDetails();

    return () => {
      isMounted = false;
    };
  }, [billId]);

  const subtotal = useMemo(
    () =>
      lineItems.reduce(
        (sum, item) =>
          sum + (Number(item.quantity) || 0) * (Number(item.amount) || 0),
        0,
      ),
    [lineItems],
  );

  const taxAmount = useMemo(
    () => subtotal * ((Number(taxRate) || 0) / 100),
    [subtotal, taxRate],
  );

  const discountAmount = useMemo(
    () => subtotal * ((Number(discountRate) || 0) / 100),
    [discountRate, subtotal],
  );

  const total = useMemo(
    () => Math.max(0, subtotal + taxAmount - discountAmount),
    [discountAmount, subtotal, taxAmount],
  );

  const balanceDue = useMemo(
    () => Math.max(0, total - (Number(amountPaid) || 0)),
    [amountPaid, total],
  );

  const invoicePayload = useMemo(
    () =>
      buildInvoicePayload({
        id: billId || '',
        metadata: invoiceMetadata,
        from: fromAddress,
        to: billTo,
        paymentTerms,
        lineItems,
        taxRate,
        discountRate,
        discountAmount,
        subtotal,
        taxAmount,
        total,
        amountPaid,
        balanceDue,
        notes,
        checkIn,
        checkOut,
      }),
    [
      amountPaid,
      balanceDue,
      billId,
      billTo,
      checkIn,
      checkOut,
      discountAmount,
      discountRate,
      fromAddress,
      invoiceMetadata,
      lineItems,
      notes,
      paymentTerms,
      subtotal,
      taxAmount,
      taxRate,
      total,
    ],
  );

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleOpenCheckInPicker = useCallback(() => {
    setActiveDateField(DATE_FIELD.CHECK_IN);
  }, []);

  const handleOpenCheckOutPicker = useCallback(() => {
    setActiveDateField(DATE_FIELD.CHECK_OUT);
  }, []);

  const handleDateConfirm = useCallback(
    date => {
      if (activeDateField === DATE_FIELD.CHECK_IN) {
        setCheckIn(date);
        if (checkOut && checkOut < date) {
          setCheckOut(null);
        }
      } else if (activeDateField === DATE_FIELD.CHECK_OUT) {
        setCheckOut(date);
      }
      setActiveDateField(null);
    },
    [activeDateField, checkOut],
  );

  const handleDateCancel = useCallback(() => {
    setActiveDateField(null);
  }, []);

  const handleItemChange = useCallback((id, field, value) => {
    setLineItems(currentItems =>
      currentItems.map(item =>
        item.id === id ? {...item, [field]: value} : item,
      ),
    );
  }, []);

  const handleRemoveItem = useCallback(id => {
    setLineItems(currentItems => currentItems.filter(item => item.id !== id));
  }, []);

  const handleAddItem = useCallback(() => {
    const itemId = nextItemId.current;
    nextItemId.current += 1;
    setLineItems(currentItems => [...currentItems, createLineItem(itemId)]);
  }, []);

  const handleTaxRateChange = useCallback(value => {
    setTaxRate(sanitizeDecimal(value));
  }, []);

  const handleDiscountRateChange = useCallback(value => {
    setDiscountRate(sanitizeDecimal(value));
  }, []);

  const handleAmountPaidChange = useCallback(value => {
    setAmountPaid(sanitizeDecimal(value));
  }, []);

  const handleFromChange = useCallback(value => {
    setSelectedFromPropertyId(null);
    setFromAddress(value);
  }, []);

  const handleFromSelect = useCallback(item => {
    setSelectedFromPropertyId(item?.id || null);
    setFromAddress(item?.from || item?.title || '');
  }, []);

  const getShareableInvoice = useCallback(
    () => ({
      ...invoiceMetadata,
      ...invoicePayload,
      status: invoiceStatus,
      homestayLogo: user?.homestayLogo || '',
    }),
    [invoiceMetadata, invoicePayload, invoiceStatus, user?.homestayLogo],
  );

  const handleSaveInvoice = useCallback(async () => {
    try {
      setIsCreatingInvoice(true);
      const response = billId
        ? await makeUpdateBillRequest(billId, invoicePayload)
        : await makeCreateBillRequest(invoicePayload);
      successToast(
        response?.message ||
          t(
            billId
              ? 'CREATE_INVOICE.UPDATED_SUCCESSFULLY'
              : 'CREATE_INVOICE.CREATED_SUCCESSFULLY',
          ),
      );
      navigation.goBack();
    } catch {
      // APIClient displays the server error toast.
    } finally {
      setIsCreatingInvoice(false);
    }
  }, [billId, invoicePayload, navigation, t]);

  const handleShareInvoice = useCallback(async () => {
    try {
      setIsSharingInvoice(true);
      await shareInvoice(getShareableInvoice(), t('CREATE_INVOICE.SHARE_TITLE'));
    } catch {
      errorToast(t('CREATE_INVOICE.SHARE_FAILED'));
    } finally {
      setIsSharingInvoice(false);
    }
  }, [getShareableInvoice, t]);

  const itemCountText = t(
    lineItems.length === 1
      ? 'CREATE_INVOICE.ITEMS_COUNT_ONE'
      : 'CREATE_INVOICE.ITEMS_COUNT_OTHER',
    {count: lineItems.length},
  );

  return (
    <ScreenContainer noPaddingTop noPaddingBottom>
      <ScreenHeader
        title={t(
          billId ? 'CREATE_INVOICE.EDIT_TITLE' : 'CREATE_INVOICE.TITLE',
        )}
        // subtitle={t('CREATE_INVOICE.SUBTITLE')}
        badgeText={billId ? invoiceStatus : t('CREATE_INVOICE.DRAFT')}
        backAccessibilityLabel={t('CREATE_INVOICE.BACK')}
        onBack={handleBack}
      />

      <View style={styles.flex}>
        <KeyboardAwareScrollView
          enableOnAndroid
          enableAutomaticScroll
          enableResetScrollToCoords={false}
          extraScrollHeight={20}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <SectionHeader
              icon={<CalendarIcon color={COLORS.LOGIN_PRIMARY} />}
              title={t('CREATE_INVOICE.STAY_DETAILS')}
            />
            <View style={styles.fieldsRow}>
              <Input
                label={t('CREATE_INVOICE.CHECK_IN')}
                value={formatDate(checkIn)}
                placeholder={t('CREATE_INVOICE.DATE_PLACEHOLDER')}
                rightIcon={<CalendarIcon />}
                editable={false}
                onPress={handleOpenCheckInPicker}
                onRightIconPress={handleOpenCheckInPicker}
                containerStyles={styles.dateField}
                borderColor={COLORS.INVOICE_FORM_FIELD_BORDER}
                focusedBorderColor={COLORS.LOGIN_PRIMARY}
              />
              <Input
                label={t('CREATE_INVOICE.CHECK_OUT')}
                value={formatDate(checkOut)}
                placeholder={t('CREATE_INVOICE.DATE_PLACEHOLDER')}
                rightIcon={<CalendarIcon />}
                editable={false}
                onPress={handleOpenCheckOutPicker}
                onRightIconPress={handleOpenCheckOutPicker}
                containerStyles={styles.dateField}
                borderColor={COLORS.INVOICE_FORM_FIELD_BORDER}
                focusedBorderColor={COLORS.LOGIN_PRIMARY}
              />
            </View>
            <Input
              label={t('CREATE_INVOICE.PAYMENT_TERMS')}
              value={paymentTerms}
              onChangeText={setPaymentTerms}
              placeholder={t('CREATE_INVOICE.PAYMENT_TERMS_PLACEHOLDER')}
              containerStyles={styles.lastField}
              borderColor={COLORS.INVOICE_FORM_FIELD_BORDER}
              focusedBorderColor={COLORS.LOGIN_PRIMARY}
            />
          </View>

          <View style={styles.section}>
            <SectionHeader
              icon={<BuildingIcon />}
              title={t('CREATE_INVOICE.FROM')}
            />
            <InvoiceItemDropdown
              label={t('CREATE_INVOICE.FROM')}
              placeholder={t('CREATE_INVOICE.FROM_PLACEHOLDER')}
              items={propertyOptions}
              value={fromDisplayValue}
              isLoading={isPropertiesLoading}
              showAmount={false}
              onChangeText={handleFromChange}
              onSelectItem={handleFromSelect}
            />
          </View>

          <View style={styles.section}>
            <SectionHeader
              icon={<UserOutlineIcon />}
              title={t('CREATE_INVOICE.BILL_TO')}
            />
            <Input
              value={billTo}
              onChangeText={setBillTo}
              placeholder={t('CREATE_INVOICE.BILL_TO_PLACEHOLDER')}
              multiline
              numberOfLines={3}
              inputStyle={styles.addressInput}
              containerStyles={styles.lastField}
              borderColor={COLORS.INVOICE_FORM_FIELD_BORDER}
              focusedBorderColor={COLORS.LOGIN_PRIMARY}
            />
          </View>

          <View style={styles.section}>
            <SectionHeader
              icon={<ListIcon />}
              title={t('CREATE_INVOICE.ITEMS')}
              trailing={
                <StyledText color={COLORS.TEXT_SECONDARY} size={10}>
                  {itemCountText}
                </StyledText>
              }
            />
            {lineItems.map((item, index) => (
              <InvoiceLineItem
                key={item.id}
                index={index}
                item={item}
                itemOptions={itemOptions}
                isItemOptionsLoading={isFoodMenuLoading}
                onChange={handleItemChange}
                onRemove={handleRemoveItem}
              />
            ))}
            <TouchableOpacity
              accessibilityRole="button"
              onPress={handleAddItem}
              style={styles.addItemButton}>
              <PlusIcon color={COLORS.TEXT} size={18} />
              <StyledText size={14} containerStyle={styles.addItemText}>
                {t('CREATE_INVOICE.ADD_LINE_ITEM')}
              </StyledText>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Input
              label={t('CREATE_INVOICE.NOTES')}
              value={notes}
              onChangeText={setNotes}
              placeholder={t('CREATE_INVOICE.NOTES_PLACEHOLDER')}
              multiline
              numberOfLines={4}
              inputStyle={styles.notesInput}
              containerStyles={styles.lastField}
              borderColor={COLORS.INVOICE_FORM_FIELD_BORDER}
              focusedBorderColor={COLORS.LOGIN_PRIMARY}
            />
          </View>

          <InvoiceCalculation
            subtotal={subtotal}
            taxRate={taxRate}
            taxAmount={taxAmount}
            discountRate={discountRate}
            discountAmount={discountAmount}
            amountPaid={amountPaid}
            balanceDue={balanceDue}
            onTaxRateChange={handleTaxRateChange}
            onDiscountRateChange={handleDiscountRateChange}
            onAmountPaidChange={handleAmountPaidChange}
          />
        </KeyboardAwareScrollView>

        <View style={[styles.footer, {paddingBottom: Math.max(insets.bottom, 10)}]}>
          <View style={styles.totalRow}>
            <StyledText color={COLORS.TEXT_SECONDARY} size={12}>
              {t('CREATE_INVOICE.TOTAL')}
            </StyledText>
            <StyledText variant="bold" size={18}>
              {formatCurrencyWithDecimals(total)}
            </StyledText>
          </View>
          <View style={styles.actionsRow}>
            {!!billId && (
              <TouchableOpacity
                disabled={isSharingInvoice || isCreatingInvoice}
                onPress={handleShareInvoice}
                style={[
                  styles.shareButton,
                  (isSharingInvoice || isCreatingInvoice) && styles.disabledButton,
                ]}>
                {isSharingInvoice ? (
                  <ActivityIndicator color={COLORS.LOGIN_PRIMARY} />
                ) : (
                  <>
                    <UploadIcon color={COLORS.LOGIN_PRIMARY} />
                    <StyledText
                      color={COLORS.LOGIN_PRIMARY}
                      variant="semiBold"
                      size={13}
                      containerStyle={styles.actionButtonText}>
                      {t('CREATE_INVOICE.SHARE')}
                    </StyledText>
                  </>
                )}
              </TouchableOpacity>
            )}
            <TouchableOpacity
              disabled={isCreatingInvoice || isSharingInvoice}
              onPress={handleSaveInvoice}
              style={[
                styles.saveButton,
                (isCreatingInvoice || isSharingInvoice) && styles.disabledButton,
              ]}>
              {isCreatingInvoice ? (
                <ActivityIndicator color={COLORS.SURFACE} />
              ) : (
                <StyledText color={COLORS.SURFACE} variant="semiBold" size={13}>
                  {t('CREATE_INVOICE.SAVE')}
                </StyledText>
              )}
            </TouchableOpacity>
          </View>
        </View>
        {isBillDetailsLoading && (
          <View style={styles.detailsLoader}>
            <ActivityIndicator color={COLORS.LOGIN_PRIMARY} size="large" />
          </View>
        )}
      </View>
      <DatePicker
        modal
        mode="date"
        open={!!activeDateField}
        date={
          activeDateField === DATE_FIELD.CHECK_OUT
            ? checkOut || checkIn || new Date()
            : checkIn || new Date()
        }
        minimumDate={
          activeDateField === DATE_FIELD.CHECK_OUT && checkIn
            ? checkIn
            : undefined
        }
        title={t('CREATE_INVOICE.SELECT_DATE')}
        confirmText={t('CREATE_INVOICE.CONFIRM')}
        cancelText={t('CREATE_INVOICE.CANCEL')}
        onConfirm={handleDateConfirm}
        onCancel={handleDateCancel}
      />
    </ScreenContainer>
  );
};

export default CreateInvoiceScreen;
