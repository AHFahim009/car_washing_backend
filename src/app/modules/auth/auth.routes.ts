import { Router } from "express";
import validationGuard from "../../middlewares/validationGuard";
import { AuthValidation } from "./auth.validation";
import { AuthControllers } from "./auth.controllers";

const router = Router()
router.post("/signup", validationGuard(AuthValidation.UserSchema),
  AuthControllers.createUser
)
router.post("/login", validationGuard(AuthValidation.LoginSchema),
  AuthControllers.userLogin
)

export const AuthRouter = router