import React from "react";
import './landing.css';
import MovingGallery from "../components/moving-gallery";
import {trans} from '../general_';
import { useNavigate } from "react-router-dom";
import {addMessage} from '../components/message-footer';
//////////////////////////////////////////
export default function Landing({translation, isLogin, signInUpButton}) {
  const navigate = useNavigate();
  //////////////////////////////////////////
  const onReadingButtonClick = (evt) => {
    if(isLogin()){
      navigate("/reading")
    }else{
      addMessage(
        trans("Landing page", translation),
        trans("You need to login first.", translation),
        'error'
      );
    } 
  }
  const onChattingButtonClick = (evt) => {
    if(isLogin()){
      navigate("/chatting")
    }else{
      addMessage(
        trans("Landing page", translation),
        trans("You need to login first.", translation),
        'error'
      );
    } 
  }
  const onLoginButtonClick = (evt) => {
    signInUpButton.current.click();
  }
  //////////////////////////////////////////
  return <div className="landing-container">
    <div className="moving-gallery-panel"><MovingGallery translation={translation} /></div>
    <div className="floating-panel">
      <div>
      </div>
      <div>
        <span className="title-h">{trans("Uses AI", translation)}</span>
      </div>
      <div>
        <span className="title-h">{trans("read the document", translation)}</span>
      </div>
      <div>
        <span className="title-h">{trans("and anwser", translation)}</span>
      </div>
      <div>
        <span className="title-h">{trans("questions.", translation)}</span>
      </div>
      <div>
        <span className="subtitle-h">{trans("Discover the full story", translation)}</span>
      </div>
      <div>
        <span className="subtitle-h">{trans("let AI guide you through every page.", translation)}</span>
      </div>
      <div style={{display:"grid", textAlign:"center"}}>
        <span className="guider">{trans("click on moving books to try", translation)} <span 
          className = "tooltip tooltip-right guider-tooltip"
          data-tooltip = {trans(`It's base on a document,\nwhen user ask a question,\nthe answer are sourcing from the document only.`, translation)}
        >
          {trans("Reading Comprehension", translation)} <i className="fa-solid fa-circle-question"></i>
        </span> {trans("or", translation)}</span>
      </div>
      <div>
        {isLogin()
        ?<>
          <p 
            className="major-button tooltip tooltip-right " 
            onClick = {onReadingButtonClick}
            data-tooltip = {trans('use AI to reading document \nand answer your question ', translation)}
          >
            {trans("Reading Comprehension", translation)}
          </p>
          <p 
            className = "major-button tooltip tooltip-right" 
            onClick = {onChattingButtonClick}
            data-tooltip = {trans('OpenAI GPT AI \nwith presetable prompt \nchat history will storage in local \n we don\'t keep any data ', translation)}
          >
            {trans("chatGPT", translation)}
          </p>
        </>
        :
          <p 
            className = "major-button tooltip tooltip-right " 
            data-tooltip = {trans('after sign in enabling upload file.', translation)}
            onClick = {onLoginButtonClick}
          >
            {trans("Sign Up/ In", translation)}
          </p>
        }
      </div>
      <div></div>
    </div>
  </div>
}