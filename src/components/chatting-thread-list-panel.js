import { trans, setDeepJsonValue } from '../general_';
import './chatting-thread-list-panel.scss';
import React, { useRef, useState } from 'react';
import lc_ from '../stroage_';
import { useNavigate } from "react-router-dom";
import {addMessage} from '../components/message-footer';
///////////////////////////////////////
export default function ChattingThreadListPanel({ setTopichash, threadList, translation, setThreadList, isLogin, userInfo, setUserInfo}){
  const navigate = useNavigate();
  const themeForm = useRef(null);
  const themeCustomModal = useRef(null);
  const [customModalShow, setCustomModalShow] = useState(false);
  onLightModeClick();
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
    const cs = getComputedStyle(document.documentElement);
    ////////////////////////////////
    const onFormSubmit = (evt) => {
      evt.preventDefault();
      const formData = (new FormData(themeForm.current)).entries();
      const customRet = {};
      for(let [key, val] of formData){
        customRet[key] = val;
      }
      onLightModeClick("setCustom", customRet);
      setCustomModalShow(false);
    }
    function colorNameToHex(color) {
      var dummy = document.createElement("div");
      dummy.style.color = color;
      document.body.appendChild(dummy);
      // 获取计算后的颜色值
      var computedColor = window.getComputedStyle(dummy).color;
      document.body.removeChild(dummy);
      // 将RGB转换为HEX
      var rgb = computedColor.match(/\d+/g); 
      return "#" + ((1 << 24) + (parseInt(rgb[0]) << 16) + (parseInt(rgb[1]) << 8) + parseInt(rgb[2])).toString(16).slice(1).toUpperCase();
    }
    ///////////////////
    return <div className="modal modal-sm active" ref={themeCustomModal}>
      <span href="#close" className="modal-overlay" aria-label="Close"></span>
      <div className="modal-container">
        <div className="modal-header">
          <span href="#close" className="btn btn-clear float-right c-hand" aria-label="Close" onClick={()=>setCustomModalShow(false)}><i className="fa-solid fa-xmark close-button"></i></span>
          <div className="modal-title h5">{trans("Custom Theme", translation)}</div>
        </div>
        <div className="modal-body">
          <div className="content"><form ref={themeForm} onSubmit={onFormSubmit}>
            <div className='form-group'>
              <div className='col-3'>
                <label>background-color</label>
              </div>
              <div className='col-9'>
                <input 
                  name = '--chatting-background-color' 
                  type = 'color' 
                  defaultValue = {colorNameToHex(cs.getPropertyValue('--chatting-background-color'))}
                />
              </div>
            </div>
            <div className='form-group'>
              <div className='col-3'>
                <label>border-color</label>
              </div>
              <div className='col-9'>
                <input 
                  name = '--chatting-border-color' 
                  type = 'color' 
                  defaultValue = {colorNameToHex(cs.getPropertyValue('--chatting-border-color'))}
                />
              </div>
            </div>
            <div className='form-group'>
              <div className='col-3'>
                <label>pre-font-size</label>
              </div>
              <div className='col-9'>
                <select className="form-select" defaultValue={cs.getPropertyValue('--chatting-content-pre-font-size')}>
                  <option>Choose an option</option>
                  <option>large</option>
                  <option>medium</option>
                  <option>small</option>
                </select>
              </div>
            </div>
            <div className='form-group'>
              <div className='col-3'>
                <label>text-color</label>
              </div>
              <div className='col-9'>
                <input 
                  name = '--chatting-text-color' 
                  type = 'color' 
                  defaultValue = {colorNameToHex(cs.getPropertyValue('--chatting-text-color'))}
                />
              </div>
            </div>
            <div className='form-group'>
              <div className='col-3'>
                <label>error-text-color</label>
              </div>
              <div className='col-9'>
                <input 
                  name = '--chatting-error-text-color' 
                  type = 'color' 
                  defaultValue = {colorNameToHex(cs.getPropertyValue('--chatting-error-text-color'))}
                />
              </div>
            </div>
            <div className='form-group'>
              <div className='col-3'>
                <label>outline-color</label>
              </div>
              <div className='col-9'>
                <input 
                  name = '--chatting-init-parameter-outline-color' 
                  type = 'color' 
                  defaultValue = {colorNameToHex(cs.getPropertyValue('--chatting-init-parameter-outline-color'))}
                />
              </div>
            </div>
            <div className='form-group'>
              <div className='col-3'>
                <label>fade-item-color</label>
              </div>
              <div className='col-9'>
                <input 
                  name = '--chatting-init-parameter-fade-item-color' 
                  type = 'color' 
                  defaultValue = {colorNameToHex(cs.getPropertyValue('--chatting-init-parameter-fade-item-color'))}
                />
              </div>
            </div>
            <div className='form-group'>
              <div className='col-3'>
                <label>active-text-color</label>
              </div>
              <div className='col-9'>
                <input 
                  name = '--chatting-active-text-color' 
                  type = 'color' 
                  defaultValue = {colorNameToHex(cs.getPropertyValue('--chatting-active-text-color'))}
                />
              </div>
            </div>
          </form></div>
        </div>
        <div className="modal-footer">
          <div className='button-group'>
              <button 
                className = 'btn c-hand' 
                onClick = {() => {setCustomModalShow(false)}}
              >{trans("Cancel", translation)}</button>
              <button 
                className='btn c-hand'
                onClick = {() => themeForm.current.requestSubmit()}
              >{trans("Save", translation)}</button>
            </div>
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
  function onLightModeClick(mode, theme = undefined){
    let root = document.querySelector(':root');
    let json = {};

    switch(mode){
      case "dark":
        json = darkMode();
        saveMode();
      break;
      case undefined:
        json = userInfo?.profile_setting?.setting?.chatting?.theme;
      break;
      case "custom":
        setCustomModalShow(true);
      break;
      case "setCustom":
        //set theme and save
        if(theme !== undefined){
          json = theme;
          saveMode();
        }
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
        lc_.UpdateUserProfile(pv["profile_setting"], (res) => { });
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
              onClick = {() => onLightModeClick("light")}
            >{trans("Light", translation)}</li>
            <li 
              className = "menu-item c-hand"
              onClick = {() => onLightModeClick("dark")}
            >{trans("Dark", translation)}</li>
            <li 
              className = "menu-item c-hand"
              onClick = {() => onLightModeClick("custom")}
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
    <div>{customModalShow && renderThemeCustomModal()}</div>
  </div>
}