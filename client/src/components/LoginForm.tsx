import React, { ChangeEvent, FC, FormEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IUserData } from "../models/IUserData";
import { IError } from "../models/IError";
import {login, registration} from "../store/AuthSlice";
import { AppDispatch, RootState } from "../store/store";

const LoginForm: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {loading} = useSelector((state: RootState) => state.auth);

  const [userData, setUserData] = useState<IUserData>({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<IError>({
    message: ''
  })

  const {email, password} = userData;

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const onRegistrationHandler = async () => {
    dispatch(registration({email, password}));
  }

  const onSubmitHandler = (e: FormEvent) => {
    e.preventDefault();
    try {
      if (!userData.email || !userData.password) {
        setErrors({message:"All fields are required."});
        return;
      }
      dispatch(login({email, password}));
      // console.log('Submit successful', `email: ${email}, password: ${password}`);
      userData.email = '';
      userData.password = '';
    } catch (errors) {
      console.error('Error while Logging in', errors);
    }
  }

  return (
    <form onSubmit={onSubmitHandler}>
      <h2>LoginForm</h2>
      <input
        type="text"
        name="email"
        value={userData.email}
        placeholder="Email"
        onChange={onChangeHandler}
      />

      <input
        type="text"
        name="password"
        value={userData.password}
        placeholder="Password"
        onChange={onChangeHandler}
      />

      <button type="submit" disabled={loading}>
        {loading ? 'Logging in ...' : 'Login'} 
        </button>
      <button type="button"
        onClick={onRegistrationHandler}
        disabled={loading}>
        {loading ? 'Registering...' : 'Registration'}
        </button>

      {
        errors.message && 
        <p>{errors.message}</p>
      }
    </form>
  );
};

export default LoginForm;