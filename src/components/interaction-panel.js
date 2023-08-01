import './interaction-panel.css';
import React, { useState, useRef, useEffect } from "react";
import {trans} from '../general_';
import LoadingIcon from './loading-icon';
import lc_ from '../stroage_';
import {addMessage} from './message-footer';
////globe helper/////////////////////////////////////
function extractFromStructure(json, type){
  //json data are nested , extract data base on template, 
  const template = dataTemplate(type);
  for(let key in template){
    template[key] = readPosition(template[key]);
  }
  return template;
  ////help below//////////////////////////
  function readPosition(path){
    let value = json;
    for (const key of path) value = value[key];
    return value;
  }
  function dataTemplate(type){
    switch(type){
      case "textToComprehension": return {
        q: ["q"],
        level: ['level'],
        is_share: ['is_share'],
        timestamp: ['timestamp'],
        comprehension_history_id: ['comprehension_history_id'],
        usage: ['usage'],
        anwser: ['result', 'choices', 0, 'message', 'content']
      }
      default: return undefined;
    }
  }
}
function getAllHistoryOrderByUnifyTime(fileHash) {
  //read all history about this filehash, and reorganized it to an array and order by timestamp
  const raw = lc_.getFileDetail(fileHash, ["comprehension", "image", "text"]);
  const ret = [];
  for (let catalog_key in raw)
    for (let content in raw[catalog_key]) {
      ret.push({
        ...extractFromStructure(raw[catalog_key][content], catalog_key),
        type: catalog_key,
      });
    }
  ret.sort((a, b) =>{
    return new Date(a.timestamp).getTime() > new Date(b.timestamp).getTime()
    ? 1
    : -1
    }
  );
  return ret;
}
///main compoment///////////////////////////////////////
export default function InteractionDisplay({translation, isLogin, fileHash}){
  const [isLoading, setIsLoading] = useState(false);
  const [historyList, setHistoryList] = useState([]);
  const inputBox = useRef(null);
  const historyPanel = useRef(null);
  ///////////////////////////////////////////////////////
  useEffect(() => {
    //read all history about this hash
    if(fileHash !== undefined) lc_.getAllHistoryFromFileHash(fileHash, (res) => {
      //when res callback, the data from server were storaged in the local storage, getAllHistoryOrderByUnifyTime is reading from local stroage
      const historyFromUpdatedLocalStorage = getAllHistoryOrderByUnifyTime(fileHash);
      setHistoryList(historyFromUpdatedLocalStorage);
    })
  }, [fileHash]);

  useEffect(() => {
    //scroll to the bottom
    const lastChildElement = historyPanel.current?.lastElementChild;
    lastChildElement?.scrollIntoView({ behavior: 'smooth' });
  }, [historyList])
  ///////////////////////////////////////////////////////
  const onTextareaKeyUp = (evt) => {
    
  }

  const onHistoryShareButtonClick = (evt, jsonItem) => {
    if(isLogin()){
      const currentTarget = evt.currentTarget;
      jsonItem.is_share = !jsonItem.is_share;
      jsonItem.fileHash = fileHash;
      lc_.userToggleReadingComprehensionShare(jsonItem, (res) => {
        if(res.data){
          currentTarget.classList.toggle('active');
        }
        
      })
    }
  }

  const onSendButtonClick = (evt) => {
    if(isLoading) return;
    setIsLoading(true);
    try {
      let q = inputBox.current.value;
      if(fileHash === undefined) return;
      lc_.questionToReadingComprehension(fileHash, q, "2", (res) => {
        //if failed
        if(res.error) addMessage(
          trans("Reading comperhension", translation),
          trans(res.error, translation),
          "error"
        );
        //if successed
        if(res.data){
          inputBox.current.value = "";
          const historyFromUpdatedLocalStorage = getAllHistoryOrderByUnifyTime(fileHash);
          setHistoryList(historyFromUpdatedLocalStorage);
          
        }
        setIsLoading(false);
      });
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  }
  ///////////////////////////////////////////////////////
  const renderHistoryCard = (el, idx) => {
    ////////////////
    function returnTypeIcon(type){
      switch (type){
        case "textToComprehension" : 
          return <div className='tooltip tooltip-left' data-tooltip={`reading comprehension.`}>
            <i className="fa-brands fa-readme"></i>
          </div>
        default: return <></>
      }
    }
    /////////////////////////////////////////////////////
    return <div 
      key = {"history-card-div-" + idx} 
      className = {`history-card-div ${el.type}`}
    >
      <div className='question'>
        <div>{trans("question",translation)}: 
          <div className='function-panel'>
            {returnTypeIcon(el.type)}
            <div 
              className = {`tooltip tooltip-left c-hand ${el.is_share && "active"}`} 
              
              data-tooltip = {`switch me on to share answer to others.`}
              onClick = {(evt)=>{onHistoryShareButtonClick(evt, el)}}

            >
              <i className="fa-solid fa-comment " ></i>
            </div>
            <div className='popover popover-bottom'>
              <i className="fa-solid fa-circle-info c-hand"></i>
              <div className="popover-container bg-dark">
                <div className="card bg-dark">
                  <div className="card-body">
                    <div>{trans("nerd data", translation)}</div>
                    <div>{trans("timestamp",translation)}: {new Date(el.timestamp).toLocaleTimeString()}</div>
                    <div>{trans("Token usage",translation)}: {el.usage}</div>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
        <span>{el.q}</span>
        
      </div>
      <div className='anwser'>
        <span>{trans("anwser", translation)}: </span>
        <span>{el.anwser}</span>
      </div>
    </div>
  }
  
  return <div className='interaction-Display'>
    <div ref={historyPanel} className='history-panel'>
      {historyList.map(renderHistoryCard)}
    </div>
    <div className='input-panel'>
      <div>
        <textarea 
          readOnly = {isLoading} 
          ref = {inputBox} 
          onKeyUp = {onTextareaKeyUp}
        ></textarea>
        <button onClick={onSendButtonClick}>{isLoading ? <LoadingIcon/> : trans("Send", translation)}</button>
      </div>
    </div>
  </div>
}