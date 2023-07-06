import React, { useEffect, useRef, useState } from "react";
// import { Link } from "react-router-dom";
import './login-panel.css';
import {createElement, trans} from '../general_';
import fe_ from '../fetch_';

export default function Login({sign_modal, loginAvailable, loginRegex, translation, addMessage}){
  let [sign_up, sign_in, signUpIdInput, signUpPasswordInput1, signUpPasswordInput2, signInIdInput, signInPasswordInput] = [useRef(null),useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];
  let [userIdRegex, setUserIDRegex] = useState([]);
  let [passwordRegex, setPasswordRegex] = useState([]);
  useEffect(()=>{
    setUserIDRegex(loginRegex.userIdRegex);
    setPasswordRegex(loginRegex.passwordRegex);
  }, [loginRegex]);
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
    const form = {userId: signUpIdInput.current.value};
    const hintDiv = evt.currentTarget.querySelector('.password-hint-div');
    if(signUpPasswordInput1.current.value !== signUpPasswordInput2.current.value){
      
      hintDiv.replaceChildren(createElement({tagname_: "p", innerText: `- ${trans("Two password should be same.", translation)}`, class: "form-input-hint"}));
      return false;
    }else form['password'] = signUpPasswordInput1.current.value;
    

    if(new RegExp(userIdRegex.regex).test(form.userId) === false){
      console.log(trans("sign in user id regex test failed.",translation));
      return;
    };
    if(new RegExp(passwordRegex.regex).test(form.password) === false) {
      console.log(trans("sign in password regex test failed.",translation));
      return;
    };
    //init register
    fe_.UserRegister(form, (res) => {
      if(res.userId){ //if successed
        

      }else{ // if failed
        hintDiv.replaceChildren(createElement({tagname_: "p", innerText: `- ${trans("Register failed, contact Admin.", translation)}`, class: "form-input-hint"}));
      }
      // console.log(res);
    })
  }
  const sign_in_form_submit = (evt) => {
    evt.preventDefault();
    addMessage("something", "some content");
  }
  const userId_input_change = (evt) => {
    const hintDiv = evt.target.form.querySelector('.userId-hint-div');
    hintDiv.replaceChildren(...test_userId(evt.currentTarget.value));

    function test_userId(value){
      //in this case are differently others it return dom element instead of string
      const ret = [];
      const check_userID_p = createElement({
        tagname_: "p",  childs_:
        [
          {tagname_: "i", class:"form-icon loading"}, 
        ], 
        class: "form-input-hint", 
      });
      ret.push(check_userID_p);

      // check UserID
      fe_.checkUserID(value, (response) => {
        if(response['result']!==true){
          check_userID_p.innerText = `- userId: ${value} is taken.`;
        }else{
          setTimeout(() => {
            hintDiv.removeChild(check_userID_p);
          }, 300);
        }
      });
      //check regex
      userIdRegex.forHint.forEach(el => {
        const regex = new RegExp(el[0]);
        if(regex.test(value) === false) {
          ret.push(createElement({tagname_: "p", innerText: el[1], class: "form-input-hint"}));
        } 
      })
      return ret;
    }
  } 
  const password_input_change = (evt) => {
    //get hint div
    const hintDiv = evt.target.form.querySelector('.password-hint-div');
    //get password input
    const allPasswordInput = evt.target.form.querySelectorAll('input[type=password]');
    //testing value
    const newChilds = test_value(evt.currentTarget.value).map(el => createElement({tagname_: "p", innerText: el, class: "form-input-hint"}));
    //replace new hint
    hintDiv.replaceChildren(...newChilds);
    ///////////////////////////////////////
    function test_value(value){
      const ret = [];
      if(allPasswordInput.length === 2) if(allPasswordInput[0].value !== allPasswordInput[1].value){
        ret.push(`- ${trans("Two password should be same.", translation)}`);
      }
      passwordRegex.forHint.forEach(el => {
        const regex = new RegExp(el[0]);
        if(regex.test(value) === false) {
          ret.push(el[1]);
        } 
      })
      return ret;
    }
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
          <div className="content modal-content-h">
            {loginAvailable?
            <>
            <ul className="tab tab-block tab-h">
              <li className="tab-item" onClick={on_sign_modal_tab_click} type="sign-up">
                <span >Sign up</span>
              </li>
              <li className="tab-item active" onClick={on_sign_modal_tab_click} type="sign-in">
                <span >Sign In</span>
              </li>
            </ul>
            <div className="columns is-not-visable-h" ref={sign_up}>
              <div className="column col-12 col-sm-12">
                <form className="form-horizontal" action="#forms" onSubmit={sign_up_form_submit}>
                  <div className="form-group">
                    <div className="col-3">
                      <label className="form-label form-label-h" >User Id</label>
                    </div>
                    <div className="col-9">
                      <input ref={signUpIdInput} className="form-input" type="text" placeholder="User Id" onBlur={userId_input_change} name="userId"/>
                    </div>
                  </div>

                  <div className="form-group has-error userId-hint-div">
                    <p className="form-input-hint ">The name is invalid.</p>
                  </div>

                  <div className="form-group">
                    <div className="col-3">
                      <label className="form-label form-label-h" >Enter Password</label>
                    </div>
                    <div className="col-9">
                      <input className="form-input" type="password" ref={signUpPasswordInput1} placeholder="Password" onBlur={password_input_change} name="password"/>
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="col-3">
                      <label className="form-label form-label-h" >re-Enter Password</label>
                    </div>
                    <div className="col-9">
                      <input className="form-input"
                        type="password" ref={signUpPasswordInput2} placeholder="re-Enter Password" onBlur={password_input_change} name="password"/>
                    </div>
                  </div>
                  <div className="form-group password-hint-div has-error">
                    <p className="form-input-hint">The name is invalid.</p>
                  </div>
                  <div className="form-group login-modal-justify-right">
                    <button className="btn btn-style-h"> Sign Up </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="columns" ref={sign_in}>
              <div className="column col-12 col-sm-12">
                <form className="form-horizontal" action="#forms" onSubmit={sign_in_form_submit}>
                  <div className="form-group">
                    <div className="col-3">
                      <label className="form-label form-label-h" >User Id</label>
                    </div>
                    <div className="col-9">
                      <input className="form-input" ref={signInIdInput}  type="text" placeholder="User Id" />
                    </div>
                  </div>

                  <div className="form-group">
                    <div className="col-3">
                      <label className="form-label form-label-h" >Enter Password</label>
                    </div>
                    <div className="col-9">
                      <input className="form-input" type="password" ref={signInPasswordInput} placeholder="Password" />
                    </div>
                  </div>
                  <div className="form-group login-modal-justify-right">
                    <button className="btn btn-style-h"> Login </button>
                  </div>
                </form>
              </div>
            </div>
            </>
            
            :trans("Login currently not available.", translation)}
            
          </div>
        </div>
        <div className="modal-footer">
          ...
        </div>
      </div>
    </div>
  
  </>
}