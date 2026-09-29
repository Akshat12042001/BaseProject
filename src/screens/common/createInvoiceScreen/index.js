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
import {Formik} from 'formik';
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
  UserOutlineIcon,
} from '../../../components/svgs';
import {COLORS, FORM_SCHEMA} from '../../../constants';
import {
  makeCreateBillRequest,
  makeGetBillDetailsRequest,
  makeGetBookingPreviewRequest,
  makeGetFoodMenuBillItemsRequest,
  makeUpdateBillRequest,
} from '../../../api/common';
import {
  buildInvoicePayload,
  formatBillDetails,
  formatCurrencyWithDecimals,
  formatActiveProperties,
  formatMenuBillItems,
} from '../../../utils/invoice';
import {formatBookingInvoicePrefill} from '../../../utils/booking';
import {errorToast, successToast} from '../../../utils/alerts';
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
  serverId: null,
  name: '',
  quantity: '',
  amount: '',
});

const EMPTY_VALUES = {
  checkIn: null,
  checkOut: null,
  paymentTerms: '',
  fromAddress: '',
  selectedFromPropertyId: null,
  billTo: '',
  notes: '',
  taxRate: '',
  discountRate: '',
  amountPaid: '',
  lineItems: [createLineItem(1)],
};

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
  const bookingId = route.params?.bookingId;
  const insets = useSafeAreaInsets();
  const invoiceForm = FORM_SCHEMA.CREATE_INVOICE;
  const nextItemId = useRef(2);
  const [activeDateField, setActiveDateField] = useState(null);
  const [initialValues, setInitialValues] = useState(EMPTY_VALUES);
  const [invoiceStatus, setInvoiceStatus] = useState('');
  const [invoiceMetadata, setInvoiceMetadata] = useState({});
  const [deletedLineItems, setDeletedLineItems] = useState([]);
  const [itemOptions, setItemOptions] = useState([]);
  const [isFoodMenuLoading, setIsFoodMenuLoading] = useState(true);
  const [isBillDetailsLoading, setIsBillDetailsLoading] = useState(
    !!billId || !!bookingId,
  );
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);
  const {data: propertiesData, isLoading: isPropertiesLoading} =
    useGetMyPropertiesQuery({page: 1, limit: 100});

  const propertyOptions = useMemo(
    () => formatActiveProperties(propertiesData),
    [propertiesData],
  );

  useEffect(() => {
    let isMounted = true;

    const fetchBillItems = async () => {
      try {
        setIsFoodMenuLoading(true);
        const response = await makeGetFoodMenuBillItemsRequest();
        if (isMounted) {
          setItemOptions(formatMenuBillItems(response));
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

    fetchBillItems();

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
        setInvoiceMetadata(details.metadata || {});
        setInitialValues({
          checkIn: details.checkIn,
          checkOut: details.checkOut,
          paymentTerms: details.paymentTerms,
          fromAddress: details.from,
          selectedFromPropertyId: null,
          billTo: details.to,
          notes: details.notes,
          taxRate: details.taxRate,
          discountRate: details.discountRate,
          amountPaid: details.amountPaid,
          lineItems: details.lineItems.length
            ? details.lineItems
            : [createLineItem(1)],
        });
        setDeletedLineItems([]);
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

  useEffect(() => {
    if (!bookingId || billId || isPropertiesLoading) {
      return undefined;
    }

    let isMounted = true;

    const prefillFromBooking = async () => {
      try {
        setIsBillDetailsLoading(true);
        const response = await makeGetBookingPreviewRequest(bookingId);
        if (!isMounted) {
          return;
        }

        const prefill = formatBookingInvoicePrefill(
          response,
          propertyOptions,
          t('CREATE_INVOICE.ROOM_RENT_PENDING'),
        );

        if (!prefill) {
          errorToast(t('CREATE_INVOICE.BOOKING_LOAD_ERROR'));
          navigation.goBack();
          return;
        }

        setInitialValues({
          ...EMPTY_VALUES,
          checkIn: prefill.checkIn,
          checkOut: prefill.checkOut,
          fromAddress: prefill.fromAddress,
          selectedFromPropertyId: prefill.selectedFromPropertyId,
          billTo: prefill.billTo,
          amountPaid: prefill.amountPaid,
          notes: prefill.notes,
          lineItems: prefill.lineItems,
        });
        nextItemId.current = prefill.nextItemId;
      } catch {
        if (isMounted) {
          navigation.goBack();
        }
      } finally {
        if (isMounted) {
          setIsBillDetailsLoading(false);
        }
      }
    };

    prefillFromBooking();

    return () => {
      isMounted = false;
    };
  }, [
    billId,
    bookingId,
    isPropertiesLoading,
    navigation,
    propertyOptions,
    t,
  ]);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleSubmit = useCallback(
    async values => {
      const fromDisplayValue = values.selectedFromPropertyId
        ? propertyOptions.find(
            property => property.id === values.selectedFromPropertyId,
          )?.title || values.fromAddress
        : values.fromAddress;

      const lineItems = values.lineItems || [];
      const subtotal = lineItems.reduce(
        (sum, item) =>
          sum + (Number(item.quantity) || 0) * (Number(item.amount) || 0),
        0,
      );
      const taxAmount = subtotal * ((Number(values.taxRate) || 0) / 100);
      const discountAmount =
        subtotal * ((Number(values.discountRate) || 0) / 100);
      const total = Math.max(0, subtotal + taxAmount - discountAmount);
      const balanceDue = Math.max(0, total - (Number(values.amountPaid) || 0));

      const invoicePayload = buildInvoicePayload({
        id: billId || '',
        from: fromDisplayValue,
        to: values.billTo,
        paymentTerms: values.paymentTerms,
        lineItems,
        deletedLineItems,
        taxRate: values.taxRate,
        discountRate: values.discountRate,
        discountAmount,
        subtotal,
        taxAmount,
        total,
        amountPaid: values.amountPaid,
        balanceDue,
        notes: values.notes,
        checkIn: values.checkIn,
        checkOut: values.checkOut,
        metadata: invoiceMetadata,
        status: invoiceStatus,
        isUpdate: !!billId,
      });

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
    },
    [
      billId,
      deletedLineItems,
      invoiceMetadata,
      invoiceStatus,
      navigation,
      propertyOptions,
      t,
    ],
  );

  const fieldBorder = COLORS.INVOICE_FORM_FIELD_BORDER;
  const fieldFocus = COLORS.LOGIN_PRIMARY;

  return (
    <ScreenContainer noPaddingTop noPaddingBottom>
      <ScreenHeader
        title={t(
          billId ? 'CREATE_INVOICE.EDIT_TITLE' : 'CREATE_INVOICE.TITLE',
        )}
        badgeText={billId ? invoiceStatus : t('CREATE_INVOICE.DRAFT')}
        backAccessibilityLabel={t('CREATE_INVOICE.BACK')}
        onBack={handleBack}
      />

      <Formik
        validateOnChange
        enableReinitialize
        onSubmit={handleSubmit}
        initialValues={initialValues}
        validationSchema={invoiceForm.schema}>
        {({
          handleBlur,
          handleChange,
          handleSubmit: submitForm,
          setFieldValue,
          setFieldTouched,
          values,
          errors,
          touched,
        }) => {
          const fromDisplayValue = values.selectedFromPropertyId
            ? propertyOptions.find(
                property => property.id === values.selectedFromPropertyId,
              )?.title || values.fromAddress
            : values.fromAddress;

          const lineItems = values.lineItems || [];
          const itemCountText = t(
            lineItems.length === 1
              ? 'CREATE_INVOICE.ITEMS_COUNT_ONE'
              : 'CREATE_INVOICE.ITEMS_COUNT_OTHER',
            {count: lineItems.length},
          );

          const subtotal = lineItems.reduce(
            (sum, item) =>
              sum + (Number(item.quantity) || 0) * (Number(item.amount) || 0),
            0,
          );
          const taxAmount = subtotal * ((Number(values.taxRate) || 0) / 100);
          const discountAmount =
            subtotal * ((Number(values.discountRate) || 0) / 100);
          const total = Math.max(0, subtotal + taxAmount - discountAmount);
          const balanceDue = Math.max(
            0,
            total - (Number(values.amountPaid) || 0),
          );

          const handleOpenCheckInPicker = () => {
            setActiveDateField(DATE_FIELD.CHECK_IN);
            setFieldTouched('checkIn', true);
          };

          const handleOpenCheckOutPicker = () => {
            setActiveDateField(DATE_FIELD.CHECK_OUT);
            setFieldTouched('checkOut', true);
          };

          const handleDateConfirm = date => {
            if (activeDateField === DATE_FIELD.CHECK_IN) {
              setFieldValue('checkIn', date, true);
              if (values.checkOut && values.checkOut < date) {
                setFieldValue('checkOut', null, true);
              }
              setFieldTouched('checkIn', true, false);
            } else if (activeDateField === DATE_FIELD.CHECK_OUT) {
              setFieldValue('checkOut', date, true);
              setFieldTouched('checkOut', true, false);
            }
            setActiveDateField(null);
          };

          const handleDateCancel = () => {
            setActiveDateField(null);
          };

          const handleFromChange = value => {
            setFieldValue('selectedFromPropertyId', null, false);
            setFieldValue('fromAddress', value, true);
          };

          const handleFromSelect = item => {
            setFieldValue('selectedFromPropertyId', item?.id || null, false);
            setFieldValue('fromAddress', item?.title || '', true);
            setFieldTouched('fromAddress', true, false);
          };

          const handleDecimalChange = (fieldKey, value) => {
            setFieldValue(fieldKey, sanitizeDecimal(value), true);
          };

          const handleItemChange = (id, patch) => {
            const nextItems = lineItems.map(item =>
              item.id === id ? {...item, ...patch} : item,
            );
            setFieldValue('lineItems', nextItems, true);
            setFieldTouched('lineItems', true, false);
          };

          const handleRemoveItem = id => {
            const removedItem = lineItems.find(item => item.id === id);

            if (removedItem?.serverId) {
              setDeletedLineItems(currentDeleted => {
                if (
                  currentDeleted.some(
                    item => item.serverId === removedItem.serverId,
                  )
                ) {
                  return currentDeleted;
                }

                return [...currentDeleted, removedItem];
              });
            }

            const nextItems = lineItems.filter(item => item.id !== id);
            setFieldValue(
              'lineItems',
              nextItems.length ? nextItems : [createLineItem(1)],
              true,
            );
            setFieldTouched('lineItems', true, false);
          };

          const handleAddItem = () => {
            const itemId = nextItemId.current;
            nextItemId.current += 1;
            setFieldValue(
              'lineItems',
              [...lineItems, createLineItem(itemId)],
              true,
            );
            setFieldTouched('lineItems', true, false);
          };

          return (
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
                      label={`${t('CREATE_INVOICE.CHECK_IN')} *`}
                      value={formatDate(values.checkIn)}
                      placeholder={t('CREATE_INVOICE.DATE_PLACEHOLDER')}
                      rightIcon={<CalendarIcon />}
                      editable={false}
                      onPress={handleOpenCheckInPicker}
                      onRightIconPress={handleOpenCheckInPicker}
                      error={
                        touched.checkIn && errors.checkIn && !values.checkIn
                          ? errors.checkIn
                          : undefined
                      }
                      containerStyles={styles.dateField}
                      borderColor={fieldBorder}
                      focusedBorderColor={fieldFocus}
                    />
                    <Input
                      label={`${t('CREATE_INVOICE.CHECK_OUT')} *`}
                      value={formatDate(values.checkOut)}
                      placeholder={t('CREATE_INVOICE.DATE_PLACEHOLDER')}
                      rightIcon={<CalendarIcon />}
                      editable={false}
                      onPress={handleOpenCheckOutPicker}
                      onRightIconPress={handleOpenCheckOutPicker}
                      error={
                        touched.checkOut && errors.checkOut && !values.checkOut
                          ? errors.checkOut
                          : undefined
                      }
                      containerStyles={styles.dateField}
                      borderColor={fieldBorder}
                      focusedBorderColor={fieldFocus}
                    />
                  </View>
                  <Input
                    label={`${t('CREATE_INVOICE.PAYMENT_TERMS')} *`}
                    value={values.paymentTerms}
                    onBlur={handleBlur('paymentTerms')}
                    onChangeText={handleChange('paymentTerms')}
                    placeholder={t('CREATE_INVOICE.PAYMENT_TERMS_PLACEHOLDER')}
                    error={touched.paymentTerms && errors.paymentTerms}
                    containerStyles={styles.lastField}
                    borderColor={fieldBorder}
                    focusedBorderColor={fieldFocus}
                  />
                </View>

                <View style={styles.section}>
                  <SectionHeader
                    icon={<BuildingIcon />}
                    title={t('CREATE_INVOICE.FROM')}
                  />
                  <InvoiceItemDropdown
                    label={`${t('CREATE_INVOICE.FROM')} *`}
                    placeholder={t('CREATE_INVOICE.FROM_PLACEHOLDER')}
                    items={propertyOptions}
                    value={fromDisplayValue}
                    isLoading={isPropertiesLoading}
                    showAmount={false}
                    onChangeText={handleFromChange}
                    onSelectItem={handleFromSelect}
                  />
                  {!!touched.fromAddress && !!errors.fromAddress && (
                    <StyledText size={12} color={COLORS.RED_ERROR}>
                      *{t(errors.fromAddress)}
                    </StyledText>
                  )}
                </View>

                <View style={styles.section}>
                  <SectionHeader
                    icon={<UserOutlineIcon />}
                    title={t('CREATE_INVOICE.BILL_TO')}
                  />
                  <Input
                    label={`${t('CREATE_INVOICE.BILL_TO')} *`}
                    value={values.billTo}
                    onBlur={handleBlur('billTo')}
                    onChangeText={handleChange('billTo')}
                    placeholder={t('CREATE_INVOICE.BILL_TO_PLACEHOLDER')}
                    error={touched.billTo && errors.billTo}
                    containerStyles={styles.lastField}
                    borderColor={fieldBorder}
                    focusedBorderColor={fieldFocus}
                  />
                </View>

                <View style={styles.section}>
                  <SectionHeader
                    icon={<ListIcon />}
                    title={`${t('CREATE_INVOICE.ITEMS')} *`}
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
                  {!!touched.lineItems && !!errors.lineItems && (
                    <StyledText size={12} color={COLORS.RED_ERROR}>
                      *{t(errors.lineItems)}
                    </StyledText>
                  )}
                </View>

                <View style={styles.section}>
                  <Input
                    label={t('CREATE_INVOICE.NOTES')}
                    value={values.notes}
                    onBlur={handleBlur('notes')}
                    onChangeText={handleChange('notes')}
                    placeholder={t('CREATE_INVOICE.NOTES_PLACEHOLDER')}
                    multiline
                    numberOfLines={4}
                    inputStyle={styles.notesInput}
                    containerStyles={styles.lastField}
                    borderColor={fieldBorder}
                    focusedBorderColor={fieldFocus}
                  />
                </View>

                <InvoiceCalculation
                  subtotal={subtotal}
                  taxRate={values.taxRate}
                  taxAmount={taxAmount}
                  discountRate={values.discountRate}
                  discountAmount={discountAmount}
                  amountPaid={values.amountPaid}
                  balanceDue={balanceDue}
                  onTaxRateChange={value =>
                    handleDecimalChange('taxRate', value)
                  }
                  onDiscountRateChange={value =>
                    handleDecimalChange('discountRate', value)
                  }
                  onAmountPaidChange={value =>
                    handleDecimalChange('amountPaid', value)
                  }
                />
              </KeyboardAwareScrollView>

              <View
                style={[
                  styles.footer,
                  {paddingBottom: Math.max(insets.bottom, 10)},
                ]}>
                <View style={styles.totalRow}>
                  <StyledText color={COLORS.TEXT_SECONDARY} size={12}>
                    {t('CREATE_INVOICE.TOTAL')}
                  </StyledText>
                  <StyledText variant="bold" size={18}>
                    {formatCurrencyWithDecimals(total)}
                  </StyledText>
                </View>
                <View style={styles.actionsRow}>
                  <TouchableOpacity
                    disabled={isCreatingInvoice}
                    onPress={submitForm}
                    style={[
                      styles.saveButton,
                      isCreatingInvoice && styles.disabledButton,
                    ]}>
                    {isCreatingInvoice ? (
                      <ActivityIndicator color={COLORS.SURFACE} />
                    ) : (
                      <StyledText
                        color={COLORS.SURFACE}
                        variant="semiBold"
                        size={13}>
                        {t('CREATE_INVOICE.SAVE')}
                      </StyledText>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
              {isBillDetailsLoading && (
                <View style={styles.detailsLoader}>
                  <ActivityIndicator
                    color={COLORS.LOGIN_PRIMARY}
                    size="large"
                  />
                </View>
              )}
              <DatePicker
                modal
                mode="date"
                open={!!activeDateField}
                date={
                  activeDateField === DATE_FIELD.CHECK_OUT
                    ? values.checkOut || values.checkIn || new Date()
                    : values.checkIn || new Date()
                }
                minimumDate={
                  activeDateField === DATE_FIELD.CHECK_OUT && values.checkIn
                    ? values.checkIn
                    : undefined
                }
                title={t('CREATE_INVOICE.SELECT_DATE')}
                confirmText={t('CREATE_INVOICE.CONFIRM')}
                cancelText={t('CREATE_INVOICE.CANCEL')}
                onConfirm={handleDateConfirm}
                onCancel={handleDateCancel}
              />
            </View>
          );
        }}
      </Formik>
    </ScreenContainer>
  );
};

export default CreateInvoiceScreen;
