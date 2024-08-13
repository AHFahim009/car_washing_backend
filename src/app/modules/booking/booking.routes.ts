import { Router } from "express";
import { authGuard } from "../../middlewares/authGurad";
import { BookingControllers } from "./booking.controllers";
import validationGuard from "../../middlewares/validationGuard";
import { BookingValidation } from "./booking.validation";

const router = Router()

router.post("/bookings", validationGuard(BookingValidation.BookingSchema), authGuard(["user"]), BookingControllers.createBooking)
router.get("/bookings", authGuard(["admin"]), BookingControllers.getAllBookings)
router.get("/my-bookings", authGuard(["user"]), BookingControllers.getUserBookings)

export const BookingRouter = router