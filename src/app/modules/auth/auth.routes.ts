import { Router } from "express";
import validationGuard from "../../middlewares/validationGuard";
import { AuthValidation } from "./auth.validation";
import { AuthControllers } from "./auth.controllers";
import upload from "../../middlewares/multer";
import { authGuard } from "../../middlewares/authGurad";

const router = Router();
router.post(
  "/signup",
  upload.single("photo"),
  (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
  },

  AuthControllers.createUser
);

// Route to get all users
router.get("/allUser", AuthControllers.getAllUsers);

// Route to create a new user

// Route for user login
router.post(
  "/login",
  validationGuard(AuthValidation.LoginSchema),
  AuthControllers.userLogin
);

// Route to update a user role by userId
router.put(
  "/allUser/:userId",
  authGuard(["admin"]),
  AuthControllers.updateUserRole
);
//  route to update user info
router.put(
  "/update/:id",
  upload.single("photo"),
  (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  AuthControllers.updateUser
);


// Route to get a single user by userId
router.get("/allUser/:userId", AuthControllers.getUserById);

// Route to delete a user by userId
router.delete("/deleteUser/:userId", authGuard(["admin"]), AuthControllers.deleteUserById);

export const AuthRouter = router;
