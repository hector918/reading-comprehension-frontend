import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import './navbar.css';
import Login from "./login-panel";
import fe_ from '../fetch_';
import {trans} from '../general_';
export default function NavBar({ language, setLanguage, translation, setTranslation, addMessage }) {
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
    fe_.getLanguageFile(currentLanguage, (data) => {
      if(data){
        setLanguage(pv => ({...pv, currentLanguage}));
        setTranslation(data);
      } 
    })
  }
  //////////////////////////////////////////////
  return (<>
    <header className="navbar navbar-h">
      <section className="navbar-section">
        <Link className="navbar-logo" to={"/"}>
          <img src="./logo.png" width="44" height="44" alt="Logo" />
          <span className="unselectable text-color h6">Binary Mind</span>
        </Link>

        {/* <a href="..." className="btn btn-link">Docs</a>
      <a href="..." className="btn btn-link">GitHub</a> */}
      </section>
      <section className="navbar-section">
        {/* <div className="input-group input-inline">
        <input className="form-input" type="text" placeholder="search"/>
        <button className="btn btn-primary input-group-btn">Search</button>
      </div> */}
        <div className="dropdown">
          <span className="btn btn-link dropdown-toggle" tabIndex="0">
            Language <i className="icon icon-caret"></i>
          </span>
          <ul className="menu">
            {language.availableList.map(([key, val], idx)=> <li className={`menu-item ${language.currentLanguage === val ? "current_language" :""}`} filename={val} key={idx} onClick={on_change_language}>{key}</li>)}
          </ul>
        </div>
        <Link to={"/about"} className="btn btn-link text-color nav-link-h">{trans("About", translation)}</Link>
        <Link className="btn btn-link text-color nav-link-h" onClick={on_sign_modal_show_click}>{trans("Sign Up/ In", translation)}</Link>
      </section>
    </header>
    <Login 
      sign_modal={sign_modal} 
      loginAvailable={loginAvailable} 
      loginRegex={loginRegex} 
      translation={translation}
      addMessage={addMessage}
    />
    
  </>
  )
}