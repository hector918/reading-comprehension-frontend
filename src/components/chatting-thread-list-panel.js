import { trans } from '../general_';
import './chatting-thread-list-panel.css';
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
      onClick = {() => onCardClick(thread)}
    >
      <div className='title'>
        <p>{thread.question.substring(0, 80)}</p>
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
    <div className='chatting-thread-list-div'>
      {threadList.length === 0
        ? <h3>{trans("no chatting history yet. add one?", translation)}</h3>
        : threadList.map(renderThreadCard)
      }
    </div>
    <div className='chatting-thread-list-function-div'>
      <button className='c-hand' onClick={onClearChatHistoryClick}>{trans("Clear chat history", translation)}</button>
      <button className='c-hand' onClick={onNewChatClick}>{trans("New Chat", translation)}</button>
    </div>
    <div></div>
  </div>
}