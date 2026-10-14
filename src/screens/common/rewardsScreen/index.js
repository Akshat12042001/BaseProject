import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {ScrollView, View} from 'react-native';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {Dropdown} from 'react-native-element-dropdown';
import Skeleton from 'react-native-reanimated-skeleton';
import {ScreenContainer, StyledText} from '../../../components/atoms';
import {ScreenHeader} from '../../../components/molecules';
import {
  TrendDownIcon,
  TrendUpIcon,
  TrophyIcon,
} from '../../../components/svgs';
import {COLORS, FONTS, SCREEN} from '../../../constants';
import {
  makeGetRewardsRequest,
  makeGetRewardsSummaryRequest,
} from '../../../api/common';
import {
  mapRewardsTransaction,
  getRewardsSummary,
  getRewardsTransactions,
  REWARDS_FILTER,
  REWARDS_TRANSACTION_TYPE,
} from '../../../utils/rewards';
import styles from './styles';

const buildTransactionsQuery = referenceType => {
  const params = {page: 1, limit: 20};

  if (referenceType && referenceType !== REWARDS_FILTER.ALL) {
    params.referenceType = referenceType;
  }

  return params;
};

const SUMMARY_CARD_WIDTH = (SCREEN.WIDTH - 24 - 16) / 3;

const SUMMARY_SKELETON_LAYOUT = [
  {
    key: 'summary-row',
    flexDirection: 'row',
    justifyContent: 'space-between',
    children: [
      {
        key: 'summary-0',
        width: SUMMARY_CARD_WIDTH,
        height: 110,
        borderRadius: 12,
      },
      {
        key: 'summary-1',
        width: SUMMARY_CARD_WIDTH,
        height: 110,
        borderRadius: 12,
      },
      {
        key: 'summary-2',
        width: SUMMARY_CARD_WIDTH,
        height: 110,
        borderRadius: 12,
      },
    ],
  },
];

const TABLE_SKELETON_LAYOUT = Array.from({length: 6}, (_, index) => ({
  key: `table-row-${index}`,
  width: SCREEN.WIDTH - 48,
  height: 48,
  borderRadius: 8,
  marginBottom: 10,
}));

const getTypeBadgeStyle = type => {
  switch (type) {
    case REWARDS_TRANSACTION_TYPE.USED:
      return {
        backgroundColor: '#D14343',
        textColor: COLORS.WHITE,
      };
    case REWARDS_TRANSACTION_TYPE.EARNED:
      return {
        backgroundColor: COLORS.LOGIN_PRIMARY,
        textColor: COLORS.WHITE,
      };
    case REWARDS_TRANSACTION_TYPE.ADJUSTMENT:
    default:
      return {
        backgroundColor: COLORS.GREYSCALE_200,
        textColor: COLORS.GREYSCALE_900,
      };
  }
};

const formatPoints = points => {
  const amount = Number(points) || 0;
  if (amount > 0) {
    return `+${amount}`;
  }
  return `${amount}`;
};

const SummaryCard = ({
  label,
  value,
  valueColor,
  iconBackground,
  iconColor,
  Icon,
}) => (
  <View style={styles.summaryCard}>
    <View style={[styles.summaryIconWrap, {backgroundColor: iconBackground}]}>
      <Icon color={iconColor} size={16} />
    </View>
    <StyledText
      color={COLORS.TEXT_SECONDARY}
      size={9}
      numberOfLines={2}
      textStyle={styles.summaryLabel}>
      {label}
    </StyledText>
    <StyledText
      variant="bold"
      size={20}
      color={valueColor}
      textStyle={styles.summaryValue}>
      {value}
    </StyledText>
  </View>
);

const RewardsScreen = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const [selectedType, setSelectedType] = useState(REWARDS_FILTER.ALL);
  const [isTypeFocused, setIsTypeFocused] = useState(false);
  const [isSummaryLoading, setIsSummaryLoading] = useState(true);
  const [isTransactionsLoading, setIsTransactionsLoading] = useState(true);
  const [summary, setSummary] = useState({
    availablePoints: 0,
    totalEarned: 0,
    totalUsed: 0,
  });
  const [transactions, setTransactions] = useState([]);

  const typeOptions = useMemo(
    () => [
      {label: t('REWARDS.ALL_TYPES'), value: REWARDS_FILTER.ALL},
      {label: t('REWARDS.DEAL_REWARDS'), value: REWARDS_FILTER.DEAL_REWARDS},
      {
        label: t('REWARDS.ORDER_REDEMPTION'),
        value: REWARDS_FILTER.ORDER_REDEMPTION,
      },
    ],
    [t],
  );

  const fetchSummary = useCallback(async () => {
    try {
      setIsSummaryLoading(true);
      const summaryResponse = await makeGetRewardsSummaryRequest();
      setSummary(getRewardsSummary(summaryResponse));
    } catch (error) {
      setSummary({
        availablePoints: 0,
        totalEarned: 0,
        totalUsed: 0,
      });
    } finally {
      setIsSummaryLoading(false);
    }
  }, []);

  const fetchTransactions = useCallback(async referenceType => {
    try {
      setIsTransactionsLoading(true);
      const transactionsResponse = await makeGetRewardsRequest(
        buildTransactionsQuery(referenceType),
      );
      setTransactions(
        getRewardsTransactions(transactionsResponse).map(mapRewardsTransaction),
      );
    } catch (error) {
      setTransactions([]);
    } finally {
      setIsTransactionsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isFocused) {
      return;
    }
    fetchSummary();
  }, [fetchSummary, isFocused]);

  useEffect(() => {
    if (!isFocused) {
      return;
    }
    fetchTransactions(selectedType);
  }, [fetchTransactions, isFocused, selectedType]);

  const getTypeLabel = useCallback(
    type => {
      switch (type) {
        case REWARDS_TRANSACTION_TYPE.USED:
          return t('REWARDS.TYPE_USED');
        case REWARDS_TRANSACTION_TYPE.ADJUSTMENT:
          return t('REWARDS.TYPE_ADJUSTMENT');
        case REWARDS_TRANSACTION_TYPE.EARNED:
          return t('REWARDS.TYPE_EARNED');
        default:
          return type;
      }
    },
    [t],
  );

  const handleTypeChange = useCallback(item => {
    if (item?.value) {
      setSelectedType(item.value);
    }
  }, []);

  const renderTableHeader = () => (
    <View style={styles.tableHeader}>
      <View style={styles.colDate}>
        <StyledText
          color={COLORS.TEXT_MUTED}
          size={10}
          variant="semiBold"
          textStyle={styles.tableHeaderText}>
          {t('REWARDS.DATE')}
        </StyledText>
      </View>
      <View style={styles.colType}>
        <StyledText
          color={COLORS.TEXT_MUTED}
          size={10}
          variant="semiBold"
          textStyle={styles.tableHeaderText}>
          {t('REWARDS.TYPE')}
        </StyledText>
      </View>
      <View style={styles.colPoints}>
        <StyledText
          color={COLORS.TEXT_MUTED}
          size={10}
          variant="semiBold"
          textStyle={styles.tableHeaderText}>
          {t('REWARDS.POINTS')}
        </StyledText>
      </View>
      <View style={styles.colDescription}>
        <StyledText
          color={COLORS.TEXT_MUTED}
          size={10}
          variant="semiBold"
          textStyle={styles.tableHeaderText}>
          {t('REWARDS.DESCRIPTION')}
        </StyledText>
      </View>
      <View style={styles.colExpiry}>
        <StyledText
          color={COLORS.TEXT_MUTED}
          size={10}
          variant="semiBold"
          textStyle={styles.tableHeaderText}>
          {t('REWARDS.EXPIRY')}
        </StyledText>
      </View>
      <View style={styles.colBalance}>
        <StyledText
          color={COLORS.TEXT_MUTED}
          size={10}
          variant="semiBold"
          textStyle={styles.tableHeaderText}>
          {t('REWARDS.BALANCE_AFTER')}
        </StyledText>
      </View>
    </View>
  );

  return (
    <ScreenContainer noPaddingBottom noPaddingTop>
      <ScreenHeader
        title={t('REWARDS.TITLE')}
        subtitle={t('REWARDS.SUBTITLE')}
        onBack={() => navigation.goBack()}
      />

      <View style={[styles.screen, {paddingBottom: insets.bottom || 8}]}>
        <Skeleton
          isLoading={isSummaryLoading}
          layout={SUMMARY_SKELETON_LAYOUT}
          boneColor={COLORS.SKELETON_BONE}
          highlightColor={COLORS.SKELETON_HIGHLIGHT}
          containerStyle={styles.summarySkeleton}>
          <View style={styles.summaryRow}>
            <SummaryCard
              label={t('REWARDS.AVAILABLE_POINTS')}
              value={String(summary.availablePoints)}
              valueColor="#2F6FED"
              iconBackground="#EAF1FF"
              iconColor="#2F6FED"
              Icon={TrophyIcon}
            />
            <SummaryCard
              label={t('REWARDS.TOTAL_EARNED')}
              value={String(summary.totalEarned)}
              valueColor={COLORS.LOGIN_PRIMARY}
              iconBackground="#EDF4EF"
              iconColor={COLORS.LOGIN_PRIMARY}
              Icon={TrendUpIcon}
            />
            <SummaryCard
              label={t('REWARDS.TOTAL_USED')}
              value={String(summary.totalUsed)}
              valueColor="#D46D58"
              iconBackground="#FDEFEA"
              iconColor="#D46D58"
              Icon={TrendDownIcon}
            />
          </View>
        </Skeleton>

        <View style={styles.filterRow}>
          <View style={styles.dropdown}>
            <StyledText
              color={
                isTypeFocused ? COLORS.LOGIN_PRIMARY : COLORS.GREYSCALE_500
              }
              size={11}
              containerStyle={styles.dropdownLabel}>
              {t('REWARDS.TYPE')}
            </StyledText>
            <Dropdown
              data={typeOptions}
              labelField="label"
              valueField="value"
              value={selectedType}
              disable={isTransactionsLoading}
              onFocus={() => setIsTypeFocused(true)}
              onBlur={() => setIsTypeFocused(false)}
              onChange={handleTypeChange}
              maxHeight={180}
              dropdownPosition="auto"
              style={[
                styles.dropdownField,
                isTypeFocused && styles.dropdownFieldFocused,
              ]}
              placeholderStyle={styles.dropdownPlaceholder}
              selectedTextStyle={styles.dropdownSelectedText}
              itemTextStyle={styles.dropdownItemText}
              containerStyle={styles.dropdownList}
              activeColor="#EDF4EF"
              fontFamily={FONTS.regular}
            />
          </View>
        </View>

        <View style={styles.tableCard}>
          {isTransactionsLoading ? (
            <Skeleton
              isLoading
              layout={TABLE_SKELETON_LAYOUT}
              boneColor={COLORS.SKELETON_BONE}
              highlightColor={COLORS.SKELETON_HIGHLIGHT}
              containerStyle={styles.tableSkeleton}
            />
          ) : (
            <ScrollView
              style={styles.tableVerticalScroll}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                nestedScrollEnabled>
                <View style={styles.tableContent}>
                  {renderTableHeader()}

                  {transactions.length ? (
                    transactions.map(item => {
                      const badge = getTypeBadgeStyle(item.type);
                      const pointsColor =
                        item.points < 0 ? '#D14343' : COLORS.LOGIN_PRIMARY;

                      return (
                        <View key={item.id} style={styles.tableRow}>
                          <View style={styles.colDate}>
                            <StyledText size={12} numberOfLines={2}>
                              {item.date}
                            </StyledText>
                          </View>
                          <View style={styles.colType}>
                            <View
                              style={[
                                styles.typeBadge,
                                {backgroundColor: badge.backgroundColor},
                              ]}>
                              <StyledText
                                color={badge.textColor}
                                size={11}
                                variant="semiBold">
                                {getTypeLabel(item.type)}
                              </StyledText>
                            </View>
                          </View>
                          <View style={styles.colPoints}>
                            <StyledText
                              color={pointsColor}
                              size={13}
                              variant="semiBold">
                              {formatPoints(item.points)}
                            </StyledText>
                          </View>
                          <View style={styles.colDescription}>
                            <StyledText
                              size={12}
                              color={
                                item.category ===
                                REWARDS_FILTER.ORDER_REDEMPTION
                                  ? COLORS.LOGIN_PRIMARY
                                  : COLORS.TEXT
                              }
                              numberOfLines={2}>
                              {item.description}
                            </StyledText>
                          </View>
                          <View style={styles.colExpiry}>
                            <StyledText size={12} color={COLORS.TEXT_SECONDARY}>
                              {item.expiry || t('REWARDS.NO_EXPIRY')}
                            </StyledText>
                          </View>
                          <View style={styles.colBalance}>
                            <StyledText size={13} variant="bold">
                              {item.balanceAfter}
                            </StyledText>
                          </View>
                        </View>
                      );
                    })
                  ) : (
                    <View style={styles.emptyState}>
                      <StyledText color={COLORS.TEXT_SECONDARY} size={13}>
                        {t('REWARDS.EMPTY')}
                      </StyledText>
                    </View>
                  )}
                </View>
              </ScrollView>
            </ScrollView>
          )}
        </View>
      </View>
    </ScreenContainer>
  );
};

export default RewardsScreen;
