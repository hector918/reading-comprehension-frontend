import './chatting-history-interaction-panel.css'
import React, { useState, useRef } from 'react';
import {trans, createElement, createHashFromStr} from '../general_';
import LoadingIcon from './loading-icon';
import fetch_ from '../fetch_';
import lc_ from '../stroage_';
import ChattingInitParameterPanel from "./chatting-init-parameter-panel";
// for control the history page scrolling
let continueScroll = true;
///////////////////////////////////////////
export default function ChattingHistoryInteractionPanel({translation, isLogin}){
  const [textValue, setTextValue] = useState("js json object and element obj how to tell, could make it bullet points, Provide your response in a markdown code block?");
  const [isLoading, setIsLoading] = useState(false);
  const chattingDisplay = useRef(null);
  let [topicHash, setTopichash] = useState(undefined);
  let initParameter = {};
  //////////////////////////////////////////
  const createChattingCard = ({q}) => {
    const answerDisplay = createElement({tagname_: "pre", class: "anwser-display"});
    const blinkingCursor = createElement({
      tagname_: "i", 
      class: "fa-solid fa-terminal fa-sm fa-fade", 
      style:"padding-bottom: 10vh;"
    });
    const card = createElement({
      class: "chatting-card animate-box animate-new-box",
      childs_: [
        {class: "question-div", childs_: [
          {tagname_: "span", innerHTML: `${trans("Question", translation)}: `},
          {tagname_: "span", innerText: q}
        ]},
        {class: "anwser-div", childs_: [
          {tagname_: "span", innerText: `${trans('Anwser',translation)}: `},
          answerDisplay,
          blinkingCursor
        ]},
      ]
    })
    return {card, answerDisplay, blinkingCursor};
  }
  //////////////////////////////////////////
  const onTextareaChange = (evt) => {
    if(!isLoading) setTextValue(evt.target.value);
  }
  const onHistoryPanelScroll = (evt) => {
    continueScroll = false;
  }
  const onSubmitClick = (evt) => {
    console.log(initParameter)
    return 
    if(!isLoading && textValue.length > 4){
      setIsLoading(true);
      //preparing data
      const messages = [{
        role : "user",
        content : textValue
      }];
      var fullContent = "";
      //preparing html elements
      const {card, answerDisplay, blinkingCursor} = createChattingCard({q: textValue});
      chattingDisplay.current.append(card);
      //reset panel scroll, if user scroll in the process, it will stop scrolling
      chattingDisplay.current.scrollTop = chattingDisplay.current.scrollHeight;
      continueScroll = true;
      //fetch init
      fetch_.chatting_to_openai({messages}, onData);
      ////helper on data
      function onData(res){
        try {
          for(let item of res){
            const json = JSON.parse(item);
            if(json.onEnd){
              // on end 
              blinkingCursor.parentElement.removeChild(blinkingCursor);
              setIsLoading(false);
              requestOnEnd();
            }else if(json.error){
              //on error
              throw new Error(json.error);
            }else if(json.data.content){
              //on data
              fullContent += json.data.content;
              answerDisplay.innerHTML += json.data.content;
              
              if(continueScroll){
                chattingDisplay.current.scrollTop = chattingDisplay.current.scrollHeight;
              } 
            }
          }
        } catch (error) {
          if(blinkingCursor.parentElement) blinkingCursor.parentElement.removeChild(blinkingCursor);
          console.log("error", res, error);
          card.append(createElement({
            class: "error", 
            innerHTML: `${trans('error',translation)}: ${error.message}`
          }));
          setIsLoading(false);
        }
      }
    }
    ///on end helper///////////////////////////////////
    function requestOnEnd(){
      if(topicHash === undefined){
        topicHash = createHashFromStr(textValue + new Date().toLocaleString());
        setTopichash(topicHash);
      }
      // lc_.saveChat(topicHash, textValue, )
    }
  }
  //////////////////////////////////////////
  return <div className='chatting-history-content-panel'>
    <div></div>
    <div 
      ref = {chattingDisplay}
      className = 'chatting-history-display'
      onTouchMove = {onHistoryPanelScroll}
      onKeyDown = {onHistoryPanelScroll}
      onMouseDown = {onHistoryPanelScroll}
      onWheel = {onHistoryPanelScroll}
    >
      {(topicHash === undefined && !isLoading) && <ChattingInitParameterPanel 
        translation = {translation} 
        isLogin = {isLogin} 
        initParameter = {initParameter}
      />}
    </div>
    <div className='chatting-question-input-panel'>
      <div className='input'>
        <textarea 
          value = {textValue} 
          onChange = {onTextareaChange}
          placeholder = {trans('type in you question in here.', translation)}
          readOnly = {isLoading}
          disabled = {isLoading}
        />
      </div>
      <div className='submit-button'>
        <button className='c-hand btn' onClick={onSubmitClick}>
          {isLoading? <LoadingIcon />: trans("Send", translation)}
        </button>
      </div>
    </div>
    <div></div>
  </div>
}