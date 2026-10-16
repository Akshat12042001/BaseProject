import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {ScreenContainer, StyledText} from '../../../components/atoms';
import {ScreenHeader} from '../../../components/molecules';
import {
  BagIcon,
  CheckCircleIcon,
  RupeeIcon,
  StorefrontIcon,
  TruckIcon,
} from '../../../components/svgs';
import {makeGetMyOrdersRequest} from '../../../api/common';
import {COLORS} from '../../../constants';
import {formatCurrency} from '../../../utils/invoice';
import {
  buildMyOrdersParams,
  getOrdersList,
  getOrdersMeta,
  getOrdersSummary,
  mapOrder,
  ORDER_FILTER,
  ORDERS_PAGE_LIMIT,
} from '../../../utils/orders';
import styles from './styles';

const OrdersSkeleton = () => (
  <ScrollView
    style={styles.screen}
    contentContainerStyle={styles.content}
    showsVerticalScrollIndicator={false}>
    <View style={styles.summaryGrid}>
      {Array.from({length: 4}).map((_, index) => (
        <View key={`summary-bone-${index}`} style={styles.summarySkeletonCard} />
      ))}
    </View>

    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.filtersScroll}
      contentContainerStyle={styles.filtersContent}>
      {Array.from({length: 5}).map((_, index) => (
        <View key={`filter-bone-${index}`} style={styles.filterSkeletonChip} />
      ))}
    </ScrollView>

    <View style={styles.tableCard}>
      <View style={styles.tableSkeletonContent}>
        {Array.from({length: 5}).map((_, index) => (
          <View key={`table-bone-${index}`} style={styles.tableSkeletonRow} />
        ))}
      </View>
    </View>
  </ScrollView>
);

const SummaryCard = ({label, value, Icon}) => (
  <View style={styles.summaryCard}>
    <View style={styles.summaryHeader}>
      <StyledText color={COLORS.TEXT_SECONDARY} size={12} numberOfLines={1}>
        {label}
      </StyledText>
      <Icon color={COLORS.TEXT_MUTED} size={18} />
    </View>
    <StyledText variant="bold" size={22} containerStyle={styles.summaryValue}>
      {value}
    </StyledText>
  </View>
);

const OrdersScreen = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const requestIdRef = useRef(0);

  const [selectedFilter, setSelectedFilter] = useState(ORDER_FILTER.ALL);
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [metaTotal, setMetaTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [isError, setIsError] = useState(false);

  const filterOptions = useMemo(
    () => [
      {label: t('ORDERS.FILTER_ALL'), value: ORDER_FILTER.ALL},
      {label: t('ORDERS.FILTER_PENDING'), value: ORDER_FILTER.PENDING},
      {label: t('ORDERS.FILTER_CONFIRMED'), value: ORDER_FILTER.CONFIRMED},
      {label: t('ORDERS.FILTER_PROCESSING'), value: ORDER_FILTER.PROCESSING},
      {label: t('ORDERS.FILTER_FAILED'), value: ORDER_FILTER.FAILED},
    ],
    [t],
  );

  const summary = useMemo(
    () => getOrdersSummary(orders, metaTotal),
    [metaTotal, orders],
  );

  const hasNextPage = page < totalPages;

  const fetchOrders = useCallback(
    async ({
      page: nextPage = 1,
      status = selectedFilter,
      append = false,
    } = {}) => {
      const requestId = ++requestIdRef.current;

      try {
        if (append) {
          setIsFetchingMore(true);
        } else {
          setIsLoading(true);
        }

        const response = await makeGetMyOrdersRequest(
          buildMyOrdersParams({
            page: nextPage,
            limit: ORDERS_PAGE_LIMIT,
            status,
          }),
        );

        if (requestId !== requestIdRef.current) {
          return;
        }

        const mappedOrders = getOrdersList(response).map(mapOrder);
        const meta = getOrdersMeta(response);

        setOrders(current =>
          append ? [...current, ...mappedOrders] : mappedOrders,
        );
        setPage(meta.page);
        setTotalPages(meta.totalPages);
        setMetaTotal(meta.total);
        setIsError(false);
      } catch (error) {
        if (requestId !== requestIdRef.current) {
          return;
        }

        if (!append) {
          setOrders([]);
          setPage(1);
          setTotalPages(1);
          setMetaTotal(0);
        }
        setIsError(true);
      } finally {
        if (requestId !== requestIdRef.current) {
          return;
        }
        setIsLoading(false);
        setIsFetchingMore(false);
      }
    },
    [selectedFilter],
  );

  useEffect(() => {
    if (!isFocused) {
      return;
    }
    fetchOrders({page: 1, status: selectedFilter, append: false});
  }, [fetchOrders, isFocused, selectedFilter]);

  const handleFilterChange = useCallback(value => {
    setSelectedFilter(value);
    setPage(1);
  }, []);

  const handleLoadMore = useCallback(() => {
    if (isLoading || isFetchingMore || !hasNextPage) {
      return;
    }

    fetchOrders({
      page: page + 1,
      status: selectedFilter,
      append: true,
    });
  }, [
    fetchOrders,
    hasNextPage,
    isFetchingMore,
    isLoading,
    page,
    selectedFilter,
  ]);

  const getPaymentLabel = useCallback(
    status => {
      if (status === 'pending') {
        return t('ORDERS.PAYMENT_PENDING');
      }
      return status;
    },
    [t],
  );

  const emptyTitle = useMemo(() => {
    if (isError) {
      return t('ORDERS.LOAD_ERROR');
    }

    switch (selectedFilter) {
      case ORDER_FILTER.PENDING:
        return t('ORDERS.EMPTY_PENDING');
      case ORDER_FILTER.CONFIRMED:
        return t('ORDERS.EMPTY_CONFIRMED');
      case ORDER_FILTER.PROCESSING:
        return t('ORDERS.EMPTY_PROCESSING');
      case ORDER_FILTER.FAILED:
        return t('ORDERS.EMPTY_FAILED');
      default:
        return t('ORDERS.EMPTY');
    }
  }, [isError, selectedFilter, t]);

  const handleCompletePayment = useCallback(() => {
    // Placeholder until payment flow is wired.
  }, []);

  const handleTableScroll = useCallback(
    ({nativeEvent}) => {
      const {layoutMeasurement, contentOffset, contentSize} = nativeEvent;
      const isCloseToBottom =
        layoutMeasurement.height + contentOffset.y >= contentSize.height - 40;

      if (isCloseToBottom) {
        handleLoadMore();
      }
    },
    [handleLoadMore],
  );

  return (
    <ScreenContainer noPaddingTop noPaddingBottom>
      <ScreenHeader
        title={t('ORDERS.TITLE')}
        subtitle={t('ORDERS.SUBTITLE')}
        onBack={() => navigation.goBack()}
      />

      <View style={[styles.screen, {paddingBottom: insets.bottom || 8}]}>
        {isLoading ? (
          <OrdersSkeleton />
        ) : (
          <ScrollView
            style={styles.screen}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}>
            <View style={styles.summaryGrid}>
              <SummaryCard
                label={t('ORDERS.TOTAL_ORDERS')}
                value={String(summary.totalOrders)}
                Icon={BagIcon}
              />
              <SummaryCard
                label={t('ORDERS.ACTIVE_ORDERS')}
                value={String(summary.activeOrders)}
                Icon={TruckIcon}
              />
              <SummaryCard
                label={t('ORDERS.DELIVERED')}
                value={String(summary.delivered)}
                Icon={CheckCircleIcon}
              />
              <SummaryCard
                label={t('ORDERS.TOTAL_SPEND')}
                value={formatCurrency(summary.totalSpend)}
                Icon={RupeeIcon}
              />
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filtersScroll}
              contentContainerStyle={styles.filtersContent}>
              {filterOptions.map(option => {
                const isActive = selectedFilter === option.value;
                const isFailed = option.value === ORDER_FILTER.FAILED;

                return (
                  <TouchableOpacity
                    key={option.value}
                    accessibilityRole="button"
                    onPress={() => handleFilterChange(option.value)}
                    style={[
                      styles.filterChip,
                      isActive && styles.filterChipActive,
                      isActive && isFailed && styles.filterChipFailedActive,
                    ]}>
                    <StyledText
                      textStyle={{marginTop: 2}}
                      color={isActive ? COLORS.WHITE : COLORS.TEXT}
                      size={13}
                      variant={isActive ? 'semiBold' : 'regular'}>
                      {option.label}
                    </StyledText>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <View style={styles.tableCard}>
              <ScrollView
                style={styles.tableVerticalScroll}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled
                onScroll={handleTableScroll}
                scrollEventThrottle={16}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  nestedScrollEnabled>
                  <View style={styles.tableContent}>
                    <View style={styles.tableHeader}>
                      <View style={styles.colOrder}>
                        <StyledText
                          color={COLORS.TEXT_SECONDARY}
                          size={12}
                          variant="semiBold"
                          textStyle={styles.tableHeaderText}>
                          {t('ORDERS.COL_ORDER')}
                        </StyledText>
                      </View>
                      <View style={styles.colDate}>
                        <StyledText
                          color={COLORS.TEXT_SECONDARY}
                          size={12}
                          variant="semiBold"
                          textStyle={styles.tableHeaderText}>
                          {t('ORDERS.COL_DATE')}
                        </StyledText>
                      </View>
                      <View style={styles.colItems}>
                        <StyledText
                          color={COLORS.TEXT_SECONDARY}
                          size={12}
                          variant="semiBold"
                          textStyle={styles.tableHeaderText}>
                          {t('ORDERS.COL_ITEMS')}
                        </StyledText>
                      </View>
                      <View style={styles.colMoney}>
                        <StyledText
                          color={COLORS.TEXT_SECONDARY}
                          size={12}
                          variant="semiBold"
                          textStyle={styles.tableHeaderText}>
                          {t('ORDERS.COL_SUBTOTAL')}
                        </StyledText>
                      </View>
                      <View style={styles.colMoney}>
                        <StyledText
                          color={COLORS.TEXT_SECONDARY}
                          size={12}
                          variant="semiBold"
                          textStyle={styles.tableHeaderText}>
                          {t('ORDERS.COL_CGST')}
                        </StyledText>
                      </View>
                      <View style={styles.colMoney}>
                        <StyledText
                          color={COLORS.TEXT_SECONDARY}
                          size={12}
                          variant="semiBold"
                          textStyle={styles.tableHeaderText}>
                          {t('ORDERS.COL_SGST')}
                        </StyledText>
                      </View>
                      <View style={styles.colMoney}>
                        <StyledText
                          color={COLORS.TEXT_SECONDARY}
                          size={12}
                          variant="semiBold"
                          textStyle={styles.tableHeaderText}>
                          {t('ORDERS.COL_TOTAL')}
                        </StyledText>
                      </View>
                      <View style={styles.colPayment}>
                        <StyledText
                          color={COLORS.TEXT_SECONDARY}
                          size={12}
                          variant="semiBold"
                          textStyle={styles.tableHeaderText}>
                          {t('ORDERS.COL_PAYMENT')}
                        </StyledText>
                      </View>
                      <View style={styles.colActions}>
                        <StyledText
                          color={COLORS.TEXT_SECONDARY}
                          size={12}
                          variant="semiBold"
                          textStyle={styles.tableHeaderText}>
                          {t('ORDERS.COL_ACTIONS')}
                        </StyledText>
                      </View>
                    </View>

                    {orders.length ? (
                      orders.map(order => (
                        <View key={order.id} style={styles.tableRow}>
                          <View style={styles.colOrder}>
                            <StyledText variant="bold" size={13}>
                              {order.shortId}
                            </StyledText>
                            <StyledText
                              color={COLORS.TEXT_MUTED}
                              size={11}
                              numberOfLines={1}
                              containerStyle={styles.orderIdSecondary}>
                              {order.reference}
                            </StyledText>
                          </View>
                          <View style={styles.colDate}>
                            <StyledText color={COLORS.TEXT_SECONDARY} size={13}>
                              {order.date}
                            </StyledText>
                          </View>
                          <View style={styles.colItems}>
                            <StyledText variant="bold" size={13}>
                              {order.items}
                            </StyledText>
                          </View>
                          <View style={styles.colMoney}>
                            <StyledText size={13}>
                              {formatCurrency(order.subtotal)}
                            </StyledText>
                          </View>
                          <View style={styles.colMoney}>
                            <StyledText size={13}>
                              {formatCurrency(order.cgst)}
                            </StyledText>
                          </View>
                          <View style={styles.colMoney}>
                            <StyledText size={13}>
                              {formatCurrency(order.sgst)}
                            </StyledText>
                          </View>
                          <View style={styles.colMoney}>
                            <StyledText variant="bold" size={13}>
                              {formatCurrency(order.total)}
                            </StyledText>
                          </View>
                          <View style={styles.colPayment}>
                            <View style={styles.paymentBadge}>
                              <StyledText size={12} variant="semiBold">
                                {getPaymentLabel(order.paymentStatus)}
                              </StyledText>
                            </View>
                          </View>
                          <View style={styles.colActions}>
                            {order.paymentStatus === 'pending' ? (
                              <TouchableOpacity
                                accessibilityRole="button"
                                onPress={handleCompletePayment}
                                style={styles.actionButton}>
                                <StyledText
                                  color={COLORS.WHITE}
                                  size={12}
                                  variant="semiBold">
                                  {t('ORDERS.COMPLETE_PAYMENT')}
                                </StyledText>
                              </TouchableOpacity>
                            ) : null}
                          </View>
                        </View>
                      ))
                    ) : (
                      <View style={styles.emptyState}>
                        <StorefrontIcon color={COLORS.TEXT_MUTED} size={52} />
                        <StyledText
                          color={COLORS.TEXT_SECONDARY}
                          size={16}
                          variant="semiBold"
                          containerStyle={styles.emptyTitle}>
                          {emptyTitle}
                        </StyledText>
                        {!isError ? (
                          <StyledText color={COLORS.TEXT_MUTED} size={13}>
                            {t('ORDERS.EMPTY_HINT')}
                          </StyledText>
                        ) : null}
                      </View>
                    )}

                    {isFetchingMore ? (
                      <View style={styles.footerLoader}>
                        <ActivityIndicator color={COLORS.LOGIN_PRIMARY} />
                      </View>
                    ) : null}
                  </View>
                </ScrollView>
              </ScrollView>
            </View>
          </ScrollView>
        )}
      </View>
    </ScreenContainer>
  );
};

export default OrdersScreen;
