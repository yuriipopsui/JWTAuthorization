import UserJWT from "../models/user-model.js";
import crypto from "crypto";
import {v4 as uuidv4} from "uuid";
import MailService from "./mail-service.js";
import TokenService from "./token-service.js";
import UserDto from "../dtos/userDto.js";
import ApiError from "../exeptions/api-errors.js";
import util from "node:util";
// import userModel from "../models/user-model.js";

class UserService {
  async registration(email, password) {
    const candidate = await UserJWT.findOne({email});
    if(candidate) {
      throw ApiError.BadRequest(`User with email: ${email} already exists`);
    }
    const salt = crypto.randomBytes(16).toString('hex');
    const hashedPassword = crypto.scryptSync(password, salt, 64).toString('hex');
    const activationLink = uuidv4();
    const user = await UserJWT.create({email, password: hashedPassword, activationLink, hashSalt: salt});
    // console.log("User is:", user);

    // await MailService.sendActivationMail(email, activationLink);

    const userDto = new UserDto(user);
    const tokens = await TokenService.generateToken({...userDto});
    await TokenService.saveToken(user.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto
    };
  }

  async activate(activationLink) {
    const user = await UserJWT.findOne({activationLink});
    if(!user) {
      throw ApiError.BadRequest('Incorrect actiovation link');
    }
    user.isActivated = true;
    await user.save();
  }

  async login(email, password) {
    const user = await UserJWT.findOne({email});
    // console.log(`user is: ${user}`);
    if(!user) {
      throw ApiError.BadRequest(`User with email ${email} is not found.`)
    }
    const {hashSalt} = user;
    // hashedInputPassword is password entered by user in login
    const scrypt = util.promisify(crypto.scrypt);
    const hashedInputPassword = (await scrypt(password, hashSalt, 64)).toString('hex');

      console.log(hashedInputPassword);
      console.log(user.password);
    if(hashedInputPassword !== user.password) {
      throw ApiError.BadRequest('Invalid password');
    }
    const userDto = new UserDto(user);
    const tokens = await TokenService.generateToken({...userDto});


    if(!tokens.refreshToken) {
      throw ApiError.BadRequest('Refresh token generation failed');
    }

    await TokenService.saveToken(user.id, tokens.refreshToken);

    return {...tokens, user: userDto};
  }

  async logout(refreshToken) {
    const token = await TokenService.removeToken({refreshToken});
    return token;
  }

  async refresh(refreshToken) {
    if(!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const userData = TokenService.validateRefreshToken(refreshToken);
    const tokenFromDB = await TokenService.findToken(refreshToken);
    if(!userData || !tokenFromDB) {
      throw ApiError.UnauthorizedError();
    }

    const user = await UserJWT.findById(userData.id);
    const userDto = new UserDto(user);
    const tokens = await TokenService.generateToken({...userDto});
    await TokenService.saveToken(user.id, tokens.refreshToken);
    return {...tokens, user: userDto};
  }

  async getAllUsers() {
    const users = await UserJWT.find();
    return users;
  }
}

export default new UserService();