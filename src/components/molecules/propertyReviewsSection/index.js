import React, {memo, useCallback, useMemo, useState} from 'react';
import {ActivityIndicator, TouchableOpacity, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {StyledText} from '../../atoms';
import {StarIcon} from '../../svgs';
import {COLORS} from '../../../constants';
import {
  useGetHostPendingReviewsQuery,
  useGetPropertyReviewsQuery,
} from '../../../redux/tabs';
import {
  REVIEW_TABS,
  buildReviewsState,
  formatReviewRating,
  getFilteredReviews,
  getPropertyReviewSummary,
} from '../../../utils/propertyDetail';
import styles from './styles';

const SummaryItem = ({label, value, isRating = false}) => (
  <View style={styles.summaryItem}>
    <StyledText color={COLORS.TEXT_SECONDARY} size={12}>
      {label}
    </StyledText>
    {isRating && !value ? (
      <View style={styles.ratingDash} />
    ) : (
      <StyledText variant="bold" size={22} containerStyle={styles.summaryValue}>
        {value}
      </StyledText>
    )}
  </View>
);

const ReviewItem = ({review}) => (
  <View style={styles.reviewCard}>
    <View style={styles.reviewHeader}>
      <StyledText variant="semiBold" size={14}>
        {review.guestName}
      </StyledText>
      <View style={styles.reviewRatingRow}>
        <StarIcon color="#F5B301" size={12} />
        <StyledText variant="semiBold" size={13}>
          {formatReviewRating(review.rating)}
        </StyledText>
      </View>
    </View>
    <StyledText
      color={COLORS.TEXT_SECONDARY}
      size={13}
      textStyle={styles.reviewComment}>
      {review.comment}
    </StyledText>
  </View>
);

const PropertyReviewsSection = ({homestayId, hostId}) => {
  const {t} = useTranslation();
  const [activeTab, setActiveTab] = useState(REVIEW_TABS.PENDING);

  const skipPending = !homestayId;
  const isAllTab = activeTab === REVIEW_TABS.ALL;
  const skipApproved = !homestayId || !hostId || !isAllTab;

  const {
    data: pendingReviewsResponse,
    isLoading: isPendingReviewsLoading,
    isFetching: isPendingReviewsFetching,
  } = useGetHostPendingReviewsQuery(
    {
      homestayId,
      page: 1,
      limit: 10,
    },
    {skip: skipPending},
  );

  const {
    data: approvedReviewsResponse,
    isLoading: isApprovedReviewsLoading,
    isFetching: isApprovedReviewsFetching,
  } = useGetPropertyReviewsQuery(
    {
      homestayId,
      hostId,
      status: 'approved',
      isPublic: true,
      page: 1,
      limit: 10,
    },
    {skip: skipApproved},
  );

  const reviews = useMemo(
    () =>
      buildReviewsState(
        pendingReviewsResponse,
        isAllTab ? approvedReviewsResponse : null,
      ),
    [pendingReviewsResponse, approvedReviewsResponse, isAllTab],
  );

  const summary = useMemo(() => getPropertyReviewSummary({reviews}), [reviews]);
  const filteredReviews = useMemo(
    () => getFilteredReviews(reviews, activeTab),
    [reviews, activeTab],
  );

  const handleSelectPending = useCallback(() => {
    setActiveTab(REVIEW_TABS.PENDING);
  }, []);

  const handleSelectAll = useCallback(() => {
    setActiveTab(REVIEW_TABS.ALL);
  }, []);

  const isPendingTab = activeTab === REVIEW_TABS.PENDING;
  const isLoading = isPendingTab
    ? isPendingReviewsLoading || isPendingReviewsFetching
    : isApprovedReviewsLoading || isApprovedReviewsFetching;

  const emptyTitle = isPendingTab
    ? t('PROPERTY_DETAIL.NO_PENDING_REVIEWS')
    : t('PROPERTY_DETAIL.NO_REVIEWS');
  const emptyDescription = isPendingTab
    ? t('PROPERTY_DETAIL.NO_PENDING_REVIEWS_DESC')
    : t('PROPERTY_DETAIL.NO_REVIEWS_DESC');

  return (
    <View style={styles.section}>
      <StyledText variant="bold" size={18} containerStyle={styles.sectionTitle}>
        {t('PROPERTY_DETAIL.REVIEWS')}
      </StyledText>
      <StyledText
        color={COLORS.TEXT_SECONDARY}
        size={13}
        textStyle={styles.sectionSubtitle}>
        {t('PROPERTY_DETAIL.REVIEWS_SUBTITLE')}
      </StyledText>

      <View style={styles.summaryCard}>
        <SummaryItem
          label={t('PROPERTY_DETAIL.PENDING')}
          value={String(summary.pending)}
        />
        <View style={styles.summaryDivider} />
        <SummaryItem
          label={t('PROPERTY_DETAIL.PUBLISHED')}
          value={String(summary.published)}
        />
        <View style={styles.summaryDivider} />
        <SummaryItem
          label={t('PROPERTY_DETAIL.AVERAGE_RATING')}
          value={formatReviewRating(summary.averageRating)}
          isRating
        />
      </View>

      <View style={styles.tabSwitcher}>
        <TouchableOpacity
          accessibilityRole="button"
          onPress={handleSelectPending}
          style={[styles.tabButton, isPendingTab && styles.tabButtonActive]}>
          <StyledText
            color={isPendingTab ? COLORS.SURFACE : COLORS.TEXT}
            variant="semiBold"
            size={13}>
            {t('PROPERTY_DETAIL.PENDING')}
          </StyledText>
        </TouchableOpacity>
        <TouchableOpacity
          accessibilityRole="button"
          onPress={handleSelectAll}
          style={[styles.tabButton, !isPendingTab && styles.tabButtonActive]}>
          <StyledText
            color={!isPendingTab ? COLORS.SURFACE : COLORS.TEXT}
            variant="semiBold"
            size={13}>
            {t('PROPERTY_DETAIL.ALL_REVIEWS')}
          </StyledText>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingState}>
          <ActivityIndicator color={COLORS.LOGIN_PRIMARY} size="small" />
        </View>
      ) : filteredReviews.length ? (
        filteredReviews.map(review => (
          <ReviewItem key={review.id} review={review} />
        ))
      ) : (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon} />
          <StyledText
            variant="bold"
            size={16}
            containerStyle={styles.emptyTitle}>
            {emptyTitle}
          </StyledText>
          <StyledText
            color={COLORS.TEXT_SECONDARY}
            size={13}
            textStyle={styles.emptyDescription}>
            {emptyDescription}
          </StyledText>
        </View>
      )}
    </View>
  );
};

export default memo(PropertyReviewsSection);
