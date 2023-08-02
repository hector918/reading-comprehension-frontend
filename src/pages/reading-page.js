import './reading-page.css';
import React, { useState, useRef } from "react";
// import {MessageFooter, addMessage} from '../components/message-footer';
import {trans, change_setFileHash} from '../general_';
import DocumentMenuBar from '../components/document-menu-bar';
import DocumentDisplay from '../components/document-display';
import { useParams } from 'react-router-dom';
import InteractionDisplay from '../components/interaction-panel';
import InteractionMenuBar from '../components/interactionMenuBar';
/////////////////////////////////////
export default function ReadingPage({translation, isLogin}){
  //filehash is from url just use it one time, fileHash is for react component Internal use and across pages
  const {filehash} = useParams();
  const [fileHash, setFileHash] = useState(filehash);
  const [pagesCount, setPagesCount] = useState(999);
  const historyPanel = useRef(null);
  //send globe setfilehash available
  change_setFileHash(setFileHash);
  /////////////////////////////////////
  const onMouseUp = (evt) => {
    if(window.getSelection()){
      let str = window.getSelection().toString();
      if(str.length < 1000){

      }else {

      }
      console.log(str);

    }
  }
  /////////////////////////////////////
  return(
    <div className="reading-page-div-h">
      <div className='reading-header-gap'>
        <div></div>
        <DocumentMenuBar 
          translation = {translation} 
          isLogin = {isLogin} 
          pagesCount = {pagesCount}
        />
        <div></div>
        <InteractionMenuBar
          translation = {translation} 
          isLogin = {isLogin}  
          fileHash = {fileHash}
          historyPanel = {historyPanel}
        />
        <div></div>
      </div>
      <div className='reading-central-panel' onMouseUp={onMouseUp}>
        <div></div>
        <div className=''>
          <DocumentDisplay 
            translation = {translation} 
            isLogin = {isLogin} 
            fileHash = {fileHash}
            setPagesCount = {setPagesCount}
          />
        </div>
        <div className='reading-page-central-gap'></div>
        <div className='interaction-panel'>
          <InteractionDisplay 
            translation = {translation} 
            isLogin = {isLogin} 
            fileHash = {fileHash}
            historyPanel = {historyPanel}
          />
        </div>
        <div></div>
      </div>
      
      {/* <div className='reading-footer-gap'><span>{trans("Under construction", translation)}</span></div> */}
      <div className='is-not-visable-h popup-div-for-selected-text'>
        <div><p></p></div>
        <div></div>
      </div>
    </div>
  )
}