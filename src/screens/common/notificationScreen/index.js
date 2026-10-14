import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {ActivityIndicator, FlatList, RefreshControl, View} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import moment from 'moment';
import {useDispatch} from 'react-redux';
import {ScreenContainer, StyledText} from '../../../components/atoms';
import {NotificationCard, ScreenHeader} from '../../../components/molecules';
import {makeMarkNotificationReadRequest} from '../../../api/common';
import {COLORS} from '../../../constants';
import {tabsApi, useGetNotificationsQuery} from '../../../redux/tabs/api';
import {errorToast} from '../../../utils/alerts';
import styles from './styles';

const NOTIFICATION_QUERY = {limit: 10, page: 1};

const keyExtractor = item => item.id;

const ItemSeparator = () => <View style={styles.separator} />;

const NotificationRow = React.memo(
  ({item, sender, readLabel, onPress}) => {
    const isUnread = item?.status === false;

    const handlePress = useCallback(() => {
      onPress(item);
    }, [item, onPress]);

    return (
      <NotificationCard
        isUnread={isUnread}
        sender={sender}
        date={formatNotificationDate(item.createdAt)}
        title={item.title || ''}
        readLabel={isUnread ? '' : readLabel}
        onPress={handlePress}
      />
    );
  },
);

const formatNotificationDate = value => {
  const date = moment(value);
  return date.isValid() ? date.format('D MMM') : '';
};

const NotificationScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const [markingId, setMarkingId] = useState(null);
  const [isPullRefreshing, setIsPullRefreshing] = useState(false);
  const {data, isLoading, isFetching, refetch} = useGetNotificationsQuery(
    NOTIFICATION_QUERY,
  );

  const notifications = data?.data || [];

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const handleRefresh = useCallback(() => {
    setIsPullRefreshing(true);
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (!isFetching && isPullRefreshing) {
      setIsPullRefreshing(false);
    }
  }, [isFetching, isPullRefreshing]);

  const getReadLabel = useCallback(
    readAt => {
      const readDate = moment(readAt);
      if (!readDate.isValid()) {
        return '';
      }

      if (readDate.isSame(moment(), 'day')) {
        return t('NOTIFICATION.READ_TODAY');
      }

      if (readDate.isSame(moment().subtract(1, 'day'), 'day')) {
        return t('NOTIFICATION.READ_YESTERDAY');
      }

      return t('NOTIFICATION.READ_ON', {date: readDate.format('D MMM')});
    },
    [t],
  );

  const handlePressNotification = useCallback(
    async item => {
      if (!item?.id || markingId) {
        return;
      }

      try {
        setMarkingId(item.id);
        await makeMarkNotificationReadRequest(item.id);
        dispatch(
          tabsApi.util.updateQueryData(
            'getNotifications',
            NOTIFICATION_QUERY,
            draft => {
              const notification = draft?.data?.find(
                entry => entry.id === item.id,
              );

              if (!notification) {
                return;
              }

              notification.status = true;
              notification.readAt = moment().format('YYYY-MM-DD');
            },
          ),
        );
      } catch (error) {
        if (!error?.response) {
          errorToast(t('NOTIFICATION.MARK_READ_FAILED'));
        }
      } finally {
        setMarkingId(null);
      }
    },
    [dispatch, markingId, t],
  );

  const renderItem = useCallback(
    ({item}) => (
      <NotificationRow
        item={item}
        sender={t('NOTIFICATION.SENDER')}
        readLabel={getReadLabel(item.readAt)}
        onPress={handlePressNotification}
      />
    ),
    [getReadLabel, handlePressNotification, t],
  );

  const listEmpty = useMemo(() => {
    if ((isLoading || isFetching) && !isPullRefreshing) {
      return (
        <View style={styles.empty}>
          <ActivityIndicator color={COLORS.LOGIN_PRIMARY} />
        </View>
      );
    }

    return (
      <View style={styles.empty}>
        <StyledText color={COLORS.GREYSCALE_500} size={14} textAlign="center">
          {t('NOTIFICATION.EMPTY')}
        </StyledText>
      </View>
    );
  }, [isFetching, isLoading, isPullRefreshing, t]);

  return (
    <ScreenContainer noPaddingTop noPaddingBottom>
      <ScreenHeader
        title={t('NOTIFICATION.TITLE')}
        backAccessibilityLabel={t('NOTIFICATION.BACK')}
        onBack={handleBack}
      />
      <FlatList
        data={notifications}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
        ListEmptyComponent={listEmpty}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isPullRefreshing}
            onRefresh={handleRefresh}
            tintColor={COLORS.LOGIN_PRIMARY}
            colors={[COLORS.LOGIN_PRIMARY]}
          />
        }
      />
    </ScreenContainer>
  );
};

export default NotificationScreen;
