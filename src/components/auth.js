// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, signInWithRedirect, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';
import fe_ from '../fetch_';
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBXc8M7SxXVJOBx5RGCUk_2e8PRSaIjgms",
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
    // var token = result.credential.accessToken;
    var user = result.user;
    const {accessToken, uid, displayName, email} = user;
    console.log(user, accessToken, uid, displayName, email);
    fe_.userLoginWithThirdParty(accessToken, (res) => {
      callback(res);
    })
  }).catch(function(error) {
    // 错误处理
    console.error(error);
  });
}
const authByMicrosoft = () => {
  const provider = new OAuthProvider('microsoft.com');
  // 使用弹出窗口方式登录
  signInWithPopup(auth, provider).then((result) => {
    // 登录成功的处理
    // var token = result.credential.accessToken;
    var user = result.user;
    const {accessToken, uid, displayName, email} = user;
    console.log(user, accessToken, uid, displayName, email);
  }).catch(function(error) {
    // 错误处理
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
    const {accessToken, uid, displayName, email} = user;
    console.log(user, accessToken, uid, displayName, email);
    
  }).catch(function(error) {
    // 错误处理
    console.error(error);
  });
}


export default{
  authByGoogle, authByMicrosoft, authByApple
}