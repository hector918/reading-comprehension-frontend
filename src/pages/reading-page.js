import './reading-page.css';
import React from "react";
// import {MessageFooter, addMessage} from '../components/message-footer';
import {trans} from '../general_';
import DocumentMenuBar from '../components/document-menu-bar';
/////////////////////////////////////
export default function ReadingPage({translation, isLogin}){
  return(
    <div className="reading-page-div-h">
      
      <div className='reading-header-gap'>
        <div></div>
        <DocumentMenuBar translation={translation} isLogin= {isLogin} />
        <div>menu 2</div>
        <div></div>

      </div>
      <div className='reading-central-panel'>
        <div></div>
        <div className='document-display'>

        </div>
        <div className='interaction-panel'>

        </div>
        <div></div>
      </div>
      
      <div className='reading-footer-gap'><span>{trans("Under construction", translation)}</span></div>
    </div>
  )
}