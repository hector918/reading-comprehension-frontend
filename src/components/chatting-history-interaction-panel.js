import './chatting-history-interaction-panel.css'
import React, { useState, useRef } from 'react';
import {trans, createElement, throttle} from '../general_';
import LoadingIcon from './loading-icon';
import fetch_ from '../fetch_';
//////////////////////////////////////////
export default function ChattingHistoryInteractionPanel({translation}){
  const [textValue, setTextValue] = useState("js json object and element obj how to tell, could make it bullet points, Provide your response in a markdown code block?");
  const [isloading, setIsLoading] = useState(false);
  const chattingDisplay = useRef(null);
  const [continueScroll, setContinueScroll] = useState(true);
  //////////////////////////////////////////
  const clearChattingDisplay = () => {
    chattingDisplay.current.innerHTML = "";

  }
  const createChattingCard = ({q}) => {
    const answerDisplay = createElement({tagname_: "pre", class: "anwser-display"});
    const blinkingCursor = createElement({tagname_: "i", class:"fa-solid fa-terminal fa-fade"});
    const card = createElement({
      class: "chatting-card animate-box animate-new-box",
      childs_: [
        {class: "question-div", childs_: [
          {tagname_: "span", innerHTML: `${trans("Question", translation)}: `},
          {tagname_: "span", innerText: q}
        ]},
        {class: "anwser-div", childs_: [
          {tagname_: "span", innerText: `${trans('Anwser')}: `},
          answerDisplay,
          blinkingCursor
        ]},
      ]
    })
    return {card, answerDisplay, blinkingCursor};
  }

  //////////////////////////////////////////
  const onTextareaChange = (evt) => {
    if(!isloading) setTextValue(evt.target.value);
  }
  const onHistoryPanelScroll = (evt) => {
    setContinueScroll(false);
  }
  const onSubmitClick = (evt) => {
    if(!isloading && textValue.length > 4){
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
      setContinueScroll(true);
      const scrollFn = throttle(() => {blinkingCursor.scrollIntoView({ behavior: "smooth", block: "end" })}, 1000);
      //fetch init
      fetch_.chatting_to_openai({messages}, onData, answerDisplay);
      ////helper on data
      function onData(res){
        try {
          for(let item of res){
            const json = JSON.parse(item);
            if(json.onEnd){
              // on end 
              blinkingCursor.parentElement.removeChild(blinkingCursor);
              setIsLoading(false);
              if(continueScroll) {
                answerDisplay.scrollIntoView({ behavior: "smooth", block: "end" });
              }
            }else if(json.error){
              //on error
              blinkingCursor.parentElement.removeChild(blinkingCursor);
              setIsLoading(false);
              console.log(json.error);
            }else if(json.data.content){
              //on data
              fullContent += json.data.content;
              answerDisplay.innerHTML += json.data.content;
              if(continueScroll) scrollFn();
            }
          }
        } catch (error) {
          console.log("error", res, error);
        }
      }
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
    >
    </div>
    <div className='chatting-question-input-panel'>
      <div className='input'>
        <textarea 
          value = {textValue} 
          onChange = {onTextareaChange}
          placeholder = {trans('type in you question in here.', translation)}
        />
      </div>
      <div className='submit-button'>
        <button className='c-hand btn' onClick={onSubmitClick}>
          {isloading? <LoadingIcon />: trans("Send", translation)}
        </button>
      </div>
    </div>
    <div></div>
  </div>
}