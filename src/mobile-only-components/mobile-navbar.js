import './mobile-navbar.css';
import React, { useRef, useState } from 'react';
import { Link } from "react-router-dom";
import Login from '../components/login-panel';
import fe_ from '../fetch_';
import '../components/absoluteMainContainer.css';
///////////////////////////////////////////
export default function MobileNavbar({ language, setLanguage, translation, setTranslation, addMessage, userInfo, setUserInfo, isLogin }) {
  const [sign_modal] = [useRef(null)];
  const [loginAvailable, SetLoginAvailable] = useState(false);
  const [loginRegex, SetLoginRegex] = useState({});
  const userProfileContainer = useRef(null);
  // const languageContainer = useRef(null);
  // const linkContainer = useRef(null);
  ///////////////////////////////////////////
  const onSignModalShowClick = (evt) => {
    sign_modal.current.classList.add("active");
    fe_.checkLoginFunction((ret => {
      if (ret !== false) SetLoginRegex(ret);
      SetLoginAvailable(ret !== false)
    }))
  }
  const onUserProfileClick = (evt) => {
    userProfileContainer.current.classList.add('animate');
    userProfileContainer.current.classList.toggle('hide');
  }
  ///////////////////////////////////////////
  return <header className='navbar mobile-navbar-h'>
    <div className='nav-item'>
      <Link className="navbar-logo" to={"/"}>
        <img src={`${window.location.origin}/logo.png`} alt="Logo" />
      </Link>
    </div>
    <div className='nav-item'><i className="fa-solid fa-link fa-xl"></i></div>
    <div className='nav-item'>
      <div
        className='absolute-main-container-trigger'
      // ref = {userProfile}
      >
        <div >
          <i className="fa-solid fa-language fa-xl"></i>
        </div>

        {/* <AbsoluteMainContainer languageContainer={languageContainer} /> */}
      </div>
    </div>
    <div className='nav-item'>

      {isLogin()
        ?
        <>
          <i className="fa-solid fa-user-secret fa-xl" onClick={onSignModalShowClick}></i>
          <Login
            sign_modal={sign_modal}
            loginAvailable={loginAvailable}
            loginRegex={loginRegex}
            translation={translation}
            addMessage={addMessage}
            userInfo={userInfo}
            setUserInfo={setUserInfo}
          />
        </>
        :
        <div
          className='absolute-main-container-trigger'
        >
          <div onClick={onUserProfileClick}>
            <i className="fa-solid fa-user-plus fa-xl"></i>
          </div>
          <div className="absolute-main-container" ref={userProfileContainer}>
            123

            <button className="absolute-main-container-close-button">
              click me to close
            </button>
          </div>
          {/* <AbsoluteMainContainer userProfileContainer={userProfileContainer} /> */}
        </div>
      }
    </div>
  </header>
}