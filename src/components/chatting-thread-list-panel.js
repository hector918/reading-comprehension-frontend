import { trans, setDeepJsonValue } from '../general_';
import './chatting-thread-list-panel.scss';
import React, { useRef, useEffect } from 'react';
import lc_ from '../stroage_';
import { useNavigate } from "react-router-dom";
import {addMessage} from '../components/message-footer';
///////////////////////////////////////
export default function ChattingThreadListPanel({ setTopichash, threadList, translation, setThreadList, isLogin, userInfo, setUserInfo}){
  const navigate = useNavigate();
  const themeCustomModal = useRef(null);
  onLightModeClick();
  useEffect(()=>{
    
  }, [])
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
  const renderThemeCustomModal = () => {
    return <div class="modal active" ref={themeCustomModal}>
      <span href="#close" class="modal-overlay" aria-label="Close"></span>
      <div class="modal-container">
        <div class="modal-header">
          <span href="#close" class="btn btn-clear float-right" aria-label="Close"></span>
          <div class="modal-title h5">Modal title</div>
        </div>
        <div class="modal-body">
          <div class="content">
          </div>
        </div>
        <div class="modal-footer">
          ...
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
  function onLightModeClick(mode){
    let root = document.querySelector(':root');
    //example for get property value = var tmp = rs.getPropertyValue('--chatting-background-color')
    let json = {};
    switch(mode){
      case "dark":
        json = darkMode();
        saveMode();
      break;
      case undefined:
        json = userInfo?.profile_setting?.setting?.chatting?.theme;
      break;
      default:
        json = defaultMode();
        saveMode();
    }
    for(let key in json){
      root.style.setProperty(key, json[key]);
    }
    function saveMode(){
      setUserInfo(pv => {
        pv = setDeepJsonValue(pv, ["profile_setting",'setting','chatting','theme'], json);
        lc_.UpdateUserProfile(pv["profile_setting"], (res) => {
        });
        return {...pv};
      });
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
        "--chatting-background-color" : "#444",
        "--chatting-border-color": "#999",
        "--chatting-content-pre-font-size": "medium",
        "--chatting-text-color": "white",
        "--chatting-error-text-color": "red",
        "--chatting-init-parameter-outline-color": "blue",
        "--chatting-init-parameter-fade-item-color": "lightgray",
        "--chatting-active-text-color": "violet"
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
            >{trans("Light", translation)}</li>
            <li 
              className = "menu-item c-hand"
              onClick = {()=>onLightModeClick("dark")}
            >{trans("Dark", translation)}</li>
            <li 
              className = "menu-item c-hand"
              onClick = {()=>onLightModeClick("custom")}
            >{trans("Custom", translation)}</li>
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