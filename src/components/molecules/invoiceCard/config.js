import {
  BrushIcon,
  DollarCircleIcon,
  EyeOpen,
  ShareIcon,
  TrashIcon,
} from '../../svgs';

export const INVOICE_MENU_ACTION = {
  EDIT: 'edit',
  PREVIEW: 'preview',
  MARK_PAID: 'markPaid',
  SHARE: 'share',
  DELETE: 'delete',
};

export const INVOICE_MENU_ITEMS = [
  {
    action: INVOICE_MENU_ACTION.EDIT,
    labelKey: 'INVOICES.MENU_EDIT',
    Icon: BrushIcon,
  },
  {
    action: INVOICE_MENU_ACTION.PREVIEW,
    labelKey: 'INVOICES.MENU_PREVIEW',
    Icon: EyeOpen,
  },
  {
    action: INVOICE_MENU_ACTION.MARK_PAID,
    labelKey: 'INVOICES.MENU_MARK_PAID',
    Icon: DollarCircleIcon,
  },
  {
    action: INVOICE_MENU_ACTION.SHARE,
    labelKey: 'INVOICES.MENU_SHARE',
    Icon: ShareIcon,
  },
  {
    action: INVOICE_MENU_ACTION.DELETE,
    labelKey: 'INVOICES.MENU_DELETE',
    Icon: TrashIcon,
    destructive: true,
  },
];
