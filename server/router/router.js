import { Router } from "express";
import UserController from "../controllers/user-controller.js";
import { body } from "express-validator";
import authMiddleware from "../middlewares/auth-middleware.js"; 

//App architecture: Router => Controller => Service( logic for hanling req/res in Controller)

const router = new Router();

router.post(
  "/registration",
  // body("email").isEmail(),
  // body("password").isLength({ min: 4, max: 16 }),
  UserController.registration
);
router.post("/login", UserController.login);
router.post("/logout", UserController.logout);
router.get("/activate/:link", UserController.activate);
router.get("/refresh", UserController.refresh);
router.get("/users_jwt", authMiddleware, UserController.users_jwt);
router.get("/auth/check-auth", authMiddleware, UserController.checkAuth);

export default router;

//App architecture: Router => Controller => Service( logic for hanling req/res in Controller)
