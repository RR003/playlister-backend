import React, { createContext, useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import api from "./auth-request-api";

const AuthContext = createContext();
console.log("create AuthContext: " + AuthContext);

// THESE ARE ALL THE TYPES OF UPDATES TO OUR AUTH STATE THAT CAN BE PROCESSED
export const AuthActionType = {
  GET_LOGGED_IN: "GET_LOGGED_IN",
  LOGIN_USER: "LOGIN_USER",
  LOGOUT_USER: "LOGOUT_USER",
  REGISTER_USER: "REGISTER_USER",
  HIDE_ERROR_MODAL: "HIDE_ERROR_MODAL",
  DISPLAY_ERROR_MODAL: "DISPLAY_ERROR_MODAL",
  HOME: "HOME",
  ALL_LISTS: "ALL_LISTS",
  USERS: "USERS",
};

function AuthContextProvider(props) {
  const [auth, setAuth] = useState({
    user: null,
    loggedIn: false,
    e: false,
    message: "",
    home: false,
    allLists: false,
    users: false,
  });
  const history = useHistory();

  useEffect(() => {
    auth.getLoggedIn();
  }, []);

  const authReducer = (action) => {
    const { type, payload } = action;
    switch (type) {
      case AuthActionType.GET_LOGGED_IN: {
        return setAuth({
          user: payload.user,
          loggedIn: payload.loggedIn,
          e: auth.e,
          message: auth.message,
          home: auth.home,
          allLists: auth.allLists,
          users: auth.users,
        });
      }
      case AuthActionType.LOGIN_USER: {
        return setAuth({
          user: payload.user,
          loggedIn: true,
          e: auth.e,
          message: auth.message,
          home: true,
          allLists: false,
          users: false,
        });
      }
      case AuthActionType.LOGOUT_USER: {
        return setAuth({
          user: null,
          loggedIn: false,
          e: auth.e,
          message: auth.message,
          home: false,
          allLists: false,
          users: false,
        });
      }
      case AuthActionType.REGISTER_USER: {
        return setAuth({
          user: payload.user,
          loggedIn: true,
          e: auth.e,
          message: auth.message,
          home: true,
          allLists: false,
          users: false,
        });
      }
      case AuthActionType.HIDE_ERROR_MODAL: {
        return setAuth({
          user: auth.user,
          loggedIn: auth.loggedIn,
          e: false,
          message: "",
          home: auth.home,
          allLists: auth.allLists,
          users: auth.users,
        });
      }
      case AuthActionType.DISPLAY_ERROR_MODAL: {
        return setAuth({
          user: auth.user,
          loggedIn: auth.loggedIn,
          e: true,
          message: payload.message,
          home: auth.home,
          allLists: auth.allLists,
          users: auth.users,
        });
      }
      case AuthActionType.HOME: {
        return setAuth({
          user: auth.user,
          loggedIn: auth.loggedIn,
          e: false,
          message: "",
          home: true,
          allLists: false,
          users: false,
        });
      }
      case AuthActionType.ALL_LISTS: {
        return setAuth({
          user: auth.user,
          loggedIn: auth.loggedIn,
          e: false,
          message: "",
          home: false,
          allLists: true,
          users: false,
        });
      }
      case AuthActionType.USERS: {
        return setAuth({
          user: auth.user,
          loggedIn: auth.loggedIn,
          e: false,
          message: "",
          home: false,
          allLists: false,
          users: true,
        });
      }

      default:
        return auth;
    }
  };

  auth.getLoggedIn = async function () {
    const response = await api.getLoggedIn();
    if (response.status === 200) {
      authReducer({
        type: AuthActionType.SET_LOGGED_IN,
        payload: {
          loggedIn: response.data.loggedIn,
          user: response.data.user,
        },
      });
    }
  };

  auth.registerUser = async function (
    firstName,
    lastName,
    email,
    password,
    passwordVerify
  ) {
    try {
      const response = await api.registerUser(
        firstName,
        lastName,
        email,
        password,
        passwordVerify
      );
      if (response.status === 200) {
        authReducer({
          type: AuthActionType.REGISTER_USER,
          payload: {
            user: response.data.user,
          },
        });
        history.push("/");
      }
    } catch (err) {
      authReducer({
        type: AuthActionType.DISPLAY_ERROR_MODAL,
        payload: {
          message: err.response.data.errorMessage,
        },
      });
    }
  };

  auth.hideErrorModal = async function () {
    authReducer({
      type: AuthActionType.HIDE_ERROR_MODAL,
    });
  };

  auth.loginUser = async function (email, password) {
    try {
      const response = await api.loginUser(email, password);
      if (response.status === 200) {
        //menu.login();
        authReducer({
          type: AuthActionType.LOGIN_USER,
          payload: {
            user: response.data.user,
          },
        });
        history.push("/");
      }
    } catch (err) {
      authReducer({
        type: AuthActionType.DISPLAY_ERROR_MODAL,
        payload: {
          message: err.response.data.errorMessage,
        },
      });
    }
  };

  auth.logoutUser = async function () {
    const response = await api.logoutUser();
    if (response.status === 200) {
      authReducer({
        type: AuthActionType.LOGOUT_USER,
        payload: null,
      });
      history.push("/");
    }
  };

  auth.getUserInitials = function () {
    let initials = "";
    if (auth.user) {
      initials += auth.user.firstName.charAt(0);
      initials += auth.user.lastName.charAt(0);
    }
    console.log("user initials: " + initials);
    return initials;
  };

  auth.goHome = function () {
    authReducer({
      type: AuthActionType.HOME,
    });
  };

  auth.goAllLists = function () {
    authReducer({
      type: AuthActionType.ALL_LISTS,
    });
  };

  auth.goUsers = function () {
    authReducer({
      type: AuthActionType.USERS,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
export { AuthContextProvider };
