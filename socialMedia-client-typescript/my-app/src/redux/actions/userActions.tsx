import {
  SET_USER,
  SET_ERRORS,
  CLEAR_ERRORS,
  LOADING_UI,
  SET_UNAUTHENTICATED,
  LOADING_USER,
  MARK_NOTIFICATIONS_READ,
} from "../types";
import { axiosGet, axiosPost } from "../../util/BackendServices";
import axios from "axios";
import { Dispatch } from "redux";
interface UserDataProps {
  email: string;
  password: string;
}
interface UserDetails {
  bio: string;
  website: string;
  favoriteQuote: string;
  favoriteBooks: string;
  location: string;
}
interface NewUserData {
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
}
interface History {
  push(url: string): void;
}
export const getUserData = () => (dispatch: Dispatch) => {
  dispatch({ type: LOADING_USER });
  axiosGet("/user")
    .then((res) => {
      dispatch({
        type: SET_USER,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

export const loginUser = (userData: UserDataProps, history: History) => (
  dispatch: Dispatch<any>
) => {
  dispatch({ type: LOADING_UI });

  axios
    .post("/login", userData)
    .then((res) => {
      const FBIdToken = `Bearer ${res.data.token}`;
      localStorage.setItem("FBIdToken", FBIdToken);
      dispatch(getUserData());

      dispatch({ type: CLEAR_ERRORS });
      history.push("/");
    })
    .catch((error) => {
      dispatch({
        type: SET_ERRORS,
        payload: error.response.data,
      });
    });
};

export const logoutUser = () => (dispatch: Dispatch) => {
  localStorage.removeItem("FBIdToken");
  delete axios.defaults.headers.common["Authorization"];
  dispatch({ type: SET_UNAUTHENTICATED });
};

export const signupUser = (newUserData: NewUserData, history: History) => (
  dispatch: Dispatch<any>
) => {
  dispatch({ type: LOADING_UI });

  axios
    .post("/signup", newUserData)
    .then((res) => {
      const FBIdToken = `Bearer ${res.data.token}`;
      localStorage.setItem("FBIdToken", FBIdToken);
      dispatch(getUserData());
      dispatch({ type: CLEAR_ERRORS });
      history.push("/");
    })
    .catch((error) => {
      dispatch({
        type: SET_ERRORS,
        payload: error.response.data,
      });
    });
};

export const uploadImage = (formData: FormData) => (
  dispatch: Dispatch<any>
) => {
  dispatch({ type: LOADING_USER });
  axiosPost("/user/image", formData)
    .then((res) => {
      dispatch(getUserData());
    })
    .catch((err) => {
      console.log(err);
    });
};

export const editUserDetails = (userDetails: UserDetails) => (
  dispatch: Dispatch<any>
) => {
  dispatch({ type: LOADING_USER });
  axiosPost("/user", userDetails)
    .then((res) => {
      dispatch(getUserData());
    })
    .catch((err) => {
      console.log(err);
    });
};

export const markNotificationsRead = (notificationIds: string[]) => (
  dispatch: Dispatch
) => {
  axiosPost("/notifications", notificationIds)
    .then((res) => {
      dispatch({
        type: MARK_NOTIFICATIONS_READ,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
