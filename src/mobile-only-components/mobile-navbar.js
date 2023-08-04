import './mobile-navbar.css';
import React from 'react';
import { Link } from "react-router-dom";
///////////////////////////////////////////
export default function MobileNavbar({language, setLanguage, translation, setTranslation, addMessage, userInfo, setUserInfo, isLogin}){
  return <header className='navbar mobile-navbar-h'>
    <div className='nav-item'>
      <Link className="navbar-logo" to={"/"}>
        <img src={`${window.location.origin}/logo.png`}  alt="Logo" />
      </Link>
    </div>
    <div className='nav-item'><i className="fa-solid fa-link fa-2xl"></i></div>
    <div className='nav-item'><i className="fa-solid fa-language fa-2xl"></i></div>
    <div className='nav-item'><i className="fa-solid fa-user fa-2xl"></i></div>
  </header>
}