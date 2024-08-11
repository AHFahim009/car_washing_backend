import { Router } from "express";
import validationGuard from "../../middlewares/validationGuard";
import { OurServiceValidation } from "./ourService.validation";
import { authGuard } from "../../middlewares/authGurad";
import { OurServiceControllers } from "./ourService.controllers";

const router = Router()
router.post("/", validationGuard(OurServiceValidation.serviceSchema), authGuard(["admin"]), OurServiceControllers.createService)

export const OurServiceRoutes = router