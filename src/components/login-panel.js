import React, { useEffect, useRef, useState } from "react";
import './login-panel.css';
import {createElement, trans, createPasswordHash, loadingIcon} from '../general_';
import fe_ from '../fetch_';
import lc_ from '../stroage_';
import fb_auth from './auth';
///////////////////////////////////////
export default function Login({sign_modal, loginAvailable, loginRegex, translation, addMessage, userInfo, setUserInfo}){
  //define useref
  let [sign_up, sign_in, signUpIdInput, signUpPasswordInput1, signUpPasswordInput2, signInIdInput, signInPasswordInput, sign_in_tab_button] = [useRef(null),useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];
  //
  let [userIdRegex, setUserIDRegex] = useState([]);
  let [passwordRegex, setPasswordRegex] = useState([]);
  let [checkUserIdLoading, setCheckUserIdLoading] = useState(false);
  let [signInLoading, setSignInLoading] = useState(false);
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
    //switching tabs
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
    // verification of input value
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
        addMessage(
          trans("Successfully registered"), 
          trans("This message will automatically close."), 
          "success"
        );
        sign_in_tab_button.current.click();
        //clean up input value
        signUpIdInput.current.value = "";
        signUpPasswordInput1.current.value = "";
        signUpPasswordInput2.current.value = "";
      }else{ // if failed
        hintDiv.replaceChildren(createElement({tagname_: "p", innerText: `- ${trans("Register failed, contact Admin.", translation)}`, class: "form-input-hint"}));
      }
    })
  }
  const sign_in_form_submit = (evt) => {
    evt.preventDefault();
    setSignInLoading(true);
    const hintDiv = evt.target.querySelector('.sign-result-div');
    hintDiv.replaceChildren(createElement({tagname_: "p", class: "form-input-hint"}))
    lc_.UserLogin({
      userId: signInIdInput.current.value,
      password: createPasswordHash(signInPasswordInput.current.value),
    }, (res) => {
      if(res.error){
        //failed
        setTimeout(() => {
          hintDiv.replaceChildren(createElement({tagname_: "p", innerText: `- ${trans("User ID or password not matched.", translation)}`, class: "form-input-hint"}));
          setSignInLoading(false);
        }, 300);
      }else{
        //successed
        setUserInfo(res.data);
        on_sign_modal_close_click();
        addMessage(trans("Successed login.", translation),"", "success");
        hintDiv.replaceChildren();
        signInPasswordInput.current.value = "";
        signInIdInput.current.value = "";
      }
    })
  }
  const userId_input_change = (evt) => {
    const hintDiv = evt.target.form.querySelector('.userId-hint-div');
    hintDiv.replaceChildren(...test_userId(evt.currentTarget.value));
    function test_userId(value){
      //in this case are differently others it return dom element instead of string
      setCheckUserIdLoading(true);
      const ret = [];
      const check_userID_p = createElement({tagname_: "p", class: "form-input-hint",});
      ret.push(check_userID_p);
      // check UserID
      fe_.checkUserID(value, (response) => {
        if(response['result']!==true){
          check_userID_p.innerText = `- userId: ${value} is taken.`;
        }else{
          setTimeout(() => {
            hintDiv.removeChild(check_userID_p);
            setCheckUserIdLoading(false);
          }, 300);
        }
      });
      //check regex
      userIdRegex.forHint.forEach(el => {
        const regex = new RegExp(el[0]);
        if(regex.test(value) === false) {
          ret.push(createElement({tagname_: "p", innerText: `- ${trans(el[1], translation)}`, class: "form-input-hint"}));
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
          ret.push(`- ${trans(el[1], translation)}`);
        } 
      })
      return ret;
    }
  }
  const onThirdPartyLoginClick = (evt, type = "google") => {
    ////////
    const hintDiv = evt.currentTarget.querySelector('.password-hint-div');
    switch(type){
      default: fb_auth.authByGoogle(res => {
        if(res.error){
          //failed
          addMessage(trans(res.error, translation),"", "error");
        }else{
          //successed
          setUserInfo(res.data);
          addMessage(trans("Successed login.", translation),"", "success");
        }
        on_sign_modal_close_click();
        setSignInLoading(false);
      })
    }
    
    
  }
  /////////////////////////////////////////////////
  return <>
  <div ref={sign_modal} className="modal" >
      <span href="#close" className="modal-overlay" aria-label="Close"></span>
      <div className="modal-container">
        <div className="modal-header">
          <span href="#close" className="btn btn-clear float-right c-hand" aria-label="Close" onClick={on_sign_modal_close_click}><i className="fa-solid fa-xmark close-button"></i></span>
          <div className="modal-title h5 text-left">Binary Mind - {trans("Sign Up/ In", translation)}</div>
        </div>
        
        <div className="modal-body">
          <div className="content modal-content-h">
            {loginAvailable?
            <>
            <ul className="tab tab-block tab-h">
              <li className="tab-item" onClick={on_sign_modal_tab_click} type="sign-up">
                <span >{trans("Sign Up",translation)}</span>
              </li>
              <li ref={sign_in_tab_button} className="tab-item active" onClick={on_sign_modal_tab_click} type="sign-in">
                <span >{trans("Sign In",translation)}</span>
              </li>
            </ul>
            <div className="columns is-not-visable-h" ref={sign_up}>
              <div className="column col-12 col-sm-12">
                <form className="form-horizontal" action="#forms" onSubmit={sign_up_form_submit}>
                  <div className="form-group">
                    <div className="col-3 flex justify-between">
                      <label className="form-label form-label-h" >{trans("User Id", translation)}</label>
                      {checkUserIdLoading && loadingIcon()}
                    </div>
                    <div className="col-9">
                      <input ref={signUpIdInput} className="form-input" type="text" placeholder={trans("User Id", translation)} onBlur={userId_input_change} name="userId"/>
                    </div>
                  </div>

                  <div className="form-group has-error userId-hint-div">
                  </div>

                  <div className="form-group">
                    <div className="col-3">
                      <label className="form-label form-label-h" >{trans("Enter password", translation)}</label>
                    </div>
                    <div className="col-9">
                      <input className="form-input" type="password" ref={signUpPasswordInput1} placeholder={trans("Password", translation)} onBlur={password_input_change} name="password"/>
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="col-3">
                      <label className="form-label form-label-h" >{trans("re-Enter password", translation)}</label>
                    </div>
                    <div className="col-9">
                      <input className="form-input"
                        type="password" ref={signUpPasswordInput2} placeholder={trans("re-Enter password", translation)} onBlur={password_input_change} name="password"/>
                    </div>
                  </div>
                  <div className="form-group password-hint-div has-error">
                  </div>
                  <div className="form-group login-modal-justify-right">
                    <button className="btn btn-style-h"> {trans("Sign Up", translation)} </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="columns" ref={sign_in}>
              <div className="column col-12 col-sm-12">
                <form className="form-horizontal" action="#forms" onSubmit={sign_in_form_submit}>
                  <div className="form-group">
                    <div className="col-3 flex justify-between">
                      <label className="form-label form-label-h" >{trans("User Id", translation)}</label>
                      {signInLoading && loadingIcon()}
                    </div>
                    <div className="col-9">
                      <input className="form-input" ref={signInIdInput}  type="text" placeholder={trans("User Id", translation)} />
                    </div>
                  </div>

                  <div className="form-group">
                    <div className="col-3">
                      <label className="form-label form-label-h" >{trans("Enter password", translation)}</label>
                    </div>
                    <div className="col-9">
                      <input className="form-input" type="password" ref={signInPasswordInput} placeholder={trans("Password", translation)} />
                    </div>
                  </div>
                  <div className="form-group sign-result-div has-error">
                  </div>
                  <div className="form-group login-modal-justify-right">
                    <button className="btn btn-style-h"> {trans("Login", translation)} </button>
                  </div>
                </form>
              </div>
            </div>
            </>
            
            :trans("Login currently not available.", translation)}
            
          </div>
        </div>
        <div className="modal-footer">
          <div style={{display:"flex",margin:"10px",gap:"10px",justifyContent:"space-evenly"}}>
            <button 
              className = "c-hand" 
              onClick = {evt => {onThirdPartyLoginClick(evt, "google")}}
            >log in with Google <i className="fa-brands fa-google"></i></button>
            <button 
              className = "c-hand" 
              onClick = {fb_auth.authByMicrosoft}
            >log in with Microsoft <i className="fa-brands fa-microsoft"></i></button>
          </div>
        </div>
      </div>
    </div>
  </>
}