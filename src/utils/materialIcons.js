const LISTING_QUESTION_ICON_MAP = {
  LocationOnIcon: 'location-on',
  TerrainIcon: 'terrain',
  DirectionsWalkIcon: 'directions-walk',
  LocalParking: 'local-parking',
  SignpostIcon: 'signpost',
  GroupIcon: 'group',
};

const DEFAULT_ICON = 'category';

const toKebabCase = value =>
  String(value || '')
    .replace(/Icon$/, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/_/g, '-')
    .toLowerCase();

export const normalizeMaterialIconName = iconName => {
  if (!iconName) {
    return DEFAULT_ICON;
  }

  const trimmed = String(iconName).trim();

  if (LISTING_QUESTION_ICON_MAP[trimmed]) {
    return LISTING_QUESTION_ICON_MAP[trimmed];
  }

  if (trimmed.includes('_')) {
    return trimmed;
  }

  return toKebabCase(trimmed);
};
