import './chatting-history-interaction-panel.css'
import React, { useState, useRef, useEffect } from 'react';
import {trans, createElement, createHashFromStr} from '../general_';
import LoadingIcon from './loading-icon';
import fetch_ from '../fetch_';
import lc_ from '../stroage_';
import ChattingInitParameterPanel from "./chatting-init-parameter-panel";
import { createRoot } from 'react-dom/client';
import {createPortal} from 'react-dom';
// import { compile, convert } from 'html-to-text';
// import puppeteer from 'puppeteer';

// for control the history page scrolling
let continueScroll = true;
///////////////////////////////////////////
export default function ChattingHistoryInteractionPanel({translation, isLogin, topicHash, setTopichash, setThreadList}){
  const [isLoading, setIsLoading] = useState(false);
  const chattingDisplay = useRef(null);
  const userInputTextarea = useRef(null);
  let initParameter = {};
  ///////////////////////////////////////
  useEffect(() => {
    chattingDisplay.current.innerHTML = "";
    if(topicHash !== undefined){
      const threadHistory = lc_.readThread(topicHash);
      for(let el of threadHistory){
        chattingDisplay.current.append(renderChattingCard(el));
      }
    }
  }, [topicHash])
//
  function renderChattingDisplay(){
    return <div className='chatting-display-container'>
      {(!topicHash && !isLoading) &&<ChattingInitParameterPanel 
        translation = {translation} 
        isLogin = {isLogin} 
        initParameter = {initParameter}
      />}
      <div 
        ref = {chattingDisplay}
        className = 'chatting-history-display'
        onTouchMove = {onHistoryPanelScroll}
        onKeyDown = {onHistoryPanelScroll}
        onMouseDown = {onHistoryPanelScroll}
        onWheel = {onHistoryPanelScroll}
        onLoadStart = {onDisplayLoad}
      >
      </div>
    </div>
  }
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
  function renderChattingCard(threadRow){
    const {card, answerDisplay, blinkingCursor} = createChattingCard({q: threadRow.question});
    answerDisplay.innerHTML = threadRow.response;
    blinkingCursor.parentElement.removeChild(blinkingCursor);
    return card;
  }
  // async function readLink(url){
  //   const iframe = document.createElement("iframe");
  //   iframe.onload = (evt) => {
  //     console.log("iframe loaded");
  //     console.log(iframe.contentWindow.document.body.innerHTML)
  //   }
  //   iframe.src = url;
  //   document.body.append(iframe)
    

  // }
  //////////////////////////////////////////
  const onDisplayLoad = (evt) => {
    console.log(evt)
  }
  const onTextareaChange = (evt) => {
    // if(!isLoading) setTextValue(evt.target.value);
  }
  const onHistoryPanelScroll = (evt) => {
    continueScroll = false;
  }
  const onSubmitClick = (evt) => {
    // readLink('https://docs.google.com/document/d/15d7uNDZjeaB0bWDoIrsDsWTIepmRqHjK/edit?usp=sharing&ouid=101705573460941531649&rtpof=true&sd=true');
    if(!isLoading && userInputTextarea.current.value.length > 4){
      setIsLoading(true);
      //preparing data
      //const = markdownResponse = "; Provide your response in a markdown code block.";
      console.log(lc_.readThread(topicHash));
      const history = lc_.readThread(topicHash);

      let messages = Array.isArray(history) ? history[history.length -1].messages : undefined;
      const {prompt, model, links} = initParameter;
      if(messages){
        //if continue chat
        messages.push({
          role : "user",
          content : userInputTextarea.current.value
        })
      }else{
        //if new chat
        messages = [
          {
            role: "system",
            content: `${prompt || ""}`
          },
          {
            role : "user",
            content : userInputTextarea.current.value
          }
        ];
      }
      var fullContent = "";
      //preparing html elements
      const {card, answerDisplay, blinkingCursor} = createChattingCard({q: userInputTextarea.current.value});
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
              //call the end before clear the user input
              requestOnEnd(model, messages, fullContent);
              userInputTextarea.current.value = "";
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
    function requestOnEnd(model, messages, fullContent){
      if(topicHash === undefined){
        //new topic
        const textValue = userInputTextarea.current.value;
        topicHash = createHashFromStr(textValue + new Date().toLocaleString());
        setTopichash(topicHash);
        lc_.saveChat(topicHash, model, textValue, messages, fullContent);
        setThreadList(lc_.readThreadsAsArray());
      }else{
        //old topic
        const textValue = userInputTextarea.current.value;
        lc_.saveChat(topicHash, model, textValue, messages, fullContent);
      }
    }
  }
  //////////////////////////////////////////
  return <div className='chatting-history-content-panel'>
    <div></div>
    {renderChattingDisplay()}
    <div className='chatting-question-input-panel'>
      <div className='input'>
        <textarea 
          placeholder = {trans('type in you question in here.', translation)}
          readOnly = {isLoading}
          disabled = {isLoading}
          ref = {userInputTextarea}
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