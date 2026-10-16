import { CalendarIcon, LogoutIcon, ShopIcon, SupportIcon } from "../../../components/svgs";
import { COLORS } from "../../../constants";

const DATA = [
  {
    id: 1,
    title: 'Bookings',
    icon:<CalendarIcon color={COLORS.PRIMARY} />
  },
  {
    id: 2,
    title: 'Support',
    icon:<SupportIcon color={COLORS.PRIMARY} size={20} />
  },
  {
    id: 4,
    title: 'Shop',
    icon:<ShopIcon color={COLORS.PRIMARY} size={20} />
  },
  {
    id: 3,
    title: 'Logout',
    icon:<LogoutIcon color={COLORS.RED_ERROR} size={20} />
  },
];

export default DATA;
