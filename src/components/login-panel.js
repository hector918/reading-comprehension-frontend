import React, { useRef } from "react";
import { Link } from "react-router-dom";
import './login-panel.css';

export default function Login({sign_modal, loginAvailable}){
  let [sign_up, sign_in] = [useRef(null), useRef(null)];
  /////////////////////////////////////////////
  const on_sign_modal_close_click = (evt) => {
    sign_modal.current.classList.remove("active");
  }
  const on_sign_modal_tab_click = (evt) => {
    const type = evt.currentTarget.getAttribute("type");
    if(type === "sign-up"){
      sign_up.current.classList.remove("is-not-visable-h");
      sign_in.current.classList.add("is-not-visable-h");
    }else{
      sign_up.current.classList.add("is-not-visable-h");
      sign_in.current.classList.remove("is-not-visable-h");
    }
    evt.currentTarget.parentNode.childNodes.forEach(el=>{
      el.classList.remove("active");
    });
    evt.currentTarget.classList.add("active");
  }
  const sign_up_form_submit = (evt) => {
    evt.preventDefault();
  }
  const sign_in_form_submit = (evt) => {
    evt.preventDefault();

  }
  /////////////////////////////////////////////////
  return <>
  <div ref={sign_modal} className="modal" >
      <span href="#close" className="modal-overlay" aria-label="Close"></span>
      <div className="modal-container">
        <div className="modal-header">
          <span href="#close" className="btn btn-clear float-right" aria-label="Close" onClick={on_sign_modal_close_click}></span>
          <div className="modal-title h5 text-left">Binary Mind - Login</div>
        </div>
        <div className="modal-body">
          <div className="content">
            {loginAvailable?
            
            <>
            <ul className="tab tab-block tab-h">
              <li className="tab-item active" onClick={on_sign_modal_tab_click} type="sign-up">
                <span >Sign up</span>
              </li>
              <li className="tab-item" onClick={on_sign_modal_tab_click} type="sign-in">
                <span >Sign In</span>
              </li>
              
            </ul>
            <div className="columns is-not-visable-h" ref={sign_up}>
              <div className="column col-12 col-sm-12">
                <form className="form-horizontal" action="#forms" onSubmit={sign_up_form_submit}>
                  <div className="form-group">
                    <div className="col-3">
                      <label className="form-label form-label-h" >Email</label>
                    </div>
                    <div className="col-9">
                      <input className="form-input" type="email" placeholder="Email" pattern="[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$" />
                    </div>
                  </div>


                  <div className="form-group">
                    <div className="col-3">
                      <label className="form-label form-label-h" >Enter Password</label>
                    </div>
                    <div className="col-9">
                      <input className="form-input" type="password" placeholder="Password" />
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="col-3">
                      <label className="form-label form-label-h" >re-Enter Password</label>
                    </div>
                    <div className="col-9">
                      <input className="form-input"
                        type="password" placeholder="Password" />
                    </div>
                  </div>
                  <div className="form-group login-modal-justify-right">
                    <button className="btn btn-style-h"> Submit </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="columns" ref={sign_in}>
              <div className="column col-12 col-sm-12">
                <form className="form-horizontal" action="#forms" onSubmit={sign_in_form_submit}>
                  <div className="form-group">
                    <div className="col-3">
                      <label className="form-label form-label-h" >Email</label>
                    </div>
                    <div className="col-9">
                      <input className="form-input"  type="email" placeholder="Email" pattern="[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$" />
                    </div>
                  </div>


                  <div className="form-group">
                    <div className="col-3">
                      <label className="form-label form-label-h" >Enter Password</label>
                    </div>
                    <div className="col-9">
                      <input className="form-input" type="password" placeholder="Password" />
                    </div>
                  </div>
                  <div className="form-group login-modal-justify-right">
                    <button className="btn btn-style-h"> Submit </button>
                  </div>
                </form>
              </div>
            </div>
            </>
            
            :"Login currently not available"}
            
          </div>
        </div>
        <div className="modal-footer">
          ...
        </div>
      </div>
    </div>
  
  </>
}