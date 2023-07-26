import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import './navbar.css';
import Login from "./login-panel";
import UserProfileDropdown from "./user-profile-dropdown";
import fe_ from '../fetch_';
import {trans} from '../general_';

export default function NavBar({ language, setLanguage, translation, setTranslation, addMessage, userInfo, setUserInfo, isLogin }) {
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
  const on_change_language = (evt) => {
    const currentLanguage = evt.currentTarget.getAttribute("filename");
    fe_.getLanguageFile(currentLanguage, (res) => {
      if(res){
        setLanguage(pv => ({...pv, currentLanguage}));
        setTranslation(res);
      } 
    })
  }

  const on_user_logout_click = (evt) => {
    fe_.UserLogout((res) => {
      if(res.error){
        addMessage(trans("Logout failed.", translation),"", "error");
      }else{
        addMessage(trans("Successed logout.", translation),"", "success");
        setUserInfo({});
      }
    })
  }
  //////////////////////////////////////////////
  return (<>
    <header className="navbar navbar-h">
      <section className="navbar-section">
        <Link className="navbar-logo" to={"/"}>
          <img src={`${window.location.origin}/logo.png`} width="44" height="44" alt="Logo" />
          <span className="unselectable text-color">Binary Mind</span>
        </Link>

        {/* <a href="..." className="btn btn-link">Docs</a>
      <a href="..." className="btn btn-link">GitHub</a> */}
      </section>
      <section className="navbar-section navbar-section-s">
        {/* <div className="input-group input-inline">
        <input className="form-input" type="text" placeholder="search"/>
        <button className="btn btn-primary input-group-btn">Search</button>
      </div> */}
        <div className="dropdown dropdown-right">
          <span className="btn btn-link dropdown-toggle c-hand" tabIndex="0">
            Language <i className="fa-solid fa-caret-down"></i>
          </span>
          <ul className="menu">
            <form>
            {language.availableList.map(([key, val], idx)=>
              <li className={`menu-item ${language.currentLanguage === val ? "current_language" :""}`} filename={val} key={idx} onClick={on_change_language}>
                <label className="form-radio">
                  <input type="radio" name="language" defaultChecked={language.currentLanguage === val} />
                  <i className="form-icon"></i> {key}
                </label>
              </li>
            )}
            </form>
          </ul>
        </div>
        <Link to={"/about"} className="btn btn-link text-color nav-link-h c-hand">{trans("About", translation)}</Link>
        {isLogin()?
          <UserProfileDropdown
            
            translation = {translation}
            userInfo = {userInfo}
            setUserInfo = {setUserInfo}
            addMessage = {addMessage}
            on_user_logout_click = {on_user_logout_click}
          />
        :
          <Link className="btn btn-link text-color nav-link-h c-hand" onClick={on_sign_modal_show_click}>{trans("Sign Up/ In", translation)}</Link>
        }
      </section>
    </header>
    {isLogin()? ""
      :<Login 
        sign_modal = {sign_modal} 
        loginAvailable = {loginAvailable} 
        loginRegex = {loginRegex} 
        translation = {translation}
        addMessage = {addMessage}
        userInfo = {userInfo}
        setUserInfo = {setUserInfo}
      />
    }
  </>
  )
}