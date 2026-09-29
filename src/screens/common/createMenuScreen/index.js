import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {Formik} from 'formik';
import {Input, ScreenContainer, StyledText} from '../../../components/atoms';
import {
  MenuCategoriesSection,
  ScreenHeader,
} from '../../../components/molecules';
import {ChevronRightIcon, LoginEyeIcon} from '../../../components/svgs';
import {MenuPdfPreviewModal} from '../../../components/modals';
import {
  makeCreateFoodMenuRequest,
  makeGetSingleFoodMenuRequest,
  makeUpdateFoodMenuRequest,
} from '../../../api/common';
import {ASSETS, COLORS, FORM_SCHEMA, NAVIGATION} from '../../../constants';
import {buildMenuPayload, formatMenuDetails} from '../../../utils/menu';
import {createMenuPdfFile} from '../../../utils/menuPdf';
import {errorToast, successToast} from '../../../utils/alerts';
import styles from './styles';

const TEMPLATES = [
  {id: 'classic', translationKey: 'CLASSIC', image: ASSETS.IMAGES.CLASSIC},
  {id: 'himalayan', translationKey: 'HIMALAYAN', image: ASSETS.IMAGES.HIMALAYAN},
  {id: 'heritage', translationKey: 'HERITAGE', image: ASSETS.IMAGES.HERITAGE},
  {id: 'minimal', translationKey: 'MINIMAL', image: ASSETS.IMAGES.MINIMAL},
  {id: 'essential', translationKey: 'ESSENTIAL', image: ASSETS.IMAGES.ESSENTIAL},
];

const EMPTY_VALUES = {
  selectedTemplate: '',
  menuName: '',
  tagline: '',
  ordersPhone: '',
  kitchenHours: '',
  logoUrl: '',
  categories: [],
};

const CreateMenuScreen = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();
  const routeMenuId = route.params?.menuId;
  const insets = useSafeAreaInsets();
  const menuForm = FORM_SCHEMA.CREATE_MENU;
  const [editingMenuId, setEditingMenuId] = useState(routeMenuId || '');
  const [initialValues, setInitialValues] = useState(EMPTY_VALUES);
  const [isMenuDetailsLoading, setIsMenuDetailsLoading] = useState(!!routeMenuId);
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [previewPdfPath, setPreviewPdfPath] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  useEffect(() => {
    if (routeMenuId) {
      setEditingMenuId(routeMenuId);
    }
  }, [routeMenuId]);

  useEffect(() => {
    if (!routeMenuId) {
      setInitialValues(EMPTY_VALUES);
      return undefined;
    }

    let isMounted = true;

    const fetchMenuDetails = async () => {
      try {
        setIsMenuDetailsLoading(true);
        const response = await makeGetSingleFoodMenuRequest(routeMenuId);

        if (!isMounted) {
          return;
        }

        const details = formatMenuDetails(response);
        setEditingMenuId(details.id || routeMenuId);
        setInitialValues({
          selectedTemplate: details.templateId || '',
          menuName: details.title || '',
          tagline: details.tagline || '',
          ordersPhone: details.phoneNumber || '',
          kitchenHours: details.kitchenTiming || '',
          logoUrl: details.logoUrl || '',
          categories: details.categories || [],
        });
      } catch {
        // APIClient displays the server error toast.
      } finally {
        if (isMounted) {
          setIsMenuDetailsLoading(false);
        }
      }
    };

    fetchMenuDetails();

    return () => {
      isMounted = false;
    };
  }, [routeMenuId]);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleClosePreview = useCallback(() => {
    setIsPreviewVisible(false);
    setPreviewPdfPath('');
    setPreviewTitle('');
  }, []);

  const handleSelectLogo = useCallback(() => {
    navigation.navigate(NAVIGATION.COMMON.CREATE_LOGO_SCREEN);
  }, [navigation]);

  const buildPayloadFromValues = useCallback(
    values =>
      buildMenuPayload({
        title: values.menuName,
        tagline: values.tagline,
        phoneNumber: values.ordersPhone,
        kitchenTiming: values.kitchenHours,
        templateId: values.selectedTemplate,
        categories: values.categories,
      }),
    [],
  );

  const handleSubmit = useCallback(
    async values => {
      try {
        setIsSaving(true);
        const menuPayload = buildPayloadFromValues(values);
        const response = editingMenuId
          ? await makeUpdateFoodMenuRequest(editingMenuId, menuPayload)
          : await makeCreateFoodMenuRequest(menuPayload);
        successToast(
          response?.message ||
            t(
              editingMenuId
                ? 'CREATE_MENU.UPDATED_SUCCESSFULLY'
                : 'CREATE_MENU.CREATED_SUCCESSFULLY',
            ),
        );
        navigation.goBack();
      } catch {
        // APIClient displays the server error toast.
      } finally {
        setIsSaving(false);
      }
    },
    [buildPayloadFromValues, editingMenuId, navigation, t],
  );

  return (
    <ScreenContainer noPaddingTop noPaddingBottom>
      <Formik
        validateOnChange
        enableReinitialize
        onSubmit={handleSubmit}
        initialValues={initialValues}
        validationSchema={menuForm.schema}>
        {({
          handleBlur,
          handleChange,
          handleSubmit: submitForm,
          setFieldValue,
          setFieldTouched,
          validateForm,
          values,
          errors,
          touched,
        }) => {
          const totalItems = (values.categories || []).reduce(
            (sum, category) => sum + (category.items?.length || 0),
            0,
          );

          const selectedTemplate = TEMPLATES.find(
            item => item.id === values.selectedTemplate,
          );
          const selectedTemplateLabel = selectedTemplate
            ? t(`CREATE_MENU.TEMPLATES.${selectedTemplate.translationKey}`)
            : '';

          const headerSubtitle = selectedTemplateLabel
            ? t('CREATE_MENU.HEADER_SUBTITLE', {
                count: totalItems,
                template: selectedTemplateLabel,
              })
            : t('CREATE_MENU.HEADER_SUBTITLE_ITEMS', {count: totalItems});

          const handlePreview = async () => {
            setFieldTouched('menuName', true, false);
            setFieldTouched('selectedTemplate', true, false);

            const formErrors = await validateForm();
            if (formErrors.menuName || formErrors.selectedTemplate) {
              if (formErrors.menuName) {
                errorToast(t(formErrors.menuName));
              } else if (formErrors.selectedTemplate) {
                errorToast(t('CREATE_MENU.TEMPLATE_REQUIRED'));
              }
              return;
            }

            try {
              setIsPreviewLoading(true);
              const menuPayload = buildPayloadFromValues(values);
              const filePath = await createMenuPdfFile(menuPayload);
              setPreviewTitle(values.menuName);
              setPreviewPdfPath(filePath);
              setIsPreviewVisible(true);
            } catch {
              errorToast(t('CREATE_MENU.PREVIEW_FAILED'));
            } finally {
              setIsPreviewLoading(false);
            }
          };

          const handleTemplateSelect = templateId => {
            setFieldValue('selectedTemplate', templateId, true);
            setFieldTouched('selectedTemplate', true, false);
          };

          const handlePhoneChange = text => {
            const sanitized = String(text || '')
              .replace(/[^0-9]/g, '')
              .slice(0, 10);
            setFieldValue('ordersPhone', sanitized, true);
          };

          const handleCategoriesChange = nextCategories => {
            setFieldValue('categories', nextCategories, true);
            setFieldTouched('categories', true, false);
          };

          const handleSavePress = () => {
            setFieldTouched('selectedTemplate', true, false);
            setFieldTouched('menuName', true, false);
            setFieldTouched('ordersPhone', true, false);
            setFieldTouched('kitchenHours', true, false);
            setFieldTouched('categories', true, false);
            submitForm();
          };

          return (
            <>
              <ScreenHeader
                title={
                  values.menuName ||
                  t(
                    routeMenuId || editingMenuId
                      ? 'CREATE_MENU.EDIT_TITLE'
                      : 'CREATE_MENU.TITLE',
                  )
                }
                subtitle={headerSubtitle}
                backAccessibilityLabel={t('CREATE_MENU.BACK')}
                onBack={handleBack}
                rightComponent={
                  <TouchableOpacity
                    accessibilityRole="button"
                    accessibilityLabel={t('CREATE_MENU.PREVIEW')}
                    disabled={isPreviewLoading || isMenuDetailsLoading}
                    onPress={handlePreview}
                    style={styles.headerIconButton}>
                    {isPreviewLoading ? (
                      <ActivityIndicator color={COLORS.SURFACE} size="small" />
                    ) : (
                      <LoginEyeIcon color={COLORS.SURFACE} size={18} />
                    )}
                  </TouchableOpacity>
                }
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
                  <View style={styles.templateSection}>
                    <View style={styles.templateHeader}>
                      <StyledText variant="bold" size={15}>
                        {t('CREATE_MENU.TEMPLATE')}
                      </StyledText>
                      <StyledText color={COLORS.TEXT_SECONDARY} size={10}>
                        {t('CREATE_MENU.TEMPLATE_HINT')}
                      </StyledText>
                    </View>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.templateList}>
                      {TEMPLATES.map(template => {
                        const isSelected =
                          values.selectedTemplate === template.id;

                        return (
                          <TouchableOpacity
                            key={template.id}
                            accessibilityRole="button"
                            onPress={() => handleTemplateSelect(template.id)}
                            style={[
                              styles.templateCard,
                              isSelected && styles.templateCardSelected,
                            ]}>
                            <Image
                              source={template.image}
                              style={styles.templateImage}
                              resizeMode="cover"
                            />
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>
                    {!!touched.selectedTemplate && !!errors.selectedTemplate && (
                      <StyledText
                        color={COLORS.RED_ERROR}
                        size={11}
                        containerStyle={styles.fieldError}>
                        *{t('CREATE_MENU.TEMPLATE_REQUIRED')}
                      </StyledText>
                    )}
                  </View>

                  <View style={styles.section}>
                    <StyledText
                      variant="bold"
                      size={15}
                      containerStyle={styles.sectionTitle}>
                      {t('CREATE_MENU.MENU_DETAILS')}
                    </StyledText>

                    <TouchableOpacity
                      onPress={handleSelectLogo}
                      accessibilityRole="button"
                      style={styles.logoRow}>
                      <View style={styles.logoPlaceholder}>
                        {values.logoUrl ? (
                          <Image
                            source={{uri: values.logoUrl}}
                            style={styles.logoImage}
                            resizeMode="cover"
                          />
                        ) : (
                          <StyledText
                            color={COLORS.TEXT_MUTED}
                            size={8}
                            variant="semiBold">
                            {t('CREATE_MENU.LOGO')}
                          </StyledText>
                        )}
                      </View>
                      <View style={styles.logoCopy}>
                        <StyledText
                          color={COLORS.TEXT_SECONDARY}
                          variant="semiBold"
                          size={13}>
                          {values.logoUrl
                            ? t('CREATE_MENU.LOGO_SELECTED')
                            : t('CREATE_MENU.LOGO_PLACEHOLDER')}
                        </StyledText>
                        <StyledText
                          color={COLORS.TEXT_SECONDARY}
                          size={10}
                          containerStyle={styles.logoSubtitle}>
                          {t('CREATE_MENU.LOGO_HINT')}
                        </StyledText>
                      </View>
                      <ChevronRightIcon color={COLORS.TEXT_MUTED} />
                    </TouchableOpacity>

                    <Input
                      label={t('CREATE_MENU.MENU_NAME')}
                      value={values.menuName}
                      onBlur={handleBlur('menuName')}
                      onChangeText={handleChange('menuName')}
                      placeholder={t('CREATE_MENU.MENU_NAME_PLACEHOLDER')}
                      error={touched.menuName && errors.menuName}
                      borderColor={COLORS.INVOICE_FORM_FIELD_BORDER}
                      focusedBorderColor={COLORS.LOGIN_PRIMARY}
                    />

                    <Input
                      label={t('CREATE_MENU.TAGLINE')}
                      value={values.tagline}
                      onBlur={handleBlur('tagline')}
                      onChangeText={handleChange('tagline')}
                      placeholder={t('CREATE_MENU.TAGLINE_PLACEHOLDER')}
                      error={touched.tagline && errors.tagline}
                      borderColor={COLORS.INVOICE_FORM_FIELD_BORDER}
                      focusedBorderColor={COLORS.LOGIN_PRIMARY}
                    />

                    <View style={styles.fieldsRow}>
                      <Input
                        label={t('CREATE_MENU.ORDERS_PHONE')}
                        value={values.ordersPhone}
                        onBlur={handleBlur('ordersPhone')}
                        onChangeText={handlePhoneChange}
                        keyboardType="phone-pad"
                        maxLength={10}
                        placeholder={t('CREATE_MENU.ORDERS_PHONE_PLACEHOLDER')}
                        error={touched.ordersPhone && errors.ordersPhone}
                        containerStyles={[styles.halfField, styles.lastField]}
                        borderColor={COLORS.INVOICE_FORM_FIELD_BORDER}
                        focusedBorderColor={COLORS.LOGIN_PRIMARY}
                      />
                      <Input
                        label={t('CREATE_MENU.KITCHEN_HOURS')}
                        value={values.kitchenHours}
                        onBlur={handleBlur('kitchenHours')}
                        onChangeText={handleChange('kitchenHours')}
                        placeholder={t('CREATE_MENU.KITCHEN_HOURS_PLACEHOLDER')}
                        error={touched.kitchenHours && errors.kitchenHours}
                        containerStyles={[styles.halfField, styles.lastField]}
                        borderColor={COLORS.INVOICE_FORM_FIELD_BORDER}
                        focusedBorderColor={COLORS.LOGIN_PRIMARY}
                      />
                    </View>
                  </View>

                  <MenuCategoriesSection
                    categories={values.categories}
                    onCategoriesChange={handleCategoriesChange}
                  />
                  {!!touched.categories && !!errors.categories && (
                    <StyledText
                      color={COLORS.RED_ERROR}
                      size={11}
                      containerStyle={styles.categoriesError}>
                      *{t(errors.categories)}
                    </StyledText>
                  )}
                </KeyboardAwareScrollView>

                <View
                  style={[
                    styles.footer,
                    {paddingBottom: Math.max(insets.bottom, 10)},
                  ]}>
                  <View style={styles.actionsRow}>
                    <TouchableOpacity
                      accessibilityRole="button"
                      disabled={isSaving || isMenuDetailsLoading}
                      onPress={handleSavePress}
                      style={[
                        styles.saveButton,
                        (isSaving || isMenuDetailsLoading) &&
                          styles.disabledButton,
                      ]}>
                      {isSaving ? (
                        <ActivityIndicator color={COLORS.SURFACE} />
                      ) : (
                        <StyledText
                          color={COLORS.SURFACE}
                          variant="semiBold"
                          size={13}>
                          {t('CREATE_MENU.SAVE_CHANGES')}
                        </StyledText>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>

                {isMenuDetailsLoading && (
                  <View style={styles.detailsLoader}>
                    <ActivityIndicator
                      color={COLORS.LOGIN_PRIMARY}
                      size="large"
                    />
                  </View>
                )}
              </View>

              <MenuPdfPreviewModal
                isVisible={isPreviewVisible}
                pdfPath={previewPdfPath}
                title={previewTitle || values.menuName || t('CREATE_MENU.PREVIEW')}
                onClose={handleClosePreview}
              />
            </>
          );
        }}
      </Formik>
    </ScreenContainer>
  );
};

export default CreateMenuScreen;
