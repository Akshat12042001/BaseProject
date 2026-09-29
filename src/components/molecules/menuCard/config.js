import {
  BrushIcon,
  EyeOpen,
  ShareIcon,
  TrashIcon,
} from '../../svgs';

export const MENU_CARD_ACTION = {
  EDIT: 'edit',
  PREVIEW: 'preview',
  SHARE: 'share',
  DELETE: 'delete',
};

export const MENU_CARD_ITEMS = [
  {
    action: MENU_CARD_ACTION.EDIT,
    labelKey: 'MENU.MENU_EDIT',
    Icon: BrushIcon,
  },
  {
    action: MENU_CARD_ACTION.PREVIEW,
    labelKey: 'MENU.MENU_PREVIEW',
    Icon: EyeOpen,
  },
  {
    action: MENU_CARD_ACTION.SHARE,
    labelKey: 'MENU.MENU_SHARE',
    Icon: ShareIcon,
  },
  {
    action: MENU_CARD_ACTION.DELETE,
    labelKey: 'MENU.MENU_DELETE',
    Icon: TrashIcon,
    destructive: true,
  },
];
