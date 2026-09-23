import React, {useCallback, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import {
  CustomButton,
  Input,
  ScreenContainer,
  StyledText,
} from '../../../components/atoms';
import {ScreenHeader} from '../../../components/molecules';
import {PickImageModal} from '../../../components/modals';
import {
  CheckIcon,
  CloseIcon,
  ImageIcon,
  UploadIcon,
} from '../../../components/svgs';
import {
  makeGenerateLogoRequest,
  makeUpdateGeneratedLogoRequest,
  makeUploadLogoRequest,
} from '../../../api/common';
import {makeMeRequest} from '../../../api/auth';
import {COLORS} from '../../../constants';
import {setUserData} from '../../../redux/auth/auth.reducer';
import {errorToast, successToast} from '../../../utils/alerts';
import {getGeneratedLogoUrl} from '../../../utils/logo';
import styles from './styles';

const TABS = {
  UPLOAD: 'upload',
  CREATE: 'create',
};

const CreateLogoScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const user = useSelector(state => state.auth.user);
  const [activeTab, setActiveTab] = useState(TABS.UPLOAD);
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [isPickImageVisible, setIsPickImageVisible] = useState(false);
  const [isSubmittingLogo, setIsSubmittingLogo] = useState(false);
  const [homestayName, setHomestayName] = useState('');
  const [logoDescription, setLogoDescription] = useState('');
  const [generatedLogo, setGeneratedLogo] = useState(null);
  const [isGeneratingLogo, setIsGeneratingLogo] = useState(false);
  const [isActivatingLogo, setIsActivatingLogo] = useState(false);

  const currentLogoUrl = user?.homestayLogo || '';

  const refreshUserData = useCallback(async () => {
    const userResponse = await makeMeRequest();

    dispatch(
      setUserData({
        ...userResponse,
        accessToken: user?.accessToken,
        refreshToken: user?.refreshToken,
      }),
    );
  }, [dispatch, user?.accessToken, user?.refreshToken]);

  const clearLocalStates = useCallback(({keepGeneratedLogo = false} = {}) => {
    setSelectedLogo(null);
    setHomestayName('');
    setLogoDescription('');
    setIsPickImageVisible(false);

    if (!keepGeneratedLogo) {
      setGeneratedLogo(null);
    }
  }, []);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleChooseLogo = useCallback(() => {
    setIsPickImageVisible(true);
  }, []);

  const handleClosePickImage = useCallback(() => {
    setIsPickImageVisible(false);
  }, []);

  const handleSelectLogo = useCallback(file => {
    if (file?.uri) {
      setSelectedLogo(file);
    }
  }, []);

  const handleSubmitLogo = useCallback(async () => {
    if (!selectedLogo?.uri) {
      return;
    }

    try {
      setIsSubmittingLogo(true);
      const response = await makeUploadLogoRequest(selectedLogo);
      await refreshUserData();
      clearLocalStates();
      successToast(response?.message || t('CREATE_LOGO.UPLOAD_SUCCESS'));
    } catch {
      // APIClient displays the server error toast.
    } finally {
      setIsSubmittingLogo(false);
    }
  }, [clearLocalStates, refreshUserData, selectedLogo, t]);

  const canCreateLogo =
    homestayName.trim().length > 0 && logoDescription.trim().length > 0;

  const handleCreateLogo = useCallback(async () => {
    if (!canCreateLogo || isGeneratingLogo) {
      return;
    }

    try {
      setIsGeneratingLogo(true);
      const response = await makeGenerateLogoRequest({
        homestay: homestayName.trim(),
        description: logoDescription.trim(),
      });

      console.log('response', response);
      if (response?.status === 401) {
        errorToast(response?.message);
        return;
      }
      const logoUrl = getGeneratedLogoUrl(response);

      if (!logoUrl) {
        throw new Error('Generated logo URL is missing');
      }

      setGeneratedLogo({
        url: logoUrl,
        homestayName: homestayName.trim(),
      });
      // clearLocalStates({keepGeneratedLogo: true});
      successToast(response?.message || t('CREATE_LOGO.GENERATE_SUCCESS'));
    } catch {
      // APIClient displays the server error toast.
    } finally {
      setIsGeneratingLogo(false);
    }
  }, [
    canCreateLogo,
    clearLocalStates,
    homestayName,
    isGeneratingLogo,
    logoDescription,
    t,
  ]);

  const handleRejectLogo = useCallback(() => {
    setGeneratedLogo(null);
  }, []);

  const handleSetActiveLogo = useCallback(async () => {
    if (!generatedLogo?.url || isActivatingLogo) {
      return;
    }

    try {
      setIsActivatingLogo(true);
      const response = await makeUpdateGeneratedLogoRequest({
        url: generatedLogo.url,
      });
      await refreshUserData();
      clearLocalStates();
      successToast(response?.message || t('CREATE_LOGO.ACTIVATE_SUCCESS'));
    } catch {
      // APIClient displays the server error toast.
    } finally {
      setIsActivatingLogo(false);
    }
  }, [clearLocalStates, generatedLogo, isActivatingLogo, refreshUserData, t]);

  const renderTab = useCallback(
    (tab, label) => {
      const isActive = activeTab === tab;

      return (
        <TouchableOpacity
          key={tab}
          accessibilityRole="button"
          onPress={() => setActiveTab(tab)}
          style={[styles.tab, isActive && styles.activeTab]}>
          <StyledText
            color={isActive ? COLORS.LOGIN_PRIMARY : COLORS.TEXT_SECONDARY}
            variant={isActive ? 'semiBold' : 'medium'}
            size={14}>
            {label}
          </StyledText>
        </TouchableOpacity>
      );
    },
    [activeTab],
  );

  const renderUploadTab = () => (
    <>
      <View style={styles.card}>
        <StyledText variant="bold" size={16} containerStyle={styles.cardTitle}>
          {t('CREATE_LOGO.MY_LOGO_TITLE')}
        </StyledText>
        <StyledText
          color={COLORS.TEXT_SECONDARY}
          size={12}
          containerStyle={styles.cardSubtitle}>
          {t('CREATE_LOGO.MY_LOGO_SUBTITLE')}
        </StyledText>
        <View style={styles.logoPreviewBox}>
          {currentLogoUrl ? (
            <Image
              source={{uri: currentLogoUrl}}
              style={styles.currentLogoImage}
              resizeMode="contain"
            />
          ) : (
            <StyledText
              color={COLORS.TEXT_MUTED}
              size={12}
              textStyle={styles.emptyLogoText}>
              {t('CREATE_LOGO.NO_LOGO')}
            </StyledText>
          )}
        </View>
      </View>

      <View style={styles.card}>
        <StyledText variant="bold" size={16} containerStyle={styles.cardTitle}>
          {t('CREATE_LOGO.UPLOAD_TITLE')}
        </StyledText>
        <StyledText
          color={COLORS.TEXT_SECONDARY}
          size={12}
          containerStyle={styles.cardSubtitle}>
          {t('CREATE_LOGO.UPLOAD_SUBTITLE')}
        </StyledText>

        <View style={styles.uploadZone}>
          {selectedLogo?.uri ? (
            <Image
              source={{uri: selectedLogo.uri}}
              style={styles.selectedPreview}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.uploadIconWrap}>
              <ImageIcon color={COLORS.LOGIN_PRIMARY} />
            </View>
          )}

          <StyledText
            variant="semiBold"
            size={14}
            containerStyle={styles.uploadTitle}>
            {t('CREATE_LOGO.CHOOSE_YOUR_LOGO')}
          </StyledText>
          <StyledText
            color={COLORS.TEXT_SECONDARY}
            size={11}
            containerStyle={styles.uploadHint}>
            {t('CREATE_LOGO.FILE_HINT')}
          </StyledText>

          <TouchableOpacity
            accessibilityRole="button"
            disabled={isSubmittingLogo}
            onPress={handleChooseLogo}
            style={styles.chooseButton}>
            <UploadIcon color={COLORS.LOGIN_PRIMARY} size={16} />
            <StyledText
              color={COLORS.LOGIN_PRIMARY}
              variant="semiBold"
              size={13}>
              {t('CREATE_LOGO.CHOOSE_LOGO')}
            </StyledText>
          </TouchableOpacity>
        </View>

        <CustomButton
          title={t('CREATE_LOGO.SUBMIT_LOGO')}
          onPress={handleSubmitLogo}
          isDisabled={!selectedLogo || isSubmittingLogo}
          isLoading={isSubmittingLogo}
          color={COLORS.LOGIN_PRIMARY}
          containerStyle={styles.submitButton}
        />
      </View>
    </>
  );

  const renderNewLogoCard = () => (
    <View style={styles.card}>
      <StyledText variant="bold" size={16} containerStyle={styles.cardTitle}>
        {t('CREATE_LOGO.NEW_LOGO_TITLE')}
      </StyledText>
      <StyledText
        color={COLORS.TEXT_SECONDARY}
        size={12}
        containerStyle={styles.cardSubtitle}>
        {t('CREATE_LOGO.NEW_LOGO_SUBTITLE')}
      </StyledText>

      <View style={styles.logoPreviewBox}>
        <Image
          source={{uri: generatedLogo.url}}
          style={styles.generatedLogoImage}
          resizeMode="contain"
        />
        <StyledText
          color={COLORS.TEXT_SECONDARY}
          size={11}
          textStyle={styles.generatedLogoName}>
          {generatedLogo.homestayName}
        </StyledText>
      </View>

      <View style={styles.logoActionRow}>
        <TouchableOpacity
          accessibilityRole="button"
          disabled={isActivatingLogo}
          onPress={handleSetActiveLogo}
          style={styles.setActiveButton}>
          {isActivatingLogo ? (
            <ActivityIndicator color={COLORS.WHITE} size="small" />
          ) : (
            <>
              <CheckIcon color={COLORS.WHITE} size={14} />
              <StyledText color={COLORS.WHITE} variant="semiBold" size={13}>
                {t('CREATE_LOGO.SET_AS_ACTIVE')}
              </StyledText>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          accessibilityRole="button"
          disabled={isActivatingLogo}
          onPress={handleRejectLogo}
          style={styles.rejectButton}>
          <CloseIcon color={COLORS.WHITE} size={14} />
          <StyledText color={COLORS.WHITE} variant="semiBold" size={13}>
            {t('CREATE_LOGO.REJECT')}
          </StyledText>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCreateTab = () => (
    <>
      {generatedLogo?.url ? renderNewLogoCard() : null}

      <View style={styles.card}>
        <StyledText variant="bold" size={16} containerStyle={styles.cardTitle}>
          {t('CREATE_LOGO.CREATE_TITLE')}
        </StyledText>
        <StyledText
          color={COLORS.TEXT_SECONDARY}
          size={12}
          containerStyle={styles.createSubtitle}>
          {t('CREATE_LOGO.CREATE_SUBTITLE')}
        </StyledText>

        <Input
          value={homestayName}
          onChangeText={setHomestayName}
          placeholder={t('CREATE_LOGO.HOMESTAY_NAME_PLACEHOLDER')}
          borderColor={COLORS.INVOICE_FORM_FIELD_BORDER}
          focusedBorderColor={COLORS.LOGIN_PRIMARY}
          containerStyles={styles.field}
          label={t('CREATE_LOGO.HOMESTAY_NAME_LABEL')}
        />

        <Input
          value={logoDescription}
          onChangeText={setLogoDescription}
          placeholder={t('CREATE_LOGO.DESCRIPTION_PLACEHOLDER')}
          multiline
          numberOfLines={5}
          inputStyle={styles.descriptionInput}
          borderColor={COLORS.INVOICE_FORM_FIELD_BORDER}
          focusedBorderColor={COLORS.LOGIN_PRIMARY}
          containerStyles={styles.lastField}
          label={t('CREATE_LOGO.DESCRIPTION_LABEL')}
        />

        <View style={styles.noteBanner}>
          <Text style={styles.noteText}>
            <Text style={styles.noteTextBold}>
              {t('CREATE_LOGO.NOTE_LABEL')}
            </Text>
            {t('CREATE_LOGO.NOTE_TEXT')}
            <Text style={styles.noteTextBold}>
              {t('CREATE_LOGO.NOTE_LIMIT')}
            </Text>
            {t('CREATE_LOGO.NOTE_SUFFIX')}
          </Text>
        </View>

        <CustomButton
          title={t('CREATE_LOGO.CREATE_BUTTON')}
          onPress={handleCreateLogo}
          isDisabled={!canCreateLogo || isGeneratingLogo}
          isLoading={isGeneratingLogo}
          color={COLORS.LOGIN_PRIMARY}
          containerStyle={styles.createButton}
        />
      </View>
    </>
  );

  return (
    <ScreenContainer noPaddingTop noPaddingBottom>
      <View style={styles.screen}>
        <ScreenHeader
          title={t('CREATE_LOGO.TITLE')}
          backAccessibilityLabel={t('CREATE_LOGO.BACK')}
          onBack={handleBack}
        />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.tabs}>
            {renderTab(TABS.UPLOAD, t('CREATE_LOGO.TAB_UPLOAD'))}
            {renderTab(TABS.CREATE, t('CREATE_LOGO.TAB_CREATE'))}
          </View>

          {activeTab === TABS.UPLOAD ? renderUploadTab() : renderCreateTab()}
        </ScrollView>
      </View>

      <PickImageModal
        isVisible={isPickImageVisible}
        title={t('CREATE_LOGO.CHOOSE_LOGO')}
        onCloseModal={handleClosePickImage}
        onSelect={handleSelectLogo}
        acceptOnlyImage
      />
    </ScreenContainer>
  );
};

export default CreateLogoScreen;
