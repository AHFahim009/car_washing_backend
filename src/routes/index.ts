import { Router } from "express";
import { AuthRouter } from "../app/modules/auth/auth.routes";
import { OurServiceRoutes } from "../app/modules/ourService/ourServices.routes";

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

];

routes.forEach((item) => router.use(item.root, item.endpoints));
export const ApplicationRoutes = router;
