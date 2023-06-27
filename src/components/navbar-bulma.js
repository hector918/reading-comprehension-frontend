import React, { useRef } from "react";
import { Link } from "react-router-dom";
import './navbar-bulma.css';

export default function NavBar(){
  const logInModal = useRef(null);
  const [sign_up_div, sign_in_div] = [useRef(null), useRef(null)];
  //////////////////////////////////////////
  const sign_in_on_click = (evt) => {
    logInModal.current.classList.add('is-active');
  }
  const sign_in_close_on_click = (evt) => {
    logInModal.current.classList.remove('is-active');
  }
  const sign_tab_on_click = (evt) => {
    evt.currentTarget.parentNode.childNodes.forEach(el=>{
      el.classList.remove("is-active");
    });
    evt.currentTarget.classList.add("is-active");
    if(evt.currentTarget.getAttribute("type-h") === "sign-up"){
      sign_up_div.current.classList.remove("is-not-visable-h");
      sign_in_div.current.classList.add("is-not-visable-h");
    }else{
      sign_in_div.current.classList.remove("is-not-visable-h");
      sign_up_div.current.classList.add("is-not-visable-h");
    }
  }
  const on_modal_sign_up_submit = (evt) => {
    evt.preventDefault();
  }
  const on_modal_sign_in_submit = (evt) => {
    evt.preventDefault();

  }
  ////////////////////////////////////////////////
  return(
    <nav className="navbar navbar-c has-shadow" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <Link className="navbar-logo" to={"/"}>
          <img src="./logo.png" width="44" height="44" alt="Logo"/>
          <span>Binary Mind</span>
        </Link>

        <Link role="button" className="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </Link>
      </div>

      <div id="navbarBasicExample" className="navbar-menu">
        {/* <div className="navbar-start">
          <Link className="navbar-item">
            Home
          </Link>

          <Link className="navbar-item">
            Documentation
          </Link>

          <div className="navbar-item has-dropdown is-hoverable">
            <Link className="navbar-link">
              More
            </Link>

            <div className="navbar-dropdown">
              <Link className="navbar-item">
                About
              </Link>
              <Link className="navbar-item">
                Jobs
              </Link>
              <Link className="navbar-item">
                Contact
              </Link>
              <hr className="navbar-divider"/>
              <Link className="navbar-item">
                Report an issue
              </Link>
            </div>
          </div>
        </div> */}

        <div className="navbar-end">
          {/* <div className="navbar-item">
            <div className="buttons">
              <Link className="button is-primary">
                <strong>Sign up</strong>
              </Link>
              <Link className="button is-light">
                Log in
              </Link>
            </div>
          </div> */}
          <Link className="navbar-item custom_text_shadow" to={"/about"}>
              About
          </Link>
          <div className="navbar-item custom_text_shadow" onClick={sign_in_on_click}>
              Sign Up / In
          </div>
        </div>
        
      </div>
      <div ref={logInModal} className="modal">
          <div className="modal-background"></div>
          <div className="modal-content">
            <div className="tabs is-medium is-centered">
              <ul>
                <li type-h="sign-up" className="is-active" onClick={sign_tab_on_click}><span>Sign Up</span></li>
                <li type-h="sign-in" onClick={sign_tab_on_click}><span>Sign In</span></li>
              </ul>
            </div>
            <div ref={sign_up_div} className="sign-up-div">
              <form onSubmit={on_modal_sign_up_submit}>
                <div className="field">
                  <p className="control has-icons-left has-icons-right">
                    <input className="input input-theme-border" type="email" placeholder="Email"/>
                    <span className="icon is-small is-left">
                      <i className="fas fa-envelope"></i>
                    </span>
                    <span className="icon is-small is-right">
                      <i className="fas fa-check"></i>
                    </span>
                  </p>
                </div>
                <div className="field">
                  <p className="control has-icons-left">
                    <input className="input input-theme-border" type="password" placeholder="enter-Password" name="password"/>
                    <span className="icon is-small is-left">
                      <i className="fas fa-lock"></i>
                    </span>
                  </p>
                </div>
                <div className="field">
                  <p className="control has-icons-left">
                    <input className="input input-theme-border" type="password" placeholder="re-Password" name="re-enter-password"/>
                    <span className="icon is-small is-left">
                      <i className="fas fa-lock"></i>
                    </span>
                  </p>
                </div>
                <div className="control">
                  <button className="button btn-theme-border">Submit</button>
                </div>
              </form>
            </div>
            <div ref={sign_in_div} className="sign-in-div is-not-visable-h">
              <form onSubmit={on_modal_sign_in_submit}>
                <div className="field">
                  <p className="control has-icons-left has-icons-right">
                    <input className="input input-theme-border" type="email" placeholder="Email"/>
                    <span className="icon is-small is-left">
                      <i className="fas fa-envelope"></i>
                    </span>
                    <span className="icon is-small is-right">
                      <i className="fas fa-check"></i>
                    </span>
                  </p>
                </div>
                <div className="field">
                  <p className="control has-icons-left">
                    <input className="input input-theme-border" type="password" placeholder="Password"/>
                    <span className="icon is-small is-left">
                      <i className="fas fa-lock"></i>
                    </span>
                  </p>
                </div>
                <div className="control">
                  <button className="button btn-theme-border">Submit</button>
                </div>
              </form>
            </div>
          </div>
          <button className="modal-close is-large" aria-label="close" onClick={sign_in_close_on_click}></button>
        </div>
    </nav>)
}