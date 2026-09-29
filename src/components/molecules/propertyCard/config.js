import {BrushIcon, EyeOpen, LoginEyeIcon, TrashIcon} from '../../svgs';

export const PROPERTY_CARD_ACTION = {
  PREVIEW: 'preview',
  VIEW_LISTING: 'viewListing',
  EDIT: 'edit',
  DELETE: 'delete',
};

export const PROPERTY_CARD_ITEMS = [
  {
    action: PROPERTY_CARD_ACTION.PREVIEW,
    labelKey: 'PROPERTIES.MENU_PREVIEW',
    Icon: LoginEyeIcon,
  },
  {
    action: PROPERTY_CARD_ACTION.VIEW_LISTING,
    labelKey: 'PROPERTIES.MENU_VIEW_LISTING',
    Icon: EyeOpen,
  },
  {
    action: PROPERTY_CARD_ACTION.EDIT,
    labelKey: 'PROPERTIES.MENU_EDIT',
    Icon: BrushIcon,
  },
  {
    action: PROPERTY_CARD_ACTION.DELETE,
    labelKey: 'PROPERTIES.MENU_DELETE',
    Icon: TrashIcon,
    destructive: true,
  },
];
