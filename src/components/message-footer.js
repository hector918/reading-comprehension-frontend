import React, {useRef} from "react";
import './message-footer.css';
import {createElement, trans} from '../general_';
let addMessage = null;

function MessageFooter({translation}){
  const messageBoard = useRef(null);
  ///////////////////////////////////////////////////////
  function createMessage(title, content){
    messageBoard.current.append(createElement({class: "toast", childs_:[
      {tagname_: "button", class: "btn btn-clear float-right"},
      {tagname_: "h6", innerText: trans(title, translation)},
      {tagname_: "p", innerText: trans(content, translation)}
    ]}));
  }
  addMessage = createMessage;
  ///////////////////////////////////////////////////////
  return <div ref={messageBoard} className="message-footer-h p-fixed">
    
  </div>
}

export {MessageFooter, addMessage}