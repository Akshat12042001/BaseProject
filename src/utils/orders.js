import moment from 'moment';

export const ORDERS_PAGE_LIMIT = 10;

export const ORDER_FILTER = {
  ALL: 'all',
  PENDING: 'pending',
  CONFIRMED: 'paid',
  PROCESSING: 'processing',
  FAILED: 'failed',
};

export const ACTIVE_ORDER_STATUSES = [
  'confirmed',
  'processing',
  'shipped',
];

export const getOrdersList = response => {
  if (Array.isArray(response)) {
    return response;
  }
  if (Array.isArray(response?.data)) {
    return response.data;
  }
  return [];
};

export const getOrdersMeta = response => ({
  page: Number(response?.meta?.page || response?.page) || 1,
  limit: Number(response?.meta?.limit || response?.limit) || ORDERS_PAGE_LIMIT,
  total: Number(response?.meta?.total || response?.count) || 0,
  totalPages: Number(response?.meta?.totalPages || response?.totalPages) || 1,
});

export const formatOrderShortId = orderId => {
  const value = String(orderId || '').replace(/-/g, '');
  if (!value) {
    return '—';
  }
  return `#${value.slice(0, 8).toUpperCase()}`;
};

export const formatOrderDate = value => {
  if (!value || !moment(value).isValid()) {
    return '—';
  }
  return moment(value).format('D MMM YYYY');
};

export const mapOrder = order => {
  const items = Array.isArray(order?.items) ? order.items : [];
  const status = String(order?.status || '').toLowerCase();
  const paymentStatus = String(order?.paymentStatus || '').toLowerCase();

  return {
    id: order?.id,
    shortId: formatOrderShortId(order?.id),
    reference: order?.orderNumber || '—',
    date: formatOrderDate(order?.placedAt || order?.createdAt),
    items: items.length,
    subtotal: Number(order?.subtotal) || 0,
    cgst: Number(order?.cgst) || 0,
    sgst: Number(order?.sgst) || 0,
    total: Number(order?.total) || 0,
    pointsDiscount: Number(order?.pointsDiscount) || 0,
    paymentStatus,
    status,
  };
};

export const getOrdersSummary = (orders, metaTotal) => {
  const list = Array.isArray(orders) ? orders : [];

  return {
    totalOrders: Number(metaTotal) || list.length,
    activeOrders: list.filter(order =>
      ACTIVE_ORDER_STATUSES.includes(order.status),
    ).length,
    delivered: list.filter(order => order.status === 'delivered').length,
    totalSpend: list.reduce((sum, order) => {
      const spend = Math.max(
        (Number(order.subtotal) || 0) - (Number(order.pointsDiscount) || 0),
        0,
      );
      return sum + spend;
    }, 0),
  };
};

export const buildMyOrdersParams = ({
  page = 1,
  limit = ORDERS_PAGE_LIMIT,
  status = ORDER_FILTER.ALL,
} = {}) => {
  const params = {
    page,
    limit,
  };

  if (status && status !== ORDER_FILTER.ALL) {
    params.status = status;
  }

  return params;
};
