import './chatting-thread-list-panel.css';
import React, { useState } from 'react';
///////////////////////////////////////
export default function ChattingThreadListPanel({ setTopichash, threadList}){
  ///////////////////////////////////////////
  const renderThreadCard = (thread, idx) => {
    return <div 
      className = 'chatting-thread-card' 
      key = {`chatting-thread-card-${idx}`}
      onClick = {()=>onCardClick(thread)}
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
    setTopichash(undefined);
  }
  ///////////////////////////////////////////
  return <div className='chatting-thread-list-panel'>
    <div></div>
    <div className='chatting-thread-list-div'>
      {threadList.map(renderThreadCard)}
    </div>
    <div className='chatting-thread-list-function-div'>
      <button className='c-hand' >Clear chat history</button>
      <button className='c-hand' onClick={onNewChatClick}>New Chat</button>
    </div>
    <div></div>
  </div>
}