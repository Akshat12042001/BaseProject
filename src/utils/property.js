export const getProperties = response =>
  Array.isArray(response?.data) ? response.data : [];

export const getPropertyImageUrl = property => {
  if (property?.primaryImageUrl) {
    return property.primaryImageUrl;
  }

  const images = Array.isArray(property?.images) ? property.images : [];
  const primaryImage = images.find(image => image?.isPrimary);

  return primaryImage?.imageUrl || images[0]?.imageUrl || '';
};

export const formatPropertyLocation = (city, state) =>
  [city, state].filter(Boolean).join(', ');

export const formatPropertyPrice = value => {
  const amount = Math.round(Number(value) || 0);
  return `₹${amount.toLocaleString('en-IN')}`;
};

export const formatPropertyStatus = status => {
  const normalizedStatus = String(status || '').trim();

  if (!normalizedStatus) {
    return '';
  }

  return normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1);
};

export const getPropertyCancellationLabel = property =>
  property?.cancellationPolicy?.name || '';
