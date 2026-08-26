import moment from 'moment';
import ASSETS from '../constants/assets';

const TEMPLATE_IMAGES = {
  classic: ASSETS.IMAGES.CLASSIC,
  himalayan: ASSETS.IMAGES.HIMALAYAN,
  heritage: ASSETS.IMAGES.HERITAGE,
  minimal: ASSETS.IMAGES.MINIMAL,
  essential: ASSETS.IMAGES.ESSENTIAL,
};

export const getFoodMenus = response => {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  return [];
};

export const getMenuItemCount = menu =>
  (menu?.sections || []).reduce(
    (total, section) => total + (section?.items?.length || 0),
    0,
  );

export const getMenuTemplateImage = templateId =>
  TEMPLATE_IMAGES[String(templateId || '').toLowerCase()] ||
  ASSETS.IMAGES.CLASSIC;

export const formatMenuUpdatedAt = value => {
  if (!value) {
    return '';
  }

  const date = moment(value);

  if (!date.isValid()) {
    return '';
  }

  return `Updated ${date.fromNow()}`;
};

export const formatMenuDescription = (menu, t) => {
  const templateKey = String(menu?.templateId || '').toUpperCase();
  const templateName =
    t(`CREATE_MENU.TEMPLATES.${templateKey}`, {
      defaultValue:
        templateKey.charAt(0) + templateKey.slice(1).toLowerCase(),
    }) || templateKey;
  const itemCount = getMenuItemCount(menu);
  const itemsLabel = t(
    itemCount === 1 ? 'MENU.ITEM_COUNT_ONE' : 'MENU.ITEM_COUNT_OTHER',
    {count: itemCount},
  );

  return `${templateName} · ${itemsLabel}`;
};

const mapMenuItem = item => ({
  id: String(item.id),
  name: item.name || '',
  price:
    item.price === null || item.price === undefined ? '' : String(item.price),
  isNonVeg: Boolean(item.isNonVeg),
  isMustHave: Boolean(item.isMustHave),
});

export const formatMenuDetails = response => {
  const menu = response?.data || response || {};
  const sections = Array.isArray(menu.sections) ? menu.sections : [];

  return {
    id: menu.id || '',
    title: menu.title || '',
    tagline: menu.tagline || '',
    phoneNumber: menu.phoneNumber || '',
    kitchenTiming: menu.kitchenTiming || '',
    logoUrl: menu.logoUrl || '',
    templateId: menu.templateId || null,
    isActive: Boolean(menu.isActive),
    metadata: {
      hostId: menu.hostId,
      createdAt: menu.createdAt,
      updatedAt: menu.updatedAt,
    },
    categories: sections.map(section => {
      const items = (section.items || []).map(mapMenuItem);

      return {
        id: String(section.id),
        name: section.title || '',
        items: items.length
          ? items
          : [
              {
                id: `item-${section.id}`,
                name: '',
                price: '',
                isNonVeg: false,
                isMustHave: false,
              },
            ],
      };
    }),
  };
};

export const buildMenuPayload = ({
  title,
  tagline,
  phoneNumber,
  kitchenTiming,
  templateId,
  categories,
}) => ({
  title: title.trim(),
  tagline: tagline.trim(),
  phoneNumber: phoneNumber.trim(),
  kitchenTiming: kitchenTiming.trim(),
  templateId,
  sections: categories
    .filter(category => category.name.trim())
    .map((category, sectionIndex) => ({
      title: category.name.trim(),
      sortOrder: sectionIndex,
      items: category.items
        .filter(item => item.name.trim())
        .map((item, itemIndex) => ({
          name: item.name.trim(),
          price: String(item.price ?? ''),
          isNonVeg: Boolean(item.isNonVeg),
          isMustHave: Boolean(item.isMustHave),
          sortOrder: itemIndex,
        })),
    })),
});
