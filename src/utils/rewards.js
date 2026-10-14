import moment from 'moment';

export const REWARDS_FILTER = {
  ALL: 'all',
  DEAL_REWARDS: 'deal',
  ORDER_REDEMPTION: 'order',
};

export const REWARDS_TRANSACTION_TYPE = {
  USED: 'used',
  ADJUSTMENT: 'adjustment',
  EARNED: 'earned',
};

export const getRewardsSummary = response => ({
  availablePoints:
    Number(
      response?.spendableBalance ??
        response?.balance ??
        response?.availablePoints ??
        0,
    ) || 0,
  totalEarned: Number(response?.totalEarned) || 0,
  totalUsed: Number(response?.totalUsed) || 0,
});

export const getRewardsTransactions = response => {
  if (Array.isArray(response)) {
    return response;
  }
  if (Array.isArray(response?.data)) {
    return response.data;
  }
  return [];
};

const normalizeTransactionType = type => {
  const value = String(type || '').toLowerCase();

  if (value === 'used') {
    return REWARDS_TRANSACTION_TYPE.USED;
  }
  if (value === 'earned') {
    return REWARDS_TRANSACTION_TYPE.EARNED;
  }
  if (value.includes('adjust')) {
    return REWARDS_TRANSACTION_TYPE.ADJUSTMENT;
  }

  return REWARDS_TRANSACTION_TYPE.ADJUSTMENT;
};

export const getDisplayPoints = item => {
  const points = Number(item?.points) || 0;
  const type = normalizeTransactionType(item?.transactionType);

  if (type === REWARDS_TRANSACTION_TYPE.USED) {
    return -Math.abs(points);
  }

  return points;
};

export const formatRewardsDate = value => {
  if (!value || !moment(value).isValid()) {
    return '—';
  }
  return moment(value).format('D MMM YYYY, hh:mm a');
};

export const formatRewardsExpiry = value => {
  if (!value || !moment(value).isValid()) {
    return null;
  }
  return moment(value).format('D MMM YYYY');
};

export const mapRewardsTransaction = item => {
  const category =
    item?.source?.kind || item?.referenceType || REWARDS_FILTER.DEAL_REWARDS;
  const type = normalizeTransactionType(item?.transactionType);
  const points = getDisplayPoints(item);

  return {
    id: item?.id,
    date: formatRewardsDate(item?.createdAt),
    type,
    points,
    description:
      item?.source?.label || item?.description || item?.referenceType || '—',
    expiry: formatRewardsExpiry(item?.expiresAt),
    balanceAfter: Number(item?.balanceAfter) || 0,
    category:
      category === 'order'
        ? REWARDS_FILTER.ORDER_REDEMPTION
        : category === 'deal'
        ? REWARDS_FILTER.DEAL_REWARDS
        : category,
  };
};
