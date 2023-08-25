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
        <div>
          <i className="fa-solid fa-ellipsis"></i>
        </div>
        <div>
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
  ///////////////////////////////////////////
  return <div className='chatting-thread-list-panel'>
    <div></div>
    <div className='chatting-function-and-list'>
      <div className='chatting-thread-function-div'>
        {/* <i className="fa-solid fa-moon"></i> */}
        
        <i className="fa-regular fa-sun"></i>
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