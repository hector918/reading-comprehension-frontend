import './reading-page.css';
import React, { useState } from "react";
// import {MessageFooter, addMessage} from '../components/message-footer';
import {trans, change_setFileHash} from '../general_';
import DocumentMenuBar from '../components/document-menu-bar';
import DocumentDisplay from '../components/document-display';
import { useParams } from 'react-router-dom';
import InteractionDisplay from '../components/interaction-panel';
/////////////////////////////////////
export default function ReadingPage({translation, isLogin}){
  const {filehash} = useParams();
  const [fileHash, setFileHash] = useState(filehash);
  //send globe setfilehash available
  change_setFileHash(setFileHash);
  return(
    <div className="reading-page-div-h">
      <div className='reading-header-gap'>
        <div></div>
        <DocumentMenuBar 
          translation = {translation} 
          isLogin = {isLogin} 
        />
        <div>menu 2</div>
        <div></div>

      </div>
      <div className='reading-central-panel'>
        <div></div>
        <div className=''>
          <DocumentDisplay 
            translation = {translation} 
            isLogin = {isLogin} 
            fileHash = {fileHash}
          />
        </div>
        <div className='interaction-panel'>
          <InteractionDisplay 
            translation = {translation} 
            isLogin = {isLogin} 
            fileHash = {fileHash}
          />
        </div>
        <div></div>
      </div>
      
      <div className='reading-footer-gap'><span>{trans("Under construction", translation)}</span></div>
    </div>
  )
}