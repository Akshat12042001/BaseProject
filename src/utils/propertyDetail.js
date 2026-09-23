export const getPropertyDetailData = response => response?.data || response || {};

export const normalizePropertyDetail = property => {
  const host = property?.host;

  return {
    ...property,
    host: host
      ? {
          ...host,
          languages: host.languages || host.profile?.languages || [],
          tagline: host.tagline || host.bio || '',
        }
      : null,
  };
};

export const formatPropertyType = type =>
  String(type || '')
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

export const getDescriptionSections = description => {
  const text = String(description || '').trim();
  const marker = '\n\nThe space\n';
  const markerIndex = text.indexOf(marker);

  if (markerIndex === -1) {
    return {
      overview: text,
      sectionTitle: '',
      sectionBody: '',
    };
  }

  return {
    overview: text.slice(0, markerIndex).trim(),
    sectionTitle: 'The space',
    sectionBody: text.slice(markerIndex + marker.length).trim(),
  };
};

export const formatListingQuestionChip = question => {
  if (!question?.enabled) {
    return '';
  }

  switch (question.id) {
    case 'distance_from_main_town':
      return `${question.question}: ${question.answer} ${question.distanceType}`;
    case 'off_road':
      if (question.booleanAnswer && question.subQuestion?.answer) {
        return `${question.question}: ${question.subQuestion.answer} ${question.distanceType || 'm'}`;
      }
      return '';
    case 'walking_distance_from_parking':
      return `${question.question}: ${question.answer} ${question.distanceType}`;
    case 'parking':
      return `${question.question}: ${question.booleanAnswer ? 'Public' : 'Private'}`;
    case 'stairs_access':
      return `${question.question}: ${question.booleanAnswer ? 'Yes' : 'No'}`;
    case 'suitable_for': {
      const options = question.selectedOptions || [];
      if (!options.length) {
        return '';
      }
      if (options.length === 1) {
        return `${question.question}: ${options[0]}`;
      }
      const lastOption = options[options.length - 1];
      const restOptions = options.slice(0, -1).join(', ');
      return `${question.question}: ${restOptions} & ${lastOption}`;
    }
    default:
      return question.answer ? `${question.question}: ${question.answer}` : '';
  }
};

export const getListingQuestionRows = listingQuestions => {
  const chips = (listingQuestions || [])
    .map(question => ({
      id: question.id,
      icon: question.icon,
      text: formatListingQuestionChip(question),
      halfWidth: ['parking', 'stairs_access'].includes(question.id),
    }))
    .filter(chip => chip.text);

  const rows = [];
  let index = 0;

  while (index < chips.length) {
    const current = chips[index];
    const next = chips[index + 1];

    if (current.halfWidth && next?.halfWidth) {
      rows.push([current, next]);
      index += 2;
      continue;
    }

    rows.push([current]);
    index += 1;
  }

  return rows;
};

export const getPropertyAmenities = property =>
  (property?.amenities || property?.homestayAmenities || [])
    .map(item => {
      const amenity = item?.amenity || item;

      return {
        name: amenity?.name,
        icon: amenity?.icon,
      };
    })
    .filter(item => item?.name);

export const REVIEW_TABS = {
  PENDING: 'pending',
  ALL: 'all',
};

export const formatReviewRating = rating => {
  const value = Number(rating);

  if (!rating || Number.isNaN(value) || value <= 0) {
    return '';
  }

  return value % 1 === 0 ? String(value) : value.toFixed(1);
};

export const getReviewsList = response => {
  const items = response?.data;

  if (Array.isArray(items)) {
    return items;
  }

  if (Array.isArray(items?.data)) {
    return items.data;
  }

  return [];
};

export const getReviewsTotal = (response, list) =>
  response?.meta?.total ?? response?.data?.meta?.total ?? list.length;

export const mapReviewItem = review => ({
  id: review.id,
  guestName:
    review.guestName ||
    [review.guest?.firstName, review.guest?.lastName].filter(Boolean).join(' ') ||
    [review.user?.firstName, review.user?.lastName].filter(Boolean).join(' ') ||
    'Guest',
  rating: review.rating ?? review.overallRating ?? review.stars,
  comment: review.comment || review.reviewText || review.feedback || '',
});

export const calculateAverageRating = reviews => {
  const values = reviews
    .map(item => Number(item.rating))
    .filter(value => !Number.isNaN(value) && value > 0);

  if (!values.length) {
    return null;
  }

  const total = values.reduce((sum, value) => sum + value, 0);

  return total / values.length;
};

export const buildReviewsState = (pendingResponse, approvedResponse) => {
  const pending = getReviewsList(pendingResponse).map(mapReviewItem);
  const published = approvedResponse
    ? getReviewsList(approvedResponse).map(mapReviewItem)
    : [];

  return {
    pending,
    published,
    pendingTotal: getReviewsTotal(pendingResponse, pending),
    publishedTotal: approvedResponse
      ? getReviewsTotal(approvedResponse, published)
      : 0,
    averageRating: approvedResponse ? calculateAverageRating(published) : null,
  };
};

export const getPropertyReviewSummary = property => {
  const reviews = property?.reviews || {};

  return {
    pending: reviews.pendingTotal ?? reviews.pending?.length ?? 0,
    published: reviews.publishedTotal ?? reviews.published?.length ?? 0,
    averageRating: reviews.averageRating ?? null,
  };
};

export const getFilteredReviews = (reviews, activeTab) => {
  if (activeTab === REVIEW_TABS.PENDING) {
    return reviews?.pending || [];
  }

  return reviews?.published || [];
};

export const getHostDisplayName = host =>
  [host?.firstName, host?.lastName].filter(Boolean).join(' ');

export const getHostInitial = host => {
  const name = getHostDisplayName(host);

  return name.charAt(0).toUpperCase() || '?';
};

export const formatHostLanguages = languages =>
  (languages || []).filter(Boolean).join(', ');

export const getPropertyImages = (property, fallbackCount = 5) => {
  const images = (property?.images || [])
    .map(image => image?.imageUrl)
    .filter(Boolean);

  if (images.length) {
    return images;
  }

  return Array.from({length: fallbackCount}, () => property?.dummyImageUrl || '');
};
