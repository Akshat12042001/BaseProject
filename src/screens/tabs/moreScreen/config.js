import { CalendarIcon, LogoutIcon } from "../../../components/svgs";
import { COLORS } from "../../../constants";

const DATA = [
  {
    id: 1,
    title: 'Bookings',
    icon:<CalendarIcon color={COLORS.PRIMARY} />
  },
  {
    id: 2,
    title: 'Logout',
    icon:<LogoutIcon color={COLORS.RED_ERROR} size={20} />
  },
];

export default DATA;
