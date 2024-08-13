import { Router } from "express";
import validationGuard from "../../middlewares/validationGuard";
import { OurServiceValidation } from "./ourService.validation";
import { authGuard } from "../../middlewares/authGurad";
import { OurServiceControllers } from "./ourService.controllers";

const router = Router()
router.post("/", validationGuard(OurServiceValidation.serviceSchema), authGuard(["admin"]), OurServiceControllers.createService)

router.get("/", OurServiceControllers.getAllServices)

router.get("/:id", OurServiceControllers.getService)

router.put("/:id", validationGuard(OurServiceValidation.serviceUpdateSchema), authGuard(["admin"]), OurServiceControllers.updateService)

router.delete("/:id", authGuard(["admin"]), OurServiceControllers.deleteService)

export const OurServiceRoutes = router