// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, signInWithRedirect, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';
import fe_ from '../fetch_';
import { addMessage } from './message-footer';
import { trans } from "../general_";
// Your web app's Firebase configuration
const FIREBASE_API = process.env.REACT_APP_FIREBASE_API_KEY;
const firebaseConfig = {
  apiKey: FIREBASE_API,
  authDomain: "virtual-dogfish-305504.firebaseapp.com",
  projectId: "virtual-dogfish-305504",
  storageBucket: "virtual-dogfish-305504.appspot.com",
  messagingSenderId: "599627267696",
  appId: "1:599627267696:web:6d9b1b039a8092b9c43eb5"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const authByGoogle = (callback) => {
  // 使用弹出窗口方式登录
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider).then((result) => {
    // 登录成功的处理
    var user = result.user;
    const { accessToken, uid, displayName, email } = user;
    fe_.userLoginWithThirdParty(accessToken, (res) => {
      callback(res);
    })
  }).catch(function (error) {
    // 错误处理
    addMessage(trans("Sign in with Google"), error.message, "error");
    console.error(error);
  });
}
const authByMicrosoft = (callback) => {
  const provider = new OAuthProvider('microsoft.com');
  provider.setCustomParameters({
    prompt: "consent",
    tenant: "consumers",
  });
  // 使用弹出窗口方式登录
  signInWithPopup(auth, provider).then((result) => {
    // 登录成功的处理
    // var token = result.credential.accessToken;
    var user = result.user;
    const { accessToken, uid, displayName, email } = user;
    fe_.userLoginWithThirdParty(accessToken, (res) => {
      callback(res);
    })
  }).catch(function (error) {
    // 错误处理
    addMessage(trans("Sign in with Microsoft"), error.message, "error");
    console.error(error);
  });
}

const authByApple = () => {
  const provider = new OAuthProvider('apple.com');
  // 使用弹出窗口方式登录
  signInWithPopup(auth, provider).then((result) => {
    // 登录成功的处理
    // var token = result.credential.accessToken;
    var user = result.user;
    const { accessToken, uid, displayName, email } = user;

  }).catch(function (error) {
    // 错误处理
    console.error(error);
  });
}

export default {
  authByGoogle, authByMicrosoft, authByApple
}