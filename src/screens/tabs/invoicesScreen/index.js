import React, {useCallback, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  View,
} from 'react-native';
import Skeleton from 'react-native-reanimated-skeleton';
import {useTranslation} from 'react-i18next';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {
  ActionLoadingOverlay,
  ScreenContainer,
  StyledText,
} from '../../../components/atoms';
import {DeleteBillModal, PreviewBillModal} from '../../../components/modals';
import {InvoiceCard} from '../../../components/molecules';
import {INVOICE_MENU_ACTION} from '../../../components/molecules/invoiceCard';
import {PlusIcon, RefreshIcon} from '../../../components/svgs';
import {COLORS, NAVIGATION, SCREEN} from '../../../constants';
import {
  makeDeleteBillRequest,
  makeGetBillDetailsRequest,
  makeUpdateBillStatusRequest,
} from '../../../api/common';
import {useGetBillsQuery} from '../../../redux/tabs';
import {errorToast, successToast} from '../../../utils/alerts';
import {
  formatBillPreview,
  formatCurrency,
  formatDateRange,
  formatInvoiceStatus,
  formatShortDate,
  getInitials,
  getStayNights,
} from '../../../utils/invoice';
import {shareInvoice} from '../../../utils/shareInvoice';
import styles from './styles';

const PAGE_LIMIT = 10;
const POPOVER_CLOSE_DELAY_MS = 500;
const INVOICE_CARD_HEIGHT = 88;
const INVOICE_CARD_GAP = 12;

const INVOICE_SKELETON_LAYOUT = Array.from({length: 4}, (_, index) => ({
  key: `invoice-skeleton-${index}`,
  width: SCREEN.WIDTH - 18,
  height: INVOICE_CARD_HEIGHT,
  borderRadius: 16,
  marginBottom: index === 3 ? 0 : INVOICE_CARD_GAP,
}));

const keyExtractor = item => item.id;

const getItemLayout = (_, index) => ({
  length: INVOICE_CARD_HEIGHT + INVOICE_CARD_GAP,
  offset: (INVOICE_CARD_HEIGHT + INVOICE_CARD_GAP) * index,
  index,
});

const InvoiceSeparator = () => <View style={styles.separator} />;

const InvoicesScreen = () => {
  const {t} = useTranslation();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const user = useSelector(state => state.auth.user);
  const [page, setPage] = useState(1);
  const [sharingBillId, setSharingBillId] = useState(null);
  const [markingPaidBillId, setMarkingPaidBillId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deletingBillId, setDeletingBillId] = useState(null);
  const [isPopoverLoading, setIsPopoverLoading] = useState(false);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const {
    data: billsResponse,
    isError,
    isFetching,
    isLoading,
    refetch,
  } = useGetBillsQuery({page, limit: PAGE_LIMIT});

  const invoices = billsResponse?.data || [];
  const currentMonthStats = billsResponse?.stats?.currentMonth;
  const hasNextPage =
    (billsResponse?.meta?.page || page) <
    (billsResponse?.meta?.totalPages || 1);
  const headerStyle = useMemo(
    () => [styles.header, {paddingTop: insets.top || 20}],
    [insets.top],
  );

  const handleEditInvoice = useCallback(
    billId => {
      navigation.navigate(NAVIGATION.STACKS.COMMON, {
        screen: NAVIGATION.COMMON.CREATE_INVOICE_SCREEN,
        params: {billId},
      });
    },
    [navigation],
  );

  const handleClosePreviewModal = useCallback(() => {
    setIsPreviewVisible(false);
    setPreviewData(null);
    setIsPreviewLoading(false);
  }, []);

  const handleOpenPreviewBill = useCallback(
    async billId => {
      setPreviewData(null);
      setIsPreviewVisible(true);
      setIsPreviewLoading(true);

      try {
        const response = await makeGetBillDetailsRequest(billId);
        setPreviewData(
          formatBillPreview(response, {
            homestayLogo: user?.homestayLogo || '',
          }),
        );
      } catch {
        // APIClient displays the server error toast.
        setIsPreviewVisible(false);
        setPreviewData(null);
      } finally {
        setIsPreviewLoading(false);
      }
    },
    [user?.homestayLogo],
  );

  const handleShareInvoice = useCallback(
    async billId => {
      if (sharingBillId) {
        return;
      }

      try {
        setSharingBillId(billId);
        const response = await makeGetBillDetailsRequest(billId);
        const bill = response?.data || response || {};

        if (!bill?.id && !bill?.invoiceNo) {
          errorToast(t('INVOICES.SHARE_FAILED'));
          return;
        }

        await shareInvoice(
          {
            ...bill,
            payment_terms: bill.payment_terms || bill.paymentTerms || '',
            homestayLogo: user?.homestayLogo || '',
          },
          t('CREATE_INVOICE.SHARE_TITLE'),
        );
      } catch (error) {
        if (!error?.response) {
          errorToast(t('INVOICES.SHARE_FAILED'));
        }
      } finally {
        setSharingBillId(null);
      }
    },
    [sharingBillId, t, user?.homestayLogo],
  );

  const handleMarkBillAsPaid = useCallback(
    async billId => {
      if (markingPaidBillId) {
        return;
      }

      const bill = invoices.find(item => item.id === billId);
      const isPaid = String(bill?.status || '').toLowerCase() === 'paid';

      try {
        setMarkingPaidBillId(billId);
        const response = await makeUpdateBillStatusRequest(billId);
        successToast(
          response?.message ||
            t(
              isPaid
                ? 'INVOICES.MARK_VIEWED_SUCCESS'
                : 'INVOICES.MARK_PAID_SUCCESS',
            ),
        );
        refetch();
      } catch (error) {
        if (!error?.response) {
          errorToast(t('INVOICES.MARK_PAID_FAILED'));
        }
      } finally {
        setMarkingPaidBillId(null);
      }
    },
    [invoices, markingPaidBillId, refetch, t],
  );

  const handleCloseDeleteModal = useCallback(() => {
    if (deletingBillId) {
      return;
    }
    setDeleteTarget(null);
  }, [deletingBillId]);

  const handleConfirmDeleteBill = useCallback(async () => {
    const billId = deleteTarget?.id;
    if (!billId || deletingBillId) {
      return;
    }

    try {
      setDeletingBillId(billId);
      const response = await makeDeleteBillRequest(billId);
      successToast(response?.message || t('INVOICES.DELETE_SUCCESS'));
      setDeleteTarget(null);

      if (page === 1) {
        refetch();
      } else {
        setPage(1);
      }
    } catch {
      // APIClient displays the server error toast.
    } finally {
      setDeletingBillId(null);
    }
  }, [deleteTarget?.id, deletingBillId, page, refetch, t]);

  const handleInvoiceMenuAction = useCallback(
    (action, billId) => {
      if (action === INVOICE_MENU_ACTION.EDIT) {
        setTimeout(() => {
          handleEditInvoice(billId);
        }, POPOVER_CLOSE_DELAY_MS);
        return;
      }

      if (action === INVOICE_MENU_ACTION.PREVIEW) {
        setIsPopoverLoading(true);
        setTimeout(() => {
          setIsPopoverLoading(false);
          handleOpenPreviewBill(billId);
        }, POPOVER_CLOSE_DELAY_MS);
        return;
      }

      if (action === INVOICE_MENU_ACTION.MARK_PAID) {
        setIsPopoverLoading(true);
        setTimeout(() => {
          handleMarkBillAsPaid(billId).finally(() => {
            setIsPopoverLoading(false);
          });
        }, POPOVER_CLOSE_DELAY_MS);
        return;
      }

      if (action === INVOICE_MENU_ACTION.SHARE) {
        setIsPopoverLoading(true);
        setTimeout(() => {
          handleShareInvoice(billId).finally(() => {
            setIsPopoverLoading(false);
          });
        }, POPOVER_CLOSE_DELAY_MS);
        return;
      }

      if (action !== INVOICE_MENU_ACTION.DELETE) {
        return;
      }

      const bill = invoices.find(item => item.id === billId);
      setTimeout(() => {
        setDeleteTarget({
          id: billId,
          guestName: bill?.to || '',
        });
      }, POPOVER_CLOSE_DELAY_MS);
    },
    [
      handleEditInvoice,
      handleMarkBillAsPaid,
      handleOpenPreviewBill,
      handleShareInvoice,
      invoices,
    ],
  );

  const renderInvoice = useCallback(
    ({item}) => {
      const isPaid = String(item.status).toLowerCase() === 'paid';
      const isSettled = Number(item.amountDue) <= 0 || isPaid;
      const nights = getStayNights(item.checkIn, item.checkOut);

      return (
        <InvoiceCard
          id={item.id}
          initials={getInitials(item.to)}
          name={item.to}
          status={formatInvoiceStatus(item.status)}
          statusType={isSettled ? 'paid' : 'draft'}
          isPaid={isPaid}
          dates={formatDateRange(item.checkIn, item.checkOut)}
          stayDetails={t('INVOICES.STAY_DETAILS', {
            count: nights,
            date: formatShortDate(item.createdAt),
          })}
          amount={formatCurrency(item.total)}
          settlement={
            isSettled
              ? t('INVOICES.STATUS.SETTLED')
              : t('INVOICES.DUE_AMOUNT', {
                  amount: formatCurrency(item.amountDue),
                })
          }
          onMenuAction={handleInvoiceMenuAction}
        />
      );
    },
    [handleInvoiceMenuAction, t],
  );

  const handleLoadMore = useCallback(() => {
    if (!isFetching && hasNextPage) {
      setPage(currentPage => currentPage + 1);
    }
  }, [hasNextPage, isFetching]);

  const handleRefresh = useCallback(() => {
    if (page === 1) {
      refetch();
      return;
    }

    setPage(1);
  }, [page, refetch]);

  const renderFooter = useCallback(() => {
    if (!isFetching || page === 1) {
      return null;
    }

    return (
      <View style={styles.paginationLoader}>
        <ActivityIndicator color={COLORS.LOGIN_PRIMARY} />
      </View>
    );
  }, [isFetching, page]);

  const renderEmpty = useCallback(() => {
    if (isLoading) {
      return (
        <Skeleton
          isLoading
          layout={INVOICE_SKELETON_LAYOUT}
          boneColor={COLORS.SKELETON_BONE}
          highlightColor={COLORS.SKELETON_HIGHLIGHT}
          containerStyle={styles.skeletonContainer}
        />
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <StyledText color={COLORS.TEXT_SECONDARY} size={13} textAlign="center">
          {t(
            isError
              ? 'INVOICES.LOAD_ERROR'
              : 'INVOICES.EMPTY',
          )}
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
              {t('INVOICES.TITLE')}
            </StyledText>
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.refreshButton}
                onPress={handleRefresh}
                disabled={isFetching}>
                <RefreshIcon color={COLORS.SURFACE} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.newButton} onPress={() => navigation.navigate(NAVIGATION.STACKS.COMMON, {screen: NAVIGATION.STACKS.COMMON.CREATE_INVOICE_SCREEN})}>
                <PlusIcon />
                <StyledText color={COLORS.PRIMARY} variant="bold" size={12}>
                  {t('INVOICES.NEW')}
                </StyledText>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.summary}>
              <StyledText color={COLORS.SURFACE} variant="bold" size={17}>
                {formatCurrency(currentMonthStats?.totalAmount)}
              </StyledText>
              <StyledText color={COLORS.HEADER_TEXT_MUTED} size={9}>
                {t('INVOICES.BILLED_LABEL')}
              </StyledText>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summary}>
              <StyledText color={COLORS.SURFACE} variant="bold" size={17}>
                {formatCurrency(currentMonthStats?.totalDueAmount)}
              </StyledText>
              <StyledText color={COLORS.HEADER_TEXT_MUTED} size={9}>
                {t('INVOICES.OUTSTANDING_LABEL')}
              </StyledText>
            </View>
          </View>
        </View>

        <FlatList
          data={invoices}
          renderItem={renderInvoice}
          keyExtractor={keyExtractor}
          ItemSeparatorComponent={InvoiceSeparator}
          getItemLayout={getItemLayout}
          initialNumToRender={4}
          maxToRenderPerBatch={6}
          windowSize={5}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.4}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl
              refreshing={isFetching && page === 1 && !isLoading}
              onRefresh={handleRefresh}
              tintColor={COLORS.LOGIN_PRIMARY}
              colors={[COLORS.LOGIN_PRIMARY]}
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
        />
      </View>

      <PreviewBillModal
        data={previewData}
        isLoading={isPreviewLoading}
        isVisible={isPreviewVisible}
        onClose={handleClosePreviewModal}
      />

      <DeleteBillModal
        guestName={deleteTarget?.guestName}
        isDeleting={!!deletingBillId}
        isVisible={!!deleteTarget}
        onCancel={handleCloseDeleteModal}
        onConfirm={handleConfirmDeleteBill}
      />

      <ActionLoadingOverlay
        visible={
          isPopoverLoading || !!sharingBillId || !!markingPaidBillId
        }
      />
    </ScreenContainer>
  );
};

export default InvoicesScreen;