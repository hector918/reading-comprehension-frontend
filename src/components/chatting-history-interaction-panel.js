import './chatting-history-interaction-panel.css'
import React, { useState, useRef } from 'react';
import {trans} from '../general_';
import LoadingIcon from './loading-icon';
import fetch_ from '../fetch_';
export default function ChattingHistoryInteractionPanel({translation}){
  const [textValue, setTextValue] = useState("");
  const [isloading, setIsLoading] = useState(true);
  const chattingDisplay = useRef(null);
  //////////////////////////////////////////
  const clearChattingDisplay = () => {
    chattingDisplay.current.innerHTML = "";
    
  }
  const renderCard = (chatData) => {
    const cardContainer = chattingDisplay.current;

  }
  //////////////////////////////////////////
  const onTextareaChange = (evt) => {
    if(!isloading) setTextValue(evt.target.value);
  }

  const onSubmitClick = (evt) => {
    if(!isloading){
      console.log("send");
      const messages = [{
        role : "user",
        content : textValue
      }]
      fetch_.chatting_to_openai({messages}, (res) => {
        try {
          for(let item of res){
            const json = JSON.parse(item);
            if(json.data){
              console.log(json.data.content)
            }
          }
        } catch (error) {
          console.log("error", res);
        }
      })
    }
  }
  //////////////////////////////////////////
  return <div className='chatting-history-content-panel'>
    <div 
      ref = {chattingDisplay}
      className = 'chatting-history-display'
    >
      this is chating page

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