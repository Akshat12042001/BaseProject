import React, {useCallback, useMemo, useState} from 'react';
import {
  FlatList,
  RefreshControl,
  TouchableOpacity,
  View,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import Skeleton from 'react-native-reanimated-skeleton';
import {
  ActionLoadingOverlay,
  ScreenContainer,
  StyledText,
} from '../../../components/atoms';
import {DeleteMenuModal, MenuPdfPreviewModal} from '../../../components/modals';
import {MenuCard} from '../../../components/molecules';
import {MENU_CARD_ACTION} from '../../../components/molecules/menuCard';
import {PlusIcon} from '../../../components/svgs';
import {COLORS, NAVIGATION, SCREEN} from '../../../constants';
import {
  makeDeleteFoodMenuRequest,
  makeGetSingleFoodMenuRequest,
  makeUpdateFoodMenuActiveRequest,
} from '../../../api/common';
import {useGetFoodMenuQuery} from '../../../redux/tabs';
import {errorToast, successToast} from '../../../utils/alerts';
import {
  buildMenuPayloadFromDetails,
  formatMenuDescription,
  formatMenuDetails,
  formatMenuUpdatedAt,
  getFoodMenus,
  getMenuTemplateImage,
} from '../../../utils/menu';
import {createMenuPdfFile} from '../../../utils/menuPdf';
import {shareMenuPdf} from '../../../utils/shareMenu';
import styles from './styles';

const keyExtractor = item => item.id;
const POPOVER_CLOSE_DELAY_MS = 500;
const MENU_CARD_HEIGHT = 96;
const MENU_CARD_GAP = 10;

const MENU_SKELETON_LAYOUT = Array.from({length: 4}, (_, index) => ({
  key: `menu-skeleton-${index}`,
  width: SCREEN.WIDTH - 24,
  height: MENU_CARD_HEIGHT,
  borderRadius: 11,
  marginBottom: index === 3 ? 0 : MENU_CARD_GAP,
}));

const MenuSeparator = () => <View style={styles.separator} />;

const MenuScreen = () => {
  const {t} = useTranslation();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const {
    data: foodMenuResponse,
    isError,
    isFetching,
    isLoading,
    refetch,
  } = useGetFoodMenuQuery();

  const [activeUpdatingId, setActiveUpdatingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deletingMenuId, setDeletingMenuId] = useState(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [previewPdfPath, setPreviewPdfPath] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [busyMenuId, setBusyMenuId] = useState(null);
  const [isPopoverLoading, setIsPopoverLoading] = useState(false);

  const menus = useMemo(
    () => getFoodMenus(foodMenuResponse),
    [foodMenuResponse],
  );

  // useFocusEffect(
  //   useCallback(() => {
  //     refetch();
  //   }, [refetch]),
  // );

  const headerStyle = useMemo(
    () => [styles.header, {paddingTop: insets.top || 20, paddingBottom: 20}],
    [insets.top],
  );

  const subtitle = t('MENU.SUBTITLE', {count: menus.length});

  const handleCreateMenu = useCallback(() => {
    navigation.navigate(NAVIGATION.STACKS.COMMON, {
      screen: NAVIGATION.COMMON.CREATE_MENU_SCREEN,
    });
  }, [navigation]);

  const handleEditMenu = useCallback(
    id => {
      navigation.navigate(NAVIGATION.STACKS.COMMON, {
        screen: NAVIGATION.COMMON.CREATE_MENU_SCREEN,
        params: {menuId: id},
      });
    },
    [navigation],
  );

  const fetchMenuPayload = useCallback(async menuId => {
    const response = await makeGetSingleFoodMenuRequest(menuId);
    const details = formatMenuDetails(response);
    return {
      details,
      menuPayload: buildMenuPayloadFromDetails(details),
    };
  }, []);

  const handleClosePreview = useCallback(() => {
    setIsPreviewVisible(false);
    setPreviewPdfPath('');
    setPreviewTitle('');
  }, []);

  const handlePreviewMenu = useCallback(
    async menuId => {
      if (busyMenuId) {
        return;
      }

      try {
        setBusyMenuId(menuId);
        const {details, menuPayload} = await fetchMenuPayload(menuId);

        if (!String(details.title || '').trim()) {
          errorToast(t('CREATE_MENU.MENU_NAME_REQUIRED'));
          return;
        }

        if (!details.templateId) {
          errorToast(t('CREATE_MENU.TEMPLATE_REQUIRED'));
          return;
        }

        const filePath = await createMenuPdfFile(menuPayload);
        setPreviewTitle(details.title);
        setPreviewPdfPath(filePath);
        setIsPreviewVisible(true);
      } catch {
        errorToast(t('CREATE_MENU.PREVIEW_FAILED'));
      } finally {
        setBusyMenuId(null);
      }
    },
    [busyMenuId, fetchMenuPayload, t],
  );

  const handleShareMenu = useCallback(
    async menuId => {
      if (busyMenuId) {
        return;
      }

      try {
        setBusyMenuId(menuId);
        const {details, menuPayload} = await fetchMenuPayload(menuId);

        if (!details.title || !details.templateId) {
          errorToast(t('MENU.SHARE_FAILED'));
          return;
        }

        await shareMenuPdf(menuPayload, t('CREATE_MENU.SHARE'));
      } catch (error) {
        if (!error?.response) {
          errorToast(t('MENU.SHARE_FAILED'));
        }
      } finally {
        setBusyMenuId(null);
      }
    },
    [busyMenuId, fetchMenuPayload, t],
  );

  const handleActiveChange = useCallback(
    async (menuId, isActive) => {
      if (activeUpdatingId) {
        return;
      }

      try {
        setActiveUpdatingId(menuId);
        const response = await makeUpdateFoodMenuActiveRequest(menuId, isActive);
        successToast(
          response?.message ||
            t(isActive ? 'MENU.ACTIVE_SUCCESS' : 'MENU.INACTIVE_SUCCESS'),
        );
        refetch();
      } catch (error) {
        if (!error?.response) {
          errorToast(t('MENU.ACTIVE_FAILED'));
        }
      } finally {
        setActiveUpdatingId(null);
      }
    },
    [activeUpdatingId, refetch, t],
  );

  const handleCloseDeleteModal = useCallback(() => {
    if (deletingMenuId) {
      return;
    }
    setDeleteTarget(null);
  }, [deletingMenuId]);

  const handleConfirmDeleteMenu = useCallback(async () => {
    const menuId = deleteTarget?.id;
    if (!menuId || deletingMenuId) {
      return;
    }

    try {
      setDeletingMenuId(menuId);
      const response = await makeDeleteFoodMenuRequest(menuId);
      successToast(response?.message || t('MENU.DELETE_SUCCESS'));
      setDeleteTarget(null);
      refetch();
    } catch {
      // APIClient displays the server error toast.
    } finally {
      setDeletingMenuId(null);
    }
  }, [deleteTarget?.id, deletingMenuId, refetch, t]);

  const handleMenuAction = useCallback(
    (action, menuId) => {
      if (action === MENU_CARD_ACTION.EDIT) {
        setTimeout(() => {
          handleEditMenu(menuId);
        }, POPOVER_CLOSE_DELAY_MS);
        return;
      }

      if (action === MENU_CARD_ACTION.PREVIEW) {
        setIsPopoverLoading(true);
        setTimeout(() => {
          handlePreviewMenu(menuId).finally(() => {
            setIsPopoverLoading(false);
          });
        }, POPOVER_CLOSE_DELAY_MS);
        return;
      }

      if (action === MENU_CARD_ACTION.SHARE) {
        setIsPopoverLoading(true);
        setTimeout(() => {
          handleShareMenu(menuId).finally(() => {
            setIsPopoverLoading(false);
          });
        }, POPOVER_CLOSE_DELAY_MS);
        return;
      }

      if (action !== MENU_CARD_ACTION.DELETE) {
        return;
      }

      const menu = menus.find(item => item.id === menuId);
      setTimeout(() => {
        setDeleteTarget({
          id: menuId,
          menuName: menu?.title || '',
        });
      }, POPOVER_CLOSE_DELAY_MS);
    },
    [handleEditMenu, handlePreviewMenu, handleShareMenu, menus],
  );

  const renderMenu = useCallback(
    ({item}) => (
      <MenuCard
        id={item.id}
        title={item.title}
        description={formatMenuDescription(item, t)}
        updated={formatMenuUpdatedAt(item.updatedAt)}
        templateImage={getMenuTemplateImage(item.templateId)}
        isActive={Boolean(item.isActive)}
        isActiveUpdating={activeUpdatingId === item.id}
        onActiveChange={handleActiveChange}
        onMenuAction={handleMenuAction}
      />
    ),
    [activeUpdatingId, handleActiveChange, handleMenuAction, t],
  );

  const renderEmpty = useCallback(() => {
    if (isLoading) {
      return (
        <Skeleton
          isLoading
          layout={MENU_SKELETON_LAYOUT}
          boneColor={COLORS.SKELETON_BONE}
          highlightColor={COLORS.SKELETON_HIGHLIGHT}
          containerStyle={styles.skeletonContainer}
        />
      );
    }

    return (
      <View style={styles.emptyState}>
        <StyledText color={COLORS.TEXT_SECONDARY} size={13}>
          {isError ? t('MENU.LOAD_ERROR') : t('MENU.EMPTY')}
        </StyledText>
      </View>
    );
  }, [isError, isLoading, t]);

  return (
    <ScreenContainer noPaddingTop noPaddingBottom>
      <View style={styles.screen}>
        <View style={headerStyle}>
          <View style={styles.topRow}>
            <StyledText color={COLORS.SURFACE} variant="bold" size={20}>
              {t('MENU.TITLE')}
            </StyledText>
            <TouchableOpacity
              accessibilityRole="button"
              onPress={handleCreateMenu}
              style={styles.newButton}>
              <PlusIcon />
              <StyledText color={COLORS.PRIMARY} variant="bold" size={12}>
                {t('MENU.NEW')}
              </StyledText>
            </TouchableOpacity>
          </View>
          <StyledText
            color={COLORS.HEADER_TEXT_MUTED}
            size={12}
            containerStyle={styles.subtitle}>
            {subtitle}
          </StyledText>
        </View>

        <FlatList
          data={menus}
          renderItem={renderMenu}
          keyExtractor={keyExtractor}
          ItemSeparatorComponent={MenuSeparator}
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl
              refreshing={isFetching && !isLoading}
              onRefresh={refetch}
              tintColor={COLORS.LOGIN_PRIMARY}
              colors={[COLORS.LOGIN_PRIMARY]}
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.list,
            !menus.length && styles.emptyList,
          ]}
        />
      </View>

      <MenuPdfPreviewModal
        isVisible={isPreviewVisible}
        pdfPath={previewPdfPath}
        title={previewTitle}
        onClose={handleClosePreview}
      />

      <DeleteMenuModal
        isDeleting={!!deletingMenuId}
        isVisible={!!deleteTarget}
        menuName={deleteTarget?.menuName}
        onCancel={handleCloseDeleteModal}
        onConfirm={handleConfirmDeleteMenu}
      />

      <ActionLoadingOverlay
        visible={
          isPopoverLoading || !!busyMenuId || !!activeUpdatingId
        }
      />
    </ScreenContainer>
  );
};

export default MenuScreen;
