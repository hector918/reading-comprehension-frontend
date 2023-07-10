import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import './navbar.css';
import Login from "./login-panel";
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
  const on_user_profile_click = (evt) => {
    console.log(userInfo)
  }
  const on_user_logout_click = (evt) => {
    fe_.UserLogout((res) => {
      if(res.error){
        addMessage(trans("Logout failed.", translation),"", "toast-error");
      }else{
        addMessage(trans("Successed logout.", translation),"", "toast-success");
        setUserInfo({});
      }
    })
  }
  //////////////////////////////////////////////
  return (<>
    <header className="navbar navbar-h">
      <section className="navbar-section">
        <Link className="navbar-logo" to={"/"}>
          <img src="./logo.png" width="44" height="44" alt="Logo" />
          <span className="unselectable text-color">Binary Mind</span>
        </Link>

        {/* <a href="..." className="btn btn-link">Docs</a>
      <a href="..." className="btn btn-link">GitHub</a> */}
      </section>
      <section className="navbar-section">
        {/* <div className="input-group input-inline">
        <input className="form-input" type="text" placeholder="search"/>
        <button className="btn btn-primary input-group-btn">Search</button>
      </div> */}
        <div className="dropdown dropdown-right">
          <span className="btn btn-link dropdown-toggle" tabIndex="0">
            Language <i className="icon icon-caret"></i>
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
        <Link to={"/about"} className="btn btn-link text-color nav-link-h">{trans("About", translation)}</Link>
        {isLogin()?
          <>
            <div className="dropdown dropdown-right">
              <span href="#" className="btn btn-link dropdown-toggle" tabIndex="0">
              {trans("Me", translation)} <i className="icon icon-caret"></i>
              </span>
              <ul className="menu profile-menu"><form>
                <li className="menu-item">
                    <div className="tile tile-centered">
                      <div className="tile-icon"><img className="avatar" src="../img/avatar-4.png" alt="Avatar"/></div>
                      <div className="tile-content">{userInfo.username}</div>
                    </div>
                </li>
                <li className="menu-item">
                    <div className="tile tile-centered" onClick={on_user_logout_click}>
                      <div className="tile-icon"><i class="icon icon-arrow-left"></i></div>
                      <div className="tile-content">{trans("logout", translation)}</div>
                    </div>
                </li>
              </form></ul>
            </div>
          </>
        :
          <Link className="btn btn-link text-color nav-link-h" onClick={on_sign_modal_show_click}>{trans("Sign Up/ In", translation)}</Link>
        }
      </section>
    </header>
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
  )
}