import './mobile-navbar.css';
import React, { useRef, useState } from 'react';
import { Link } from "react-router-dom";
import Login from '../components/login-panel';
import fe_ from '../fetch_';
///////////////////////////////////////////
export default function MobileNavbar({language, setLanguage, translation, setTranslation, addMessage, userInfo, setUserInfo, isLogin}){
  const [sign_modal] = [useRef(null)];
  const [loginAvailable, SetLoginAvailable] = useState(false);
  const [loginRegex, SetLoginRegex] = useState({});
  ///////////////////////////////////////////
  const on_sign_modal_show_click = (evt) => {
    sign_modal.current.classList.add("active");
    fe_.checkLoginFunction((ret => {
      if(ret !== false) SetLoginRegex(ret);
      SetLoginAvailable(ret !== false)
    }))
  }
  ///////////////////////////////////////////
  return <header className='navbar mobile-navbar-h'>
    <div className='nav-item'>
      <Link className="navbar-logo" to={"/"}>
        <img src={`${window.location.origin}/logo.png`}  alt="Logo" />
      </Link>
    </div>
    <div className='nav-item'><i className="fa-solid fa-link fa-xl"></i></div>
    <div className='nav-item'><i className="fa-solid fa-language fa-xl"></i></div>
    <div className='nav-item'>
      
      {isLogin()
        ?
        <>
          <i className="fa-solid fa-user-plus fa-xl" onClick={on_sign_modal_show_click}></i>
          <Login
            sign_modal = {sign_modal} 
            loginAvailable = {loginAvailable} 
            loginRegex = {loginRegex} 
            translation = {translation}
            addMessage = {addMessage}
            userInfo = {userInfo}
            setUserInfo = {setUserInfo}
          />
        </>
        :
        <>
          
        </>
      }
    </div>
  </header>
}