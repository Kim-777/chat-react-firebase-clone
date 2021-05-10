import React, { useEffect } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory
} from 'react-router-dom';
import Chat from './components/Chat/Chat';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import firebase from './firebase';
import { useDispatch, useSelector } from 'react-redux';
import {
  setUser
} from './redux/actions/user';

function App() {

  const history = useHistory();
  const dispatch = useDispatch();
  const { isLoading } = useSelector(({user}) => user);
  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      console.log('user', user);

      // login 상태
      if(user) {
        console.log('here')
        dispatch(setUser(user));
        history.push("/");
      } else {
        history.push("/login");
      }

    });


  }, [dispatch, history]);

  if(isLoading) {
    return (
      <div>
        ...loading
      </div>
    )
  }

  return (
      <Switch>
        <Route exact path="/" component={Chat} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
      </Switch>      
  );
}

export default App;
