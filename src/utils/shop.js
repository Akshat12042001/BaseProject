export const SHOP_PAGE_LIMIT = 12;

export const productCategories = [
  {
    value: 'conditioner',
    label: 'Conditioner',
  },
  {
    value: 'moisturizer',
    label: 'Moisturizer (Lotion)',
  },
  {
    value: 'shampoo',
    label: 'Shampoo',
  },
  {
    value: 'shower_gel',
    label: 'Shower Gel',
  },
  {
    value: 'soap',
    label: 'Soap',
  },
  {
    value: 'dental_kit',
    label: 'Dental Kit',
  },
  {
    value: 'Moisturizer',
    label: 'Moisturizer',
  },
];

export const getProductCategoryLabel = category => {
  const value = String(category || '').trim();
  if (!value) {
    return '';
  }

  const match = productCategories.find(
    item =>
      item.value.toLowerCase() === value.toLowerCase() ||
      item.label.toLowerCase() === value.toLowerCase(),
  );

  return match?.label || value;
};

export const getShopCatalogProducts = response => {
  if (Array.isArray(response)) {
    return response;
  }
  if (Array.isArray(response?.data)) {
    return response.data;
  }
  return [];
};

export const getShopCatalogMeta = response => ({
  page: Number(response?.page) || 1,
  limit: Number(response?.limit) || SHOP_PAGE_LIMIT,
  totalPages: Number(response?.totalPages) || 1,
  count: Number(response?.count) || 0,
});

export const getProductImageUrl = product => {
  const images = Array.isArray(product?.images) ? product.images : [];
  const featured =
    images.find(image => image?.isFeatured) || images[0] || null;

  // Prefer the base product image. `varient` is a branded overlay asset and can
  // show a blank logo placeholder on the bottle.
  return featured?.imageUrl || featured?.thumbnailUrl || featured?.varient || '';
};

export const getProductDiscountPercent = (price, compareAtPrice) => {
  const current = Number(price) || 0;
  const original = Number(compareAtPrice) || 0;

  if (!original || original <= current) {
    return 0;
  }

  return Math.round(((original - current) / original) * 100);
};

export const mapShopProduct = product => {
  const price = Number(product?.price) || 0;
  const originalPrice = Number(product?.compareAtPrice) || 0;

  return {
    id: product?.id,
    title: product?.name || '',
    description: product?.shortDescription || product?.description || '',
    category: getProductCategoryLabel(product?.category),
    imageUrl: getProductImageUrl(product),
    price,
    originalPrice,
    discountPercent: getProductDiscountPercent(price, originalPrice),
    exclGst: product?.IncludeGST !== true,
  };
};

export const buildShopCatalogParams = ({
  page = 1,
  limit = SHOP_PAGE_LIMIT,
  minPrice = 0,
  maxPrice = 10000,
  categories = [],
  sortBy = 'createdAt',
  sortOrder = 'DESC',
} = {}) => {
  const categoryList = Array.isArray(categories)
    ? categories.filter(Boolean)
    : [];

  return {
    page,
    limit,
    sortBy,
    sortOrder,
    minPrice: Number(minPrice) || 0,
    maxPrice: Number(maxPrice) || 0,
    categories: categoryList.join(','),
  };
};
