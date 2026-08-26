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
import { useNavigation} from '@react-navigation/native';
import {ScreenContainer, StyledText} from '../../../components/atoms';
import {InvoiceCard} from '../../../components/molecules';
import {PlusIcon, RefreshIcon} from '../../../components/svgs';
import {COLORS, NAVIGATION, SCREEN} from '../../../constants';
import {useGetBillsQuery} from '../../../redux/tabs';
import {
  formatCurrency,
  formatDateRange,
  formatInvoiceStatus,
  formatShortDate,
  getInitials,
  getStayNights,
} from '../../../utils/invoice';
import styles from './styles';

const PAGE_LIMIT = 10;
const INVOICE_SKELETON_LAYOUT = Array.from({length: 4}, (_, index) => ({
  key: `invoice-skeleton-${index}`,
  width: SCREEN.WIDTH - 18,
  height: 67,
  borderRadius: 11,
  marginBottom: index === 3 ? 0 : 9,
}));

const keyExtractor = item => item.id;

const getItemLayout = (_, index) => ({
  length: 76,
  offset: 76 * index,
  index,
});

const InvoiceSeparator = () => <View style={styles.separator} />;

const InvoicesScreen = () => {
  const {t} = useTranslation();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [page, setPage] = useState(1);
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

  const handleInvoicePress = useCallback(
    billId => {
      navigation.navigate(NAVIGATION.STACKS.COMMON, {
        screen: NAVIGATION.COMMON.CREATE_INVOICE_SCREEN,
        params: {billId},
      });
    },
    [navigation],
  );

  const renderInvoice = useCallback(
    ({item}) => {
      const isSettled =
        Number(item.amountDue) <= 0 ||
        String(item.status).toLowerCase() === 'paid';
      const nights = getStayNights(item.checkIn, item.checkOut);

      return (
        <InvoiceCard
          id={item.id}
          initials={getInitials(item.from)}
          name={item.from}
          status={formatInvoiceStatus(item.status)}
          statusType={isSettled ? 'paid' : 'draft'}
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
          onPress={handleInvoicePress}
        />
      );
    },
    [handleInvoicePress, t],
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
    </ScreenContainer>
  );
};

export default InvoicesScreen;