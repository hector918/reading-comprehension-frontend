import ChattingHistoryInteractionPanel from '../components/chatting-history-interaction-panel';
import ChattingThreadListPanel from '../components/chatting-thread-list-panel';
import lc_ from '../stroage_';
import './chatting.css';
import React, {useState} from 'react';
///////////////////////////////////////
export default function Chatting({translation, isLogin}){
  let [topicHash, setTopichash] = useState(undefined);
  const [threadList, setThreadList] = useState(lc_.readThreadsAsArray());
  return <div className='chatting-container'>
    {isLogin()
    ?
    <>
      <div className='chat-history-topic-panel'>
        <ChattingThreadListPanel
          translation = {translation} 
          isLogin = {isLogin}
          topicHash = {topicHash}
          setTopichash = {setTopichash}
          threadList = {threadList}
          setThreadList = {setThreadList}
        />
      </div>
      <ChattingHistoryInteractionPanel 
        translation = {translation} 
        isLogin = {isLogin}
        topicHash = {topicHash}
        setTopichash = {setTopichash}
        setThreadList = {setThreadList}
      />
    </>
    :
    <div>please login first</div>
    }
  </div>
}