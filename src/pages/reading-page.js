import './reading-page.css';
import React, { useState, useRef } from "react";
// import {MessageFooter, addMessage} from '../components/message-footer';
import {trans, change_setFileHash} from '../general_';
import DocumentMenuBar from '../components/document-menu-bar';
import DocumentDisplay from '../components/document-display';
import { useParams } from 'react-router-dom';
import InteractionDisplay from '../components/interaction-panel';
import InteractionMenuBar from '../components/interactionMenuBar';
import lc_ from '../stroage_';
/////////////////////////////////////
export default function ReadingPage({translation, isLogin}){
  //filehash is from url just use it one time, fileHash is for react component Internal use and across pages
  const {filehash} = useParams();
  const [fileHash, setFileHash] = useState(filehash);
  const [pagesCount, setPagesCount] = useState(999);
  const [selectedText, setSelectedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const historyPanel = useRef(null);
  const textSelectionPopupDiv = useRef(null);
  //send globe setfilehash available
  change_setFileHash(setFileHash);
  /////////////////////////////////////
  const onExplainButtonClick = (evt) => {
    textSelectionPopupDiv.current.classList.add('is-not-visable-h');
    lc_.textToExplanation(fileHash, selectedText, (res) => {
      console.log(res);
    })
  }
  const onMouseUp = (evt) => {
    //if cursor selected some text and page not loading
    if(window.getSelection() && !isLoading){
      const pDiv = textSelectionPopupDiv.current;
      //clear Previous style
      pDiv.style = {};
      let str = window.getSelection().toString().trim();
      //if new selected text === old selected text exit
      if(str === selectedText){
        pDiv.classList.add('is-not-visable-h');
        return;
      } 
      //if str is loog than 1000 and less than 4, cancel the action
      if(str.length < 1000 && str.length > 3){
        setSelectedText(str);
        //calculate the cursor position
        const cursorH = window.innerWidth / 2 - evt.clientX >= 0 ?"onLeft" : "onRight";
        const cursorV = window.innerHeight / 2 - evt.clientY >= 0 ? "onTop": "onBottom";
        //setting div's position and button's location
        if(cursorH === 'onLeft'){
          pDiv.style.left = `${evt.clientX}px`;
        }else{
          pDiv.style.right = `${window.innerWidth - evt.clientX}px`;
          pDiv.style.alignItems = 'end';
        }
        if(cursorV === 'onTop'){
          pDiv.style.top = `${evt.clientY}px`;
          pDiv.style.flexDirection = 'column-reverse';
        }else{
          pDiv.style.bottom = `${window.innerHeight - evt.clientY}px`;
        }
        //make it visable
        pDiv.classList.remove('is-not-visable-h');
      }else {
        pDiv.classList.add('is-not-visable-h');
      }
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
            setIsLoading = {setIsLoading}
            isLoading = {isLoading}
          />
        </div>
        <div></div>
      </div>
      {/* <div className='reading-footer-gap'><span>{trans("Under construction", translation)}</span></div> */}
      <div 
        className = 'is-not-visable-h popup-div-for-selected-text'
        ref = {textSelectionPopupDiv}
      >
        <div className='selected-text-display'><p>{selectedText}</p></div>
        <div className='selected-text-function-panel'>
          <button 
            className = 'btn-theme-border'
            onClick = {onExplainButtonClick}
          >
            {trans('Elaborate on this')}
          </button>
        </div>
      </div>
    </div>
  )
}