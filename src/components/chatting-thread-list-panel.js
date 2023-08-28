import { trans } from '../general_';
import './chatting-thread-list-panel.scss';
import React, { useState } from 'react';
import lc_ from '../stroage_';
import { useNavigate } from "react-router-dom";
import {addMessage} from '../components/message-footer';
///////////////////////////////////////
export default function ChattingThreadListPanel({ setTopichash, threadList, translation, setThreadList, isLogin}){
  const navigate = useNavigate();

  ///////////////////////////////////////////
  const renderThreadCard = (thread, idx) => {
    return <div 
      className = 'chatting-thread-card' 
      key = {`chatting-thread-card-${idx}`}
    >
      <div 
        className = 'title' 
        onClick = {() => onCardClick(thread)}
      >
        <p>
          {thread.type && <span>{thread.type} </span>}
          {thread.title && <span> {thread.title}</span>}
        </p>
        <span>{thread.question.substring(0, 80)}</span>
      </div>
      <div className='icon-div'>
        <div className='disable'>
          <i className="fa-solid fa-ellipsis"></i>
        </div>
        <div onClick={()=>onThreadDeleteClick(thread.threadHash)}>
          <i className="fa-solid fa-trash-can"></i>
        </div>
      </div>
    </div>
  }
  ///////////////////////////////////////////
  function onCardClick(thread){
    setTopichash(thread.threadHash);
  }
  function onNewChatClick(){
    if(!isLogin()){
      navigate("/");
      addMessage(
        trans("Chatting page", translation),
        trans("You need to login first.", translation),
        'error'
      );
    }
    setTopichash(undefined);
  }
  function onClearChatHistoryClick(){
    lc_.clearAllThreads();
    setThreadList(lc_.readThreadsAsArray());
  }
  function onThreadDeleteClick(threadHash){
    lc_.removeThread(threadHash);
    setTopichash(pv => {
      if(pv === threadHash){
        return undefined;
      }
    })
    setThreadList(lc_.readThreadsAsArray());
  }
  function onLightModeClick(mode = "light"){
    let root = document.querySelector(':root');
    let rs = getComputedStyle(root);
    //example for get property value = var tmp = rs.getPropertyValue('--chatting-background-color')
    let json = {};
    switch(mode){
      case "dark":
        json = darkMode();
      break;
      default:
        json = defaultMode();
    }
    for(let key in json){
      root.style.setProperty(key, json[key]);
    }
    function defaultMode(){
      return {
        "--chatting-background-color" : "white",
        "--chatting-border-color": "darkgray",
        "--chatting-content-pre-font-size": "medium",
        "--chatting-text-color": "black",
        "--chatting-error-text-color": "red",
        "--chatting-init-parameter-outline-color": "blue",
        "--chatting-init-parameter-fade-item-color": "lightgray",
        "--chatting-active-text-color": "purple"
      }
    }
    function darkMode(){
      return {
        "--chatting-background-color" : "#777",
        "--chatting-border-color": "#999",
        "--chatting-content-pre-font-size": "medium",
        "--chatting-text-color": "white",
        "--chatting-error-text-color": "red",
        "--chatting-init-parameter-outline-color": "blue",
        "--chatting-init-parameter-fade-item-color": "lightgray",
        "--chatting-active-text-color": "purple"
      }
    }
  }
  ///////////////////////////////////////////
  return <div className='chatting-thread-list-panel'>
    <div></div>
    <div className='chatting-function-and-list'>
      <div className='chatting-thread-function-div'>
        {/* <i className="fa-solid fa-moon"></i> */}
        <div className="dropdown">
          <span 
            className = "dropdown-toggle c-hand" 
            tabIndex = "0"
          >
            <i className="fa-solid fa-circle-half-stroke"></i>
          </span>
          <ul className="menu">
            <li 
              className = "menu-item c-hand"
              onClick = {()=>onLightModeClick("light")}
            >Light</li>
            <li 
              className = "menu-item c-hand"
              onClick = {()=>onLightModeClick("dark")}
            >Dark</li>
            <li 
              className = "menu-item c-hand"
              onClick = {()=>onLightModeClick("custom")}
            >Custom</li>
          </ul>
        </div>
      </div>
      <div className='chatting-thread-list-div'>
        {threadList.length === 0
          ? <h3>{trans("no chatting history yet. add one?", translation)}</h3>
          : threadList.map(renderThreadCard)
        }
      </div>
    </div>
    
    <div className='chatting-thread-list-function-div'>
      <button className='c-hand' onClick={onClearChatHistoryClick}>{trans("Clear chat history", translation)}</button>
      <button className='c-hand' onClick={onNewChatClick}>{trans("New Chat", translation)}</button>
    </div>
    <div></div>
  </div>
}