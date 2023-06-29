import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import './navbar.css';
import Login from "./login-panel";
import fe from '../fetch_';
export default function NavBar() {
  const [sign_modal] = [useRef(null)];
  const [loginAvailable, SetLoginAvailable] = useState(false);
  ///////////////////////////////////////////
  const on_sign_modal_show_click = (evt) => {
    sign_modal.current.classList.add("active");
    fe.checkLoginFunction((ret => {
      SetLoginAvailable(ret !== false)
    }))
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
        <Link to={"/about"} className="btn btn-link text-color nav-link-h">About</Link>
        <Link className="btn btn-link text-color nav-link-h" onClick={on_sign_modal_show_click}>Sign Up/ In</Link>
      </section>
    </header>
    <Login sign_modal={sign_modal} loginAvailable={loginAvailable}/>
    
  </>
  )
}