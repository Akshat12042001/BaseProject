import {
  BrushIcon,
  EyeOpen,
  ReceiptIcon,
  ShareIcon,
  TrashIcon,
} from '../../svgs';

export const BOOKING_MENU_ACTION = {
  PREVIEW: 'preview',
  SHARE: 'share',
  EDIT: 'edit',
  CREATE_BILL: 'createBill',
  DELETE: 'delete',
};

export const BOOKING_MENU_ITEMS = [
  {
    action: BOOKING_MENU_ACTION.PREVIEW,
    labelKey: 'BOOKING_LIST.MENU_PREVIEW',
    Icon: EyeOpen,
  },
  {
    action: BOOKING_MENU_ACTION.SHARE,
    labelKey: 'BOOKING_LIST.MENU_SHARE',
    Icon: ShareIcon,
  },
  {
    action: BOOKING_MENU_ACTION.EDIT,
    labelKey: 'BOOKING_LIST.MENU_EDIT',
    Icon: BrushIcon,
  },
  {
    action: BOOKING_MENU_ACTION.CREATE_BILL,
    labelKey: 'BOOKING_LIST.MENU_CREATE_BILL',
    Icon: ReceiptIcon,
  },
  {
    action: BOOKING_MENU_ACTION.DELETE,
    labelKey: 'BOOKING_LIST.MENU_DELETE',
    Icon: TrashIcon,
    destructive: true,
  },
];
