import { Router } from "express";
import { AamarPayControllers } from "./aamarPay.controller";

const router = Router();
router.post("/payment/finalize", AamarPayControllers.createPayment);
router.post("/success/callback", AamarPayControllers.handleSuccessCallback);
router.post("/fail/callback", AamarPayControllers.handleFailCallback);
router.post("/cancel/callback", AamarPayControllers.handleCancelCallback);

export const AamarPayRoutes = router;
