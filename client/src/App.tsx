import React, { useEffect, FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from './store/store';
import { checkAuth, logout } from './store/AuthSlice';
// import { IAuthState } from './models/IAuthState';
import './App.css';
import LoginForm from './components/LoginForm';

const App: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user, loading, error } = useSelector(
    (state: RootState) => state.auth
  );
  
  useEffect (() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if(loading) return <div>Loading...</div>

  const onLogoutHandler = () => {
    dispatch(logout());
  }

  return (
    <div className="App">
      {
        isAuthenticated ? 
        (
          <div>
            <h1>Welcome, {user?.email}</h1>
            <button onClick={onLogoutHandler}>Logout</button>
          </div>
        ) : (
          <div>
            <h1>Please log in</h1>
            {error && <p className="error">{error}</p>}
          <LoginForm />
          <button onClick={onLogoutHandler}>Logout</button>
          </div>
        )
      }
    </div>
  );
}

export default App;
