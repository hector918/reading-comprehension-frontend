import './interaction-panel.css';
import React, { useState, useRef } from "react";
import {trans} from '../general_';
import LoadingIcon from './loading-icon';
import fe_ from '../fetch_';
import lc_ from '../stroage_';
import {addMessage} from './message-footer';

export default function InteractionDisplay({translation, isLogin, fileHash}){
  const [isLoading, setIsLoading] = useState(false);
  const inputBox = useRef(null);
  ///////////////////////////////////////////////////////
  const onTextareaKeyUp = (evt) => {
    console.log(evt, evt.keyCode);
  }
  const onSendButtonClick = (evt) => {
    if(isLoading) return;
    setIsLoading(true);
    try {
      let q = inputBox.current.value;
      if(fileHash === undefined) return;
      lc_.question_to_reading_comprehension(fileHash, q, "2", (res) => {
        //if failed
        if(res.error) addMessage(
          trans("Reading comperhension", translation),
          trans(res.error, translation),
          "error"
        );
        //if successed
        if(res.data){

        }
        setIsLoading(false);
      });
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  }
  ///////////////////////////////////////////////////////
  return <div className='interaction-Display'>
    <div className='history-panel'>

    </div>
    <div className='input-panel'>
      <div>
        <textarea ref={inputBox} onKeyUp={onTextareaKeyUp}></textarea>
        <button onClick={onSendButtonClick}>{isLoading ? <LoadingIcon/> : trans("Send", translation)}</button>
      </div>
    </div>
  </div>
}