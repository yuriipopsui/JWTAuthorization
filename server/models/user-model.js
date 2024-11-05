import {Schema, model} from 'mongoose';

const UserJWT = new Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  isActivated: {
    type: Boolean,
    default: false
  },
  activationLink: {
    type: String
  },
  hashSalt: {
    type: String
  }
});

export default model('UserJWT', UserJWT);