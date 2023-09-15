import React from "react";
import { Link } from "react-router-dom";
import './landing.scss';
import MovingGallery from "../components/moving-gallery";
import { trans } from '../general_';
import { useNavigate } from "react-router-dom";
import { addMessage } from '../components/message-footer';
//////////////////////////////////////////
export default function Landing({ translation, isLogin, signInUpButton }) {
  const navigate = useNavigate();
  //////////////////////////////////////////
  const onReadingButtonClick = (evt) => {
    if (isLogin()) {
      navigate("/reading");
    } else {
      addMessage(
        trans("Landing page", translation),
        trans("You need to login first.", translation),
        'error'
      );
    }
  }
  const onChattingButtonClick = (evt) => {
    if (isLogin()) {
      navigate("/chatting")
    } else {
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
        <span className="title-h">{trans("Read the document", translation)}</span>
      </div>
      <div>
        <span className="title-h">{trans("And answer", translation)}</span>
      </div>
      <div>
        <span className="title-h">{trans("Questions.", translation)}</span>
      </div>
      <div>
        <span className="subtitle-h">{trans("Discover the full story", translation)}</span>
      </div>
      <div>
        <span className="subtitle-h">{trans("Let AI guide you through every page.", translation)}</span>
      </div>
      <div style={{ display: "grid", textAlign: "center" }}>
        <span className="guider">
          <div className="popover popover-right">
            <span className="btn btn-primary"><i className="fa-solid fa-arrow-right"></i> {trans("Hover me for video walkthrough.", translation)} <i className="fa-solid fa-circle-question"></i></span>
            <div className="popover-container">
              <div className="card">

                <div className="card-header">{trans("click the link below to open a new windows for video walkthrough host on youtube (english)", translation)}

                </div>
                <div className="card-body">
                  <div><Link target="_new" to={"https://youtu.be/YkPKTqdOKbs"}>1. {trans("Reading Comprehension", translation)}</Link></div>
                  <div><Link target="_new" to={"https://youtu.be/FoLbWVdXwUE"}>2. {trans("chatGPT chat bot", translation)}</Link></div>
                </div>
                <div className="card-footer">
                  ...
                </div>
              </div>
            </div>
          </div>
        </span>
      </div>
      <div>
        {isLogin()
          ? <>
            <p
              className="major-button tooltip tooltip-right "
              onClick={onReadingButtonClick}
              data-tooltip={trans('use AI to reading document \nand answer your question.', translation)}
            >
              {trans("Reading Comprehension", translation)}
            </p>
            <p
              className="major-button tooltip tooltip-right"
              onClick={onChattingButtonClick}
              data-tooltip={trans("OpenAI GPT AI \nwith presetable prompt \nchat history will storage in local \n we don\\'t keep any data.", translation)}
            >
              {trans("chatGPT", translation)}
            </p>
          </>
          :
          <p
            className="major-button tooltip tooltip-right "
            data-tooltip={trans('after sign in enabling upload file.', translation)}
            onClick={onLoginButtonClick}
          >
            {trans("Sign Up/ In", translation)}
          </p>
        }
      </div>
      <div></div>
    </div>
  </div>
}