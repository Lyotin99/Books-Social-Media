import firebase from "firebase/app";
import config from "./config";
const Firebase = firebase.initializeApp(config);

export const Providers = {
  google: new firebase.auth.GoogleAuthProvider(),
};

export const auth = firebase.auth();
export default Firebase;
