import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {ActivityIndicator, FlatList, RefreshControl, TouchableOpacity, View} from 'react-native';
import moment from 'moment';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import Skeleton from 'react-native-reanimated-skeleton';
import {
  ActionLoadingOverlay,
  ScreenContainer,
  StyledText,
} from '../../../components/atoms';
import {BookingCalendarModal, DeleteBookingModal, PreviewBookingModal} from '../../../components/modals';
import {
  makeDeleteHostBookingRequest,
  makeGetBookingPreviewRequest,
} from '../../../api/common';
import {
  BookingCard,
  BookingFiltersSection,
  ScreenHeader,
} from '../../../components/molecules';
import {BOOKING_MENU_ACTION} from '../../../components/molecules/bookingCard';
import {COLORS, NAVIGATION, SCREEN} from '../../../constants';
import {useGetHostDirectBookingsQuery} from '../../../redux/tabs';
import useDebouncedValue from '../../../utils/useDebouncedValue';
import {errorToast, successToast} from '../../../utils/alerts';
import {
  BOOKING_LIST_FILTER_SCOPE,
  formatBookingPreviewResponse,
  formatHostDirectBookings,
  getHostDirectBookingsQueryParams,
} from '../../../utils/booking';
import {
  getDealSummaryShareTitle,
  shareDealSummary,
} from '../../../utils/shareDealSummary';
import styles from './styles';
import {PlusIcon} from '../../../components/svgs';

const PAGE_LIMIT = 10;
const POPOVER_CLOSE_DELAY_MS = 500;

const DATE_FIELD = {
  CHECK_IN_FROM: 'checkInFrom',
  CHECK_OUT_FROM: 'checkOutFrom',
};

const formatDisplayDate = date =>
  date ? moment(date).format('DD/MM/YYYY') : '';

const BOOKING_SKELETON_LAYOUT = Array.from({length: 3}, (_, index) => ({
  key: `booking-skeleton-${index}`,
  width: SCREEN.WIDTH - 32,
  height: 132,
  borderRadius: 16,
  marginBottom: index === 2 ? 0 : 12,
}));

const keyExtractor = item => item.id;

const ItemSeparator = () => <View style={styles.separator} />;

const BookingScreen = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [checkInFrom, setCheckInFrom] = useState(null);
  const [checkOutFrom, setCheckOutFrom] = useState(null);
  const [filterScope, setFilterScope] = useState(
    BOOKING_LIST_FILTER_SCOPE.ACTIVE_UPCOMING,
  );
  const [activeDateField, setActiveDateField] = useState(null);
  const [isPullRefreshing, setIsPullRefreshing] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deletingBookingId, setDeletingBookingId] = useState(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [previewTitle, setPreviewTitle] = useState('');
  const [sharingBookingId, setSharingBookingId] = useState(null);
  const [isPopoverLoading, setIsPopoverLoading] = useState(false);

  const debouncedSearch = useDebouncedValue(searchQuery, 400);

  const queryParams = useMemo(
    () =>
      getHostDirectBookingsQueryParams({
        page,
        limit: PAGE_LIMIT,
        search: debouncedSearch,
        checkInFrom,
        checkOutFrom,
        isActiveUpcoming:
          filterScope === BOOKING_LIST_FILTER_SCOPE.ACTIVE_UPCOMING,
      }),
    [checkInFrom, checkOutFrom, debouncedSearch, filterScope, page],
  );

  const {
    data: bookingsResponse,
    isError,
    isFetching,
    isLoading,
    refetch,
  } = useGetHostDirectBookingsQuery(queryParams);

  const bookings = useMemo(
    () => formatHostDirectBookings(bookingsResponse),
    [bookingsResponse],
  );

  const hasNextPage =
    (bookingsResponse?.meta?.page || page) <
    (bookingsResponse?.meta?.totalPages || 1);

  useEffect(() => {
    setPage(1);
  }, [checkInFrom, checkOutFrom, debouncedSearch, filterScope]);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleOpenCheckInFrom = useCallback(() => {
    setActiveDateField(DATE_FIELD.CHECK_IN_FROM);
  }, []);

  const handleOpenCheckOutFrom = useCallback(() => {
    setActiveDateField(DATE_FIELD.CHECK_OUT_FROM);
  }, []);

  const handleDateCancel = useCallback(() => {
    setActiveDateField(null);
  }, []);

  const handleDateClear = useCallback(() => {
    if (activeDateField === DATE_FIELD.CHECK_IN_FROM) {
      setCheckInFrom(null);
    } else if (activeDateField === DATE_FIELD.CHECK_OUT_FROM) {
      setCheckOutFrom(null);
    }
    setActiveDateField(null);
  }, [activeDateField]);

  const handleDateConfirm = useCallback(
    date => {
      if (activeDateField === DATE_FIELD.CHECK_IN_FROM) {
        setCheckInFrom(date);
        if (checkOutFrom && checkOutFrom < date) {
          setCheckOutFrom(null);
        }
      } else if (activeDateField === DATE_FIELD.CHECK_OUT_FROM) {
        setCheckOutFrom(date);
      }
      setActiveDateField(null);
    },
    [activeDateField, checkOutFrom],
  );

  const handleCloseDeleteModal = useCallback(() => {
    if (deletingBookingId) {
      return;
    }
    setDeleteTarget(null);
  }, [deletingBookingId]);

  const handleConfirmDeleteBooking = useCallback(async () => {
    const bookingId = deleteTarget?.id;
    if (!bookingId || deletingBookingId) {
      return;
    }

    try {
      setDeletingBookingId(bookingId);
      const response = await makeDeleteHostBookingRequest(bookingId);
      successToast(response?.message || t('BOOKING_LIST.DELETE_SUCCESS'));
      setDeleteTarget(null);

      if (page === 1) {
        refetch();
      } else {
        setPage(1);
      }
    } catch {
      // APIClient displays the server error toast.
    } finally {
      setDeletingBookingId(null);
    }
  }, [deleteTarget?.id, deletingBookingId, page, refetch, t]);

  const handleClosePreviewModal = useCallback(() => {
    setIsPreviewVisible(false);
    setPreviewData(null);
    setPreviewTitle('');
    setIsPreviewLoading(false);
  }, []);

  const handleOpenPreviewBooking = useCallback(
    async (bookingId, fallbackTitle = '') => {
      setPreviewTitle(fallbackTitle);
      setPreviewData(null);
      setIsPreviewVisible(true);
      setIsPreviewLoading(true);

      try {
        const response = await makeGetBookingPreviewRequest(bookingId);
        setPreviewData(formatBookingPreviewResponse(response));
      } catch {
        // APIClient displays the server error toast.
        setIsPreviewVisible(false);
        setPreviewData(null);
        setPreviewTitle('');
      } finally {
        setIsPreviewLoading(false);
      }
    },
    [],
  );

  const handleShareBooking = useCallback(
    async (bookingId, fallbackTitle = '') => {
      if (sharingBookingId) {
        return;
      }

      try {
        setSharingBookingId(bookingId);
        const response = await makeGetBookingPreviewRequest(bookingId);
        const data = formatBookingPreviewResponse(response);

        if (!data) {
          errorToast(t('BOOKING_LIST.SHARE_FAILED'));
          return;
        }

        await shareDealSummary(
          data,
          getDealSummaryShareTitle(data.propertyName || fallbackTitle),
        );
      } catch (error) {
        // APIClient already toasts API failures.
        if (!error?.response) {
          errorToast(t('BOOKING_LIST.SHARE_FAILED'));
        }
      } finally {
        setSharingBookingId(null);
      }
    },
    [sharingBookingId, t],
  );

  const handleBookingMenuAction = useCallback(
    (action, bookingId) => {
      const booking = bookings.find(item => item.id === bookingId);

      if (action === BOOKING_MENU_ACTION.PREVIEW) {
        setIsPopoverLoading(true);
        setTimeout(() => {
          setIsPopoverLoading(false);
          handleOpenPreviewBooking(bookingId, booking?.homestayTitle || '');
        }, POPOVER_CLOSE_DELAY_MS);
        return;
      }

      if (action === BOOKING_MENU_ACTION.SHARE) {
        setIsPopoverLoading(true);
        setTimeout(() => {
          handleShareBooking(bookingId, booking?.homestayTitle || '').finally(
            () => {
              setIsPopoverLoading(false);
            },
          );
        }, POPOVER_CLOSE_DELAY_MS);
        return;
      }

      if (action === BOOKING_MENU_ACTION.EDIT) {
        setTimeout(() => {
          navigation.navigate(NAVIGATION.COMMON.CREATE_BOOKING_SCREEN, {
            bookingId,
          });
        }, POPOVER_CLOSE_DELAY_MS);
        return;
      }

      if (action === BOOKING_MENU_ACTION.CREATE_BILL) {
        setTimeout(() => {
          navigation.navigate(NAVIGATION.COMMON.CREATE_INVOICE_SCREEN, {
            bookingId,
          });
        }, POPOVER_CLOSE_DELAY_MS);
        return;
      }

      if (action !== BOOKING_MENU_ACTION.DELETE) {
        return;
      }

      setTimeout(() => {
        setDeleteTarget({
          id: bookingId,
          guestName: booking?.guestName || '',
        });
      }, POPOVER_CLOSE_DELAY_MS);
    },
    [bookings, handleOpenPreviewBooking, handleShareBooking, navigation],
  );

  const renderBooking = useCallback(
    ({item}) => (
      <BookingCard
        id={item.id}
        homestayTitle={item.homestayTitle}
        guestName={item.guestName}
        guestPhone={item.guestPhone}
        checkIn={item.checkIn}
        checkOut={item.checkOut}
        offeredPrice={item.offeredPrice}
        adults={item.adults}
        onMenuAction={handleBookingMenuAction}
      />
    ),
    [handleBookingMenuAction],
  );

  const handleLoadMore = useCallback(() => {
    if (!isFetching && hasNextPage) {
      setPage(currentPage => currentPage + 1);
    }
  }, [hasNextPage, isFetching]);

  const handleRefresh = useCallback(() => {
    setIsPullRefreshing(true);
    if (page === 1) {
      refetch();
      return;
    }

    setPage(1);
  }, [page, refetch]);

  useEffect(() => {
    if (!isFetching && isPullRefreshing) {
      setIsPullRefreshing(false);
    }
  }, [isFetching, isPullRefreshing]);

  const showListSkeleton =
    (isLoading || (isFetching && page === 1)) && !isPullRefreshing;

  const listData = showListSkeleton ? [] : bookings;

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
    if (showListSkeleton) {
      return (
        <Skeleton
          isLoading
          layout={BOOKING_SKELETON_LAYOUT}
          boneColor={COLORS.SKELETON_BONE}
          highlightColor={COLORS.SKELETON_HIGHLIGHT}
          containerStyle={styles.skeletonContainer}
        />
      );
    }

    if (isError) {
      return (
        <View style={styles.emptyContainer}>
          <StyledText
            color={COLORS.TEXT_SECONDARY}
            size={13}
            textAlign="center"
            containerStyle={styles.emptyErrorText}>
            {t('BOOKING_LIST.LOAD_ERROR')}
          </StyledText>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyCard}>
          <View style={styles.emptyIcon} />
          <StyledText
            variant="bold"
            size={16}
            textAlign="center"
            containerStyle={styles.emptyTitle}>
            {t('BOOKING_LIST.EMPTY_TITLE')}
          </StyledText>
          <StyledText
            color={COLORS.TEXT_SECONDARY}
            size={13}
            textAlign="center"
            containerStyle={styles.emptyDescription}>
            {t('BOOKING_LIST.EMPTY_DESCRIPTION')}
          </StyledText>
        </View>
      </View>
    );
  }, [isError, showListSkeleton, t]);

  const listHeader = useMemo(
    () => (
      <BookingFiltersSection
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        checkInFromValue={formatDisplayDate(checkInFrom)}
        checkInToValue={formatDisplayDate(checkOutFrom)}
        onOpenCheckInFrom={handleOpenCheckInFrom}
        onOpenCheckInTo={handleOpenCheckOutFrom}
        filterScope={filterScope}
        onFilterScopeChange={setFilterScope}
      />
    ),
    [
      checkInFrom,
      checkOutFrom,
      filterScope,
      handleOpenCheckInFrom,
      handleOpenCheckOutFrom,
      searchQuery,
    ],
  );

  const calendarSelectedDate =
    activeDateField === DATE_FIELD.CHECK_OUT_FROM ? checkOutFrom : checkInFrom;

  const onAddBooking = useCallback(() => {
    navigation.navigate(NAVIGATION.COMMON.CREATE_BOOKING_SCREEN);
  }, [navigation]);

  return (
    <ScreenContainer noPaddingTop noPaddingBottom>
      <ScreenHeader
        title={t('BOOKING_LIST.TITLE')}
        backAccessibilityLabel={t('CREATE_BOOKING.BACK')}
        onBack={handleBack}
        rightComponent={
          <TouchableOpacity
            onPress={onAddBooking}
            style={styles.headerIconButton}>
            <PlusIcon color={COLORS.WHITE} size={18} />
          </TouchableOpacity>
        }
      />

      <View style={styles.flex}>
        <FlatList
          data={listData}
          style={styles.list}
          renderItem={renderBooking}
          keyExtractor={keyExtractor}
          ItemSeparatorComponent={ItemSeparator}
          ListHeaderComponent={listHeader}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.4}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl
              refreshing={isPullRefreshing}
              onRefresh={handleRefresh}
              tintColor={COLORS.LOGIN_PRIMARY}
              colors={[COLORS.LOGIN_PRIMARY]}
            />
          }
        />
      </View>

      <DeleteBookingModal
        guestName={deleteTarget?.guestName}
        isDeleting={!!deletingBookingId}
        isVisible={!!deleteTarget}
        onCancel={handleCloseDeleteModal}
        onConfirm={handleConfirmDeleteBooking}
      />

      <PreviewBookingModal
        data={previewData}
        fallbackTitle={previewTitle}
        isLoading={isPreviewLoading}
        isVisible={isPreviewVisible}
        onClose={handleClosePreviewModal}
      />

      <ActionLoadingOverlay
        visible={isPopoverLoading || !!sharingBookingId}
      />

      <BookingCalendarModal
        isVisible={!!activeDateField}
        title={
          activeDateField === DATE_FIELD.CHECK_OUT_FROM
            ? t('BOOKING_LIST.CHECK_IN_TO')
            : t('BOOKING_LIST.CHECK_IN_FROM')
        }
        selectedDate={calendarSelectedDate}
        allowAnyDate
        unavailableDates={[]}
        useClearAction
        onConfirm={handleDateConfirm}
        onClear={handleDateClear}
        onClose={handleDateCancel}
      />
    </ScreenContainer>
  );
};

export default BookingScreen;
