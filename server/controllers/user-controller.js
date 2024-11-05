import UserService from "../service/user-service.js";
import UserJWT from "../models/user-model.js";
import { validationResult } from "express-validator";
import ApiError from "../exeptions/api-errors.js";

//App architecture: Router => Controller => Service( logic for hanling req/res in Controller)
class UserController {
  async registration(req, res, next) {
    try {
      const errors = validationResult(req);
      if(!errors.isEmpty()) {
        return next(ApiError.BadRequest('Error in validation', errors.array()));
      }
      const {email, password} = req.body;
      const userData = await UserService.registration(email, password);

      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30*24*3600*1000,
        httpOnly: true,
        secure: true
      });
      return res.status(201).json(userData);
    } catch (error) {
      next(error);
      console.error("Error in registration:", error.message);
      return res.status(400).json({ message: error.message });
    }
  }
  async login(req, res, next) {
    try {
      const {email, password} = req.body;
      const userData = await UserService.login(email, password);
      
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30*24*3600*1000,
        httpOnly: true,
        secure: true
      });
      return res.status(201).json(userData);
    } catch (error) {
      next(error);
    }
  }
  async logout(req, res, next) {
    try {
      const {refreshToken} = req.cookies;
      const token = await UserService.logout(refreshToken);
      res.clearCookie('refreshToken');
      return res.json(token);
    } catch (error) {
      next(error);
    }
  }
  async activate(req, res, next) {
    try {
      const activationLink = req.params.link;
      await UserService.activate(activationLink);
      return res.redirect(process.env.CLIENT_URL);
    } catch (error) {
      next(error);
    }
  }
  async refresh(req, res, next) {
    try {
      const {refreshToken} = req.cookies;
      const userData = await UserService.refresh(refreshToken);
      res.cookies('refreshToken', userData.refreshToken, {
        maxAge: 30*24*3600*1000,
        httpOnly: true,
        secure: true
      });
      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }
  async users_jwt(req, res, next) {
    try {
      // res.json(['123', '456']);

      // const users_jwt = await UserJWT.find()
      const users_jwt = await UserService.getAllUsers();
      return res.json(users_jwt);

    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();