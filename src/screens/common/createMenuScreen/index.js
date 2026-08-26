import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {Input, ScreenContainer, StyledText} from '../../../components/atoms';
import {
  MenuCategoriesSection,
  ScreenHeader,
} from '../../../components/molecules';
import {
  ChevronRightIcon,
  LoginEyeIcon,
  UploadIcon,
} from '../../../components/svgs';
import {MenuPdfPreviewModal} from '../../../components/modals';
import {makeCreateFoodMenuRequest, makeGetSingleFoodMenuRequest, makeUpdateFoodMenuRequest} from '../../../api/common';
import {ASSETS, COLORS} from '../../../constants';
import {buildMenuPayload, formatMenuDetails} from '../../../utils/menu';
import {createMenuPdfFile} from '../../../utils/menuPdf';
import {errorToast, successToast} from '../../../utils/alerts';
import {shareMenuPdf} from '../../../utils/shareMenu';
import styles from './styles';

const TEMPLATES = [
  {id: 'classic', translationKey: 'CLASSIC', image: ASSETS.IMAGES.CLASSIC},
  {id: 'himalayan', translationKey: 'HIMALAYAN', image: ASSETS.IMAGES.HIMALAYAN},
  {id: 'heritage', translationKey: 'HERITAGE', image: ASSETS.IMAGES.HERITAGE},
  {id: 'minimal', translationKey: 'MINIMAL', image: ASSETS.IMAGES.MINIMAL},
  {id: 'essential', translationKey: 'ESSENTIAL', image: ASSETS.IMAGES.ESSENTIAL},
];

const CreateMenuScreen = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();
  const routeMenuId = route.params?.menuId;
  const insets = useSafeAreaInsets();
  const [editingMenuId, setEditingMenuId] = useState(routeMenuId || '');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [menuName, setMenuName] = useState('');
  const [tagline, setTagline] = useState('');
  const [ordersPhone, setOrdersPhone] = useState('');
  const [kitchenHours, setKitchenHours] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [categories, setCategories] = useState([]);
  const [isMenuDetailsLoading, setIsMenuDetailsLoading] = useState(!!routeMenuId);
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [isShareLoading, setIsShareLoading] = useState(false);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [previewPdfPath, setPreviewPdfPath] = useState('');

  useEffect(() => {
    if (routeMenuId) {
      setEditingMenuId(routeMenuId);
    }
  }, [routeMenuId]);

  useEffect(() => {
    if (!routeMenuId) {
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
        setMenuName(details.title);
        setTagline(details.tagline);
        setOrdersPhone(details.phoneNumber);
        setKitchenHours(details.kitchenTiming);
        setLogoUrl(details.logoUrl);
        setSelectedTemplate(details.templateId);
        setCategories(details.categories);
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

  const totalItems = useMemo(
    () =>
      categories.reduce(
        (sum, category) => sum + category.items.length,
        0,
      ),
    [categories],
  );

  const selectedTemplateLabel = useMemo(() => {
    const template = TEMPLATES.find(item => item.id === selectedTemplate);
    return template
      ? t(`CREATE_MENU.TEMPLATES.${template.translationKey}`)
      : '';
  }, [selectedTemplate, t]);

  const headerSubtitle = selectedTemplateLabel
    ? t('CREATE_MENU.HEADER_SUBTITLE', {
        count: totalItems,
        template: selectedTemplateLabel,
      })
    : t('CREATE_MENU.HEADER_SUBTITLE_ITEMS', {count: totalItems});

  const menuPayload = useMemo(
    () =>
      buildMenuPayload({
        title: menuName,
        tagline,
        phoneNumber: ordersPhone,
        kitchenTiming: kitchenHours,
        templateId: selectedTemplate,
        categories,
      }),
    [
      categories,
      kitchenHours,
      menuName,
      ordersPhone,
      selectedTemplate,
      tagline,
    ],
  );

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const validateMenuForPdf = useCallback(() => {
    if (!menuName.trim()) {
      errorToast(t('CREATE_MENU.MENU_NAME_REQUIRED'));
      return false;
    }

    if (!selectedTemplate) {
      errorToast(t('CREATE_MENU.TEMPLATE_REQUIRED'));
      return false;
    }

    return true;
  }, [menuName, selectedTemplate, t]);

  const handleClosePreview = useCallback(() => {
    setIsPreviewVisible(false);
    setPreviewPdfPath('');
  }, []);

  const handlePreview = useCallback(async () => {
    if (!validateMenuForPdf()) {
      return;
    }

    try {
      setIsPreviewLoading(true);
      const filePath = await createMenuPdfFile(menuPayload);
      setPreviewPdfPath(filePath);
      setIsPreviewVisible(true);
    } catch {
      errorToast(t('CREATE_MENU.PREVIEW_FAILED'));
    } finally {
      setIsPreviewLoading(false);
    }
  }, [menuPayload, t, validateMenuForPdf]);

  const handleShare = useCallback(async () => {
    if (!validateMenuForPdf()) {
      return;
    }

    try {
      setIsShareLoading(true);
      await shareMenuPdf(menuPayload, t('CREATE_MENU.SHARE'));
    } catch {
      errorToast(t('CREATE_MENU.SHARE_FAILED'));
    } finally {
      setIsShareLoading(false);
    }
  }, [menuPayload, t, validateMenuForPdf]);

  const handleSave = useCallback(async () => {
    if (!menuName.trim()) {
      errorToast(t('CREATE_MENU.MENU_NAME_REQUIRED'));
      return;
    }

    if (!selectedTemplate) {
      errorToast(t('CREATE_MENU.TEMPLATE_REQUIRED'));
      return;
    }

    try {
      setIsSaving(true);
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
  }, [editingMenuId, menuName, menuPayload, navigation, selectedTemplate, t]);

  const renderTemplate = useCallback(
    template => {
      const isSelected = selectedTemplate === template.id;

      return (
        <TouchableOpacity
          key={template.id}
          accessibilityRole="button"
          onPress={() => setSelectedTemplate(template.id)}
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
    },
    [selectedTemplate],
  );

  return (
    <ScreenContainer noPaddingTop noPaddingBottom>
      <ScreenHeader
        title={
          menuName ||
          t(routeMenuId || editingMenuId ? 'CREATE_MENU.EDIT_TITLE' : 'CREATE_MENU.TITLE')
        }
        subtitle={headerSubtitle}
        backAccessibilityLabel={t('CREATE_MENU.BACK')}
        onBack={handleBack}
        rightComponent={
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={t('CREATE_MENU.PREVIEW')}
            disabled={isPreviewLoading || isShareLoading || isMenuDetailsLoading}
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
        <ScrollView
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
              {TEMPLATES.map(renderTemplate)}
            </ScrollView>
          </View>

          <View style={styles.section}>
            <StyledText
              variant="bold"
              size={15}
              containerStyle={styles.sectionTitle}>
              {t('CREATE_MENU.MENU_DETAILS')}
            </StyledText>

            <TouchableOpacity
              accessibilityRole="button"
              style={styles.logoRow}>
              <View style={styles.logoPlaceholder}>
                {logoUrl ? (
                  <Image
                    source={{uri: logoUrl}}
                    style={styles.logoImage}
                    resizeMode="cover"
                  />
                ) : (
                  <StyledText color={COLORS.TEXT_MUTED} size={8} variant="semiBold">
                    {t('CREATE_MENU.LOGO')}
                  </StyledText>
                )}
              </View>
              <View style={styles.logoCopy}>
                <StyledText
                  color={COLORS.TEXT_SECONDARY}
                  variant="semiBold"
                  size={13}>
                  {logoUrl ? t('CREATE_MENU.LOGO_SELECTED') : t('CREATE_MENU.LOGO_PLACEHOLDER')}
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
              value={menuName}
              onChangeText={setMenuName}
              placeholder={t('CREATE_MENU.MENU_NAME_PLACEHOLDER')}
              borderColor={COLORS.INVOICE_FORM_FIELD_BORDER}
              focusedBorderColor={COLORS.LOGIN_PRIMARY}
            />

            <Input
              label={t('CREATE_MENU.TAGLINE')}
              value={tagline}
              onChangeText={setTagline}
              placeholder={t('CREATE_MENU.TAGLINE_PLACEHOLDER')}
              borderColor={COLORS.INVOICE_FORM_FIELD_BORDER}
              focusedBorderColor={COLORS.LOGIN_PRIMARY}
            />

            <View style={styles.fieldsRow}>
              <Input
                label={t('CREATE_MENU.ORDERS_PHONE')}
                value={ordersPhone}
                onChangeText={setOrdersPhone}
                keyboardType="phone-pad"
                placeholder={t('CREATE_MENU.ORDERS_PHONE_PLACEHOLDER')}
                containerStyles={[styles.halfField, styles.lastField]}
                borderColor={COLORS.INVOICE_FORM_FIELD_BORDER}
                focusedBorderColor={COLORS.LOGIN_PRIMARY}
              />
              <Input
                label={t('CREATE_MENU.KITCHEN_HOURS')}
                value={kitchenHours}
                onChangeText={setKitchenHours}
                placeholder={t('CREATE_MENU.KITCHEN_HOURS_PLACEHOLDER')}
                containerStyles={[styles.halfField, styles.lastField]}
                borderColor={COLORS.INVOICE_FORM_FIELD_BORDER}
                focusedBorderColor={COLORS.LOGIN_PRIMARY}
              />
            </View>
          </View>

          <MenuCategoriesSection
            categories={categories}
            onCategoriesChange={setCategories}
          />
        </ScrollView>

        <View style={[styles.footer, {paddingBottom: Math.max(insets.bottom, 10)}]}>
          <View style={styles.actionsRow}>
            <TouchableOpacity
              accessibilityRole="button"
              disabled={isSaving || isMenuDetailsLoading}
              onPress={handleSave}
              style={[
                styles.saveButton,
                (isSaving || isMenuDetailsLoading) && styles.disabledButton,
              ]}>
              {isSaving ? (
                <ActivityIndicator color={COLORS.SURFACE} />
              ) : (
                <StyledText color={COLORS.SURFACE} variant="semiBold" size={13}>
                  {t('CREATE_MENU.SAVE_CHANGES')}
                </StyledText>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel={t('CREATE_MENU.SHARE')}
              disabled={isSaving || isShareLoading || isPreviewLoading || isMenuDetailsLoading}
              onPress={handleShare}
              style={[
                styles.shareButton,
                (isSaving || isShareLoading || isMenuDetailsLoading) &&
                  styles.disabledButton,
              ]}>
              {isShareLoading ? (
                <ActivityIndicator color={COLORS.LOGIN_PRIMARY} />
              ) : (
                <UploadIcon color={COLORS.LOGIN_PRIMARY} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {isMenuDetailsLoading && (
          <View style={styles.detailsLoader}>
            <ActivityIndicator color={COLORS.LOGIN_PRIMARY} size="large" />
          </View>
        )}
      </View>

      <MenuPdfPreviewModal
        isVisible={isPreviewVisible}
        pdfPath={previewPdfPath}
        title={menuName || t('CREATE_MENU.PREVIEW')}
        onClose={handleClosePreview}
      />
    </ScreenContainer>
  );
};

export default CreateMenuScreen;
