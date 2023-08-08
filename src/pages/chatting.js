import ChattingHistoryInteractionPanel from '../components/chatting-history-interaction-panel';
import './chatting.css';
import React from 'react';
///////////////////////////////////////
export default function Chatting({translation, isLogin}){
  return <div className='chatting-container'>
    {isLogin()
    ?
    <>
      <div className='chat-history-topic-panel'>
        <div></div>
      </div>
      <ChattingHistoryInteractionPanel translation={translation} />
    </>
    :
    <div>please login first</div>
    }
  </div>
}