import React, { useEffect, useCallback } from "react";
import "./App.css";
import { Switch, Route, useHistory } from "react-router-dom";
import Chat from "./components/Chat/Chat";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import firebase from "./firebase";
import { useDispatch, useSelector } from "react-redux";
import { setUser, clearUser } from "./redux/actions/user";

function App() {
    const history = useHistory();
    const dispatch = useDispatch();
    const { isLoading } = useSelector(({ user }) => user);

    const initial = useCallback(async () => {
      console.log('initial');
        try {
            await firebase.auth().onAuthStateChanged((user) => {
                // console.log('user', user);

                // login 상태
                if (user) {
                    // console.log('here')
                    dispatch(setUser(user));
                    history.push("/");
                } else {
                    console.log("test clearUser");
                    dispatch(clearUser());
                    history.push("/login");
                }
            });
        } catch (error) {
            console.log(error);
        }
    }, [dispatch, history]);


    useEffect(() => {
        initial();
    }, [initial]);

    if (isLoading) {
        return <div>...loading</div>;
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
