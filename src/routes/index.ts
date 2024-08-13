import { Router } from "express";
import { AuthRouter } from "../app/modules/auth/auth.routes";
import { OurServiceRoutes } from "../app/modules/ourService/ourServices.routes";
import { SlotRoutes } from "../app/modules/slot/slot.routes";
import { BookingRouter } from "../app/modules/booking/booking.routes";

const router = Router();

const routes = [
  {
    root: "/auth",
    endpoints: AuthRouter,
  },
  {
    root: "/services",
    endpoints: OurServiceRoutes,
  },
  {
    root: "/",
    endpoints: SlotRoutes,
  },
  {
    root: "/",
    endpoints: BookingRouter,
  },

];

routes.forEach((item) => router.use(item.root, item.endpoints));
export const ApplicationRoutes = router;
