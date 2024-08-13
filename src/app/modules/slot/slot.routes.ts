import { Router } from "express";
import validationGuard from "../../middlewares/validationGuard";
import { slotValidation } from "./slot.validation";
import { authGuard } from "../../middlewares/authGurad";
import { SlotControllers } from "./slot.controllers";

const router = Router()

router.post("/services/slots", validationGuard(slotValidation.SlotSchema), authGuard(["admin"]), SlotControllers.createSlots)

router.get("/slots/availability", SlotControllers.getAvailableSlots)

export const SlotRoutes = router